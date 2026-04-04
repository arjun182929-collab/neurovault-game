'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  ChevronDown,
  ChevronRight,
  Mail,
  Calendar,
  Lock,
  Eye,
  Trash2,
  RefreshCw,
  AlertTriangle,
  FileText,
  Server,
  Smartphone,
  CreditCard,
  Users,
  Clock,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Animation variants ──
const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
};

// ── Section data ──
const sections = [
  {
    id: 'collection',
    title: 'Information We Collect',
    icon: Eye,
    color: 'text-neon-purple',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400 leading-relaxed">
          NeuroVault collects minimal data necessary to provide you with a seamless puzzle gaming experience. We are committed to data minimization and transparency.
        </p>

        <div className="grid gap-3">
          <div className="p-3 rounded-xl bg-neon-purple/5 border border-neon-purple/20">
            <h4 className="text-xs font-bold text-neon-purple mb-2 flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              Information You Provide
            </h4>
            <ul className="text-xs text-gray-400 space-y-1.5 ml-5 list-disc">
              <li><span className="text-gray-300">Display Name:</span> The username you set in your profile (stored locally on your device)</li>
              <li><span className="text-gray-300">Payment UTR:</span> UPI transaction reference number submitted for subscription verification</li>
              <li><span className="text-gray-300">Subscription Preferences:</span> Your chosen plan (Pro/Premium) and payment method</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-neon-blue/5 border border-neon-blue/20">
            <h4 className="text-xs font-bold text-neon-blue mb-2 flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5" />
              Automatically Collected
            </h4>
            <ul className="text-xs text-gray-400 space-y-1.5 ml-5 list-disc">
              <li><span className="text-gray-300">Game Progress:</span> Completed levels, scores, streaks, and in-game statistics</li>
              <li><span className="text-gray-300">Device Preferences:</span> Theme selection, language preference (EN/Hinglish)</li>
              <li><span className="text-gray-300">Usage Patterns:</span> Daily challenge participation, play frequency</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-neon-green/5 border border-neon-green/20">
            <h4 className="text-xs font-bold text-neon-green mb-2 flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5" />
              Payment Information
            </h4>
            <ul className="text-xs text-gray-400 space-y-1.5 ml-5 list-disc">
              <li><span className="text-gray-300">UTR Number:</span> Your UPI transaction reference (used solely for payment verification)</li>
              <li><span className="text-gray-300">Amount &amp; Plan:</span> Subscription amount and plan type</li>
              <li>We <span className="text-neon-green font-bold">DO NOT</span> collect, store, or process your bank account details, card numbers, UPI PINs, or any financial credentials</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'usage',
    title: 'How We Use Your Information',
    icon: Globe,
    color: 'text-neon-blue',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400 leading-relaxed">
          Your data is used exclusively to operate and improve NeuroVault. We never use your data for advertising, marketing, or sell it to third parties.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: 'Game Progress', desc: 'Track levels, scores, streaks' },
            { label: 'Leaderboard', desc: 'Rankings & competition' },
            { label: 'Subscriptions', desc: 'Plan management & access' },
            { label: 'Payment Verification', desc: 'UTR validation for UPI payments' },
            { label: 'App Improvement', desc: 'Bug fixes & feature updates' },
            { label: 'Security', desc: 'Fraud prevention & abuse protection' },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-lg bg-vault-card border border-vault-border text-center">
              <p className="text-[11px] font-bold text-white">{item.label}</p>
              <p className="text-[10px] text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-400 leading-relaxed">
            <strong>No Advertising:</strong> NeuroVault does not serve ads. We do not use your data for ad targeting, retargeting, or any marketing purposes whatsoever.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'sharing',
    title: 'Information Sharing',
    icon: Users,
    color: 'text-neon-pink',
    content: (
      <div className="space-y-4">
        <div className="grid gap-3">
          <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
            <h4 className="text-xs font-bold text-yellow-400 mb-2">Shared With Third Parties</h4>
            <ul className="text-xs text-gray-400 space-y-1.5 ml-5 list-disc">
              <li><span className="text-gray-300">PhonePe:</span> Payment processing is handled directly by PhonePe. We only receive your UTR reference number — no financial details are shared with us.</li>
            </ul>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <h4 className="text-xs font-bold text-emerald-400 mb-2">Never Shared With Anyone</h4>
            <ul className="text-xs text-gray-400 space-y-1.5 ml-5 list-disc">
              <li>Your personal data is <span className="text-emerald-400 font-semibold">never sold</span> to data brokers, advertisers, or any third party</li>
              <li>Your game data is <span className="text-emerald-400 font-semibold">never shared</span> with social media platforms</li>
              <li>Your payment information (beyond UTR) is <span className="text-emerald-400 font-semibold">never stored</span> on our servers</li>
              <li>We do not participate in any data-sharing or analytics partnerships</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'storage',
    title: 'Data Storage & Security',
    icon: Lock,
    color: 'text-neon-green',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400 leading-relaxed">
          We employ industry-standard security measures to protect your data. Data is stored in two locations:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="p-3 rounded-xl bg-vault-card border border-vault-border">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="w-4 h-4 text-neon-purple" />
              <h4 className="text-xs font-bold text-white">Client-Side (Your Device)</h4>
            </div>
            <ul className="text-xs text-gray-400 space-y-1 ml-5 list-disc">
              <li>Game progress, scores, preferences</li>
              <li>Subscription state &amp; payment records</li>
              <li>Stored in browser localStorage</li>
              <li>Never leaves your device unless synced</li>
            </ul>
          </div>
          <div className="p-3 rounded-xl bg-vault-card border border-vault-border">
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-4 h-4 text-neon-blue" />
              <h4 className="text-xs font-bold text-white">Server-Side (Encrypted)</h4>
            </div>
            <ul className="text-xs text-gray-400 space-y-1 ml-5 list-disc">
              <li>Subscription &amp; payment records</li>
              <li>Leaderboard rankings</li>
              <li>Daily challenge data</li>
              <li>Stored in encrypted SQLite database</li>
            </ul>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-neon-purple/5 border border-neon-purple/20">
          <h4 className="text-xs font-bold text-neon-purple mb-2 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" />
            Security Measures
          </h4>
          <ul className="text-xs text-gray-400 space-y-1.5 ml-5 list-disc">
            <li>HTTPS/TLS encryption for all data in transit</li>
            <li>No sensitive financial data stored on our servers</li>
            <li>Admin panel protected by password authentication</li>
            <li>Database access restricted to server-side code only</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'children',
    title: "Children's Privacy (COPPA)",
    icon: AlertTriangle,
    color: 'text-yellow-400',
    content: (
      <div className="space-y-4">
        <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-yellow-400 font-bold mb-1">Important Notice for Parents &amp; Guardians</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              NeuroVault is designed for general audiences. We comply with the Children&apos;s Online Privacy Protection Act (COPPA) and India&apos;s Digital Personal Data Protection Act (DPDPA) 2023.
            </p>
          </div>
        </div>
        <ul className="text-xs text-gray-400 space-y-2 ml-5 list-disc">
          <li>We do <span className="text-white font-bold">NOT knowingly collect</span> personal information from children under 13 years of age</li>
          <li>No registration, email, phone number, or personally identifiable information is required to use the app</li>
          <li>We do not use geolocation, camera, microphone, contacts, or any sensitive device permissions</li>
          <li>If we discover that a child under 13 has provided personal data, we will <span className="text-white font-bold">promptly delete</span> it upon notification</li>
        </ul>
        <p className="text-xs text-gray-500">
          If you believe a child under 13 has provided us with personal information, please contact us immediately at{' '}
          <a href="mailto:support@neurovault.in" className="text-neon-purple hover:underline">support@neurovault.in</a>.
        </p>
      </div>
    ),
  },
  {
    id: 'third-party',
    title: 'Third-Party Services',
    icon: Globe,
    color: 'text-neon-blue',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400 leading-relaxed">
          NeuroVault uses minimal third-party services:
        </p>
        <div className="grid gap-3">
          <div className="p-3 rounded-xl bg-vault-card border border-vault-border">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-neon-green" />
              <h4 className="text-xs font-bold text-white">PhonePe (Payment Gateway)</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              PhonePe processes your UPI payments. Payment transactions occur directly through the PhonePe app/QR code. We only receive your UTR reference number for manual verification. PhonePe&apos;s own privacy policy applies to transactions processed through their platform.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-vault-card border border-vault-border">
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-4 h-4 text-neon-purple" />
              <h4 className="text-xs font-bold text-white">Hosting &amp; Infrastructure</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              The app is hosted on secure cloud infrastructure with SSL/TLS encryption. No third-party analytics, tracking, or advertising SDKs are integrated.
            </p>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <h4 className="text-xs font-bold text-emerald-400 mb-2">Services We Do NOT Use</h4>
          <div className="flex flex-wrap gap-1.5">
            {['Google Analytics', 'Facebook SDK', 'Firebase', 'Crashlytics', 'Adjust', 'AppsFlyer', 'Unity Ads', 'AdMob', 'IronSource', 'Any Analytics SDK', 'Any Tracking SDK', 'Any Ad Network'].map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'subscription',
    title: 'Subscription & Payment Policy',
    icon: CreditCard,
    color: 'text-neon-green',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400 leading-relaxed">
          NeuroVault offers three subscription tiers. Payments are processed via PhonePe/UPI QR code.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="p-3 rounded-xl bg-vault-card border border-vault-border text-center">
            <p className="text-xs font-bold text-gray-300">Free</p>
            <p className="text-lg font-black text-white mt-1">₹0</p>
            <p className="text-[10px] text-gray-500 mt-1">50 levels, 3 hints, ads for coins</p>
          </div>
          <div className="p-3 rounded-xl bg-neon-blue/5 border border-neon-blue/30 text-center">
            <p className="text-xs font-bold text-neon-blue">Pro</p>
            <p className="text-lg font-black text-white mt-1">₹49<span className="text-xs text-gray-500">/mo</span></p>
            <p className="text-[10px] text-gray-500 mt-1">2x coins, 10 hints, no ads, +10s timer</p>
          </div>
          <div className="p-3 rounded-xl bg-neon-purple/5 border border-neon-purple/30 text-center">
            <p className="text-xs font-bold text-neon-purple">Premium</p>
            <p className="text-lg font-black text-white mt-1">₹99<span className="text-xs text-gray-500">/mo</span></p>
            <p className="text-[10px] text-gray-500 mt-1">3x coins, unlimited hints, +15s timer</p>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-vault-card border border-vault-border">
          <h4 className="text-xs font-bold text-white mb-2">Payment Process</h4>
          <ol className="text-xs text-gray-400 space-y-1.5 ml-5 list-decimal">
            <li>Select your desired plan (Pro or Premium)</li>
            <li>Scan the PhonePe QR code and pay the exact amount via UPI</li>
            <li>Enter your UTR (transaction reference number) in the app</li>
            <li>Our team verifies the payment and activates your subscription (usually within 1-24 hours)</li>
          </ol>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
            <h4 className="text-xs font-bold text-yellow-400 mb-1">Refund Policy</h4>
            <p className="text-xs text-gray-400">All payments are final once verified. Refund requests must be sent to support@neurovault.in within 48 hours of payment. Refunds are subject to review and handled on a case-by-case basis.</p>
          </div>
          <div className="p-3 rounded-xl bg-neon-blue/5 border border-neon-blue/20">
            <h4 className="text-xs font-bold text-neon-blue mb-1">Cancellation</h4>
            <p className="text-xs text-gray-400">Subscriptions can be cancelled anytime from your profile. Your plan remains active until the end of the current billing period (30 days from activation). No partial refunds for unused days.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'rights',
    title: 'Your Rights',
    icon: FileText,
    color: 'text-neon-purple',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400 leading-relaxed">
          Under India&apos;s DPDPA 2023 and applicable data protection laws, you have the following rights regarding your personal data:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: Eye,
              label: 'Right to Access',
              desc: 'Request a copy of all personal data we hold about you.',
              color: 'text-neon-purple',
              bg: 'bg-neon-purple/5 border-neon-purple/20',
            },
            {
              icon: Trash2,
              label: 'Right to Deletion',
              desc: 'Request permanent deletion of your account and all associated data.',
              color: 'text-red-400',
              bg: 'bg-red-500/5 border-red-500/20',
            },
            {
              icon: RefreshCw,
              label: 'Right to Correction',
              desc: 'Update or correct any inaccurate personal data.',
              color: 'text-neon-blue',
              bg: 'bg-neon-blue/5 border-neon-blue/20',
            },
            {
              icon: Shield,
              label: 'Right to Withdraw',
              desc: 'Withdraw consent for data processing at any time.',
              color: 'text-neon-green',
              bg: 'bg-emerald-500/5 border-emerald-500/20',
            },
          ].map((right) => (
            <div key={right.label} className={cn('p-3 rounded-xl border', right.bg)}>
              <div className="flex items-center gap-2 mb-2">
                <right.icon className={cn('w-4 h-4', right.color)} />
                <h4 className="text-xs font-bold text-white">{right.label}</h4>
              </div>
              <p className="text-xs text-gray-400">{right.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          To exercise any of these rights, email us at{' '}
          <a href="mailto:support@neurovault.in" className="text-neon-purple hover:underline">support@neurovault.in</a> with your Player ID. We will respond within 30 days.
        </p>
      </div>
    ),
  },
  {
    id: 'retention',
    title: 'Data Retention',
    icon: Clock,
    color: 'text-yellow-400',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400 leading-relaxed">
          We retain your data only for as long as necessary to provide the service:
        </p>
        <div className="space-y-2">
          {[
            { label: 'Active Account', period: 'Indefinite (until deletion request)', color: 'text-neon-green' },
            { label: 'Game Progress', period: 'Until account deletion', color: 'text-neon-blue' },
            { label: 'Payment Records', period: '2 years (legal compliance)', color: 'text-yellow-400' },
            { label: 'Subscription Data', period: 'Until subscription expiry + 90 days', color: 'text-neon-purple' },
            { label: 'Inactive Account', period: 'After 12 months of inactivity', color: 'text-gray-400' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-vault-card border border-vault-border">
              <span className="text-xs text-gray-300">{item.label}</span>
              <span className={cn('text-xs font-bold', item.color)}>{item.period}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          Upon account deletion, all personal data, game progress, and payment records are permanently erased within 30 days.
        </p>
      </div>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to This Policy',
    icon: RefreshCw,
    color: 'text-neon-blue',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400 leading-relaxed">
          We may update this Privacy Policy from time to time. Here&apos;s how we handle changes:
        </p>
        <ul className="text-xs text-gray-400 space-y-2 ml-5 list-disc">
          <li><span className="text-white font-bold">Notice:</span> We will notify you of material changes via an in-app notification at least 15 days before they take effect</li>
          <li><span className="text-white font-bold">Review Period:</span> This policy is reviewed and updated at least once per year</li>
          <li><span className="text-white font-bold">Last Updated:</span> The &quot;Last Updated&quot; date at the top of this page reflects the most recent revision</li>
          <li><span className="text-white font-bold">Continued Use:</span> Using NeuroVault after changes constitutes acceptance of the updated policy</li>
          <li><span className="text-white font-bold">Archive:</span> Previous versions of this policy are available upon request via email</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'contact',
    title: 'Contact Information',
    icon: Mail,
    color: 'text-neon-green',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400 leading-relaxed">
          For any privacy-related questions, concerns, or requests, please reach out to us:
        </p>
        <div className="p-4 rounded-xl bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 border border-neon-purple/30 text-center">
          <Mail className="w-6 h-6 text-neon-purple mx-auto mb-2" />
          <p className="text-sm font-bold text-white mb-1">NeuroVault Support</p>
          <a
            href="mailto:support@neurovault.in"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white text-sm font-bold tracking-wider hover:opacity-90 transition-opacity"
          >
            <Mail className="w-4 h-4" />
            support@neurovault.in
          </a>
          <p className="text-[10px] text-gray-500 mt-2">We respond within 48 hours</p>
        </div>
        <div className="p-3 rounded-xl bg-vault-card border border-vault-border">
          <h4 className="text-xs font-bold text-white mb-2">Developer Information</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li><span className="text-gray-500">App Name:</span> <span className="text-gray-300">NeuroVault — Extreme Puzzle Lab</span></li>
            <li><span className="text-gray-500">Developer:</span> <span className="text-gray-300">NeuroVault Team</span></li>
            <li><span className="text-gray-500">CEO &amp; Founder:</span> <span className="text-neon-purple font-bold">Arjun Kumar Das</span></li>
            <li><span className="text-gray-500">Category:</span> <span className="text-gray-300">Puzzle / Brain Game</span></li>
            <li><span className="text-gray-500">Governing Law:</span> <span className="text-gray-300">India (DPDPA 2023)</span></li>
            <li><span className="text-gray-500">Data Protection Authority:</span> <span className="text-gray-300">Data Protection Board of India</span></li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'consent',
    title: 'Your Consent',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400 leading-relaxed">
          By downloading, installing, and using NeuroVault, you acknowledge and consent to:
        </p>
        <div className="space-y-2">
          {[
            'Collection and processing of data as described in this Privacy Policy',
            'Storage of game progress and preferences on your device (localStorage)',
            'Storage of subscription and payment records on our secure servers',
            'Use of your UTR reference number solely for payment verification',
            'Display of your username and score on public leaderboards',
            'Potential changes to this policy with prior notification',
            'That data deletion requests are permanent and irreversible',
            'That NeuroVault is provided "as is" without warranties',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
        <div className="p-3 rounded-xl bg-neon-purple/5 border border-neon-purple/20">
          <p className="text-xs text-gray-400 leading-relaxed">
            If you do not agree with any part of this Privacy Policy, please uninstall the app and discontinue use. Continued use of NeuroVault after the effective date constitutes your binding acceptance of this policy.
          </p>
        </div>
      </div>
    ),
  },
];

// ── Main Component ──
export function PrivacyPolicyPage() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['collection']));
  const [allExpanded, setAllExpanded] = useState(false);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedSections(new Set());
    } else {
      setExpandedSections(new Set(sections.map((s) => s.id)));
    }
    setAllExpanded(!allExpanded);
  };

  const scrollToSection = (id: string) => {
    const el = document.querySelector(`[data-section="${id}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setExpandedSections((prev) => new Set(prev).add(id));
    }
  };

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-vault-bg flex flex-col select-none">
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-30 bg-vault-bg/95 backdrop-blur-md border-b border-vault-border px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a href="/" className="p-2 rounded-lg border border-vault-border bg-vault-card text-gray-400 hover:text-white hover:border-neon-purple/50 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </a>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-neon-purple" />
              <h1 className="text-lg font-black tracking-[0.15em] neon-text-purple">PRIVACY POLICY</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
            <span className="text-[10px] text-gray-500 hidden sm:block">{today}</span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleAll}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase text-gray-400 border border-vault-border bg-vault-card hover:text-white hover:border-neon-purple/50 transition-colors cursor-pointer"
            >
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {/* App Info Card */}
          <motion.div variants={itemVariants} className="glass-card rounded-2xl p-5 border border-neon-purple/20 text-center">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block mb-3"
            >
              <Shield className="w-12 h-12 text-neon-purple neon-glow-purple" />
            </motion.div>
            <h2 className="text-lg font-black text-white tracking-wider">NEUROVAULT</h2>
            <p className="text-xs text-gray-500 mt-1">— Extreme Puzzle Lab —</p>
            <p className="text-xs text-gray-400 mt-3 max-w-md mx-auto leading-relaxed">
              This Privacy Policy explains how NeuroVault collects, uses, stores, and protects your personal data when you use our puzzle gaming application.
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-[11px] text-gray-500">Last Updated: <span className="text-gray-400 font-bold">{today}</span></span>
            </div>
          </motion.div>

          {/* Table of Contents */}
          <motion.div variants={itemVariants} className="glass-card rounded-xl p-4 border border-vault-border">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">Table of Contents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="flex items-center gap-2 p-2 rounded-lg text-left text-xs text-gray-400 hover:text-white hover:bg-vault-card/80 transition-all cursor-pointer"
                >
                  <section.icon className={cn('w-3.5 h-3.5 flex-shrink-0', section.color)} />
                  {section.title}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Sections */}
          {sections.map((section) => {
            const isExpanded = expandedSections.has(section.id);
            const SectionIcon = section.icon;
            return (
              <motion.div
                key={section.id}
                data-section={section.id}
                variants={itemVariants}
                className="glass-card rounded-xl border border-vault-border overflow-hidden"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center gap-3 p-4 text-left cursor-pointer hover:bg-vault-card/50 transition-colors"
                >
                  <SectionIcon className={cn('w-5 h-5 flex-shrink-0', section.color)} />
                  <span className="flex-1 text-sm font-bold text-white tracking-wide">{section.title}</span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </motion.div>
                </button>

                {/* Section Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0 border-t border-vault-border/50">
                        <div className="pt-4">
                          {section.content}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* Contact CTA */}
          <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 border border-neon-purple/20 text-center mt-6">
            <Mail className="w-8 h-8 text-neon-purple mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white tracking-wider mb-2">QUESTIONS ABOUT YOUR PRIVACY?</h3>
            <p className="text-xs text-gray-400 mb-4 max-w-sm mx-auto">
              We&apos;re here to help. Reach out to us for any privacy-related questions, data requests, or concerns.
            </p>
            <a
              href="mailto:support@neurovault.in"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white text-sm font-bold tracking-wider hover:opacity-90 transition-opacity"
            >
              <Mail className="w-4 h-4" />
              Contact Us
            </a>
          </motion.div>

          {/* Legal Footer */}
          <motion.div variants={itemVariants} className="text-center py-6 border-t border-vault-border">
            <p className="text-[10px] text-gray-600 leading-relaxed">
              NeuroVault complies with the Digital Personal Data Protection Act (DPDPA) 2023, India.
            </p>
            <p className="text-[10px] text-gray-600 mt-1">
              This app is directed to a general audience and is not specifically directed at children under 13.
            </p>
            <p className="text-[10px] text-gray-700 mt-2">
              &copy; {new Date().getFullYear()} NeuroVault. Founded by <span className="text-neon-purple">Arjun Kumar Das</span>. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
