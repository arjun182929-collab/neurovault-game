import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Simple admin password (in production, use proper auth)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'neurovault2024';

function verifyAdmin(req: NextRequest): boolean {
  const auth = req.headers.get('x-admin-password');
  return auth === ADMIN_PASSWORD;
}

// Helper: batch-resolve player info from payment records
async function attachPlayersToPayments<T extends { playerId: string }>(payments: T[]) {
  const playerIds = [...new Set(payments.map((p) => p.playerId))];
  const players = playerIds.length > 0
    ? await db.player.findMany({
        where: { id: { in: playerIds } },
        select: { id: true, username: true, totalScore: true },
      })
    : [];
  const playerMap = new Map(players.map((p) => [p.id, p]));
  return payments.map((p) => ({ ...p, player: playerMap.get(p.playerId) || null }));
}

// Helper: attach payment counts to players
async function attachPaymentCounts<T extends { id: string }>(players: T[]) {
  const playerIds = players.map((p) => p.id);
  const counts = playerIds.length > 0
    ? await db.payment.groupBy({
        by: ['playerId'],
        where: { playerId: { in: playerIds } },
        _count: { id: true },
      })
    : [];
  const countMap = new Map(counts.map((c) => [c.playerId, c._count.id]));
  return players.map((p) => ({ ...p, paymentCount: countMap.get(p.id) || 0 }));
}

// GET /api/admin?action=dashboard
// GET /api/admin?action=payments&status=pending
// GET /api/admin?action=players
// GET /api/admin?action=player&id=xxx
export async function GET(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const action = req.nextUrl.searchParams.get('action');

    // Dashboard stats
    if (action === 'dashboard') {
      const [
        totalPlayers,
        activePlayers,
        totalPayments,
        pendingPayments,
        verifiedPayments,
        rejectedPayments,
        totalRevenue,
        premiumSubs,
        proSubs,
        freeSubs,
      ] = await Promise.all([
        db.player.count(),
        db.player.count({ where: { lastPlayed: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
        db.payment.count(),
        db.payment.count({ where: { status: 'pending' } }),
        db.payment.count({ where: { status: 'verified' } }),
        db.payment.count({ where: { status: 'rejected' } }),
        db.payment.aggregate({ where: { status: 'verified' }, _sum: { amount: true } }),
        db.subscription.count({ where: { plan: 'premium', status: 'active' } }),
        db.subscription.count({ where: { plan: 'pro', status: 'active' } }),
        db.subscription.count({ where: { plan: 'free' } }),
      ]);

      // Recent payments (last 10) — no relation, manual join
      const rawPayments = await db.payment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
      const recentPayments = await attachPlayersToPayments(rawPayments);

      return NextResponse.json({
        success: true,
        data: {
          players: { total: totalPlayers, active7d: activePlayers },
          payments: {
            total: totalPayments,
            pending: pendingPayments,
            verified: verifiedPayments,
            rejected: rejectedPayments,
            revenue: totalRevenue._sum.amount || 0,
          },
          subscriptions: { premium: premiumSubs, pro: proSubs, free: freeSubs },
          recentPayments,
        },
      });
    }

    // Payment list with filters
    if (action === 'payments') {
      const status = req.nextUrl.searchParams.get('status');
      const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
      const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20');

      const where: Record<string, unknown> = {};
      if (status && status !== 'all') {
        where.status = status;
      }

      const [rawPayments, total] = await Promise.all([
        db.payment.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        db.payment.count({ where }),
      ]);

      const payments = await attachPlayersToPayments(rawPayments);

      return NextResponse.json({
        success: true,
        data: {
          payments,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    }

    // Player list
    if (action === 'players') {
      const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
      const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20');
      const search = req.nextUrl.searchParams.get('search');

      const where: Record<string, unknown> = {};
      if (search) {
        where.username = { contains: search };
      }

      const [rawPlayers, total] = await Promise.all([
        db.player.findMany({
          where,
          orderBy: { totalScore: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            subscription: { select: { plan: true, status: true, expiryDate: true } },
            progress: { select: { level: true, completed: true, score: true } },
          },
        }),
        db.player.count({ where }),
      ]);

      const players = await attachPaymentCounts(rawPlayers);

      return NextResponse.json({
        success: true,
        data: {
          players,
          pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        },
      });
    }

    // Single player detail
    if (action === 'player') {
      const id = req.nextUrl.searchParams.get('id');
      if (!id) {
        return NextResponse.json({ success: false, error: 'Player ID required' }, { status: 400 });
      }

      const player = await db.player.findUnique({
        where: { id },
        include: {
          subscription: true,
          progress: { orderBy: { level: 'asc' } },
        },
      });

      if (!player) {
        return NextResponse.json({ success: false, error: 'Player not found' }, { status: 404 });
      }

      // Fetch payments separately (no relation on Player model)
      const playerPayments = await db.payment.findMany({
        where: { playerId: id },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({
        success: true,
        data: { ...player, payments: playerPayments },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action. Use: dashboard, payments, players, player' },
      { status: 400 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/admin
// Body: { action: 'verify_payment', paymentId }
// Body: { action: 'reject_payment', paymentId, reason }
// Body: { action: 'update_subscription', playerId, plan, status }
// Body: { action: 'delete_player', playerId }
// Body: { action: 'update_player', playerId, data: { username, coins, hints, lives, isPremium } }
export async function POST(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { action } = body;

    // Approve/Verify payment
    if (action === 'verify_payment') {
      const { paymentId } = body;
      if (!paymentId) {
        return NextResponse.json({ success: false, error: 'paymentId is required' }, { status: 400 });
      }

      const payment = await db.payment.findUnique({ where: { id: paymentId } });
      if (!payment) {
        return NextResponse.json({ success: false, error: 'Payment not found' }, { status: 404 });
      }

      if (payment.status !== 'pending') {
        return NextResponse.json(
          { success: false, error: `Payment already ${payment.status}` },
          { status: 400 },
        );
      }

      const now = new Date();
      const expiry = new Date(now);
      expiry.setMonth(expiry.getMonth() + 1);

      // Update payment status
      const updatedPayment = await db.payment.update({
        where: { id: paymentId },
        data: {
          status: 'verified',
          verifiedAt: now,
        },
      });

      // Activate subscription
      await db.subscription.upsert({
        where: { playerId: payment.playerId },
        create: {
          playerId: payment.playerId,
          plan: payment.plan,
          status: 'active',
          startDate: now,
          expiryDate: expiry,
          autoRenew: false,
          paymentProvider: 'phonepe',
          coinsPrice: payment.amount,
        },
        update: {
          plan: payment.plan,
          status: 'active',
          startDate: now,
          expiryDate: expiry,
          autoRenew: false,
          paymentProvider: 'phonepe',
          coinsPrice: payment.amount,
        },
      });

      // Update player premium flag
      await db.player.update({
        where: { id: payment.playerId },
        data: { isPremium: payment.plan === 'premium' },
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        data: updatedPayment,
        message: `Payment verified. ${payment.plan} subscription activated.`,
      });
    }

    // Reject payment
    if (action === 'reject_payment') {
      const { paymentId, reason } = body;
      if (!paymentId) {
        return NextResponse.json({ success: false, error: 'paymentId is required' }, { status: 400 });
      }

      const payment = await db.payment.findUnique({ where: { id: paymentId } });
      if (!payment) {
        return NextResponse.json({ success: false, error: 'Payment not found' }, { status: 404 });
      }

      if (payment.status !== 'pending') {
        return NextResponse.json(
          { success: false, error: `Payment already ${payment.status}` },
          { status: 400 },
        );
      }

      const updatedPayment = await db.payment.update({
        where: { id: paymentId },
        data: {
          status: 'rejected',
          rejectedReason: reason || 'Payment could not be verified',
        },
      });

      return NextResponse.json({
        success: true,
        data: updatedPayment,
        message: 'Payment rejected.',
      });
    }

    // Update subscription
    if (action === 'update_subscription') {
      const { playerId, plan, status } = body;
      if (!playerId || !plan) {
        return NextResponse.json({ success: false, error: 'playerId and plan are required' }, { status: 400 });
      }

      const now = new Date();
      const expiry = new Date(now);
      expiry.setMonth(expiry.getMonth() + 1);

      const subscription = await db.subscription.upsert({
        where: { playerId },
        create: {
          playerId,
          plan,
          status: status || 'active',
          startDate: now,
          expiryDate: plan === 'free' ? null : expiry,
          autoRenew: plan !== 'free',
          paymentProvider: 'admin',
        },
        update: {
          plan,
          status: status || 'active',
          ...(plan !== 'free' ? { startDate: now, expiryDate: expiry } : { expiryDate: null }),
          autoRenew: plan !== 'free',
          paymentProvider: 'admin',
        },
      });

      // Update player premium flag
      await db.player.update({
        where: { id: playerId },
        data: { isPremium: plan === 'premium' },
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        data: subscription,
        message: `Subscription updated to ${plan}`,
      });
    }

    // Update player details
    if (action === 'update_player') {
      const { playerId, data } = body;
      if (!playerId || !data) {
        return NextResponse.json({ success: false, error: 'playerId and data are required' }, { status: 400 });
      }

      const player = await db.player.update({
        where: { id: playerId },
        data,
      });

      return NextResponse.json({
        success: true,
        data: player,
        message: 'Player updated',
      });
    }

    // Delete player
    if (action === 'delete_player') {
      const { playerId } = body;
      if (!playerId) {
        return NextResponse.json({ success: false, error: 'playerId is required' }, { status: 400 });
      }

      // Delete related payments first (no cascade)
      await db.payment.deleteMany({ where: { playerId } });

      await db.player.delete({ where: { id: playerId } });

      return NextResponse.json({
        success: true,
        message: 'Player deleted',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action. Use: verify_payment, reject_payment, update_subscription, update_player, delete_player' },
      { status: 400 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
