'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Crown,
  Zap,
  Gem,
  Check,
  X,
  Shield,
  Sparkles,
  Coins,
  Clock,
  Star,
  Trophy,
  Heart,
  Gift,
  Eye,
  QrCode,
  Loader2,
  Smartphone,
  Copy,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Info,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useGameStore, SUBSCRIPTION_PLANS, type SubscriptionPlan } from '@/lib/game-store';
import { cn } from '@/lib/utils';

const planIcons: Record<SubscriptionPlan, React.ReactNode> = {
  free: <Shield className="h-6 w-6" />,
  pro: <Zap className="h-6 w-6" />,
  premium: <Crown className="h-6 w-6" />,
};

export function SubscriptionScreen() {
  const {
    setScreen,
    subscription,
    activateSubscription,
    cancelSubscription,
    checkSubscriptionExpiry,
    coins,
    playerId,
    setPlayerId,
    paymentSubmitting,
    paymentChecking,
    pendingPayment,
    submitPaymentUTR,
    checkPaymentStatus,
    setPendingPayment,
  } = useGameStore();

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(subscription.plan);
  const [paymentTab, setPaymentTab] = useState<'coins' | 'phonepe'>('phonepe');
  const [purchasing, setPurchasing] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [utrInput, setUtrInput] = useState('');
  const [utrError, setUtrError] = useState('');
  const [utrCopied, setUtrCopied] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const showFeedback = (message: string, type: 'success' | 'error' | 'info') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Ensure player ID exists
  useEffect(() => {
    if (!playerId) {
      setPlayerId('player_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8));
    }
  }, [playerId, setPlayerId]);

  // Poll pending payment status
  const pollInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const startPolling = useCallback((utr: string) => {
    if (pollInterval.current) clearInterval(pollInterval.current);
    pollInterval.current = setInterval(async () => {
      const result = await checkPaymentStatus(utr);
      if (result.success && result.data?.status === 'verified') {
        if (pollInterval.current) clearInterval(pollInterval.current);
        showFeedback('Payment verified! Subscription activated! 🎉', 'success');
      }
    }, 15000);
  }, [checkPaymentStatus]);

  useEffect(() => {
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, []);

  useEffect(() => {
    checkSubscriptionExpiry();
  }, [checkSubscriptionExpiry]);

  const handleCoinSubscribe = () => {
    if (selectedPlan === subscription.plan) return;
    if (selectedPlan === 'free') {
      activateSubscription('free', 0);
      showFeedback('Switched to Free plan', 'success');
      setShowConfirm(false);
      return;
    }

    setPurchasing(true);
    const coinCosts: Record<string, number> = { pro: 200, premium: 350 };
    const realCost = coinCosts[selectedPlan] || 0;
    const state = useGameStore.getState();

    const success = state.spendCoins(realCost);
    if (success) {
      const now = new Date();
      const expiry = new Date(now);
      expiry.setMonth(expiry.getMonth() + 1);

      useGameStore.setState({
        subscription: {
          plan: selectedPlan,
          status: 'active',
          startDate: now.toISOString(),
          expiryDate: expiry.toISOString(),
          autoRenew: true,
          paymentProvider: 'coins',
        },
        maxLives: selectedPlan === 'premium' ? 8 : 6,
        hints: selectedPlan === 'premium' ? 99 : 10,
      });

      fetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: state.playerId, plan: selectedPlan, coinCost: realCost, action: 'activate' }),
      }).catch(() => {});

      setTimeout(() => {
        setPurchasing(false);
        showFeedback(`${SUBSCRIPTION_PLANS[selectedPlan].label} activated! 🎉`, 'success');
        setShowConfirm(false);
      }, 1200);
    } else {
      setTimeout(() => {
        setPurchasing(false);
        showFeedback('Not enough coins!', 'error');
      }, 800);
    }
  };

  const handleOpenQRPayment = () => {
    setShowConfirm(false);
    setUtrInput('');
    setUtrError('');
    setShowQRModal(true);
  };

  const handleSubmitUTR = async () => {
    const cleanUtr = utrInput.trim().toUpperCase();
    if (!cleanUtr) {
      setUtrError('Please enter your UTR number');
      return;
    }
    if (cleanUtr.length < 8 || cleanUtr.length > 20) {
      setUtrError('UTR must be 8-20 characters');
      return;
    }

    setUtrError('');
    const planPrice = SUBSCRIPTION_PLANS[selectedPlan].price;
    const result = await submitPaymentUTR(cleanUtr, planPrice, selectedPlan);

    if (result.success) {
      showFeedback('UTR submitted! Verification will happen shortly.', 'success');
      startPolling(cleanUtr);
    } else {
      showFeedback(result.message, 'error');
      setUtrError(result.message);
    }
  };

  const handleCheckStatus = async () => {
    if (!pendingPayment?.utr) return;
    setCheckingStatus(true);
    const result = await checkPaymentStatus(pendingPayment.utr);
    if (result.success && result.data?.status === 'verified') {
      showFeedback('Payment verified! Subscription activated! 🎉', 'success');
      setShowQRModal(false);
      setPendingPayment(null);
    } else if (result.success) {
      showFeedback(`Payment is still ${result.data?.status || 'pending'}. We'll notify you when verified.`, 'info');
    } else {
      showFeedback(result.message, 'error');
    }
    setCheckingStatus(false);
  };

  const handleCopyUPI = () => {
    const upiId = 'your-upi-id@phonepe';
    navigator.clipboard.writeText(upiId).then(() => {
      setUtrCopied(true);
      setTimeout(() => setUtrCopied(false), 2000);
    }).catch(() => {});
  };

  const isActivePlan = (plan: SubscriptionPlan) => subscription.plan === plan && subscription.status === 'active';
  const isSubscribed = subscription.plan !== 'free' && subscription.status === 'active';
  const isPhonePePayment = subscription.paymentProvider === 'phonepe';
  const isPendingPhonePe = subscription.paymentProvider === 'pending_phonepe';

  const getExpiryString = () => {
    const date = subscription.expiryDate;
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const coinCosts: Record<string, number> = { free: 0, pro: 200, premium: 350 };

  return (
    <div className="min-h-screen bg-vault-bg text-white p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Feedback Toast */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                'fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg backdrop-blur-md max-w-xs text-center',
                feedback.type === 'success' ? 'bg-green-500/80 text-white' :
                feedback.type === 'info' ? 'bg-blue-500/80 text-white' :
                'bg-red-500/80 text-white',
              )}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
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
          transition={{ delay: 0.1 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card">
            <Crown className="h-5 w-5 text-neon-purple" />
            <span className="text-sm font-bold tracking-widest uppercase neon-text-purple">Subscription</span>
          </div>
          <p className="text-sm text-gray-500">Choose your payment method and unlock premium features</p>
        </motion.div>

        {/* Current Plan Status */}
        {isSubscribed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-2xl p-4 border border-neon-purple/30"
            style={{ boxShadow: `0 0 30px ${SUBSCRIPTION_PLANS[subscription.plan].glow}` }}
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="p-2.5 rounded-xl"
                  style={{ backgroundColor: `${SUBSCRIPTION_PLANS[subscription.plan].color}20` }}
                >
                  <div style={{ color: SUBSCRIPTION_PLANS[subscription.plan].color }}>
                    {planIcons[subscription.plan]}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold" style={{ color: SUBSCRIPTION_PLANS[subscription.plan].color }}>
                      {SUBSCRIPTION_PLANS[subscription.plan].label} Plan
                    </h3>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">
                      Active
                    </Badge>
                    {isPhonePePayment && (
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px]">
                        <Smartphone className="h-2.5 w-2.5 mr-0.5" />
                        PhonePe
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {subscription.autoRenew ? 'Auto-renews' : 'Expires'} on {getExpiryString()}
                  </p>
                </div>
              </div>
              {subscription.autoRenew && (
                <button
                  onClick={() => {
                    setFeedback(null);
                    setShowConfirm(true);
                  }}
                  className="text-xs text-gray-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg border border-gray-800 hover:border-red-500/30 cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Pending Payment Banner */}
        {isPendingPhonePe && pendingPayment && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-4 border border-yellow-500/30"
            style={{ boxShadow: '0 0 20px rgba(255, 200, 0, 0.15)' }}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mt-0.5">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-yellow-300">Payment Under Verification</h4>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-[9px] animate-pulse">
                    Pending
                  </Badge>
                </div>
                <p className="text-xs text-gray-400 mb-2">
                  UTR: <span className="font-mono text-gray-300">{pendingPayment.utr}</span> • {pendingPayment.plan.toUpperCase()} plan • ₹{pendingPayment.amount}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleCheckStatus}
                    disabled={checkingStatus}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {checkingStatus ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                    Check Status
                  </button>
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <QrCode className="h-3 w-3" />
                    View QR
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Payment Method Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="flex rounded-xl glass-card p-1 gap-1"
        >
          <button
            onClick={() => setPaymentTab('phonepe')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer',
              paymentTab === 'phonepe'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-gray-500 hover:text-gray-300',
            )}
          >
            <Smartphone className="h-4 w-4" />
            PhonePe / UPI
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[9px] px-1 py-0">
              Best
            </Badge>
          </button>
          <button
            onClick={() => setPaymentTab('coins')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer',
              paymentTab === 'coins'
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                : 'text-gray-500 hover:text-gray-300',
            )}
          >
            <Coins className="h-4 w-4" />
            Pay with Coins
            <span className="text-xs text-gray-600">({coins})</span>
          </button>
        </motion.div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(SUBSCRIPTION_PLANS) as SubscriptionPlan[]).map((plan, idx) => {
            const config = SUBSCRIPTION_PLANS[plan];
            const coinCost = coinCosts[plan];
            const active = isActivePlan(plan);
            const canAffordCoins = coins >= coinCost;

            return (
              <motion.div
                key={plan}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + idx * 0.1 }}
                onClick={() => setSelectedPlan(plan)}
                className={cn(
                  'relative glass-card rounded-2xl p-5 cursor-pointer transition-all duration-300 flex flex-col',
                  selectedPlan === plan && !active
                    ? 'ring-2 ring-offset-2 ring-offset-vault-bg'
                    : 'hover:scale-[1.02]',
                )}
                style={{
                  borderColor: selectedPlan === plan ? config.color + '80' : undefined,
                  ...(selectedPlan === plan ? { ['--tw-ring-color' as string]: config.color } : {}),
                  boxShadow: selectedPlan === plan ? `0 0 25px ${config.glow}` : undefined,
                }}
              >
                {config.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] px-3 py-1 border-0 shadow-lg">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {active && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-green-500/90 text-white text-[10px] px-3 py-1 border-0">
                      <Check className="h-3 w-3 mr-1" />
                      Current Plan
                    </Badge>
                  </div>
                )}

                {/* Plan Icon & Name */}
                <div className="text-center mb-4">
                  <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
                    style={{ backgroundColor: `${config.color}15`, color: config.color }}
                  >
                    {planIcons[plan]}
                  </div>
                  <h3 className="text-xl font-black tracking-wider uppercase" style={{ color: config.color }}>
                    {config.label}
                  </h3>
                  <div className="mt-2">
                    <span className="text-2xl font-extrabold text-white">{config.priceLabel}</span>
                    {paymentTab === 'coins' && coinCost > 0 && (
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Coins className="h-3 w-3 text-yellow-400" />
                        <span className={cn('text-xs', canAffordCoins ? 'text-yellow-300' : 'text-red-400')}>
                          {coinCost} coins
                        </span>
                        {!canAffordCoins && <span className="text-[9px] text-red-400/70">(need more)</span>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full mb-4" style={{ backgroundColor: `${config.color}30` }} />

                {/* Features */}
                <ul className="flex-1 space-y-2.5 mb-5">
                  {config.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: config.color }} />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                {active ? (
                  <button className="w-full py-3 rounded-xl text-sm font-bold bg-white/5 text-gray-500 cursor-default" disabled>
                    ✓ Active
                  </button>
                ) : plan === 'free' ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
                    className={cn(
                      'w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all cursor-pointer',
                      selectedPlan === plan ? 'text-white hover:opacity-90' : 'bg-white/5 text-gray-500 hover:bg-white/10',
                    )}
                    style={selectedPlan === plan ? { background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)` } : undefined}
                  >
                    {isSubscribed ? 'Downgrade' : 'Current'}
                  </button>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
                    className={cn(
                      'w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2',
                      selectedPlan === plan ? 'text-white hover:opacity-90' : 'bg-white/5 text-gray-500 hover:bg-white/10',
                    )}
                    style={selectedPlan === plan ? { background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)` } : undefined}
                  >
                    {paymentTab === 'phonepe' ? (
                      <>
                        <Smartphone className="h-4 w-4" />
                        Subscribe via UPI
                      </>
                    ) : (
                      <>
                        <Coins className="h-4 w-4" />
                        Subscribe ({coinCost} coins)
                      </>
                    )}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <div className="p-4 border-b border-vault-border">
            <h3 className="text-sm font-bold tracking-wider uppercase text-gray-300 text-center">
              Full Feature Comparison
            </h3>
          </div>
          <div className="divide-y divide-vault-border overflow-x-auto">
            {[
              { icon: <Heart className="h-4 w-4" />, feature: 'Max Hints', free: '3', pro: '10', premium: '∞' },
              { icon: <Clock className="h-4 w-4" />, feature: 'Timer Bonus', free: '-', pro: '+10s', premium: '+15s' },
              { icon: <Coins className="h-4 w-4" />, feature: 'Coin Multiplier', free: '1x', pro: '2x', premium: '3x' },
              { icon: <Star className="h-4 w-4" />, feature: 'Exclusive Themes', free: 'Basic', pro: '4 Themes', premium: 'All' },
              { icon: <Eye className="h-4 w-4" />, feature: 'Ad Experience', free: 'With Ads', pro: 'Ad-Free', premium: 'Ad-Free' },
              { icon: <Trophy className="h-4 w-4" />, feature: 'Leaderboard', free: 'Standard', pro: 'Pro Badge', premium: 'Crown + Priority' },
              { icon: <Heart className="h-4 w-4" />, feature: 'Max Lives', free: '5', pro: '6', premium: '8' },
              { icon: <Gift className="h-4 w-4" />, feature: 'Daily Mystery Box', free: '-', pro: '-', premium: 'Free Daily' },
            ].map((row) => (
              <div key={row.feature} className="grid grid-cols-4 gap-2 px-4 py-3 items-center min-w-[400px]">
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  {row.icon}
                  <span>{row.feature}</span>
                </div>
                <div className="text-center text-xs text-gray-400 font-medium">{row.free}</div>
                <div className="text-center text-xs font-medium" style={{ color: SUBSCRIPTION_PLANS.pro.color }}>{row.pro}</div>
                <div className="text-center text-xs font-bold" style={{ color: SUBSCRIPTION_PLANS.premium.color }}>{row.premium}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 px-4 py-2 bg-vault-card/50 text-center">
            <div />
            <div className="text-xs text-gray-500 font-bold uppercase">Free</div>
            <div className="text-xs font-bold uppercase" style={{ color: SUBSCRIPTION_PLANS.pro.color }}>Pro</div>
            <div className="text-xs font-bold uppercase" style={{ color: SUBSCRIPTION_PLANS.premium.color }}>Premium</div>
          </div>
        </motion.div>

        {/* Payment Security Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="glass-card rounded-2xl p-4 flex items-center gap-3"
        >
          <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20">
            <Shield className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-300">Secure Payments</p>
            <p className="text-xs text-gray-500">
              {paymentTab === 'phonepe'
                ? 'Pay securely via PhonePe / UPI QR code. Your payment is verified manually using the UTR reference.'
                : 'Use your in-game coin balance. Earn more by completing puzzles and daily challenges.'}
            </p>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-2xl p-5 space-y-4"
        >
          <h3 className="text-sm font-bold tracking-wider uppercase text-gray-300 text-center">FAQ</h3>
          {[
            {
              q: 'How do I subscribe via PhonePe?',
              a: 'Select a plan, tap "Subscribe via UPI", scan the QR code with PhonePe, pay the exact amount, then enter the UTR number from your payment receipt for verification.',
            },
            {
              q: 'What is UTR and where do I find it?',
              a: 'UTR (Unique Transaction Reference) is a 12-digit code on your PhonePe payment receipt. You can find it in your PhonePe transaction history or bank statement.',
            },
            {
              q: 'How long does verification take?',
              a: 'Payments are typically verified within a few minutes. You can check status anytime from the pending payment banner.',
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Yes! You can cancel auto-renew. Your plan stays active until expiry. PhonePe subscriptions are monthly - just pay again to renew.',
            },
          ].map((faq) => (
            <div key={faq.q} className="space-y-1">
              <p className="text-sm font-semibold text-gray-300">{faq.q}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </motion.div>

        <div className="h-8" />
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-2xl p-6 max-w-sm w-full space-y-4"
              style={{
                boxShadow: `0 0 40px ${SUBSCRIPTION_PLANS[selectedPlan].glow}`,
                borderColor: `${SUBSCRIPTION_PLANS[selectedPlan].color}40`,
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">
                  {isSubscribed && selectedPlan === 'free'
                    ? 'Downgrade to Free?'
                    : selectedPlan !== 'free'
                      ? `Subscribe to ${SUBSCRIPTION_PLANS[selectedPlan].label}`
                      : 'Free Plan'}
                </h3>
                <button onClick={() => setShowConfirm(false)} className="text-gray-500 hover:text-white cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {selectedPlan !== 'free' ? (
                <>
                  <div className="text-center space-y-3">
                    <div
                      className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-2"
                      style={{ backgroundColor: `${SUBSCRIPTION_PLANS[selectedPlan].color}20`, color: SUBSCRIPTION_PLANS[selectedPlan].color }}
                    >
                      {planIcons[selectedPlan]}
                    </div>
                    <p className="text-sm text-gray-400">
                      Activate <span className="font-bold text-white">{SUBSCRIPTION_PLANS[selectedPlan].label}</span> plan
                    </p>

                    {/* Price based on payment method */}
                    {paymentTab === 'phonepe' ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-2">
                          <Smartphone className="h-5 w-5 text-purple-400" />
                          <span className="text-2xl font-extrabold text-white">
                            {SUBSCRIPTION_PLANS[selectedPlan].priceLabel}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-600">Pay via PhonePe QR code • Monthly</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-2">
                          <Coins className="h-5 w-5 text-yellow-400" />
                          <span className="text-2xl font-extrabold text-yellow-300">{coinCosts[selectedPlan]}</span>
                          <span className="text-sm text-gray-500">coins</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Balance: {coins} coins {coins >= coinCosts[selectedPlan] ? '✓' : '(Not enough)'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Payment method tabs in modal */}
                  <div className="flex rounded-xl bg-white/5 p-1 gap-1">
                    <button
                      onClick={() => setPaymentTab('phonepe')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer',
                        paymentTab === 'phonepe'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'text-gray-500 hover:text-gray-300',
                      )}
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      PhonePe
                    </button>
                    <button
                      onClick={() => setPaymentTab('coins')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer',
                        paymentTab === 'coins'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'text-gray-500 hover:text-gray-300',
                      )}
                    >
                      <Coins className="h-3.5 w-3.5" />
                      Coins
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-gray-400 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    {paymentTab === 'phonepe' ? (
                      <button
                        onClick={handleOpenQRPayment}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all cursor-pointer hover:opacity-90 flex items-center justify-center gap-2"
                        style={{ background: `linear-gradient(135deg, ${SUBSCRIPTION_PLANS[selectedPlan].color}, ${SUBSCRIPTION_PLANS[selectedPlan].color}cc)` }}
                      >
                        <QrCode className="h-4 w-4" />
                        Pay ₹{SUBSCRIPTION_PLANS[selectedPlan].price}
                      </button>
                    ) : (
                      <button
                        onClick={handleCoinSubscribe}
                        disabled={purchasing || coins < coinCosts[selectedPlan]}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{ background: `linear-gradient(135deg, ${SUBSCRIPTION_PLANS[selectedPlan].color}, ${SUBSCRIPTION_PLANS[selectedPlan].color}cc)` }}
                      >
                        {purchasing ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Coins className="h-4 w-4" />
                            Pay {coinCosts[selectedPlan]} coins
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </>
              ) : isSubscribed ? (
                <>
                  <p className="text-sm text-gray-400 text-center">
                    Are you sure? You&apos;ll lose access to {SUBSCRIPTION_PLANS[subscription.plan].label} features.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-gray-400 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      Keep Plan
                    </button>
                    <button
                      onClick={() => {
                        cancelSubscription();
                        setShowConfirm(false);
                        showFeedback('Subscription cancelled. Plan active until expiry.', 'info');
                      }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-500/80 text-white hover:bg-red-500 transition-colors cursor-pointer"
                    >
                      Downgrade
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setShowConfirm(false)}
                  className="w-full py-2.5 rounded-xl text-sm font-medium bg-white/5 text-gray-400 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Close
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PhonePe QR Code Payment Modal */}
      <AnimatePresence>
        {showQRModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowQRModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto space-y-5"
              style={{
                boxShadow: `0 0 50px ${SUBSCRIPTION_PLANS[selectedPlan].glow}`,
                borderColor: `${SUBSCRIPTION_PLANS[selectedPlan].color}50`,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <QrCode className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Pay via PhonePe</h3>
                    <p className="text-[10px] text-gray-500">{SUBSCRIPTION_PLANS[selectedPlan].label} • ₹{SUBSCRIPTION_PLANS[selectedPlan].price}</p>
                  </div>
                </div>
                <button onClick={() => setShowQRModal(false)} className="text-gray-500 hover:text-white cursor-pointer p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Step 1: Scan & Pay */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold">1</span>
                  <h4 className="text-sm font-bold text-gray-200">Scan QR & Pay</h4>
                </div>

                {/* QR Code Image */}
                <div className="relative mx-auto w-64 h-64 rounded-2xl overflow-hidden border-2 border-purple-500/30 bg-white p-2">
                  <img
                    src="/phonepe-qr.jpg"
                    alt="PhonePe QR Code"
                    className="w-full h-full object-contain rounded-xl"
                  />
                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur rounded-lg px-2 py-1 flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-purple-600" />
                    <span className="text-[10px] font-bold text-gray-800">PhonePe</span>
                  </div>
                </div>

                {/* Payment Amount Highlight */}
                <div
                  className="text-center py-2 rounded-xl"
                  style={{ backgroundColor: `${SUBSCRIPTION_PLANS[selectedPlan].color}10`, border: `1px solid ${SUBSCRIPTION_PLANS[selectedPlan].color}30` }}
                >
                  <p className="text-xs text-gray-400">Pay exactly</p>
                  <p className="text-2xl font-black" style={{ color: SUBSCRIPTION_PLANS[selectedPlan].color }}>
                    ₹{SUBSCRIPTION_PLANS[selectedPlan].price}
                  </p>
                  <p className="text-[10px] text-gray-500">for {SUBSCRIPTION_PLANS[selectedPlan].label} plan (1 month)</p>
                </div>
              </div>

              {/* Step 2: Enter UTR */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold">2</span>
                  <h4 className="text-sm font-bold text-gray-200">Enter UTR Reference</h4>
                </div>

                <p className="text-xs text-gray-500 flex items-start gap-1.5">
                  <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gray-600" />
                  After paying, find the UTR (12-digit reference number) in your PhonePe transaction history or bank SMS.
                </p>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={utrInput}
                    onChange={(e) => {
                      setUtrInput(e.target.value.toUpperCase());
                      setUtrError('');
                    }}
                    placeholder="Enter UTR number (e.g. 432156789012)"
                    maxLength={20}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-vault-border text-white placeholder-gray-600 text-sm font-mono tracking-wider focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
                  />
                  {utrError && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {utrError}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitUTR}
                disabled={paymentSubmitting || !utrInput.trim()}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all cursor-pointer hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, #6B21A8, #9333EA, #7C3AED)` }}
              >
                {paymentSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting UTR...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Submit UTR for Verification
                  </>
                )}
              </button>

              {/* Pending Payment Status */}
              <AnimatePresence>
                {pendingPayment && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-3 space-y-2">
                      <div className="flex items-center gap-2 text-yellow-300">
                        <Clock className="h-4 w-4 animate-pulse" />
                        <span className="text-xs font-bold">Payment Submitted</span>
                      </div>
                      <div className="text-xs text-gray-400 space-y-0.5">
                        <p>UTR: <span className="font-mono text-gray-300">{pendingPayment.utr}</span></p>
                        <p>Status: <span className="text-yellow-300 capitalize">{pendingPayment.status}</span></p>
                      </div>
                      <button
                        onClick={handleCheckStatus}
                        disabled={checkingStatus}
                        className="w-full flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20 transition-colors cursor-pointer disabled:opacity-50 border border-yellow-500/20"
                      >
                        {checkingStatus ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                        {checkingStatus ? 'Checking...' : 'Check Verification Status'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Help text */}
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                <Smartphone className="h-4 w-4 text-gray-600 shrink-0" />
                <p className="text-[10px] text-gray-600 leading-relaxed">
                  Open PhonePe → Scan this QR code → Pay ₹{SUBSCRIPTION_PLANS[selectedPlan].price} → Copy UTR from payment success screen → Paste above
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
