import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getDailyChallenge } from '@/lib/puzzles';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const puzzle = getDailyChallenge();

    // Get or create today's challenge
    let challenge = await db.dailyChallenge.findUnique({
      where: { date: today },
    });

    if (!challenge) {
      challenge = await db.dailyChallenge.create({
        data: {
          date: today,
          level: puzzle.level,
          puzzleType: puzzle.type,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...challenge,
        puzzle,
      },
    });
  } catch (error) {
    console.error('Daily challenge error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch daily challenge' },
      { status: 500 },
    );
  }
}
