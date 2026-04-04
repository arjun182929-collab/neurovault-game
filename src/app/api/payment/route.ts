import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/payment?playerId=xxx
// Returns payment history for a player
export async function GET(req: NextRequest) {
  try {
    const playerId = req.nextUrl.searchParams.get('playerId');

    if (!playerId) {
      return NextResponse.json(
        { success: false, error: 'playerId is required' },
        { status: 400 },
      );
    }

    const payments = await db.payment.findMany({
      where: { playerId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      data: payments,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/payment
// Body: { action: 'submit_utr', playerId, utr, amount, plan }
// Body: { action: 'check_status', playerId, utr }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // Submit UTR for manual verification
    if (action === 'submit_utr') {
      const { playerId, utr, amount, plan } = body;

      if (!playerId || !utr || !amount || !plan) {
        return NextResponse.json(
          { success: false, error: 'playerId, utr, amount, and plan are required' },
          { status: 400 },
        );
      }

      if (!['pro', 'premium'].includes(plan)) {
        return NextResponse.json(
          { success: false, error: 'Invalid plan. Must be pro or premium.' },
          { status: 400 },
        );
      }

      // Validate UTR format (typically 12-digit alphanumeric for PhonePe)
      const cleanUtr = utr.trim().toUpperCase();
      if (cleanUtr.length < 8 || cleanUtr.length > 20) {
        return NextResponse.json(
          { success: false, error: 'UTR must be 8-20 characters' },
          { status: 400 },
        );
      }

      // Check for duplicate UTR
      const existingPayment = await db.payment.findUnique({
        where: { utr: cleanUtr },
      });

      if (existingPayment) {
        return NextResponse.json(
          { success: false, error: 'This UTR has already been submitted' },
          { status: 409 },
        );
      }

      // Check expected amount
      const expectedAmounts: Record<string, number> = { pro: 49, premium: 99 };
      if (amount !== expectedAmounts[plan]) {
        return NextResponse.json(
          { success: false, error: `Amount mismatch. Expected ₹${expectedAmounts[plan]} for ${plan} plan.` },
          { status: 400 },
        );
      }

      // Create payment record
      const payment = await db.payment.create({
        data: {
          playerId,
          utr: cleanUtr,
          amount,
          plan,
          status: 'pending',
          paymentMethod: 'phonepe',
        },
      });

      return NextResponse.json({
        success: true,
        data: payment,
        message: 'UTR submitted successfully. Your payment is being verified.',
      });
    }

    // Check payment verification status
    if (action === 'check_status') {
      const { playerId, utr } = body;

      if (!playerId || !utr) {
        return NextResponse.json(
          { success: false, error: 'playerId and utr are required' },
          { status: 400 },
        );
      }

      const payment = await db.payment.findUnique({
        where: { utr: utr.trim().toUpperCase() },
      });

      if (!payment) {
        return NextResponse.json(
          { success: false, error: 'Payment not found' },
          { status: 404 },
        );
      }

      // If payment is verified, also activate the subscription
      if (payment.status === 'verified' && payment.verifiedAt) {
        // Check if subscription is already active for this plan
        const subscription = await db.subscription.findUnique({
          where: { playerId },
        });

        const now = new Date();
        const expiry = new Date(now);
        expiry.setMonth(expiry.getMonth() + 1);

        if (subscription && subscription.plan !== payment.plan) {
          // Upgrade subscription
          await db.subscription.update({
            where: { playerId },
            data: {
              plan: payment.plan,
              status: 'active',
              startDate: now,
              expiryDate: expiry,
              autoRenew: false,
              paymentProvider: 'phonepe',
            },
          });

          // Update player
          await db.player.update({
            where: { id: playerId },
            data: { isPremium: payment.plan === 'premium' },
          }).catch(() => {});
        } else if (!subscription) {
          // Create new subscription
          await db.subscription.create({
            data: {
              playerId,
              plan: payment.plan,
              status: 'active',
              startDate: now,
              expiryDate: expiry,
              autoRenew: false,
              paymentProvider: 'phonepe',
            },
          });
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          status: payment.status,
          plan: payment.plan,
          amount: payment.amount,
          verifiedAt: payment.verifiedAt,
          rejectedReason: payment.rejectedReason,
          createdAt: payment.createdAt,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action. Use: submit_utr or check_status' },
      { status: 400 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
