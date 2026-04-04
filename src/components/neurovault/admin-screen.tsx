'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  Users,
  CreditCard,
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
  Trash2,
  Edit3,
  Crown,
  Zap,
  RefreshCw,
  LogOut,
  IndianRupee,
  TrendingUp,
  Activity,
  Ban,
  Check,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Types ────────────────────────────────────────────────────────
interface DashboardData {
  players: { total: number; active7d: number };
  payments: { total: number; pending: number; verified: number; rejected: number; revenue: number };
  subscriptions: { premium: number; pro: number; free: number };
  recentPayments: PaymentItem[];
}

interface PaymentItem {
  id: string;
  utr: string;
  amount: number;
  plan: string;
  status: string;
  paymentMethod: string;
  screenshotUrl: string | null;
  verifiedAt: string | null;
  rejectedReason: string | null;
  createdAt: string;
  updatedAt: string;
  playerId: string;
  player?: { id: string; username: string; totalScore: number } | null;
}

interface PlayerItem {
  id: string;
  username: string;
  avatar: string;
  totalScore: number;
  coins: number;
  hints: number;
  lives: number;
  maxLives: number;
  streak: number;
  maxStreak: number;
  isPremium: boolean;
  createdAt: string;
  lastPlayed: string | null;
  subscription?: { plan: string; status: string; expiryDate: string | null } | null;
  progress: { level: number; completed: boolean; score: number }[];
  paymentCount?: number;
  payments?: PaymentItem[];
}

type AdminTab = 'dashboard' | 'payments' | 'players';
type PaymentFilter = 'all' | 'pending' | 'verified' | 'rejected';

// ── Animation variants ──────────────────────────────────────────
const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 22 },
  },
};

// ── Status badge helper ─────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; bg: string; icon: typeof CheckCircle2; label: string }> = {
    pending: {
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10 border-yellow-400/30',
      icon: Clock,
      label: 'Pending',
    },
    verified: {
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10 border-emerald-400/30',
      icon: CheckCircle2,
      label: 'Verified',
    },
    rejected: {
      color: 'text-red-400',
      bg: 'bg-red-400/10 border-red-400/30',
      icon: XCircle,
      label: 'Rejected',
    },
    active: {
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10 border-emerald-400/30',
      icon: CheckCircle2,
      label: 'Active',
    },
    expired: {
      color: 'text-gray-400',
      bg: 'bg-gray-400/10 border-gray-400/30',
      icon: XCircle,
      label: 'Expired',
    },
    cancelled: {
      color: 'text-orange-400',
      bg: 'bg-orange-400/10 border-orange-400/30',
      icon: Ban,
      label: 'Cancelled',
    },
  };

  const c = config[status] || config.pending;
  const Icon = c.icon;

  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border', c.bg, c.color)}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
}

// ── Format helpers ───────────────────────────────────────────────
function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

// ── Main Admin Component ─────────────────────────────────────────
export function AdminScreen({
  onBack,
  adminPassword,
}: {
  onBack: () => void;
  adminPassword: string;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Data states
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [players, setPlayers] = useState<PlayerItem[]>([]);
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('pending');
  const [playerSearch, setPlayerSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerItem | null>(null);
  const [editPlayerModal, setEditPlayerModal] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, string | number>>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // ── Auth handler ──
  const handleLogin = useCallback(() => {
    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Wrong password. Try again.');
    }
  }, [passwordInput, adminPassword]);

  // ── API fetcher ──
  const fetchAdmin = useCallback(async (endpoint: string, options?: RequestInit) => {
    const res = await fetch(`/api/admin?${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': adminPassword,
        ...options?.headers,
      },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Request failed');
    return data.data;
  }, [adminPassword]);

  const postAdmin = useCallback(async (body: Record<string, unknown>) => {
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': adminPassword,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Request failed');
    return data;
  }, [adminPassword]);

  // ── Load data based on active tab ──
  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdmin('action=dashboard');
      setDashboard(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [fetchAdmin]);

  const loadPayments = useCallback(async (filter: PaymentFilter = 'pending') => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdmin(`action=payments&status=${filter}&limit=50`);
      setPayments(data.payments || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, [fetchAdmin]);

  const loadPlayers = useCallback(async (search?: string) => {
    setLoading(true);
    setError('');
    try {
      const endpoint = search
        ? `action=players&search=${encodeURIComponent(search)}&limit=50`
        : 'action=players&limit=50';
      const data = await fetchAdmin(endpoint);
      setPlayers(data.players || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load players');
    } finally {
      setLoading(false);
    }
  }, [fetchAdmin]);

  // Load on tab change
  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeTab === 'dashboard') loadDashboard();
    else if (activeTab === 'payments') loadPayments(paymentFilter);
    else if (activeTab === 'players') loadPlayers(playerSearch || undefined);
  }, [isAuthenticated, activeTab, paymentFilter, playerSearch, loadDashboard, loadPayments, loadPlayers]);

  // ── Payment actions ──
  const handleVerify = useCallback(async (paymentId: string) => {
    try {
      await postAdmin({ action: 'verify_payment', paymentId });
      loadPayments(paymentFilter);
      loadDashboard();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to verify payment');
    }
  }, [postAdmin, paymentFilter, loadPayments, loadDashboard]);

  const handleReject = useCallback(async () => {
    if (!rejectModal || !rejectReason.trim()) return;
    try {
      await postAdmin({ action: 'reject_payment', paymentId: rejectModal, reason: rejectReason });
      setRejectModal(null);
      setRejectReason('');
      loadPayments(paymentFilter);
      loadDashboard();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to reject payment');
    }
  }, [postAdmin, rejectModal, rejectReason, paymentFilter, loadPayments, loadDashboard]);

  // ── Player actions ──
  const handleUpdateSubscription = useCallback(async (playerId: string, plan: string) => {
    try {
      await postAdmin({ action: 'update_subscription', playerId, plan, status: 'active' });
      loadPlayers(playerSearch || undefined);
      loadDashboard();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update subscription');
    }
  }, [postAdmin, playerSearch, loadPlayers, loadDashboard]);

  const handleUpdatePlayer = useCallback(async () => {
    if (!editPlayerModal) return;
    try {
      await postAdmin({ action: 'update_player', playerId: editPlayerModal, data: editData });
      setEditPlayerModal(null);
      setEditData({});
      loadPlayers(playerSearch || undefined);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update player');
    }
  }, [postAdmin, editPlayerModal, editData, playerSearch, loadPlayers]);

  const handleDeletePlayer = useCallback(async (playerId: string) => {
    try {
      await postAdmin({ action: 'delete_player', playerId });
      setConfirmDelete(null);
      setSelectedPlayer(null);
      loadPlayers(playerSearch || undefined);
      loadDashboard();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete player');
    }
  }, [postAdmin, playerSearch, loadPlayers, loadDashboard]);

  const handleViewPlayer = useCallback(async (playerId: string) => {
    try {
      const data = await fetchAdmin(`action=player&id=${playerId}`);
      setSelectedPlayer(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load player details');
    }
  }, [fetchAdmin]);

  // ── Tabs config ──
  const tabs: { id: AdminTab; label: string; icon: typeof BarChart3; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
      badge: dashboard?.payments.pending || 0,
    },
    { id: 'players', label: 'Players', icon: Users },
  ];

  // ── LOGIN SCREEN ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-vault-bg flex flex-col items-center justify-center px-4 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm"
        >
          {/* Shield icon */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block"
            >
              <Shield className="w-16 h-16 text-neon-purple mx-auto neon-glow-purple" />
            </motion.div>
            <h1 className="text-2xl font-black tracking-[0.2em] text-white mt-4 neon-text-purple">
              ADMIN ACCESS
            </h1>
            <p className="text-xs text-gray-500 mt-2 tracking-wider uppercase">
              NeuroVault Control Panel
            </p>
          </div>

          {/* Password input */}
          <div className="glass-card rounded-2xl p-6 border border-neon-purple/30 neon-glow-purple">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setAuthError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter admin password..."
                  className="w-full px-4 py-3 rounded-xl bg-vault-card border border-vault-border text-white placeholder-gray-600 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple/50 transition-all"
                  autoFocus
                />
              </div>

              {authError && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-xs text-red-400"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {authError}
                </motion.p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogin}
                className="w-full py-3 rounded-xl font-bold tracking-wider uppercase text-sm neon-button cursor-pointer"
              >
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" />
                  Unlock Panel
                </div>
              </motion.button>
            </div>
          </div>

          {/* Back button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="mt-6 mx-auto flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Game
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── MAIN ADMIN PANEL ──
  return (
    <div className="min-h-screen bg-vault-bg flex flex-col select-none">
      {/* ── Header ── */}
      <div className="sticky top-0 z-30 bg-vault-bg/95 backdrop-blur-md border-b border-vault-border px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="p-2 rounded-lg border border-vault-border bg-vault-card text-gray-400 hover:text-white hover:border-neon-purple/50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-neon-purple" />
              <h1 className="text-lg font-black tracking-[0.15em] neon-text-purple">ADMIN</h1>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-vault-card rounded-xl p-1 border border-vault-border">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all cursor-pointer',
                  activeTab === tab.id
                    ? 'text-white bg-neon-purple/20 border border-neon-purple/40'
                    : 'text-gray-500 hover:text-gray-300',
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                ) : null}
              </motion.button>
            ))}
          </div>

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsAuthenticated(false)}
            className="p-2 rounded-lg border border-vault-border bg-vault-card text-gray-500 hover:text-red-400 hover:border-red-400/50 transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* ── Error toast ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-red-500/20 border border-red-400/40 text-red-400 text-xs font-bold flex items-center gap-2 max-w-md"
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
            <button onClick={() => setError('')} className="ml-2 cursor-pointer">
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content ── */}
      <div className="flex-1 px-4 py-4 max-w-6xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* ── DASHBOARD TAB ── */}
          {activeTab === 'dashboard' && dashboard && (
            <motion.div
              key="dashboard"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-5"
            >
              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <motion.div variants={itemVariants} className="glass-card rounded-xl p-4 border border-neon-purple/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-neon-purple" />
                    <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Total Players</span>
                  </div>
                  <p className="text-2xl font-black text-white font-mono">{dashboard.players.total}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{dashboard.players.active7d} active (7d)</p>
                </motion.div>

                <motion.div variants={itemVariants} className="glass-card rounded-xl p-4 border border-neon-green/20">
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee className="w-4 h-4 text-neon-green" />
                    <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Revenue</span>
                  </div>
                  <p className="text-2xl font-black text-neon-green font-mono">{formatCurrency(dashboard.payments.revenue)}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{dashboard.payments.verified} verified</p>
                </motion.div>

                <motion.div variants={itemVariants} className="glass-card rounded-xl p-4 border border-yellow-400/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Pending</span>
                  </div>
                  <p className="text-2xl font-black text-yellow-400 font-mono">{dashboard.payments.pending}</p>
                  <p className="text-[10px] text-gray-500 mt-1">needs approval</p>
                </motion.div>

                <motion.div variants={itemVariants} className="glass-card rounded-xl p-4 border border-neon-blue/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-4 h-4 text-neon-blue" />
                    <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Subscribers</span>
                  </div>
                  <p className="text-2xl font-black text-white font-mono">{dashboard.subscriptions.premium + dashboard.subscriptions.pro}</p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    <span className="text-neon-purple">{dashboard.subscriptions.premium} Premium</span> · <span className="text-neon-blue">{dashboard.subscriptions.pro} Pro</span>
                  </p>
                </motion.div>
              </div>

              {/* Revenue breakdown & recent payments */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Payment breakdown */}
                <motion.div variants={itemVariants} className="glass-card rounded-xl p-5 border border-vault-border">
                  <h3 className="text-sm font-bold text-white tracking-wider mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-neon-purple" />
                    PAYMENT BREAKDOWN
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Verified', count: dashboard.payments.verified, color: 'bg-emerald-400', percent: dashboard.payments.total ? (dashboard.payments.verified / dashboard.payments.total) * 100 : 0 },
                      { label: 'Pending', count: dashboard.payments.pending, color: 'bg-yellow-400', percent: dashboard.payments.total ? (dashboard.payments.pending / dashboard.payments.total) * 100 : 0 },
                      { label: 'Rejected', count: dashboard.payments.rejected, color: 'bg-red-400', percent: dashboard.payments.total ? (dashboard.payments.rejected / dashboard.payments.total) * 100 : 0 },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">{item.label}</span>
                          <span className="text-xs font-mono text-gray-300">{item.count}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-vault-card overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(item.percent, 0)}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={cn('h-full rounded-full', item.color)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Payments */}
                <motion.div variants={itemVariants} className="glass-card rounded-xl p-5 border border-vault-border">
                  <h3 className="text-sm font-bold text-white tracking-wider mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-neon-yellow" />
                    RECENT PAYMENTS
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {dashboard.recentPayments.length === 0 ? (
                      <p className="text-xs text-gray-600 text-center py-4">No payments yet</p>
                    ) : (
                      dashboard.recentPayments.map((p: PaymentItem) => (
                        <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-vault-card/50 border border-vault-border/50">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-300 truncate">{p.player?.username || 'Unknown'}</p>
                            <p className="text-[10px] text-gray-600 font-mono">{p.utr}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            <span className="text-xs font-bold text-white font-mono">{formatCurrency(p.amount)}</span>
                            <StatusBadge status={p.status} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ── PAYMENTS TAB ── */}
          {activeTab === 'payments' && (
            <motion.div
              key="payments"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-4"
            >
              {/* Filter bar */}
              <motion.div variants={itemVariants} className="flex items-center gap-2 flex-wrap">
                {(['pending', 'verified', 'rejected', 'all'] as PaymentFilter[]).map((f) => (
                  <motion.button
                    key={f}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPaymentFilter(f)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase border transition-all cursor-pointer',
                      paymentFilter === f
                        ? 'bg-neon-purple/20 text-white border-neon-purple/50'
                        : 'text-gray-500 border-vault-border hover:text-gray-300 hover:border-gray-600',
                    )}
                  >
                    {f}
                    {f === 'pending' && dashboard?.payments.pending ? (
                      <span className="ml-1.5 text-[9px] bg-yellow-400/20 text-yellow-400 px-1.5 py-0.5 rounded-full">
                        {dashboard.payments.pending}
                      </span>
                    ) : null}
                  </motion.button>
                ))}

                <div className="ml-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => loadPayments(paymentFilter)}
                    className="p-2 rounded-lg border border-vault-border text-gray-500 hover:text-white hover:border-neon-purple/50 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
                  </motion.button>
                </div>
              </motion.div>

              {/* Loading */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-6 h-6 text-neon-purple animate-spin" />
                </div>
              )}

              {/* Payment list */}
              {!loading && payments.length === 0 && (
                <div className="glass-card rounded-xl p-8 text-center border border-vault-border">
                  <CreditCard className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No payments found</p>
                </div>
              )}

              {!loading && payments.map((payment) => (
                <motion.div
                  key={payment.id}
                  variants={itemVariants}
                  layout
                  className="glass-card rounded-xl p-4 border border-vault-border hover:border-neon-purple/30 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: payment info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-white">{formatCurrency(payment.amount)}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-vault-card border border-vault-border text-gray-400">
                          {payment.plan}
                        </span>
                        <StatusBadge status={payment.status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500">
                        <span className="font-mono">UTR: {payment.utr}</span>
                        <span>Player: {payment.player?.username || payment.playerId?.slice(0, 8) + '...'}</span>
                        <span>{formatDate(payment.createdAt)}</span>
                      </div>
                      {payment.rejectedReason && (
                        <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          {payment.rejectedReason}
                        </p>
                      )}
                    </div>

                    {/* Right: actions */}
                    {payment.status === 'pending' && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleVerify(payment.id)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-400/30 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setRejectModal(payment.id)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 border border-red-400/30 hover:bg-red-500/20 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </motion.button>
                      </div>
                    )}

                    {payment.status === 'verified' && payment.verifiedAt && (
                      <span className="text-[10px] text-gray-600 flex-shrink-0">
                        Verified: {formatDate(payment.verifiedAt)}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ── PLAYERS TAB ── */}
          {activeTab === 'players' && (
            <motion.div
              key="players"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-4"
            >
              {/* Search bar */}
              <motion.div variants={itemVariants} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setPlayerSearch(searchQuery)}
                    placeholder="Search players by username..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-vault-card border border-vault-border text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple/50 transition-all"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setPlayerSearch(searchQuery); loadPlayers(searchQuery || undefined); }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase glass-card border border-neon-purple/30 text-neon-purple hover:border-neon-purple/60 transition-colors cursor-pointer"
                >
                  Search
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => loadPlayers()}
                  className="p-2.5 rounded-xl border border-vault-border text-gray-500 hover:text-white hover:border-neon-purple/50 transition-colors cursor-pointer"
                >
                  <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
                </motion.button>
              </motion.div>

              {/* Loading */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-6 h-6 text-neon-purple animate-spin" />
                </div>
              )}

              {/* Player list */}
              {!loading && players.length === 0 && (
                <div className="glass-card rounded-xl p-8 text-center border border-vault-border">
                  <Users className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No players found</p>
                </div>
              )}

              {!loading && players.map((player) => (
                <motion.div
                  key={player.id}
                  variants={itemVariants}
                  layout
                  className="glass-card rounded-xl p-4 border border-vault-border hover:border-neon-purple/30 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: player info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0',
                        player.isPremium
                          ? 'bg-gradient-to-br from-neon-purple to-neon-blue text-white'
                          : 'bg-vault-card border border-vault-border text-gray-500',
                      )}>
                        {player.isPremium ? (
                          <Crown className="w-5 h-5" />
                        ) : (
                          player.username?.[0]?.toUpperCase() || '?'
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white truncate">{player.username}</span>
                          {player.subscription && player.subscription.plan !== 'free' && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-neon-purple/15 text-neon-purple border border-neon-purple/30">
                              {player.subscription.plan}
                            </span>
                          )}
                          {player.subscription && (
                            <StatusBadge status={player.subscription.status} />
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500 mt-0.5">
                          <span className="font-mono">Score: {player.totalScore.toLocaleString()}</span>
                          <span>Coins: {player.coins}</span>
                          <span>Lives: {player.lives}/{player.maxLives}</span>
                          <span>Hints: {player.hints}</span>
                          <span>Streak: {player.streak}/{player.maxStreak}</span>
                          <span>{formatDate(player.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewPlayer(player.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-400 border border-vault-border hover:text-neon-purple hover:border-neon-purple/40 transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">View</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditData({
                            username: player.username,
                            coins: player.coins,
                            hints: player.hints,
                            lives: player.lives,
                            maxLives: player.maxLives,
                            streak: player.streak,
                            maxStreak: player.maxStreak,
                            totalScore: player.totalScore,
                            isPremium: player.isPremium ? 1 : 0,
                          });
                          setEditPlayerModal(player.id);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-400 border border-vault-border hover:text-neon-blue hover:border-neon-blue/40 transition-colors cursor-pointer"
                        title="Edit Player"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </motion.button>
                      {/* Quick subscription actions */}
                      <select
                        value={player.subscription?.plan || 'free'}
                        onChange={(e) => handleUpdateSubscription(player.id, e.target.value)}
                        className="text-[10px] font-bold bg-vault-card border border-vault-border text-gray-400 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-neon-purple/50 cursor-pointer"
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── REJECT PAYMENT MODAL ── */}
      <AnimatePresence>
        {rejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setRejectModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-6 glass-card border border-red-400/30"
              style={{ background: 'linear-gradient(135deg, rgba(15,15,42,0.98), rgba(20,8,30,0.95))' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-5 h-5 text-red-400" />
                <h3 className="text-base font-bold text-white">Reject Payment</h3>
              </div>
              <p className="text-xs text-gray-400 mb-3">Provide a reason for rejecting this payment:</p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., UTR not found, amount mismatch, screenshot unclear..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-vault-card border border-vault-border text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-all resize-none"
                autoFocus
              />
              <div className="flex items-center gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                  className="flex-1 py-2.5 rounded-xl font-bold tracking-wider uppercase text-sm bg-red-500/15 text-red-400 border border-red-400/30 hover:bg-red-500/25 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Reject Payment
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setRejectModal(null); setRejectReason(''); }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 glass-card border border-vault-border hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EDIT PLAYER MODAL ── */}
      <AnimatePresence>
        {editPlayerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setEditPlayerModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-6 glass-card border border-neon-blue/30 max-h-[80vh] overflow-y-auto custom-scrollbar"
              style={{ background: 'linear-gradient(135deg, rgba(15,15,42,0.98), rgba(8,15,30,0.95))' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-neon-blue" />
                  <h3 className="text-base font-bold text-white">Edit Player</h3>
                </div>
                <button onClick={() => setEditPlayerModal(null)} className="p-1 text-gray-500 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'username', label: 'Username', type: 'text' },
                  { key: 'totalScore', label: 'Total Score', type: 'number' },
                  { key: 'coins', label: 'Coins', type: 'number' },
                  { key: 'hints', label: 'Hints', type: 'number' },
                  { key: 'lives', label: 'Lives', type: 'number' },
                  { key: 'maxLives', label: 'Max Lives', type: 'number' },
                  { key: 'streak', label: 'Streak', type: 'number' },
                  { key: 'maxStreak', label: 'Max Streak', type: 'number' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      value={editData[field.key] || ''}
                      onChange={(e) => setEditData({ ...editData, [field.key]: field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-vault-card border border-vault-border text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-neon-purple/50 transition-all"
                    />
                  </div>
                ))}

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editData.isPremium === 1}
                      onChange={(e) => setEditData({ ...editData, isPremium: e.target.checked ? 1 : 0 })}
                      className="w-4 h-4 rounded border-vault-border bg-vault-card text-neon-purple focus:ring-neon-purple/50"
                    />
                    <span className="text-xs font-bold text-gray-400">Premium Status</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpdatePlayer}
                  className="flex-1 py-2.5 rounded-xl font-bold tracking-wider uppercase text-sm neon-button cursor-pointer"
                >
                  Save Changes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditPlayerModal(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 glass-card border border-vault-border hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PLAYER DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelectedPlayer(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-6 glass-card border border-neon-purple/30 max-h-[85vh] overflow-y-auto custom-scrollbar"
              style={{ background: 'linear-gradient(135deg, rgba(15,15,42,0.98), rgba(20,10,35,0.95))' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black',
                    selectedPlayer.isPremium
                      ? 'bg-gradient-to-br from-neon-purple to-neon-blue text-white'
                      : 'bg-vault-card border border-vault-border text-gray-500',
                  )}>
                    {selectedPlayer.isPremium ? <Crown className="w-6 h-6" /> : selectedPlayer.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedPlayer.username}</h3>
                    <p className="text-[10px] text-gray-500 font-mono">ID: {selectedPlayer.id.slice(0, 12)}...</p>
                  </div>
                </div>
                <button onClick={() => setSelectedPlayer(null)} className="p-2 text-gray-500 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { label: 'Score', value: selectedPlayer.totalScore.toLocaleString(), color: 'text-neon-yellow' },
                  { label: 'Coins', value: selectedPlayer.coins.toLocaleString(), color: 'text-neon-yellow' },
                  { label: 'Streak', value: `${selectedPlayer.streak}/${selectedPlayer.maxStreak}`, color: 'text-neon-orange' },
                  { label: 'Hints', value: `${selectedPlayer.hints}`, color: 'text-neon-blue' },
                  { label: 'Lives', value: `${selectedPlayer.lives}/${selectedPlayer.maxLives}`, color: 'text-neon-pink' },
                  { label: 'Levels', value: `${selectedPlayer.progress?.filter(p => p.completed).length || 0}/50`, color: 'text-neon-green' },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg p-2 bg-vault-card/50 border border-vault-border/50 text-center">
                    <p className={cn('text-sm font-bold font-mono', s.color)}>{s.value}</p>
                    <p className="text-[9px] text-gray-600 uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Subscription */}
              <div className="rounded-xl p-4 border border-vault-border bg-vault-card/30 mb-5">
                <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Subscription</h4>
                {selectedPlayer.subscription ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'text-sm font-bold uppercase',
                        selectedPlayer.subscription.plan === 'premium' ? 'text-neon-purple' :
                        selectedPlayer.subscription.plan === 'pro' ? 'text-neon-blue' : 'text-gray-500',
                      )}>
                        {selectedPlayer.subscription.plan}
                      </span>
                      <StatusBadge status={selectedPlayer.subscription.status} />
                    </div>
                    <span className="text-[10px] text-gray-600">
                      {selectedPlayer.subscription.expiryDate
                        ? `Expires: ${formatDate(selectedPlayer.subscription.expiryDate)}`
                        : 'No expiry'}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600">No subscription (Free tier)</p>
                )}
              </div>

              {/* Payment history */}
              {selectedPlayer.payments && selectedPlayer.payments.length > 0 && (
                <div className="rounded-xl p-4 border border-vault-border bg-vault-card/30 mb-5">
                  <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Payment History</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                    {selectedPlayer.payments.map((p: PaymentItem) => (
                      <div key={p.id} className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-300">{formatCurrency(p.amount)}</span>
                          <StatusBadge status={p.status} />
                        </div>
                        <span className="text-gray-600">{formatDate(p.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Danger zone */}
              <div className="rounded-xl p-4 border border-red-400/20 bg-red-400/5">
                <h4 className="text-xs font-bold text-red-400 tracking-wider uppercase mb-2">Danger Zone</h4>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setConfirmDelete(selectedPlayer.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-400 bg-red-400/10 border border-red-400/20 hover:bg-red-400/20 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Player
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CONFIRM DELETE MODAL ── */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl p-6 glass-card border border-red-400/40"
              style={{ background: 'linear-gradient(135deg, rgba(25,10,10,0.98), rgba(15,5,5,0.95))' }}
            >
              <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white text-center mb-2">Delete Player?</h3>
              <p className="text-xs text-gray-400 text-center mb-5">
                This action cannot be undone. All player data, progress, and payment records will be permanently deleted.
              </p>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDeletePlayer(confirmDelete)}
                  className="flex-1 py-2.5 rounded-xl font-bold tracking-wider uppercase text-sm bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Yes, Delete
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-xl font-bold tracking-wider uppercase text-sm text-gray-400 glass-card border border-vault-border hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
