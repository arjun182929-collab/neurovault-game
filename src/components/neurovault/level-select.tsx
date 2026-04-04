'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Check, Star, Brain, Zap, Target, Eye, RotateCcw } from 'lucide-react';
import { useGameStore } from '@/lib/game-store';
import { PUZZLES, DIFFICULTY_CONFIG, type Difficulty } from '@/lib/puzzles';
import { DIFFICULTY_LABELS_HI } from '@/lib/puzzles-hi';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'hard', 'extreme', 'insane', 'impossible'];

const PUZZLE_TYPE_ICONS: Record<string, React.ReactNode> = {
  logic: <Brain className="h-3.5 w-3.5" />,
  pattern: <Zap className="h-3.5 w-3.5" />,
  memory: <Eye className="h-3.5 w-3.5" />,
  fake_answer: <Target className="h-3.5 w-3.5" />,
  hidden_ui: <Star className="h-3.5 w-3.5" />,
  reverse_thinking: <RotateCcw className="h-3.5 w-3.5" />,
};

function getLevelBadgeClass(difficulty: Difficulty): string {
  const map: Record<Difficulty, string> = {
    easy: 'level-badge-easy',
    hard: 'level-badge-hard',
    extreme: 'level-badge-extreme',
    insane: 'level-badge-insane',
    impossible: 'level-badge-impossible',
  };
  return map[difficulty];
}

export function LevelSelect() {
  const { setScreen, startPuzzle, completedLevels, isLevelUnlocked, isLevelCompleted, totalScore, language } = useGameStore();

  const difficultySections = DIFFICULTY_ORDER.map((difficulty) => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const levels = PUZZLES.filter((p) => p.difficulty === difficulty);
    const [start, end] = config.levelRange;
    const completedInGroup = levels.filter((p) => completedLevels.has(p.level)).length;
    const progressPercent = levels.length > 0 ? (completedInGroup / levels.length) * 100 : 0;
    const isGroupFullyComplete = completedInGroup === levels.length;

    return { difficulty, config, levels, start, end, completedInGroup, progressPercent, isGroupFullyComplete };
  });

  const handleLevelClick = (level: number) => {
    startPuzzle(level);
    setScreen('gameplay');
  };

  return (
    <div className="min-h-screen bg-vault-bg text-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setScreen('home')}
          className="flex items-center gap-2 text-gray-400 hover:text-neon-purple transition-colors group cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium tracking-wider uppercase">Back</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center space-y-3"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-widest neon-text-purple">
            SELECT LEVEL
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-neon-green" />
              <span>Total Score: <span className="text-neon-green font-semibold">{totalScore}</span></span>
            </div>
            <span className="text-gray-600">|</span>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-neon-blue" />
              <span>Completed: <span className="text-neon-blue font-semibold">{completedLevels.size}</span> / {PUZZLES.length}</span>
            </div>
          </div>
        </motion.div>

        {/* Difficulty Sections */}
        {difficultySections.map((section, sectionIdx) => {
          const hasFirstUnlocked = section.levels.some((p) => isLevelUnlocked(p.level));

          return (
            <motion.div
              key={section.difficulty}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + sectionIdx * 0.1 }}
              className="space-y-3"
            >
              {/* Difficulty Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-1 h-8 rounded-full"
                    style={{ backgroundColor: section.config.color, boxShadow: `0 0 12px ${section.config.glow}` }}
                  />
                  <div>
                    <h2
                      className="text-lg font-bold tracking-wider uppercase"
                      style={{ color: section.config.color, textShadow: `0 0 20px ${section.config.glow}` }}
                    >
                      {language === 'hi' && DIFFICULTY_LABELS_HI[section.difficulty]
                        ? DIFFICULTY_LABELS_HI[section.difficulty]
                        : section.config.label}
                    </h2>
                    <p className="text-xs text-gray-500 tracking-wide">
                      Levels {section.start}–{section.end}
                    </p>
                  </div>
                  {section.isGroupFullyComplete && (
                    <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 text-xs">
                      <Check className="h-3 w-3 mr-1" />
                      Complete
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 min-w-[140px]">
                  <span>{section.completedInGroup}/{section.levels.length}</span>
                  <Progress
                    value={section.progressPercent}
                    className="h-1.5 bg-vault-card"
                  />
                </div>
              </div>

              {/* Level Grid */}
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2.5">
                {section.levels.map((puzzle, cardIdx) => {
                  const isCompleted = isLevelCompleted(puzzle.level);
                  const isUnlocked = isLevelUnlocked(puzzle.level);
                  const isClickable = isUnlocked;
                  const isCurrent = isUnlocked && !isCompleted;

                  return (
                    <motion.button
                      key={puzzle.level}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.3 + sectionIdx * 0.1 + cardIdx * 0.03,
                        type: 'spring',
                        stiffness: 200,
                      }}
                      disabled={!isClickable}
                      onClick={() => isClickable && handleLevelClick(puzzle.level)}
                      className={`
                        relative glass-card rounded-lg p-3 flex flex-col items-center justify-center gap-1.5
                        aspect-square transition-all duration-200 cursor-pointer
                        ${isClickable ? 'glass-card-hover' : ''}
                        ${isCompleted
                          ? 'border border-neon-green/40 shadow-[0_0_15px_rgba(57,255,20,0.2)]'
                          : isCurrent
                            ? 'border border-neon-purple/60 shadow-[0_0_18px_rgba(176,38,255,0.3)] animate-pulse'
                            : 'border border-gray-800/50 opacity-40'
                        }
                      `}
                    >
                      {/* Type Icon */}
                      <div
                        className={`absolute top-1.5 right-1.5 ${
                          isCompleted ? 'text-neon-green/70' : isCurrent ? 'text-neon-purple/60' : 'text-gray-600'
                        }`}
                      >
                        {PUZZLE_TYPE_ICONS[puzzle.type] || <Star className="h-3 w-3" />}
                      </div>

                      {/* Level Number */}
                      <span
                        className={`
                          text-lg font-bold tabular-nums
                          ${isCompleted ? 'text-neon-green' : isCurrent ? 'text-neon-purple' : 'text-gray-600'}
                        `}
                      >
                        {puzzle.level}
                      </span>

                      {/* Status Icon */}
                      {isCompleted ? (
                        <Check className="h-4 w-4 text-neon-green" />
                      ) : isUnlocked ? (
                        <div className={`h-4 w-4 rounded-full border-2 ${getLevelBadgeClass(section.difficulty)}`} />
                      ) : (
                        <Lock className="h-3.5 w-3.5 text-gray-600" />
                      )}

                      {/* Completed Glow Dot */}
                      {isCompleted && (
                        <motion.div
                          layoutId={`glow-${puzzle.level}`}
                          className="absolute -bottom-0.5 w-2/3 h-0.5 rounded-full"
                          style={{ backgroundColor: '#39ff14', boxShadow: '0 0 8px #39ff14' }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* Bottom Spacer */}
        <div className="h-8" />
      </div>
    </div>
  );
}
