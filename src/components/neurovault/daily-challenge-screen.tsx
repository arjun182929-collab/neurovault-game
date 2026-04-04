'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Star,
  Trophy,
  Zap,
  Flame,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/lib/game-store';
import { getDailyChallenge } from '@/lib/puzzles';
import type { PuzzleType } from '@/lib/puzzles';

function getTimeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

const TYPE_LABELS: Record<PuzzleType, string> = {
  logic: 'Logic',
  pattern: 'Pattern',
  memory: 'Memory',
  fake_answer: 'Fake Answer',
  hidden_ui: 'Hidden UI',
  reverse_thinking: 'Reverse Thinking',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
};

export function DailyChallengeScreen() {
  const {
    setScreen,
    startPuzzle,
    setDailyCompleted,
    setLastDailyDate,
    dailyCompleted,
    lastDailyDate,
    playerName,
    totalScore,
    streak,
  } = useGameStore();

  const [countdown, setCountdown] = useState(getTimeUntilMidnight());
  const [solvedBy] = useState(() => Math.floor(Math.random() * 165) + 23);

  const isCompletedToday =
    dailyCompleted && lastDailyDate === getTodayString();

  const weeklyProgress = 3; // mock: 3 out of 7 days completed this week

  // Reset daily completion if date changed
  useEffect(() => {
    const today = getTodayString();
    if (lastDailyDate !== today && dailyCompleted) {
      setDailyCompleted(false);
    }
  }, [lastDailyDate, dailyCompleted, setDailyCompleted]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptChallenge = useCallback(() => {
    const puzzle = getDailyChallenge();
    startPuzzle(puzzle.level);
    setLastDailyDate(getTodayString());
    setScreen('gameplay');
  }, [startPuzzle, setLastDailyDate, setScreen]);

  const todayPuzzle = getDailyChallenge();

  return (
    <div className="min-h-screen bg-vault-bg flex flex-col items-center px-4 py-6 select-none">
      <div className="w-full max-w-lg flex flex-col gap-5 flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setScreen('home')}
            className="p-2 rounded-lg border border-vault-border bg-vault-card text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div className="flex-1 text-center">
            <h1
              className="text-xl sm:text-2xl font-black tracking-[0.2em]"
              style={{
                color: '#ff6600',
                textShadow:
                  '0 0 10px rgba(255,102,0,0.6), 0 0 30px rgba(255,102,0,0.3)',
              }}
            >
              DAILY CHALLENGE
            </h1>
          </div>
          <div className="w-9" /> {/* spacer */}
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4"
        >
          {/* Challenge Card */}
          <motion.div
            variants={itemVariants}
            className="relative glass-card rounded-2xl p-6 overflow-hidden"
          >
            {/* Animated gradient border */}
            <div
              className="absolute inset-0 rounded-2xl opacity-60"
              style={{
                background:
                  'conic-gradient(from 0deg, #ff6600, #ff660066, #a855f7, #a855f766, #ff6600)',
                animation: 'spin 4s linear infinite',
                zIndex: 0,
              }}
            />
            <div className="absolute inset-[2px] rounded-2xl bg-vault-card z-[1]" />
            <div className="relative z-[2] flex flex-col items-center gap-4">
              {/* Subtitle */}
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-neon-orange" />
                <span className="text-xs font-bold tracking-[0.25em] text-neon-orange uppercase">
                  Today&apos;s Impossible
                </span>
                <Zap className="w-4 h-4 text-neon-orange" />
              </div>

              {/* Puzzle Info */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge
                  className="text-[10px] font-bold px-2 py-0.5"
                  style={{
                    backgroundColor: 'rgba(255,102,0,0.15)',
                    color: '#ff6600',
                    border: '1px solid rgba(255,102,0,0.3)',
                  }}
                >
                  {todayPuzzle.difficulty.toUpperCase()}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-[10px] font-bold px-2 py-0.5 border-gray-700 text-gray-400"
                >
                  {TYPE_LABELS[todayPuzzle.type]}
                </Badge>
                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{todayPuzzle.timeLimit}s</span>
                </div>
              </div>

              {/* Solved by */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Users className="w-3.5 h-3.5" />
                <span>Solved by {solvedBy} players today</span>
              </div>

              {/* Action Button */}
              {isCompletedToday ? (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className="text-lg font-black tracking-wider px-8 py-3 rounded-xl"
                    style={{
                      color: '#22c55e',
                      background: 'rgba(34,197,94,0.1)',
                      border: '1px solid rgba(34,197,94,0.3)',
                      boxShadow:
                        '0 0 15px rgba(34,197,94,0.2), 0 0 40px rgba(34,197,94,0.1)',
                    }}
                  >
                    COMPLETED ✓
                  </div>
                  <p className="text-xs text-gray-500">
                    Come back tomorrow for a new challenge!
                  </p>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleAcceptChallenge}
                  className="relative px-8 py-3.5 rounded-xl font-black tracking-wider text-white text-sm cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #ff6600, #ff8533)',
                    boxShadow:
                      '0 0 15px rgba(255,102,0,0.4), 0 0 40px rgba(255,102,0,0.15)',
                  }}
                >
                  ACCEPT CHALLENGE
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-3"
          >
            {/* Current Streak */}
            <div className="glass-card rounded-xl p-3 flex flex-col items-center gap-1">
              <motion.div
                animate={
                  streak > 0
                    ? {
                        scale: [1, 1.2, 1],
                        transition: { repeat: Infinity, duration: 1.5 },
                      }
                    : {}
                }
              >
                <Flame
                  className={`w-5 h-5 ${
                    streak > 0 ? 'text-neon-orange fire-glow' : 'text-gray-600'
                  }`}
                />
              </motion.div>
              <span className="text-base font-black text-gray-200 font-mono">
                {streak}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                Streak
              </span>
            </div>

            {/* Weekly Progress */}
            <div className="glass-card rounded-xl p-3 flex flex-col items-center gap-1">
              <Calendar className="w-5 h-5 text-neon-purple" />
              <span className="text-base font-black text-gray-200 font-mono">
                {weeklyProgress}/7
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                This Week
              </span>
            </div>

            {/* Total Score */}
            <div className="glass-card rounded-xl p-3 flex flex-col items-center gap-1">
              <Star className="w-5 h-5 text-neon-yellow" />
              <span className="text-base font-black text-gray-200 font-mono">
                {totalScore.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                Score
              </span>
            </div>
          </motion.div>

          {/* Weekly Progress Bar */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Weekly Progress
              </span>
              <span className="text-xs font-mono text-neon-orange">
                {weeklyProgress}/7
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(weeklyProgress / 7) * 100}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #ff6600, #ffcc00)',
                  boxShadow: '0 0 8px rgba(255,102,0,0.5)',
                }}
              />
            </div>
            {/* Progress Dots */}
            <div className="flex items-center justify-between mt-3">
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                      i < weeklyProgress
                        ? 'border-neon-orange bg-neon-orange/20 text-neon-orange'
                        : 'border-gray-700 bg-gray-800 text-gray-600'
                    }`}
                  >
                    {i < weeklyProgress ? '✓' : i + 1}
                  </div>
                  <span className="text-[9px] text-gray-600">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Rewards Preview */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-xl p-4 neon-border-pulse"
          >
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-neon-yellow" />
              <span className="text-xs font-bold text-neon-yellow uppercase tracking-wider">
                Weekly Reward
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Complete <span className="text-white font-bold">7 daily challenges</span>{' '}
              this week for:
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-neon-yellow bg-neon-yellow/10 px-2.5 py-1 rounded-lg border border-neon-yellow/20">
                <Star className="w-3 h-3" />
                <span className="font-bold">200 coins</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-neon-purple bg-neon-purple/10 px-2.5 py-1 rounded-lg border border-neon-purple/20">
                <Zap className="w-3 h-3" />
                <span className="font-bold">5 hints</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-neon-pink bg-neon-pink/10 px-2.5 py-1 rounded-lg border border-neon-pink/20">
                <Flame className="w-3 h-3" />
                <span className="font-bold">Theme</span>
              </div>
            </div>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-xl p-4 text-center"
          >
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
              Next challenge in
            </p>
            <span
              className="text-2xl sm:text-3xl font-black font-mono tracking-widest"
              style={{
                color: '#ff6600',
                textShadow:
                  '0 0 8px rgba(255,102,0,0.4), 0 0 20px rgba(255,102,0,0.15)',
              }}
            >
              {countdown}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
