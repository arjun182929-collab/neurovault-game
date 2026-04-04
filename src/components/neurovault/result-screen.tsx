'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  XCircle,
  RotateCcw,
  Share2,
  Home,
  Star,
  Zap,
  Flame,
 ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/lib/game-store';

const NEON_GREEN = '#39ff14';
const NEON_RED = '#ff0040';
const NEON_PURPLE = '#b026ff';

function getDifficulty(level: number): string {
  if (level <= 5) return 'Easy';
  if (level <= 15) return 'Medium';
  if (level <= 30) return 'Hard';
  return 'Expert';
}

export function ResultScreen() {
  const {
    gameResult,
    currentLevel,
    currentPuzzle,
    score,
    timeRemaining,
    attempts,
    hintUsed,
    streak,
    totalScore,
    coins,
    lives,
    hints,
    setScreen,
    startPuzzle,
    resetGame,
    isLevelCompleted,
  } = useGameStore();

  const [displayedScore, setDisplayedScore] = useState(0);
  const [shareToast, setShareToast] = useState(false);
  const prevGameResultRef = useRef<'win' | 'lose' | null>(null);
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animated score counter — only triggers on fresh win transition
  useEffect(() => {
    if (gameResult === 'win' && prevGameResultRef.current !== 'win') {
      const duration = 1500;
      const steps = 60;
      const increment = score / steps;
      let current = 0;
      // Reset score asynchronously to avoid synchronous setState in effect
      const rafId = requestAnimationFrame(() => setDisplayedScore(0));
      animationRef.current = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayedScore(score);
          if (animationRef.current) clearInterval(animationRef.current);
        } else {
          setDisplayedScore(Math.floor(current));
        }
      }, duration / steps);
      return () => {
        cancelAnimationFrame(rafId);
        if (animationRef.current) clearInterval(animationRef.current);
      };
    }
    prevGameResultRef.current = gameResult;
  }, [gameResult, score]);

  const solvePercentage = Math.max(1, 99 - currentLevel * 2);

  const handleShare = useCallback(async () => {
    const difficulty = getDifficulty(currentLevel);
    const shareText = `🧠 I solved Level ${currentLevel} (${difficulty}) of NeuroVault!\n⏱️ Time: ${timeRemaining}s | 💡 Hints: ${hintUsed ? 'yes' : 'no'}\n\nThink harder. Fail faster. Solve the impossible.\n#NeuroVault`;
    try {
      await navigator.clipboard.writeText(shareText);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    } catch {
      // Fallback: silent fail
    }
  }, [currentLevel, timeRemaining, hintUsed]);

  if (!gameResult) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 260, damping: 20 },
    },
  };

  // ─── WIN SCREEN ─────────────────────────────────────────────
  if (gameResult === 'win') {
    return (
      <div className="relative max-w-lg mx-auto p-4 min-h-screen flex items-center justify-center">
        {/* Toast notification */}
        <AnimatePresence>
          {shareToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 glass-card px-4 py-2 rounded-xl text-sm text-white"
            >
              ✅ Challenge copied! Share with friends!
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full space-y-6 text-center"
        >
          {/* Trophy icon */}
          <motion.div variants={itemVariants}>
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-2"
              style={{
                boxShadow: `0 0 40px ${NEON_GREEN}, 0 0 80px ${NEON_GREEN}40`,
                background: `radial-gradient(circle, ${NEON_GREEN}20, transparent)`,
              }}
            >
              <Trophy className="w-10 h-10" style={{ color: NEON_GREEN }} />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl font-extrabold tracking-tight neon-text-pink"
            style={{ textShadow: `0 0 20px ${NEON_GREEN}, 0 0 40px ${NEON_GREEN}60` }}
          >
            LEVEL COMPLETE
          </motion.h1>

          {/* Animated score */}
          <motion.div
            variants={itemVariants}
            className="glass-card neon-glow-green rounded-2xl p-6 space-y-1"
          >
            <p className="text-xs uppercase tracking-widest text-white/50">Score</p>
            <p
              className="text-5xl font-black tabular-nums"
              style={{ color: NEON_GREEN }}
            >
              {displayedScore.toLocaleString()}
            </p>
          </motion.div>

          {/* Stats breakdown */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-3 text-center"
          >
            <div className="glass-card rounded-xl p-3 space-y-1">
              <Zap className="w-4 h-4 mx-auto" style={{ color: NEON_GREEN }} />
              <p className="text-xs text-white/50">Time Bonus</p>
              <p className="text-sm font-bold text-white">+{timeRemaining * 10}</p>
            </div>
            <div className="glass-card rounded-xl p-3 space-y-1">
              <Star className="w-4 h-4 mx-auto text-yellow-400" />
              <p className="text-xs text-white/50">Hint Penalty</p>
              <p className="text-sm font-bold text-white">
                {hintUsed ? '-50' : '0'}
              </p>
            </div>
            <div className="glass-card rounded-xl p-3 space-y-1">
              <RotateCcw className="w-4 h-4 mx-auto" style={{ color: NEON_RED }} />
              <p className="text-xs text-white/50">Attempts</p>
              <p className="text-sm font-bold text-white">x{attempts}</p>
            </div>
          </motion.div>

          {/* Streak */}
          {streak > 1 && (
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-2">
              <Badge
                variant="outline"
                className="fire-glow text-sm px-3 py-1"
                style={{ borderColor: '#ff6a00', color: '#ff6a00' }}
              >
                {streak > 2 && <span className="mr-1">🔥</span>}
                <Flame className="w-3.5 h-3.5 mr-1" />
                {streak} Win Streak
              </Badge>
            </motion.div>
          )}

          {/* Solve percentage */}
          <motion.p
            variants={itemVariants}
            className="text-xs text-white/40 italic"
          >
            Only {solvePercentage}% of players solved this level
          </motion.p>

          {/* Coins earned */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-1 text-lg font-bold"
            style={{ color: '#fbbf24' }}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, delay: 0.8 }}
            >
              +{coins} 💰
            </motion.span>
          </motion.div>

          {/* Action buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                if (currentLevel < 50) {
                  startPuzzle(currentLevel + 1);
                  setScreen('gameplay');
                } else {
                  setScreen('levels');
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-black transition-all hover:brightness-110"
              style={{
                background: `linear-gradient(135deg, ${NEON_GREEN}, #00cc66)`,
                boxShadow: `0 0 24px ${NEON_GREEN}50`,
              }}
            >
              {currentLevel < 50 ? 'Next Level' : 'All Complete!'}
              {currentLevel < 50 && <ChevronRight className="w-4 h-4" />}
              {currentLevel >= 50 && <Trophy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setScreen('levels')}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold glass-card text-white hover:bg-white/10 transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Levels
            </button>
          </motion.div>

          {/* Share */}
          <motion.button
            variants={itemVariants}
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share Challenge
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ─── LOSE SCREEN ────────────────────────────────────────────
  return (
    <div className="relative max-w-lg mx-auto p-4 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full space-y-6 text-center"
      >
        {/* X icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-2"
          style={{
            boxShadow: `0 0 40px ${NEON_RED}40, 0 0 80px ${NEON_RED}20`,
            background: `radial-gradient(circle, ${NEON_RED}15, transparent)`,
          }}
        >
          <XCircle className="w-10 h-10" style={{ color: NEON_RED }} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl md:text-4xl font-extrabold tracking-tight"
          style={{ color: NEON_RED, textShadow: `0 0 20px ${NEON_RED}80` }}
        >
          LEVEL FAILED
        </motion.h1>

        {/* Encouraging message */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="text-white/60 text-sm italic"
        >
          &quot;The vault guards you. Try again.&quot;
        </motion.p>

        {/* Explanation card */}
        {currentPuzzle?.explanation && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card rounded-2xl p-5 text-left space-y-2"
          >
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4" style={{ color: NEON_PURPLE }} />
              <span className="text-xs uppercase tracking-widest text-white/50 font-semibold">
                Answer
              </span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              {currentPuzzle.explanation}
            </p>
          </motion.div>
        )}

        {/* Lives warning */}
        {lives <= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Badge
              variant="outline"
              className="px-3 py-1 text-xs"
              style={{ borderColor: NEON_RED, color: NEON_RED }}
            >
              ⚠️ {lives} {lives === 1 ? 'life' : 'lives'} remaining
            </Badge>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-3 pt-2"
        >
          <button
            onClick={() => { startPuzzle(currentLevel); setScreen('gameplay'); }}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-black transition-all hover:brightness-110"
            style={{
              background: `linear-gradient(135deg, ${NEON_PURPLE}, #8b00cc)`,
              boxShadow: `0 0 24px ${NEON_PURPLE}40`,
            }}
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={() => setScreen('levels')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold glass-card text-white hover:bg-white/10 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Levels
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
