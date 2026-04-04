'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, Sparkles, Zap, Check, ArrowRight } from 'lucide-react';
import { useGameStore, SUBSCRIPTION_PLANS } from '@/lib/game-store';

export function PremiumGate() {
  const { showPremiumGate, setShowPremiumGate, premiumGateFeature, setScreen } = useGameStore();

  if (!showPremiumGate) return null;

  const premiumPlan = SUBSCRIPTION_PLANS.premium;

  const featureDescriptions: Record<string, string> = {
    'unlimited hints': 'Get unlimited hints to solve any puzzle without limits',
    'ad-free': 'Remove all ads and enjoy an uninterrupted experience',
    'exclusive themes': 'Unlock stunning exclusive themes for your profile',
    'coin doubler': 'Earn 3x coins on every puzzle completion',
    'timer bonus': 'Get +15 extra seconds on every puzzle timer',
    'premium badge': 'Show off your Premium crown on the leaderboard',
    'mystery box': 'Claim a free Mystery Box every single day',
  };

  const description = featureDescriptions[premiumGateFeature.toLowerCase()] || premiumGateFeature;

  return (
    <AnimatePresence>
      {showPremiumGate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setShowPremiumGate(false)}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative glass-card rounded-2xl overflow-hidden max-w-sm w-full"
            style={{
              boxShadow: `0 0 60px ${premiumPlan.glow}, 0 0 120px rgba(176,38,255,0.15)`,
              borderColor: `${premiumPlan.color}30`,
            }}
          >
            {/* Animated gradient header */}
            <div
              className="relative p-6 pb-4 text-center overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${premiumPlan.color}15, transparent, ${premiumPlan.color}08)`,
              }}
            >
              {/* Floating sparkles */}
              <Sparkles className="absolute top-2 right-4 h-5 w-5 text-neon-purple/30 animate-pulse" />
              <Sparkles className="absolute top-8 left-6 h-3 w-3 text-neon-blue/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <Sparkles className="absolute bottom-2 right-8 h-4 w-4 text-neon-pink/20 animate-pulse" style={{ animationDelay: '1s' }} />

              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3"
                style={{
                  background: `linear-gradient(135deg, ${premiumPlan.color}25, ${premiumPlan.color}10)`,
                  color: premiumPlan.color,
                }}
              >
                <Crown className="h-8 w-8" />
              </motion.div>

              <h3 className="text-xl font-black tracking-wider text-white uppercase">
                Premium Feature
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Upgrade to unlock
              </p>
            </div>

            {/* Feature description */}
            <div className="px-6 py-4">
              <div
                className="glass-card rounded-xl p-4 text-center"
                style={{ borderColor: `${premiumPlan.color}20` }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="h-4 w-4" style={{ color: premiumPlan.color }} />
                  <span className="text-sm font-bold" style={{ color: premiumPlan.color }}>
                    {premiumGateFeature}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{description}</p>
              </div>

              {/* Quick perks list */}
              <div className="mt-4 space-y-2">
                {[
                  'Unlimited hints',
                  'Ad-free experience',
                  '3x coin earnings',
                  '+15s timer bonus',
                ].map((perk) => (
                  <div key={perk} className="flex items-center gap-2 text-xs">
                    <Check className="h-3 w-3 text-neon-purple shrink-0" />
                    <span className="text-gray-400">{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="p-6 pt-2 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowPremiumGate(false);
                  setScreen('subscription');
                }}
                className="w-full py-3 rounded-xl text-sm font-bold tracking-wide text-white flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${premiumPlan.color}, ${premiumPlan.color}cc)`,
                  boxShadow: `0 0 20px ${premiumPlan.glow}`,
                }}
              >
                <Crown className="h-4 w-4" />
                Upgrade to Premium — ₹99/mo
                <ArrowRight className="h-4 w-4" />
              </motion.button>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowPremiumGate(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-medium bg-white/5 text-gray-500 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    setShowPremiumGate(false);
                    setScreen('subscription');
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-medium bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20 transition-colors cursor-pointer"
                >
                  View Pro — ₹49/mo
                </button>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowPremiumGate(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
