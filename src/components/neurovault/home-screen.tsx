'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  ShoppingBag,
  User,
  Zap,
  Flame,
  Heart,
  Coins,
  Brain,
  ChevronRight,
  Sparkles,
  Crown,
  Share2,
  X,
  Gift,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGameStore, SUBSCRIPTION_PLANS } from '@/lib/game-store';
import { LanguageToggle } from '@/components/neurovault/language-toggle';

const menuItems = [
  {
    label: 'PLAY',
    description: 'Choose your challenge',
    screen: 'levels' as const,
    icon: Zap,
    primary: true,
    glowClass: 'neon-glow-purple',
    borderClass: 'border-neon-purple/50',
    iconColor: 'text-neon-purple',
    bgGradient: 'from-neon-purple/10 via-transparent to-neon-blue/10',
  },
  {
    label: 'DAILY CHALLENGE',
    description: 'A new puzzle every day',
    screen: 'daily' as const,
    icon: Sparkles,
    primary: false,
    glowClass: 'fire-glow',
    borderClass: 'border-neon-orange/50',
    iconColor: 'text-neon-orange',
    bgGradient: 'from-neon-orange/10 via-transparent to-neon-yellow/10',
    hideCondition: 'dailyCompleted' as const,
  },
  {
    label: 'LEADERBOARD',
    description: 'Rise through the ranks',
    screen: 'leaderboard' as const,
    icon: Trophy,
    primary: false,
    glowClass: '',
    borderClass: 'border-neon-yellow/40',
    iconColor: 'text-neon-yellow',
    bgGradient: 'from-neon-yellow/5 via-transparent to-transparent',
  },
  {
    label: 'STORE',
    description: 'Unlock upgrades & hints',
    screen: 'store' as const,
    icon: ShoppingBag,
    primary: false,
    glowClass: '',
    borderClass: 'border-neon-green/40',
    iconColor: 'text-neon-green',
    bgGradient: 'from-neon-green/5 via-transparent to-transparent',
  },
  {
    label: 'SHARE & EARN',
    description: 'Share with friends, earn coins',
    screen: 'share' as const,
    icon: Share2,
    primary: false,
    glowClass: '',
    borderClass: 'border-neon-pink/40',
    iconColor: 'text-neon-pink',
    bgGradient: 'from-neon-pink/5 via-transparent to-transparent',
  },
  {
    label: 'SUBSCRIPTION',
    description: 'Unlock premium features',
    screen: 'subscription' as const,
    icon: Crown,
    primary: false,
    glowClass: '',
    borderClass: 'border-neon-purple/40',
    iconColor: 'text-neon-purple',
    bgGradient: 'from-neon-purple/5 via-transparent to-transparent',
  },
  {
    label: 'PROFILE',
    description: 'View your stats',
    screen: 'profile' as const,
    icon: User,
    primary: false,
    glowClass: '',
    borderClass: 'border-neon-blue/40',
    iconColor: 'text-neon-blue',
    bgGradient: 'from-neon-blue/5 via-transparent to-transparent',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const statVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.4 },
  }),
};

export function HomeScreen() {
  const {
    setScreen,
    playerName,
    totalScore,
    coins,
    hints,
    lives,
    streak,
    maxStreak,
    completedLevels,
    dailyCompleted,
    subscription,
    language,
    addCoins,
  } = useGameStore();

  const [viralBannerDismissed, setViralBannerDismissed] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const isDailyAvailable = !dailyCompleted;
  const isSubscribed = subscription.plan !== 'free' && subscription.status === 'active';
  const planConfig = isSubscribed ? SUBSCRIPTION_PLANS[subscription.plan] : null;
  const isHi = language === 'hi';

  const menuLabelsHi: Record<string, { label: string; description: string }> = {
    levels: { label: 'KHELO', description: 'Apna challenge chuno' },
    daily: { label: 'Aaj KA PUZZLE', description: 'Roz naya puzzle milega' },
    leaderboard: { label: 'LEADERBOARD', description: 'Ranking mein upar jaao' },
    store: { label: 'STORE', description: 'Hints aur upgrades lo' },
    share: { label: 'SHARE KARO', description: 'Dosto ko bhejo, coins jeeto' },
    subscription: { label: 'SUBSCRIPTION', description: 'Premium features unlock karo' },
    profile: { label: 'PROFILE', description: 'Apna stats dekho' },
  };

  const stats = [
    { icon: Zap, label: isHi ? 'Score' : 'Score', value: totalScore.toLocaleString(), color: 'text-neon-purple' },
    { icon: Coins, label: isHi ? 'Coins' : 'Coins', value: coins.toLocaleString(), color: 'text-neon-yellow' },
    {
      icon: Flame,
      label: isHi ? 'Streak' : 'Streak',
      value: `${streak}${maxStreak > 0 ? `/${maxStreak}` : ''}`,
      color: streak > 0 ? 'text-neon-orange' : 'text-gray-500',
      extra: streak > 0 ? '🔥' : undefined,
    },
    { icon: Heart, label: isHi ? 'Lives' : 'Lives', value: `${lives}`, color: lives > 0 ? 'text-neon-pink' : 'text-gray-500' },
  ];

  const handleMenuClick = (screen: string) => {
    if (screen === 'share') {
      setShowShareModal(true);
      return;
    }
    setScreen(screen as 'levels' | 'daily' | 'leaderboard' | 'store' | 'subscription' | 'profile');
  };

  const handleNativeShare = async () => {
    const shareText = isHi
      ? '🎮 NeuroVault: Extreme Puzzle Lab - Dimaag ki challenge! Download karo aur coins jeeto! 🔥'
      : '🎮 NeuroVault: Extreme Puzzle Lab - The ultimate brain teaser! Download and earn coins! 🔥';

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'NeuroVault: Extreme Puzzle Lab',
          text: shareText,
          url: typeof window !== 'undefined' ? window.location.href : undefined,
        });
      } catch {
        // User cancelled share
      }
    } else {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(`${shareText}\n${typeof window !== 'undefined' ? window.location.href : ''}`);
          addCoins(10);
        } catch {
          // clipboard not available
        }
      }
    }
    setShowShareModal(false);
  };

  const dismissViralBanner = () => {
    setViralBannerDismissed(true);
  };

  return (
    <div className="min-h-screen bg-vault-bg flex flex-col items-center px-4 py-6 select-none">
      <div className="w-full max-w-lg flex flex-col gap-5 flex-1">
        {/* ── Viral Banner ── */}
        <AnimatePresence>
          {!viralBannerDismissed && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95, height: 0, marginBottom: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative overflow-hidden rounded-xl border border-neon-purple/50 p-3"
              style={{
                background: 'linear-gradient(135deg, rgba(176, 38, 255, 0.15), rgba(0, 212, 255, 0.1), rgba(255, 45, 149, 0.08))',
                boxShadow: '0 0 20px rgba(176, 38, 255, 0.2), 0 0 40px rgba(176, 38, 255, 0.05)',
                animation: 'neon-border-pulse 2s ease-in-out infinite',
              }}
            >
              {/* Animated sparkle particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                  animate={{ x: [0, 30, 0], y: [0, -15, 0], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-1 left-1/4 text-[8px]"
                >
                  ✨
                </motion.div>
                <motion.div
                  animate={{ x: [0, -20, 0], y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-1 right-1/4 text-[8px]"
                >
                  ✨
                </motion.div>
              </div>

              <div className="flex items-center justify-between gap-2 relative z-10">
                <div className="flex items-center gap-2 min-w-0">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-base flex-shrink-0"
                  >
                    🎮
                  </motion.span>
                  <p className="text-xs sm:text-sm font-bold text-white truncate">
                    {isHi
                      ? 'Bhai Hinglish mode ON hai! 🔥'
                      : '🎮 Now in HINGLISH! Switch language 🔥'}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={dismissViralBanner}
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-vault-card/80 border border-vault-border hover:border-neon-purple/50 transition-colors cursor-pointer"
                  aria-label="Dismiss banner"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logo & Tagline */}
        <motion.div
          variants={logoVariants}
          initial="hidden"
          animate="visible"
          className="text-center pt-4 pb-2"
        >
          <div className="relative inline-block">
            <Brain className="w-10 h-10 text-neon-purple mx-auto mb-2 neon-glow-purple" />
            <h1 className="text-4xl sm:text-5xl font-black tracking-[0.25em] neon-text-purple leading-tight">
              NEUROVAULT
            </h1>
            {isSubscribed && (
              <div className="absolute -top-2 -right-6">
                <Crown
                  className="h-5 w-5"
                  style={{ color: planConfig!.color }}
                />
              </div>
            )}
            <div className="absolute -inset-4 bg-neon-purple/5 rounded-3xl blur-2xl -z-10" />
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 tracking-wide font-medium uppercase">
            {isHi
              ? 'Zyada soch. Jaldi fail. Namumkin solve kar.'
              : 'Think harder. Fail faster. Solve the impossible.'}
          </p>
        </motion.div>

        {/* Player Stats Bar */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="glass-card rounded-2xl p-4 neon-border-pulse"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-bold text-gray-300 truncate">
                {playerName || 'Anonymous Player'}
              </span>
              {isSubscribed && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${planConfig!.color}20`,
                    color: planConfig!.color,
                  }}
                >
                  {planConfig!.label}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle compact />
              <span className="text-xs text-gray-600 font-mono">
                {completedLevels.size} cleared
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={statVariants}
                className="flex flex-col items-center gap-1"
              >
                <div className="relative">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  {stat.extra && (
                    <span className="absolute -top-1.5 -right-2 text-[10px]">{stat.extra}</span>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-bold text-gray-200 font-mono">
                  {stat.value}
                </span>
                <span className="text-[10px] text-gray-600 uppercase tracking-wider">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Menu Buttons */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-3"
        >
          {menuItems
            .filter((item) => !(item.hideCondition === 'dailyCompleted' && dailyCompleted))
            .map((item) => (
              <motion.button
                key={item.label}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleMenuClick(item.screen)}
                className={cn(
                  'group relative w-full text-left rounded-xl p-4 sm:p-5 border transition-all duration-300 cursor-pointer hover:bg-vault-surface border-vault-border',
                  item.bgGradient,
                  item.primary && item.glowClass,
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className={`
                        flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg
                        bg-vault-card border border-vault-border
                        group-hover:border-current/30 transition-colors duration-300
                      `}
                    >
                      <item.icon
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${item.iconColor} transition-transform duration-300 group-hover:scale-110`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`text-sm sm:text-base font-bold tracking-wide ${
                          item.primary ? 'text-neon-purple' : 'text-gray-200'
                        } group-hover:text-white transition-colors`}
                      >
                        {isHi && menuLabelsHi[item.screen]?.label
                          ? menuLabelsHi[item.screen].label
                          : item.label}
                        {item.primary && (
                          <span className="ml-2 inline-block w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                        )}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                        {isHi && menuLabelsHi[item.screen]?.description
                          ? menuLabelsHi[item.screen].description
                          : item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-300 
                    transition-all duration-300 group-hover:translate-x-1`}
                  />
                </div>

                {/* Daily available badge */}
                {item.screen === 'daily' && isDailyAvailable && (
                  <div className="absolute top-3 right-10">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-neon-orange bg-neon-orange/10 px-2 py-0.5 rounded-full border border-neon-orange/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-orange animate-pulse" />
                      NEW
                    </span>
                  </div>
                )}

                {/* Hints count on store */}
                {item.screen === 'store' && (
                  <div className="absolute top-3 right-10">
                    <span className="text-[10px] font-mono text-gray-500 bg-vault-card px-2 py-0.5 rounded-full border border-vault-border">
                      {hints} hints
                    </span>
                  </div>
                )}

                {/* Share & Earn viral badge */}
                {item.screen === 'share' && (
                  <div className="absolute top-3 right-10">
                    <motion.span
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex items-center gap-1 text-[10px] font-bold text-neon-pink bg-neon-pink/10 px-2 py-0.5 rounded-full border border-neon-pink/30"
                    >
                      🔥 VIRAL
                    </motion.span>
                  </div>
                )}

                {/* Subscription badge */}
                {item.screen === 'subscription' && (
                  <div className="absolute top-3 right-10">
                    {isSubscribed ? (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${planConfig!.color}20`,
                          color: planConfig!.color,
                          border: `1px solid ${planConfig!.color}40`,
                        }}
                      >
                        {planConfig!.label} Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-neon-purple bg-neon-purple/10 px-2 py-0.5 rounded-full border border-neon-purple/30">
                        <Crown className="h-2.5 w-2.5" />
                        UPGRADE
                      </span>
                    )}
                  </div>
                )}
              </motion.button>
            ))}
        </motion.div>

        {/* Bottom Motivational Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-auto pt-6 pb-4 text-center"
        >
          <p className="text-[11px] sm:text-xs text-gray-700 tracking-wider font-medium uppercase">
            {isHi ? (
              <>
                Sirf 1% pahunchta hai{' '}
                <span className="neon-text-purple font-bold">Impossible Vault</span> tak
              </>
            ) : (
              <>
                Only 1% reach the{' '}
                <span className="neon-text-purple font-bold">Impossible Vault</span>
              </>
            )}
          </p>
        </motion.div>
      </div>

      {/* ── Share & Earn Modal ── */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-6 glass-card border border-neon-purple/40 neon-glow-purple"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 15, 42, 0.95), rgba(26, 10, 46, 0.9))',
              }}
            >
              {/* Close button */}
              <div className="flex justify-end mb-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowShareModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-vault-card border border-vault-border hover:border-neon-purple/50 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </motion.button>
              </div>

              {/* Header */}
              <div className="text-center mb-5">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-4xl mb-3"
                >
                  🔥
                </motion.div>
                <h2 className="text-xl font-black tracking-wider text-white neon-text-purple mb-1">
                  {isHi ? 'SHARE KARO, COINS JEETO!' : 'SHARE & EARN'}
                </h2>
                <p className="text-sm text-gray-400">
                  {isHi
                    ? 'Dostoko bhejo aur 10 coins free pao!'
                    : 'Share with friends and earn 10 free coins!'}
                </p>
              </div>

              {/* Reward card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl p-4 mb-5 border border-neon-yellow/20"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 0, 0.05), rgba(255, 102, 0, 0.05))',
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Gift className="w-5 h-5 text-neon-yellow" />
                  <span className="text-sm font-bold text-neon-yellow">
                    {isHi ? 'Refer Reward' : 'Referral Reward'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-neon-yellow" />
                    <span className="text-lg font-black text-white font-mono">+10</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {isHi ? 'Har share ke liye' : 'Per share'}
                  </span>
                </div>
              </motion.div>

              {/* Share buttons */}
              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNativeShare}
                  className="w-full py-3 rounded-xl font-bold tracking-wider uppercase text-sm neon-button cursor-pointer"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    {isHi ? 'Abhi Share Karo' : 'Share Now'}
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowShareModal(false)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-gray-400 tracking-wider uppercase glass-card border border-vault-border hover:border-gray-600 transition-colors cursor-pointer"
                >
                  {isHi ? 'Baad Mein' : 'Maybe Later'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
