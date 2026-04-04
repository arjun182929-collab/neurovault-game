import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const leaderboard = await db.leaderboard.findMany({
      take: 50,
      orderBy: { score: 'desc' },
      include: { player: { select: { username: true, avatar: true } } },
    });

    return NextResponse.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerId, score, level, mode } = body;

    if (!playerId || !score || !level) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Create or update player entry
    const player = await db.player.upsert({
      where: { id: playerId },
      update: { totalScore: { increment: score } },
      create: {
        id: playerId,
        username: `Player_${playerId.slice(0, 6)}`,
        totalScore: score,
      },
    });

    // Add to leaderboard
    const entry = await db.leaderboard.create({
      data: {
        playerId,
        score,
        level,
        mode: mode || 'classic',
      },
    });

    return NextResponse.json({
      success: true,
      data: { entry, player },
    });
  } catch (error) {
    console.error('Leaderboard submit error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit score' },
      { status: 500 },
    );
  }
}
