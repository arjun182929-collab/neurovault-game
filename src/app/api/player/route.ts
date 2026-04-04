import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');

    if (!playerId) {
      return NextResponse.json(
        { success: false, error: 'Player ID required' },
        { status: 400 },
      );
    }

    const player = await db.player.findUnique({
      where: { id: playerId },
      include: { progress: true },
    });

    if (!player) {
      return NextResponse.json(
        { success: false, error: 'Player not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: player,
    });
  } catch (error) {
    console.error('Player fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch player' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerId, level, completed, score, timeSpent, attempts, hintUsed } = body;

    if (!playerId || !level) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Ensure player exists
    await db.player.upsert({
      where: { id: playerId },
      update: {},
      create: {
        id: playerId,
        username: `Player_${playerId.slice(0, 6)}`,
      },
    });

    // Upsert progress
    const progress = await db.playerProgress.upsert({
      where: {
        playerId_level: { playerId, level },
      },
      update: {
        completed: completed ?? false,
        score: Math.max(score || 0, 0),
        timeSpent: timeSpent || 0,
        attempts: attempts || 0,
        hintUsed: hintUsed || false,
      },
      create: {
        playerId,
        level,
        completed: completed ?? false,
        score: score || 0,
        timeSpent: timeSpent || 0,
        attempts: attempts || 0,
        hintUsed: hintUsed || false,
      },
    });

    // Update player total score if completed
    if (completed) {
      await db.player.update({
        where: { id: playerId },
        data: { totalScore: { increment: score || 0 } },
      });
    }

    return NextResponse.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error('Player progress error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save progress' },
      { status: 500 },
    );
  }
}
