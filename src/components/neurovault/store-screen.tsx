'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Coins,
  Lightbulb,
  Heart,
  Crown,
  Sparkles,
  Gem,
  Zap,
  Lock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useGameStore, SUBSCRIPTION_PLANS } from '@/lib/game-store';

interface StoreItem {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: React.ReactNode;
  badge?: string;
  premiumOnly?: boolean;
  action: () => boolean;
}

export function StoreScreen() {
  const {
    coins,
    addCoins,
    spendCoins,
    hints,
    addHints,
    lives,
    maxLives,
    regenerateLives,
    setScreen,
    subscription,
    triggerPremiumGate,
  } = useGameStore();

  const isSubscribed = subscription.plan !== 'free' && subscription.status === 'active';
  const isPremium = subscription.plan === 'premium' && subscription.status === 'active';
  const planConfig = SUBSCRIPTION_PLANS[subscription.plan];

  const [feedback, setFeedback] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 2000);
  };

  const storeItems: StoreItem[] = [
    {
      id: 'hints-3',
      title: 'Hint Pack (3)',
      description: 'Get 3 extra hints for tough puzzles',
      price: 50,
      icon: <Lightbulb className="h-6 w-6 text-yellow-400" />,
      action: () => {
        if (spendCoins(50)) {
          addHints(3);
          showFeedback('+3 Hints acquired!', 'success');
          return true;
        }
        showFeedback('Not enough coins!', 'error');
        return false;
      },
    },
    {
      id: 'hints-10',
      title: 'Hint Pack (10)',
      description: 'Best value — 10 hints for avid players',
      price: 150,
      icon: <Lightbulb className="h-6 w-6 text-yellow-400" />,
      badge: 'Best Value',
      action: () => {
        if (spendCoins(150)) {
          addHints(10);
          showFeedback('+10 Hints acquired!', 'success');
          return true;
        }
        showFeedback('Not enough coins!', 'error');
        return false;
      },
    },
    {
      id: 'full-lives',
      title: 'Full Lives',
      description: `Refill all ${maxLives} lives instantly`,
      price: 30,
      icon: <Heart className="h-6 w-6 text-red-400" />,
      action: () => {
        if (spendCoins(30)) {
          regenerateLives();
          showFeedback('All lives restored!', 'success');
          return true;
        }
        showFeedback('Not enough coins!', 'error');
        return false;
      },
    },
    {
      id: 'coin-doubler',
      title: 'Coin Doubler',
      description: 'Double coins earned in the next level',
      price: 100,
      icon: <Zap className="h-6 w-6 text-amber-400" />,
      premiumOnly: true,
      action: () => {
        if (spendCoins(100)) {
          showFeedback('Coin Doubler activated!', 'success');
          return true;
        }
        showFeedback('Not enough coins!', 'error');
        return false;
      },
    },
    {
      id: 'extra-life',
      title: 'Extra Life Slot',
      description: 'Permanently increase max lives by 1',
      price: 200,
      icon: <Gem className="h-6 w-6 text-cyan-400" />,
      action: () => {
        if (spendCoins(200)) {
          showFeedback('Extra life slot unlocked!', 'success');
          return true;
        }
        showFeedback('Not enough coins!', 'error');
        return false;
      },
    },
    {
      id: 'mystery-box',
      title: 'Mystery Box',
      description: 'Random reward: 1–5 hints inside!',
      price: isPremium ? 0 : 75,
      icon: <Gem className="h-6 w-6 text-purple-400" />,
      badge: isPremium ? 'FREE' : undefined,
      action: () => {
        const cost = isPremium ? 0 : 75;
        if (cost === 0 || spendCoins(cost)) {
          const randomHints = Math.floor(Math.random() * 5) + 1;
          addHints(randomHints);
          showFeedback(`Mystery Box: +${randomHints} Hints!`, 'success');
          return true;
        }
        showFeedback('Not enough coins!', 'error');
        return false;
      },
    },
  ];

  const handleFreeCoins = () => {
    if (isSubscribed) {
      // Subscribers don't see ads, give them coins anyway
      addCoins(25);
      showFeedback('Daily bonus: +25 coins!', 'success');
      return;
    }
    addCoins(25);
    showFeedback('Ad reward: +25 coins!', 'success');
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-5">
      {/* Feedback Toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg backdrop-blur-md ${
              feedback.type === 'success'
                ? 'bg-green-500/80 text-white'
                : 'bg-red-500/80 text-white'
            }`}
          >
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <button
          onClick={() => setScreen('home')}
          className="p-2 rounded-xl glass-card glass-card-hover transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold tracking-widest text-white uppercase">
            Store
          </h1>
          {isSubscribed && (
            <Badge
              className="text-[10px] px-1.5 py-0 border-0 font-bold"
              style={{
                backgroundColor: `${planConfig.color}20`,
                color: planConfig.color,
              }}
            >
              {planConfig.label}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5 bg-yellow-500/15 px-3 py-1.5 rounded-full border border-yellow-500/30">
          <Coins className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-bold text-yellow-300">{coins}</span>
        </div>
      </motion.div>

      {/* Subscription Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        onClick={() => setScreen('subscription')}
        className="relative overflow-hidden rounded-2xl p-5 glass-card cursor-pointer transition-transform hover:scale-[1.01]"
        style={{
          border: '2px solid transparent',
          backgroundImage: isSubscribed
            ? `linear-gradient(135deg, ${planConfig.color}15, ${planConfig.color}08), linear-gradient(135deg, ${planConfig.color}60, ${planConfig.color}30)`
            : 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15)), linear-gradient(135deg, #8b5cf6, #3b82f6)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        <Sparkles className="absolute top-3 right-3 h-5 w-5 text-purple-300/50 animate-pulse" />
        <Sparkles className="absolute bottom-3 left-4 h-4 w-4 text-blue-300/40 animate-pulse" />

        {isSubscribed ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5" style={{ color: planConfig.color }} />
              <span
                className="text-sm font-bold tracking-wider uppercase"
                style={{ color: planConfig.color }}
              >
                Neurovault {planConfig.label}
              </span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">
                Active
              </Badge>
            </div>
            <p className="text-white/70 text-sm mb-2">
              Your {planConfig.label} plan is active. Enjoy all your exclusive perks!
            </p>
            <div className="flex items-center gap-1 text-xs" style={{ color: planConfig.color }}>
              <span>Manage Subscription →</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-bold tracking-wider text-purple-200 uppercase">
                Neurovault Premium
              </span>
            </div>
            <p className="text-2xl font-extrabold text-white mb-3">
              ₹99<span className="text-sm font-normal text-purple-300">/month</span>
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-purple-100/80 mb-4">
              <span>✓ Ad-free experience</span>
              <span>✓ Exclusive levels</span>
              <span>✓ Premium skins</span>
              <span>✓ Unlimited hints</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setScreen('subscription');
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-bold tracking-wide hover:opacity-90 transition-opacity"
            >
              Subscribe Now
            </button>
          </>
        )}
      </motion.div>

      {/* Stats Bar */}
      <div className="flex items-center justify-around text-center text-xs text-white/70">
        <div>
          <div className="flex items-center justify-center gap-1">
            <Lightbulb className="h-3.5 w-3.5 text-yellow-400" />
            <span className="font-semibold text-yellow-300">{hints}</span>
            {isPremium && <span className="text-[9px] text-neon-purple">∞</span>}
          </div>
          <span>Hints</span>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1">
            <Heart className="h-3.5 w-3.5 text-red-400" />
            <span className="font-semibold text-red-300">
              {lives}/{maxLives}
            </span>
          </div>
          <span>Lives</span>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1">
            <Coins className="h-3.5 w-3.5 text-yellow-400" />
            <span className="font-semibold text-yellow-300">{coins}</span>
          </div>
          <span>Coins</span>
        </div>
      </div>

      {/* Subscriber Perks Banner */}
      {isSubscribed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="rounded-2xl p-3 text-center text-xs"
          style={{
            backgroundColor: `${planConfig.color}10`,
            border: `1px solid ${planConfig.color}25`,
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="h-3.5 w-3.5" style={{ color: planConfig.color }} />
            <span className="font-bold" style={{ color: planConfig.color }}>
              {planConfig.label} Perks Active
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-400">
            <span>{subscription.plan === 'premium' ? '3x' : '2x'} coins</span>
            <span>•</span>
            <span>+{subscription.plan === 'premium' ? '15' : '10'}s timer</span>
            <span>•</span>
            <span>Ad-free</span>
          </div>
        </motion.div>
      )}

      {/* Store Items Grid */}
      <div className="grid grid-cols-2 gap-3">
        {storeItems.map((item, index) => {
          const canAfford = coins >= item.price;
          const isLocked = item.premiumOnly && !isSubscribed;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              className="glass-card glass-card-hover rounded-2xl p-4 flex flex-col gap-2 relative"
            >
              {item.badge && (
                <Badge
                  className="absolute -top-2 right-2 text-[10px] px-1.5 py-0 border-0"
                  style={{
                    backgroundColor: item.badge === 'FREE' ? 'rgba(57,255,20,0.2)' : undefined,
                    color: item.badge === 'FREE' ? '#39ff14' : undefined,
                  }}
                >
                  {item.badge}
                </Badge>
              )}

              {/* Premium Lock Overlay */}
              {isLocked && (
                <div className="absolute inset-0 rounded-2xl bg-black/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-1">
                  <Lock className="h-5 w-5 text-neon-purple" />
                  <span className="text-[10px] text-neon-purple font-bold">PRO+</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white/5">{item.icon}</div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-white/50 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (isLocked) {
                    triggerPremiumGate('Exclusive store items');
                    return;
                  }
                  item.action();
                }}
                disabled={!canAfford && !isLocked}
                className={`mt-auto w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isLocked
                    ? 'bg-neon-purple/20 text-neon-purple'
                    : canAfford
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90'
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                {isLocked ? (
                  <span className="flex items-center justify-center gap-1">
                    <Crown className="h-3 w-3" />
                    Unlock
                  </span>
                ) : item.price === 0 ? (
                  <span className="flex items-center justify-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Free
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    <Coins className="h-3 w-3" />
                    {item.price}
                  </span>
                )}
              </button>
              {!canAfford && !isLocked && item.price > 0 && (
                <p className="text-[9px] text-red-400/70 text-center -mt-1">
                  Not enough coins
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Free Coins Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-4 text-center space-y-2"
      >
        <p className="text-xs text-white/50 uppercase tracking-wider font-medium">
          {isSubscribed ? 'Daily Bonus' : 'Free Coins'}
        </p>
        <button
          onClick={handleFreeCoins}
          className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            isSubscribed
              ? 'border border-neon-purple/40 text-neon-purple hover:bg-neon-purple/10'
              : 'border border-dashed border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/10'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          {isSubscribed ? 'Claim Daily +25 Coins' : 'Watch Ad for 25 Coins'}
        </button>
        {isSubscribed && (
          <p className="text-[10px] text-gray-600">No ads needed — it&apos;s your subscriber perk!</p>
        )}
      </motion.div>
    </div>
  );
}
