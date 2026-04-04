import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/subscription?playerId=xxx
export async function GET(req: NextRequest) {
  try {
    const playerId = req.nextUrl.searchParams.get('playerId');

    if (!playerId) {
      return NextResponse.json(
        { success: false, error: 'playerId is required' },
        { status: 400 },
      );
    }

    let subscription = await db.subscription.findUnique({
      where: { playerId },
    });

    // Create free subscription if none exists
    if (!subscription) {
      subscription = await db.subscription.create({
        data: { playerId, plan: 'free', status: 'active' },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        plan: subscription.plan,
        status: subscription.status,
        startDate: subscription.startDate,
        expiryDate: subscription.expiryDate,
        autoRenew: subscription.autoRenew,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/subscription
// Body: { playerId, plan, coinCost, action: 'activate' | 'cancel' | 'check' }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playerId, plan, coinCost, action } = body;

    if (action === 'activate') {
      if (!playerId || !plan) {
        return NextResponse.json(
          { success: false, error: 'playerId and plan are required' },
          { status: 400 },
        );
      }

      if (!['free', 'pro', 'premium'].includes(plan)) {
        return NextResponse.json(
          { success: false, error: 'Invalid plan' },
          { status: 400 },
        );
      }

      const now = new Date();
      const expiry = new Date(now);
      expiry.setMonth(expiry.getMonth() + 1);

      const subscription = await db.subscription.upsert({
        where: { playerId },
        create: {
          playerId,
          plan,
          status: 'active',
          startDate: now,
          expiryDate: plan === 'free' ? null : expiry,
          autoRenew: plan !== 'free',
          coinsPrice: coinCost || 0,
        },
        update: {
          plan,
          status: 'active',
          startDate: now,
          expiryDate: plan === 'free' ? null : expiry,
          autoRenew: plan !== 'free',
          coinsPrice: coinCost || 0,
        },
      });

      // Update player isPremium flag
      await db.player.update({
        where: { id: playerId },
        data: { isPremium: plan === 'premium' },
      }).catch(() => {
        // Player might not exist in DB yet (client-only state)
      });

      return NextResponse.json({
        success: true,
        data: subscription,
        message: `${plan} subscription activated`,
      });
    }

    if (action === 'cancel') {
      if (!playerId) {
        return NextResponse.json(
          { success: false, error: 'playerId is required' },
          { status: 400 },
        );
      }

      const subscription = await db.subscription.findUnique({
        where: { playerId },
      });

      if (!subscription) {
        return NextResponse.json(
          { success: false, error: 'No subscription found' },
          { status: 404 },
        );
      }

      const updated = await db.subscription.update({
        where: { playerId },
        data: { autoRenew: false, status: 'cancelled' },
      });

      return NextResponse.json({
        success: true,
        data: updated,
        message: 'Auto-renew cancelled. Plan active until expiry.',
      });
    }

    if (action === 'check') {
      if (!playerId) {
        return NextResponse.json(
          { success: false, error: 'playerId is required' },
          { status: 400 },
        );
      }

      const subscription = await db.subscription.findUnique({
        where: { playerId },
      });

      if (!subscription || subscription.plan === 'free') {
        return NextResponse.json({
          success: true,
          data: { plan: 'free', status: 'active', isActive: false },
        });
      }

      // Check expiry
      const now = new Date();
      const isExpired = subscription.expiryDate && new Date(subscription.expiryDate) < now;

      if (isExpired) {
        const expired = await db.subscription.update({
          where: { playerId },
          data: { plan: 'free', status: 'expired', expiryDate: null, autoRenew: false },
        });
        return NextResponse.json({
          success: true,
          data: { ...expired, isActive: false, wasPlan: subscription.plan },
        });
      }

      return NextResponse.json({
        success: true,
        data: { ...subscription, isActive: true },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action. Use: activate, cancel, or check' },
      { status: 400 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
