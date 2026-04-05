'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Lightbulb,
  Heart,
  Clock,
  Brain,
  Zap,
  Eye,
  Target,
  RotateCcw,
  Star,
  Trophy,
} from 'lucide-react';
import { useGameStore } from '@/lib/game-store';
import type { Puzzle, PuzzleType } from '@/lib/puzzles';
import type { AppLanguage } from '@/lib/game-store';
import { PUZZLES_HI, DIFFICULTY_LABELS_HI } from '@/lib/puzzles-hi';
import { cn } from '@/lib/utils';

// ── Puzzle type config ──────────────────────────────────────────
const TYPE_ICON: Record<PuzzleType, typeof Brain> = {
  logic: Brain,
  pattern: Zap,
  memory: Eye,
  fake_answer: Target,
  hidden_ui: Star,
  reverse_thinking: RotateCcw,
};

const TYPE_LABEL: Record<PuzzleType, string> = {
  logic: 'Logic',
  pattern: 'Pattern',
  memory: 'Memory',
  fake_answer: 'Fake Answer',
  hidden_ui: 'Hidden UI',
  reverse_thinking: 'Reverse Think',
};

// ── Animation variants ──────────────────────────────────────────
const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

const optionVariants = {
  initial: { opacity: 0, x: -20 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, type: 'spring', stiffness: 300, damping: 24 },
  }),
  exit: { opacity: 0, x: 20 },
};

// ── Helpers ─────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// ── Localization helper ───────────────────────────────────────
function getLocalizedPuzzle(puzzle: Puzzle, language: AppLanguage): Puzzle {
  if (language === 'en') return puzzle;

  const hi = PUZZLES_HI[puzzle.level];
  if (!hi) return puzzle;

  return {
    ...puzzle,
    title: hi.title,
    question: hi.question,
    hint: hi.hint,
    explanation: hi.explanation,
    options: puzzle.options?.map((opt) => ({
      ...opt,
      value: hi.options[opt.id] || opt.value,
    })),
  };
}

function calculateScore(
  timeRemaining: number,
  attempts: number,
  hintUsed: boolean,
): number {
  const base = 100;
  const timeBonus = timeRemaining * 5;
  const hintPenalty = hintUsed ? 30 : 0;
  const attemptPenalty = attempts * 10;
  return Math.max(10, base + timeBonus - hintPenalty - attemptPenalty);
}

// ── Memory grid helper ──────────────────────────────────────────
function MemoryGrid({
  items,
  showing,
}: {
  items: { emoji: string; position: number }[];
  showing: boolean;
}) {
  return (
    <div className={cn('grid gap-3 max-w-[320px] mx-auto my-6', items.length <= 4 ? 'grid-cols-2' : 'grid-cols-3')}>
      {items.map((item, i) => (
        <motion.div
          key={item.position}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05, type: 'spring', stiffness: 350, damping: 22 }}
          className={cn(
            'flex items-center justify-center rounded-xl border text-3xl sm:text-4xl aspect-square',
            'transition-all duration-300',
            showing
              ? 'glass-card neon-glow-purple border-neon-purple/30 memory-show'
              : 'bg-vault-card border-vault-border',
          )}
        >
          {showing ? item.emoji : '?'}
        </motion.div>
      ))}
    </div>
  );
}

// ── Hidden UI area ──────────────────────────────────────────────
function HiddenUIArea({
  puzzle,
  onFound,
}: {
  puzzle: Puzzle;
  onFound: (id: string) => void;
}) {
  const [clickCount, setClickCount] = useState(0);
  const [clickTimestamps, setClickTimestamps] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<string | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (elementId: string, elementType: string) => {
      if (revealed) return;

      const now = Date.now();

      if (elementType === 'triple_tap') {
        setClickCount((c) => {
          const next = c + 1;
          if (next >= 3) {
            setRevealed(elementId);
            onFound(elementId);
          }
          return next;
        });
      } else if (elementType === 'shake') {
        setClickTimestamps((prev) => {
          const recent = prev.filter((t) => now - t < 1500);
          const updated = [...recent, now];
          if (updated.length >= 5) {
            setRevealed(elementId);
            onFound(elementId);
          }
          return updated;
        });
      } else if (elementType === 'button' || elementType === 'long_press' || elementType === 'swipe') {
        setRevealed(elementId);
        onFound(elementId);
      }
    },
    [revealed, onFound],
  );

  return (
    <div
      ref={areaRef}
      className="relative w-full h-64 sm:h-80 rounded-2xl glass-card border border-vault-border overflow-hidden cursor-crosshair my-4"
    >
      <p className="absolute inset-0 flex items-center justify-center text-sm text-gray-600 pointer-events-none px-4 text-center">
        {revealed ? (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-neon-green font-bold text-lg"
          >
            <Trophy className="w-6 h-6 mx-auto mb-1" />
            Found!
          </motion.span>
        ) : (
          'Explore this area…'
        )}
      </p>

      {puzzle.hiddenElements?.map((el) => {
        const isRevealed = revealed === el.id;
        const isButton = el.type === 'button';

        return (
          <motion.button
            key={el.id}
            onClick={() => handleClick(el.id, el.type)}
            className={cn(
              'absolute rounded-full border flex items-center justify-center transition-all duration-500',
              isButton
                ? isRevealed
                  ? 'bg-neon-green/20 border-neon-green/60 text-neon-green scale-110'
                  : 'bg-transparent border-vault-border/20 hover:border-vault-border/50'
                : 'bg-transparent border-transparent hover:border-neon-purple/20',
            )}
            style={{
              left: `${el.position.x}%`,
              top: `${el.position.y}%`,
              width: el.size,
              height: el.size,
              transform: 'translate(-50%, -50%)',
            }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Hidden element: ${el.hint}`}
          >
            {isRevealed && <Star className="w-4 h-4 text-neon-green" />}
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Typewriter text ─────────────────────────────────────────────
function TypewriterText({ text, speed = 28 }: { text: string; speed?: number }) {
  const [charCount, setCharCount] = useState(0);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;

    const interval = setInterval(() => {
      indexRef.current += 1;
      const next = indexRef.current;
      if (next >= text.length) {
        setCharCount(text.length);
        clearInterval(interval);
      } else {
        setCharCount(next);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  const displayed = text.slice(0, charCount);
  return (
    <span>
      {displayed}
      {charCount < text.length && (
        <span className="typewriter-cursor">&nbsp;</span>
      )}
    </span>
  );
}

// ── Main component ──────────────────────────────────────────────
export function GameplayScreen() {
  const {
    currentPuzzle,
    currentLevel,
    setScreen,
    timeRemaining,
    setTimeRemaining,
    isTimerRunning,
    setIsTimerRunning,
    selectedAnswer,
    setSelectedAnswer,
    attempts,
    incrementAttempts,
    hints,
    useHint: consumeHint,
    hintUsed,
    setHintUsed,
    lives,
    loseLife,
    setScore,
    addScore,
    addCoins,
    streak,
    incrementStreak,
    resetStreak,
    gameResult,
    setGameResult,
    completeLevel,
    resetGame,
  } = useGameStore();

  // ── Local state ──
  const [memoryPhase, setMemoryPhase] = useState<'showing' | 'hiding' | 'answering'>('showing');
  const [shakingOption, setShakingOption] = useState<string | null>(null);
  const [correctOption, setCorrectOption] = useState<string | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const navigatedRef = useRef(false);

  const language = useGameStore((s) => s.language);
  const puzzle = currentPuzzle ? getLocalizedPuzzle(currentPuzzle, language) : null;
  const TypeIcon = puzzle ? TYPE_ICON[puzzle.type] : Brain;
  const typeLabel = puzzle ? TYPE_LABEL[puzzle.type] : '';

  // ── Memory puzzle phase control ──
  useEffect(() => {
    if (!puzzle || puzzle.type !== 'memory') return;

    const displayTime = puzzle.memoryDisplayTime ?? 3000;
    setMemoryPhase('answering');

    const hideTimer = setTimeout(() => {
      setMemoryPhase('hiding');
      // brief "hiding" transition then switch to answering
      setTimeout(() => setMemoryPhase('answering'), 400);
    }, displayTime);

    return () => clearTimeout(hideTimer);
  }, [puzzle]);

  // ── Timer ──
  useEffect(() => {
    if (!isTimerRunning || gameResult) return;

    const interval = setInterval(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining, gameResult, setTimeRemaining]);

  // ── Time-up check ──
  useEffect(() => {
    if (timeRemaining <= 0 && isTimerRunning && !gameResult) {
      setIsTimerRunning(false);
      setGameResult('lose');
      loseLife();
      resetStreak();
    }
  }, [timeRemaining, isTimerRunning, gameResult, setIsTimerRunning, setGameResult, loseLife, resetStreak]);

  // ── Navigate to result after game ends ──
  useEffect(() => {
    if (!gameResult || navigatedRef.current) return;
    navigatedRef.current = true;

    const timeout = setTimeout(() => {
      setScreen('result');
    }, 1500);

    return () => clearTimeout(timeout);
  }, [gameResult, setScreen]);

  // ── Hint handler ──
  const handleUseHint = useCallback(() => {
    if (!puzzle || hintUsed) return;
    const success = consumeHint();
    if (success) {
      setHintUsed(true);
      setHintVisible(true);
    }
  }, [puzzle, hintUsed, consumeHint, setHintUsed]);

  // ── Hidden UI found handler ──
  const handleHiddenFound = useCallback(
    (elementId: string) => {
      if (gameResult) return;
      setIsTimerRunning(false);
      const finalScore = calculateScore(timeRemaining, attempts, hintUsed);
      setScore(finalScore);
      addScore(finalScore);
      const coinsEarned = Math.floor(finalScore / 5);
      addCoins(coinsEarned);
      incrementStreak();
      completeLevel(currentLevel);
      setGameResult('win');
      setCorrectOption(elementId);
    },
    [gameResult, setIsTimerRunning, timeRemaining, attempts, hintUsed, setScore, addScore, addCoins, incrementStreak, completeLevel, currentLevel, setGameResult],
  );

  // ── Option click handler ──
  const handleOptionClick = useCallback(
    (optionId: string, isCorrect: boolean) => {
      if (gameResult) return;
      setSelectedAnswer(optionId);

      if (isCorrect) {
        setIsTimerRunning(false);
        setCorrectOption(optionId);
        const finalScore = calculateScore(timeRemaining, attempts, hintUsed);
        setScore(finalScore);
        addScore(finalScore);
        const coinsEarned = Math.floor(finalScore / 5);
        addCoins(coinsEarned);
        incrementStreak();
        completeLevel(currentLevel);
        setGameResult('win');
      } else {
        incrementAttempts();
        setShakingOption(optionId);
        setTimeout(() => setShakingOption(null), 500);

        // Check if max attempts reached (3 total wrong)
        if (attempts + 1 >= 3) {
          setIsTimerRunning(false);
          loseLife();
          resetStreak();
          setGameResult('lose');
          // Reveal correct answer
          const correct = puzzle?.options?.find((o) => o.isCorrect);
          if (correct) setCorrectOption(correct.id);
        }
      }
    },
    [gameResult, setSelectedAnswer, setIsTimerRunning, timeRemaining, attempts, hintUsed, setScore, addScore, addCoins, incrementStreak, completeLevel, currentLevel, setGameResult, incrementAttempts, loseLife, resetStreak, puzzle],
  );

  // ── Back handler ──
  const handleBack = useCallback(() => {
    setIsTimerRunning(false);
    resetGame();
    setScreen('levels');
  }, [setIsTimerRunning, resetGame, setScreen]);

  // ── Early return if no puzzle ──
  if (!puzzle) {
    return (
      <div className="min-h-screen bg-vault-bg flex items-center justify-center">
        <motion.div {...fadeIn} className="text-center">
          <Brain className="w-12 h-12 text-neon-purple mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Loading puzzle…</p>
        </motion.div>
      </div>
    );
  }

  const isMemoryShowing = puzzle.type === 'memory' && memoryPhase === 'showing';
  const isMemoryHiding = puzzle.type === 'memory' && memoryPhase === 'hiding';
  const isMemoryAnswering = puzzle.type === 'memory' && memoryPhase === 'answering';
  const showOptions = puzzle.type !== 'memory' || isMemoryAnswering;

  return (
    <div className="min-h-screen bg-vault-bg flex flex-col max-w-2xl mx-auto p-4 select-none">
      {/* ── Top bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between gap-3 mb-4"
      >
        {/* Back button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleBack}
          className="flex items-center justify-center w-10 h-10 rounded-xl glass-card border border-vault-border hover:border-neon-purple/40 transition-colors cursor-pointer"
          aria-label="Go back to levels"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </motion.button>

        {/* Language indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-1 px-2 py-1 rounded-full glass-card border border-neon-purple/20 text-[10px] font-bold text-gray-400 tracking-wider uppercase"
        >
          <span>{language === 'hi' ? '🇮🇳' : '🇬🇧'}</span>
          <span>{language === 'hi' ? 'हिं' : 'EN'}</span>
        </motion.div>

        {/* Level & type badge */}
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={cn(
              'text-xs font-bold px-3 py-1 rounded-full border',
              `level-badge-${puzzle.difficulty}`,
            )}
          >
            Lv.{currentLevel}
          </span>
          <div className="flex items-center gap-1.5 min-w-0">
            <TypeIcon className="w-3.5 h-3.5 text-neon-purple flex-shrink-0" />
            <span className="text-xs text-gray-400 truncate">{typeLabel}</span>
          </div>
        </div>

        {/* Hints */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleUseHint}
          disabled={hintUsed || hints <= 0}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer',
            hintUsed || hints <= 0
              ? 'glass-card border-vault-border opacity-40 cursor-not-allowed'
              : 'glass-card border-neon-yellow/30 text-neon-yellow hover:border-neon-yellow/60',
          )}
          aria-label="Use hint"
        >
          <Lightbulb className="w-4 h-4" />
          <span>{hints}</span>
        </motion.button>
      </motion.div>

      {/* ── Title row ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-center mb-3"
      >
        <h2 className="text-lg sm:text-xl font-black tracking-wide text-white neon-text-purple">
          {puzzle.title}
        </h2>
      </motion.div>

      {/* ── Stats row: timer + lives ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-6 mb-5"
      >
        {/* Timer */}
        <div
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl glass-card border transition-all',
            timeRemaining <= 10
              ? 'border-neon-red/50 timer-warning'
              : 'border-vault-border',
            timeRemaining <= 10 && 'shadow-[0_0_15px_rgba(255,0,64,0.5)]',
          )}
        >
          <Clock
            className={cn(
              'w-4 h-4',
              timeRemaining <= 10 ? 'text-neon-red' : 'text-gray-400',
            )}
          />
          <span
            className={cn(
              'font-mono text-sm font-bold tabular-nums',
              timeRemaining <= 10 ? 'text-neon-red' : 'text-gray-200',
            )}
          >
            {formatTime(timeRemaining)}
          </span>
        </div>

        {/* Lives */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: Math.max(lives, 0) }).map((_, i) => (
            <Heart key={i} className="w-4 h-4 text-neon-pink" fill="currentColor" />
          ))}
          {Array.from({ length: Math.max(5 - lives, 0) }).map((_, i) => (
            <Heart key={`empty-${i}`} className="w-4 h-4 text-gray-700" />
          ))}
        </div>
      </motion.div>

      {/* ── Puzzle area ── */}
      <motion.div
        {...scaleIn}
        transition={{ delay: 0.25, type: 'spring', stiffness: 220, damping: 20 }}
        className="glass-card rounded-2xl border border-vault-border neon-glow-purple flex-1 flex flex-col p-5 sm:p-6 mb-4 overflow-hidden"
      >
        {/* Question text */}
        <div className="mb-5">
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed whitespace-pre-wrap">
            <TypewriterText key={puzzle.id} text={puzzle.question} speed={22} />
          </p>
        </div>

        {/* Hint reveal */}
        <AnimatePresence>
          {hintVisible && puzzle.hint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="flex items-start gap-2 p-3 rounded-xl bg-neon-yellow/5 border border-neon-yellow/20">
                <Lightbulb className="w-4 h-4 text-neon-yellow mt-0.5 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-neon-yellow/90 leading-relaxed">
                  {puzzle.hint}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Memory puzzle grid ── */}
        {puzzle.type === 'memory' && puzzle.memoryItems && (
          <AnimatePresence mode="wait">
            {(isMemoryShowing || isMemoryHiding) && (
              <motion.div
                key="memory-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <MemoryGrid
                  items={puzzle.memoryItems.map((item) => ({
                    emoji: item.emoji,
                    position: item.position,
                  }))}
                  showing={!isMemoryHiding}
                />
                <p className="text-center text-xs text-neon-purple font-bold tracking-wider uppercase">
                  {isMemoryShowing ? 'Memorize…' : ''}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ── Hidden UI area ── */}
        {puzzle.type === 'hidden_ui' && (
          <HiddenUIArea puzzle={puzzle} onFound={handleHiddenFound} />
        )}

        {/* ── Options (standard puzzles + memory answering) ── */}
        {showOptions && puzzle.options && (
          <div className="flex flex-col gap-3 mt-auto">
            <AnimatePresence mode="wait">
              {puzzle.options.map((option, i) => {
                const isSelected = selectedAnswer === option.id;
                const isCorrectRevealed = correctOption === option.id;
                const isWrongShaking = shakingOption === option.id;
                const isDisabled = !!gameResult;

                let optionStyle = 'glass-card border-vault-border hover:border-neon-purple/40 hover:bg-vault-surface/50';
                if (isCorrectRevealed) {
                  optionStyle = 'correct-answer border-neon-green/60 bg-neon-green/10';
                } else if (isWrongShaking) {
                  optionStyle = 'wrong-answer shake';
                } else if (isSelected && !isCorrectRevealed) {
                  optionStyle = 'wrong-answer border-neon-red/50 bg-neon-red/10';
                }

                return (
                  <motion.button
                    key={option.id}
                    custom={i}
                    variants={optionVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileHover={!isDisabled ? { scale: 1.015, x: 4 } : undefined}
                    whileTap={!isDisabled ? { scale: 0.98 } : undefined}
                    onClick={() => handleOptionClick(option.id, option.isCorrect)}
                    disabled={isDisabled}
                    className={cn(
                      'w-full text-left rounded-xl p-4 border transition-all duration-200 cursor-pointer',
                      'flex items-center gap-4 min-h-[44px]',
                      optionStyle,
                      isDisabled && 'cursor-default',
                    )}
                  >
                    {/* Label circle */}
                    <span
                      className={cn(
                        'flex items-center justify-center w-9 h-9 rounded-lg text-sm font-black flex-shrink-0 border transition-colors',
                        isCorrectRevealed
                          ? 'bg-neon-green/20 border-neon-green/50 text-neon-green'
                          : isWrongShaking || (isSelected && !isCorrectRevealed)
                            ? 'bg-neon-red/20 border-neon-red/50 text-neon-red'
                            : 'bg-vault-card border-vault-border text-gray-400',
                      )}
                    >
                      {option.label}
                    </span>

                    {/* Value text */}
                    <span
                      className={cn(
                        'text-sm sm:text-base font-medium leading-snug',
                        isCorrectRevealed
                          ? 'text-neon-green'
                          : isWrongShaking || (isSelected && !isCorrectRevealed)
                            ? 'text-neon-red'
                            : 'text-gray-200',
                      )}
                    >
                      {option.value}
                    </span>

                    {/* Trap indicator */}
                    {option.isTrap && !isDisabled && (
                      <span className="ml-auto text-[10px] text-neon-orange/50 font-bold tracking-wider uppercase">
                        TRAP
                      </span>
                    )}

                    {/* Result icon */}
                    {isCorrectRevealed && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto"
                      >
                        <Trophy className="w-5 h-5 text-neon-green" />
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* ── Bottom: progress & attempts ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-xl border border-vault-border p-3 flex items-center justify-between text-xs text-gray-500"
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-300">Level {currentLevel}</span>
          <div className="w-24 h-1.5 rounded-full bg-vault-card overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(((currentLevel % 10) / 10) * 100, 100)}%` }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-blue"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Streak */}
          {streak > 0 && (
            <span className="text-neon-orange fire-glow font-bold">🔥 {streak}</span>
          )}

          {/* Attempts remaining indicator */}
          <span className="flex items-center gap-1">
            <span className="text-gray-400">Attempts:</span>
            {[0, 1, 2].map((a) => (
              <span
                key={a}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  a < 3 - attempts
                    ? 'bg-neon-purple/60'
                    : 'bg-neon-red/60',
                )}
              />
            ))}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
