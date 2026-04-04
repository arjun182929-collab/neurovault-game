'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Trophy,
  Flame,
  Brain,
  Target,
  Zap,
  Eye,
  Star,
  Award,
  Edit3,
  Check,
  X,
  Lock,
  Heart,
  Shield,
  Crown,
  FileText,
} from 'lucide-react';
import { useGameStore } from '@/lib/game-store';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
};

const themeOptions = [
  { id: 'cyber-purple', label: 'Cyber Purple', colors: ['bg-purple-600', 'bg-purple-400', 'border-neon-purple/60'] },
  { id: 'neon-blue', label: 'Neon Blue', colors: ['bg-blue-600', 'bg-blue-400', 'border-neon-blue/60'] },
  { id: 'dark-rose', label: 'Dark Rose', colors: ['bg-rose-600', 'bg-rose-400', 'border-rose-500/60'] },
  { id: 'matrix-green', label: 'Matrix Green', colors: ['bg-green-600', 'bg-green-400', 'border-green-500/60'] },
];

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: typeof Trophy;
  isUnlocked: boolean;
  glowClass: string;
}

export function ProfileScreen() {
  const {
    playerName,
    setPlayerName,
    totalScore,
    coins,
    hints,
    lives,
    maxLives,
    streak,
    maxStreak,
    completedLevels,
    currentTheme,
    setTheme,
    setScreen,
  } = useGameStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(playerName);
  const [showAdminHint, setShowAdminHint] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Long-press avatar to open admin panel
  const handleAvatarDown = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      setShowAdminHint(true);
      setScreen('admin');
    }, 2000);
  }, [setScreen]);

  const handleAvatarUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  // Show admin hint briefly
  useEffect(() => {
    if (showAdminHint) {
      const t = setTimeout(() => setShowAdminHint(false), 3000);
      return () => clearTimeout(t);
    }
  }, [showAdminHint]);

  const levelsCompleted = completedLevels.size;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getAvatarRingClass = () => {
    if (maxStreak >= 30) return 'ring-2 ring-offset-2 ring-offset-vault-bg animate-[spin_3s_linear_infinite]';
    if (maxStreak > 7) return 'ring-2 ring-offset-2 ring-offset-vault-bg ring-purple-500';
    return '';
  };

  const handleSaveName = () => {
    const trimmed = editNameValue.trim();
    if (trimmed.length > 0) {
      setPlayerName(trimmed);
    }
    setIsEditingName(false);
  };

  const handleCancelName = () => {
    setEditNameValue(playerName);
    setIsEditingName(false);
  };

  const handleStartEdit = () => {
    setEditNameValue(playerName);
    setIsEditingName(true);
  };

  const achievements: Achievement[] = [
    {
      id: 'first-blood',
      name: 'First Blood',
      description: 'Completed your first level',
      icon: Zap,
      isUnlocked: levelsCompleted >= 1,
      glowClass: 'shadow-[0_0_12px_rgba(168,85,247,0.5)]',
    },
    {
      id: 'logic-master',
      name: 'Logic Master',
      description: 'Completed 5 logic puzzles',
      icon: Brain,
      isUnlocked: levelsCompleted >= 5,
      glowClass: 'shadow-[0_0_12px_rgba(59,130,246,0.5)]',
    },
    {
      id: 'streak-fire',
      name: 'Streak Fire',
      description: '3+ day streak',
      icon: Flame,
      isUnlocked: maxStreak >= 3,
      glowClass: 'shadow-[0_0_12px_rgba(249,115,22,0.5)]',
    },
    {
      id: 'unbreakable',
      name: 'Unbreakable',
      description: '7+ day streak',
      icon: Shield,
      isUnlocked: maxStreak >= 7,
      glowClass: 'shadow-[0_0_12px_rgba(236,72,153,0.5)]',
    },
    {
      id: 'vault-explorer',
      name: 'Vault Explorer',
      description: 'Completed 25+ levels',
      icon: Eye,
      isUnlocked: levelsCompleted >= 25,
      glowClass: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]',
    },
    {
      id: 'neurogod',
      name: 'NeuroGod',
      description: 'Completed all 50 levels',
      icon: Crown,
      isUnlocked: levelsCompleted >= 50,
      glowClass: 'shadow-[0_0_16px_rgba(250,204,21,0.6)]',
    },
  ];

  const stats = [
    { icon: Trophy, label: 'Total Score', value: totalScore.toLocaleString(), color: 'text-neon-yellow' },
    { icon: Target, label: 'Levels Done', value: `${levelsCompleted}/50`, color: 'text-neon-green' },
    { icon: Flame, label: 'Max Streak', value: `${maxStreak} days`, color: 'text-neon-orange' },
    { icon: Star, label: 'Coins', value: coins.toLocaleString(), color: 'text-neon-yellow' },
    { icon: Brain, label: 'Hints Left', value: `${hints}`, color: 'text-neon-blue' },
    { icon: Heart, label: 'Lives', value: `${lives}/${maxLives}`, color: 'text-neon-pink' },
  ];

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

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
            className="p-2 rounded-lg border border-vault-border bg-vault-card text-gray-400 hover:text-white hover:border-neon-purple/50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h2 className="text-2xl sm:text-3xl font-black tracking-[0.15em] neon-text-purple">
            PROFILE
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-5"
        >
          {/* Avatar Section */}
          <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 text-center">
            <div className="flex flex-col items-center gap-4">
              {/* Avatar Circle - Long press for admin */}
              <div className="relative">
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  onTouchStart={handleAvatarDown}
                  onTouchEnd={handleAvatarUp}
                  onMouseDown={handleAvatarDown}
                  onMouseUp={handleAvatarUp}
                  onMouseLeave={handleAvatarUp}
                  className={`w-24 h-24 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-white text-2xl font-black cursor-pointer select-none ${getAvatarRingClass()}`}
                  style={
                    maxStreak >= 30
                      ? {
                          background:
                            'conic-gradient(from 0deg, #a855f7, #3b82f6, #10b981, #f59e0b, #ef4444, #a855f7)',
                        }
                      : undefined
                  }
                >
                  <span className="drop-shadow-lg">{getInitials(playerName)}</span>
                </motion.div>
                <div className="absolute -inset-3 bg-neon-purple/10 rounded-full blur-xl -z-10" />
              </div>

              {/* Editable Name */}
              <div className="flex items-center gap-2">
                <AnimatePresence mode="wait">
                  {isEditingName ? (
                    <motion.div
                      key="editing"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-2"
                    >
                      <input
                        autoFocus
                        maxLength={20}
                        value={editNameValue}
                        onChange={(e) => setEditNameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveName();
                          if (e.key === 'Escape') handleCancelName();
                        }}
                        className="bg-vault-card border border-neon-purple/50 rounded-lg px-3 py-1.5 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-neon-purple/50 w-40 text-center"
                      />
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSaveName}
                        className="p-1.5 rounded-md bg-neon-green/20 text-neon-green hover:bg-neon-green/30 transition-colors cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleCancelName}
                        className="p-1.5 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="display"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-lg font-bold text-white">{playerName || 'Anonymous'}</span>
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleStartEdit}
                        className="p-1.5 rounded-md text-gray-500 hover:text-neon-purple hover:bg-neon-purple/10 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Level Progress Bar */}
              <div className="w-full max-w-xs">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-gray-500 font-medium">Vault Progress</span>
                  <span className="text-xs font-mono text-neon-purple">{levelsCompleted}/50</span>
                </div>
                <Progress
                  value={(levelsCompleted / 50) * 100}
                  className="h-2 bg-vault-card [&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-neon-purple [&>[data-slot=progress-indicator]]:to-neon-blue"
                />
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card rounded-xl p-4 flex flex-col items-center gap-2 hover:glass-card-hover transition-all duration-300"
                >
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-lg font-bold text-white font-mono">{stat.value}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Achievements Section */}
          <motion.div variants={itemVariants} className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-neon-yellow" />
                <h3 className="text-sm font-bold text-white tracking-wide">ACHIEVEMENTS</h3>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] font-mono text-neon-purple border-neon-purple/40"
              >
                {unlockedCount}/{achievements.length}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className={`
                    relative flex flex-col items-center gap-2 rounded-xl p-3 border transition-all duration-300
                    ${
                      achievement.isUnlocked
                        ? `bg-neon-purple/5 border-neon-purple/30 ${achievement.glowClass}`
                        : 'bg-vault-card/50 border-vault-border opacity-50'
                    }
                  `}
                >
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-lg
                      ${
                        achievement.isUnlocked
                          ? 'bg-neon-purple/15'
                          : 'bg-vault-card'
                      }
                    `}
                  >
                    {achievement.isUnlocked ? (
                      <achievement.icon className="w-5 h-5 text-neon-purple" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-[11px] font-bold ${
                        achievement.isUnlocked ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      {achievement.name}
                    </p>
                    <p className="text-[9px] text-gray-600 mt-0.5">{achievement.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Theme Selection */}
          <motion.div variants={itemVariants} className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-neon-blue" />
              <h3 className="text-sm font-bold text-white tracking-wide">THEME</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {themeOptions.map((theme) => {
                const isSelected = currentTheme === theme.id;
                return (
                  <motion.button
                    key={theme.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTheme(theme.id)}
                    className={`
                      flex flex-col items-center gap-2 rounded-xl p-3 border transition-all duration-300 cursor-pointer
                      ${
                        isSelected
                          ? `${theme.colors[2]} bg-vault-surface shadow-[0_0_16px_rgba(168,85,247,0.2)]`
                          : 'border-vault-border bg-vault-card/50 hover:bg-vault-card'
                      }
                    `}
                  >
                    <div className="flex gap-1">
                      <div className={`w-4 h-4 rounded-full ${theme.colors[0]}`} />
                      <div className={`w-4 h-4 rounded-full ${theme.colors[1]}`} />
                    </div>
                    <span
                      className={`text-[10px] font-medium ${
                        isSelected ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      {theme.label}
                    </span>
                    {isSelected && (
                      <motion.div
                        layoutId="theme-indicator"
                        className="w-1.5 h-1.5 rounded-full bg-neon-green"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Privacy Policy Link */}
          <motion.button
            variants={itemVariants}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('privacy')}
            className="w-full glass-card rounded-xl p-3 border border-transparent hover:border-neon-purple/20 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-bold text-gray-500 tracking-wider uppercase">Privacy Policy</span>
            </div>
          </motion.button>

          {/* Hidden Admin Access */}
          <motion.button
            variants={itemVariants}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('admin')}
            className="w-full glass-card rounded-xl p-3 border border-transparent hover:border-neon-purple/20 transition-all cursor-pointer text-center"
          >
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-gray-700" />
              <span className="text-[10px] font-bold text-gray-700 tracking-wider uppercase">v1.0.0</span>
              <span className="text-[10px] text-gray-700">·</span>
              <span className="text-[10px] font-bold text-neon-purple/50 tracking-wider">by Arjun Kumar Das</span>
            </div>
          </motion.button>

          {/* Bottom Spacer */}
          <div className="h-4" />
        </motion.div>
      </div>
    </div>
  );
}
