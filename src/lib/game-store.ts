import { create } from 'zustand';
import { PUZZLES, type Puzzle, type Difficulty } from '@/lib/puzzles';

export type AppLanguage = 'en' | 'hi';

export type GameScreen = 'home' | 'levels' | 'gameplay' | 'leaderboard' | 'profile' | 'store' | 'daily' | 'result' | 'subscription' | 'admin' | 'privacy';

export type SubscriptionPlan = 'free' | 'pro' | 'premium';

export interface SubscriptionState {
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string | null;
  expiryDate: string | null;
  autoRenew: boolean;
  paymentProvider: 'coins' | 'phonepe' | 'pending_phonepe';
}

export interface PaymentRecord {
  id: string;
  utr: string;
  amount: number;
  plan: string;
  status: string;
  createdAt: string;
  verifiedAt: string | null;
  rejectedReason: string | null;
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, {
  label: string;
  price: number;
  priceLabel: string;
  color: string;
  glow: string;
  features: string[];
  popular?: boolean;
}> = {
  free: {
    label: 'Free',
    price: 0,
    priceLabel: 'Free',
    color: '#9ca3af',
    glow: 'rgba(156,163,175,0.3)',
    features: [
      '50 puzzle levels',
      'Daily challenges',
      '3 free hints',
      'Standard leaderboard',
      'Basic themes',
      'Ads for coins',
    ],
  },
  pro: {
    label: 'Pro',
    price: 49,
    priceLabel: '₹49/mo',
    color: '#00d4ff',
    glow: 'rgba(0,212,255,0.4)',
    features: [
      'All 50 puzzle levels',
      'Daily challenges',
      '10 hints / level',
      'No ads ever',
      'Pro exclusive themes',
      '2x coin earnings',
      'Extended timer (+10s)',
      'Pro badge on leaderboard',
    ],
  },
  premium: {
    label: 'Premium',
    price: 99,
    priceLabel: '₹99/mo',
    color: '#b026ff',
    glow: 'rgba(176,38,255,0.5)',
    popular: true,
    features: [
      'All 50 puzzle levels',
      'Daily challenges',
      'Unlimited hints',
      'No ads ever',
      'All exclusive themes',
      '3x coin earnings',
      'Extended timer (+15s)',
      'Premium crown badge',
      'Priority leaderboard rank',
      'Exclusive puzzle skins',
      'Free mystery box daily',
      'Auto life regeneration',
    ],
  },
};

const planCoinCost: Record<SubscriptionPlan, number> = {
  free: 0,
  pro: 200,
  premium: 350,
};

interface GameState {
  // Navigation
  currentScreen: GameScreen;
  setScreen: (screen: GameScreen) => void;

  // Player
  playerName: string;
  setPlayerName: (name: string) => void;
  playerId: string;
  setPlayerId: (id: string) => void;
  coins: number;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  hints: number;
  useHint: () => boolean;
  addHints: (amount: number) => void;
  lives: number;
  maxLives: number;
  loseLife: () => boolean;
  regenerateLives: () => void;
  streak: number;
  maxStreak: number;
  incrementStreak: () => void;
  resetStreak: () => void;
  totalScore: number;
  addScore: (score: number) => void;

  // Game session
  currentLevel: number;
  setCurrentLevel: (level: number) => void;
  currentPuzzle: Puzzle | null;
  startPuzzle: (level: number) => void;
  selectedAnswer: string | null;
  setSelectedAnswer: (answer: string | null) => void;
  timeRemaining: number;
  setTimeRemaining: (time: number) => void;
  isTimerRunning: boolean;
  setIsTimerRunning: (running: boolean) => void;
  attempts: number;
  incrementAttempts: () => void;
  hintUsed: boolean;
  setHintUsed: (used: boolean) => void;
  score: number;
  setScore: (score: number) => void;
  gameResult: 'win' | 'lose' | null;
  setGameResult: (result: 'win' | 'lose' | null) => void;

  // Progress
  completedLevels: Set<number>;
  completeLevel: (level: number) => void;
  isLevelCompleted: (level: number) => boolean;
  isLevelUnlocked: (level: number) => boolean;
  getLevelScore: (level: number) => number;

  // Theme
  currentTheme: string;
  setTheme: (theme: string) => void;

  // Daily
  dailyCompleted: boolean;
  setDailyCompleted: (completed: boolean) => void;
  lastDailyDate: string | null;
  setLastDailyDate: (date: string) => void;

  // Subscription
  subscription: SubscriptionState;
  setSubscription: (sub: Partial<SubscriptionState>) => void;
  activateSubscription: (plan: SubscriptionPlan, coinCost: number) => boolean;
  cancelSubscription: () => void;
  checkSubscriptionExpiry: () => void;
  isPremium: () => boolean;
  isPro: () => boolean;
  isSubscribed: () => boolean;
  getSubscriptionMultiplier: () => number;
  getMaxHints: () => number;
  getTimerBonus: () => number;
  showPremiumGate: boolean;
  setShowPremiumGate: (show: boolean) => void;
  premiumGateFeature: string;
  setPremiumGateFeature: (feature: string) => void;
  triggerPremiumGate: (feature: string) => void;

  // PhonePe Payment
  paymentSubmitting: boolean;
  paymentChecking: boolean;
  pendingPayment: PaymentRecord | null;
  submitPaymentUTR: (utr: string, amount: number, plan: SubscriptionPlan) => Promise<{ success: boolean; message: string; data?: PaymentRecord }>;
  checkPaymentStatus: (utr: string) => Promise<{ success: boolean; data?: PaymentRecord; message: string }>;
  setPendingPayment: (payment: PaymentRecord | null) => void;

  // Language
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;

  // Actions
  resetGame: () => void;
  resetPuzzleState: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Navigation
  currentScreen: 'home',
  setScreen: (screen) => set({ currentScreen: screen }),

  // Player
  playerName: 'Player',
  setPlayerName: (name) => set({ playerName: name }),
  playerId: '',
  setPlayerId: (id) => set({ playerId: id }),
  coins: 50,
  addCoins: (amount) => set((s) => ({ coins: s.coins + amount })),
  spendCoins: (amount) => {
    const state = get();
    if (state.coins >= amount) {
      set({ coins: state.coins - amount });
      return true;
    }
    return false;
  },
  hints: 3,
  useHint: () => {
    const state = get();
    const maxHints = state.getMaxHints();
    if (maxHints === -1 || state.hints > 0) {
      set({ hints: state.hints - 1, hintUsed: true });
      return true;
    }
    return false;
  },
  addHints: (amount) => set((s) => ({ hints: s.hints + amount })),
  lives: 5,
  maxLives: 5,
  loseLife: () => {
    const state = get();
    if (state.lives > 0) {
      set({ lives: state.lives - 1 });
      return true;
    }
    return false;
  },
  regenerateLives: () => set({ lives: get().maxLives }),
  streak: 0,
  maxStreak: 0,
  incrementStreak: () => {
    const newStreak = get().streak + 1;
    set({ streak: newStreak, maxStreak: Math.max(newStreak, get().maxStreak) });
    const multiplier = get().getSubscriptionMultiplier();
    if (newStreak === 3) get().addCoins(Math.round(10 * multiplier));
    if (newStreak === 7) {
      get().addHints(1);
      get().addCoins(Math.round(25 * multiplier));
    }
    if (newStreak === 30) {
      get().addCoins(Math.round(100 * multiplier));
      get().addHints(3);
    }
  },
  resetStreak: () => set({ streak: 0 }),
  totalScore: 0,
  addScore: (score) => {
    const multiplier = get().getSubscriptionMultiplier();
    set((s) => ({ totalScore: s.totalScore + Math.round(score * multiplier) }));
  },

  // Game session
  currentLevel: 1,
  setCurrentLevel: (level) => set({ currentLevel: level }),
  currentPuzzle: null,
  startPuzzle: (level) => {
    const puzzle = PUZZLES.find(p => p.level === level) || null;
    const timerBonus = get().getTimerBonus();
    set({
      currentLevel: level,
      currentPuzzle: puzzle,
      timeRemaining: (puzzle?.timeLimit || 30) + timerBonus,
      selectedAnswer: null,
      attempts: 0,
      hintUsed: false,
      score: 0,
      gameResult: null,
      isTimerRunning: true,
    });
  },
  selectedAnswer: null,
  setSelectedAnswer: (answer) => set({ selectedAnswer: answer }),
  timeRemaining: 30,
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  isTimerRunning: false,
  setIsTimerRunning: (running) => set({ isTimerRunning: running }),
  attempts: 0,
  incrementAttempts: () => set((s) => ({ attempts: s.attempts + 1 })),
  hintUsed: false,
  setHintUsed: (used) => set({ hintUsed: used }),
  score: 0,
  setScore: (score) => set({ score }),
  gameResult: null,
  setGameResult: (result) => set({ gameResult: result }),

  // Progress
  completedLevels: new Set<number>(),
  completeLevel: (level) =>
    set((s) => {
      const newCompleted = new Set(s.completedLevels);
      newCompleted.add(level);
      return { completedLevels: newCompleted };
    }),
  isLevelCompleted: (level) => get().completedLevels.has(level),
  isLevelUnlocked: (level) => {
    if (level === 1) return true;
    return get().completedLevels.has(level - 1);
  },
  getLevelScore: (level) => {
    return get().completedLevels.has(level) ? 100 : 0;
  },

  // Theme
  currentTheme: 'cyber-purple',
  setTheme: (theme) => set({ currentTheme: theme }),

  // Daily
  dailyCompleted: false,
  setDailyCompleted: (completed) => set({ dailyCompleted: completed }),
  lastDailyDate: null,
  setLastDailyDate: (date) => set({ lastDailyDate: date }),

  // Subscription
  subscription: {
    plan: 'free',
    status: 'active',
    startDate: null,
    expiryDate: null,
    autoRenew: true,
    paymentProvider: 'coins',
  },
  setSubscription: (sub) =>
    set((s) => ({ subscription: { ...s.subscription, ...sub } })),
  activateSubscription: (plan, coinCost) => {
    const state = get();
    if (plan === 'free') {
      set({
        subscription: {
          plan: 'free', status: 'active', startDate: null, expiryDate: null,
          autoRenew: true, paymentProvider: 'coins',
        },
      });
      return true;
    }
    if (!state.spendCoins(coinCost)) return false;

    const now = new Date();
    const expiry = new Date(now);
    expiry.setMonth(expiry.getMonth() + 1);

    set({
      subscription: {
        plan,
        status: 'active',
        startDate: now.toISOString(),
        expiryDate: expiry.toISOString(),
        autoRenew: true,
        paymentProvider: 'coins',
      },
      maxLives: plan === 'premium' ? 8 : 6,
      hints: plan === 'premium' ? 99 : 10,
    });

    fetch('/api/subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, coinCost, action: 'activate' }),
    }).catch(() => {});

    return true;
  },
  cancelSubscription: () => {
    set((s) => ({
      subscription: { ...s.subscription, autoRenew: false, status: 'cancelled' },
    }));

    fetch('/api/subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel' }),
    }).catch(() => {});
  },
  checkSubscriptionExpiry: () => {
    const state = get();
    if (!state.subscription.expiryDate) return;
    const now = new Date();
    const expiry = new Date(state.subscription.expiryDate);
    if (now > expiry && state.subscription.plan !== 'free') {
      set({
        subscription: {
          plan: 'free', status: 'expired', startDate: null, expiryDate: null,
          autoRenew: true, paymentProvider: 'coins',
        },
        maxLives: 5,
      });
    }
  },
  isPremium: () => get().subscription.plan === 'premium' && get().subscription.status === 'active',
  isPro: () => get().subscription.plan === 'pro' && get().subscription.status === 'active',
  isSubscribed: () => {
    const s = get().subscription;
    return s.plan !== 'free' && s.status === 'active';
  },
  getSubscriptionMultiplier: () => {
    const plan = get().subscription.plan;
    if (plan === 'premium') return 3;
    if (plan === 'pro') return 2;
    return 1;
  },
  getMaxHints: () => {
    const plan = get().subscription.plan;
    if (plan === 'premium') return -1;
    if (plan === 'pro') return 10;
    return 3;
  },
  getTimerBonus: () => {
    const plan = get().subscription.plan;
    if (plan === 'premium') return 15;
    if (plan === 'pro') return 10;
    return 0;
  },
  showPremiumGate: false,
  setShowPremiumGate: (show) => set({ showPremiumGate: show }),
  premiumGateFeature: '',
  setPremiumGateFeature: (feature) => set({ premiumGateFeature: feature }),
  triggerPremiumGate: (feature) => {
    set({ showPremiumGate: true, premiumGateFeature: feature });
  },

  // Language
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),

  // PhonePe Payment
  paymentSubmitting: false,
  paymentChecking: false,
  pendingPayment: null,
  submitPaymentUTR: async (utr, amount, plan) => {
    const state = get();
    const playerId = state.playerId;

    if (!playerId) {
      return { success: false, message: 'Player ID not found. Please restart the app.' };
    }

    set({ paymentSubmitting: true });

    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_utr',
          playerId,
          utr,
          amount,
          plan,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const payment: PaymentRecord = {
          id: data.data.id,
          utr: data.data.utr,
          amount: data.data.amount,
          plan: data.data.plan,
          status: data.data.status,
          createdAt: data.data.createdAt,
          verifiedAt: data.data.verifiedAt,
          rejectedReason: data.data.rejectedReason,
        };
        set({
          paymentSubmitting: false,
          pendingPayment: payment,
          subscription: {
            ...state.subscription,
            paymentProvider: 'pending_phonepe',
          },
        });
        return { success: true, message: data.message, data: payment };
      } else {
        set({ paymentSubmitting: false });
        return { success: false, message: data.error || 'Failed to submit UTR' };
      }
    } catch {
      set({ paymentSubmitting: false });
      return { success: false, message: 'Network error. Please try again.' };
    }
  },
  checkPaymentStatus: async (utr) => {
    const state = get();
    const playerId = state.playerId;

    if (!playerId) {
      return { success: false, message: 'Player ID not found' };
    }

    set({ paymentChecking: true });

    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check_status',
          playerId,
          utr,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const payment: PaymentRecord = {
          id: '',
          utr,
          amount: data.data.amount,
          plan: data.data.plan,
          status: data.data.status,
          createdAt: data.data.createdAt || '',
          verifiedAt: data.data.verifiedAt,
          rejectedReason: data.data.rejectedReason,
        };

        set({ paymentChecking: false, pendingPayment: payment });

        // If verified, activate subscription
        if (data.data.status === 'verified') {
          const now = new Date();
          const expiry = new Date(now);
          expiry.setMonth(expiry.getMonth() + 1);

          const planType = data.data.plan as SubscriptionPlan;
          set({
            subscription: {
              plan: planType,
              status: 'active',
              startDate: now.toISOString(),
              expiryDate: expiry.toISOString(),
              autoRenew: false,
              paymentProvider: 'phonepe',
            },
            maxLives: planType === 'premium' ? 8 : 6,
            hints: planType === 'premium' ? 99 : 10,
            pendingPayment: null,
          });
        }

        return { success: true, data: payment, message: `Payment status: ${data.data.status}` };
      } else {
        set({ paymentChecking: false });
        return { success: false, message: data.error || 'Failed to check status' };
      }
    } catch {
      set({ paymentChecking: false });
      return { success: false, message: 'Network error. Please try again.' };
    }
  },
  setPendingPayment: (payment) => set({ pendingPayment: payment }),

  // Actions
  resetGame: () => set({
    currentPuzzle: null,
    selectedAnswer: null,
    timeRemaining: 30,
    isTimerRunning: false,
    attempts: 0,
    hintUsed: false,
    score: 0,
    gameResult: null,
  }),
  resetPuzzleState: () => set({
    selectedAnswer: null,
    timeRemaining: 30,
    isTimerRunning: false,
    attempts: 0,
    hintUsed: false,
    score: 0,
    gameResult: null,
  }),
}));

export { planCoinCost };
