'use client';

import { useGameStore } from '@/lib/game-store';
import { HomeScreen } from '@/components/neurovault/home-screen';
import { LevelSelect } from '@/components/neurovault/level-select';
import { GameplayScreen } from '@/components/neurovault/gameplay-screen';
import { ResultScreen } from '@/components/neurovault/result-screen';
import { LeaderboardScreen } from '@/components/neurovault/leaderboard-screen';
import { ProfileScreen } from '@/components/neurovault/profile-screen';
import { StoreScreen } from '@/components/neurovault/store-screen';
import { DailyChallengeScreen } from '@/components/neurovault/daily-challenge-screen';
import { SubscriptionScreen } from '@/components/neurovault/subscription-screen';
import { PremiumGate } from '@/components/neurovault/premium-gate';
import { AdminScreen } from '@/components/neurovault/admin-screen';
import { PrivacyScreen } from '@/components/neurovault/privacy-screen';
import { useEffect, useRef } from 'react';

export default function NeuroVaultApp() {
  const currentScreen = useGameStore((s) => s.currentScreen);
  const loadDone = useRef(false);

  useEffect(() => {
    if (loadDone.current) return;
    loadDone.current = true;

    // Load saved state from localStorage (once)
    try {
      const saved = localStorage.getItem('neurovault-state');
      if (saved) {
        const state = JSON.parse(saved);
        const store = useGameStore.getState();
        if (state.completedLevels) {
          store.completedLevels = new Set(state.completedLevels);
        }
        // Set absolute values, not increment — prevents double-counting on refresh
        if (state.coins != null) store.coins = state.coins;
        if (state.totalScore != null) store.totalScore = state.totalScore;
        if (state.playerName) store.playerName = state.playerName;
        if (state.streak != null) store.streak = state.streak;
        if (state.maxStreak != null) store.maxStreak = state.maxStreak;
        if (state.hints != null) store.hints = state.hints;
        if (state.lives != null) store.lives = state.lives;
        if (state.maxLives != null) store.maxLives = state.maxLives;
        if (state.dailyCompleted) store.dailyCompleted = state.dailyCompleted;
        if (state.lastDailyDate) store.lastDailyDate = state.lastDailyDate;
        if (state.currentTheme) store.currentTheme = state.currentTheme;
        if (state.language) store.language = state.language;
        if (state.subscription) store.subscription = state.subscription;
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    // Check subscription expiry on mount
    useGameStore.getState().checkSubscriptionExpiry();
  }, []);

  // Safety fallback: mark motion as safe after hydration, or force-visible after 4s
  useEffect(() => {
    // Mark as motion-safe immediately (JS is executing = framer-motion can work)
    document.documentElement.setAttribute('data-motion-safe', 'true');
  }, []);

  useEffect(() => {
    // Auto-save state periodically
    const interval = setInterval(() => {
      const state = useGameStore.getState();
      try {
        localStorage.setItem('neurovault-state', JSON.stringify({
          completedLevels: Array.from(state.completedLevels),
          coins: state.coins,
          totalScore: state.totalScore,
          playerName: state.playerName,
          streak: state.streak,
          maxStreak: state.maxStreak,
          hints: state.hints,
          lives: state.lives,
          maxLives: state.maxLives,
          dailyCompleted: state.dailyCompleted,
          lastDailyDate: state.lastDailyDate,
          currentTheme: state.currentTheme,
          subscription: state.subscription,
          language: state.language,
        }));
      } catch {
        // ignore
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col animated-gradient grid-bg relative">
      {/* Ambient background particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-neon-purple/5 rounded-full blur-3xl particle" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[60%] right-[10%] w-80 h-80 bg-neon-blue/5 rounded-full blur-3xl particle" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-[20%] left-[50%] w-48 h-48 bg-neon-pink/5 rounded-full blur-3xl particle" style={{ animationDuration: '10s' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-1">
          {currentScreen === 'home' && <HomeScreen />}
          {currentScreen === 'levels' && <LevelSelect />}
          {currentScreen === 'gameplay' && <GameplayScreen />}
          {currentScreen === 'result' && <ResultScreen />}
          {currentScreen === 'leaderboard' && <LeaderboardScreen />}
          {currentScreen === 'profile' && <ProfileScreen />}
          {currentScreen === 'store' && <StoreScreen />}
          {currentScreen === 'daily' && <DailyChallengeScreen />}
          {currentScreen === 'subscription' && <SubscriptionScreen />}
          {currentScreen === 'admin' && (
            <AdminScreen
              onBack={() => useGameStore.getState().setScreen('home')}
              adminPassword={process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'neurovault2024'}
            />
          )}
          {currentScreen === 'privacy' && (
            <PrivacyScreen
              onBack={() => useGameStore.getState().setScreen('profile')}
            />
          )}
        </div>
      </div>
      <script>
  atOptions = {
    'key' : 'c074d08b5aad838eaf5e659a0adf0c7b',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/c074d08b5aad838eaf5e659a0adf0c7b/invoke.js"></script>


      {/* Premium Gate Modal - global overlay */}
      <PremiumGate />
    </div>
  );
}
