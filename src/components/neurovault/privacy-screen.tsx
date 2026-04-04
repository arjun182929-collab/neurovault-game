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
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ────────────────────────────── animation helpers ────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
};

/* ────────────────────────────── section config ───────────────────────────── */

interface SectionConfig {
  id: string;
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
}

export function PrivacyScreen({ onBack }: { onBack: () => void }) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['info-collect', 'your-consent']));
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setOpenSections(new Set(sections.map((s) => s.id)));
  };

  const collapseAll = () => {
    setOpenSections(new Set());
  };

  const scrollToSection = (id: string) => {
    const el = document.querySelector(`[data-section="${id}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveAnchor(id);
      setOpenSections((prev) => new Set(prev).add(id));
      setTimeout(() => setActiveAnchor(null), 1500);
    }
  };

  /* ──────────────────────── all 12 policy sections ──────────────────────── */

  const sections: SectionConfig[] = [
    /* 1 ── Information We Collect ────────────────────────────────────── */
    {
      id: 'info-collect',
      icon: Eye,
      title: 'Information We Collect',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 leading-relaxed">
            <strong className="text-gray-200">NeuroVault — Extreme Puzzle Lab</strong> collects the following categories of information to provide and improve your gaming experience:
          </p>

          <div className="space-y-3">
            <div className="rounded-xl bg-vault-card/60 border border-vault-border p-4">
              <h4 className="text-xs font-bold tracking-wider uppercase text-neon-purple mb-2">Information You Provide</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-purple mt-1.5 shrink-0" />
                  <span><strong className="text-gray-300">Player Name</strong> — A display name you choose for your profile (stored locally on your device).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-purple mt-1.5 shrink-0" />
                  <span><strong className="text-gray-300">Language Preference</strong> — Your selected app language (English or Hinglish), stored locally.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-purple mt-1.5 shrink-0" />
                  <span><strong className="text-gray-300">Theme Preference</strong> — Your chosen visual theme selection, stored locally.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-purple mt-1.5 shrink-0" />
                  <span><strong className="text-gray-300">Payment UTR Reference</strong> — The Unique Transaction Reference (UTR) number you submit when paying via PhonePe/UPI for subscription verification purposes only.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-vault-card/60 border border-vault-border p-4">
              <h4 className="text-xs font-bold tracking-wider uppercase text-neon-blue mb-2">Information Collected Automatically</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-blue mt-1.5 shrink-0" />
                  <span><strong className="text-gray-300">Game Progress</strong> — Puzzle completion status, scores, streaks, and performance metrics (stored locally and synced to our servers for leaderboard).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-blue mt-1.5 shrink-0" />
                  <span><strong className="text-gray-300">Device & Browser Info</strong> — Basic browser type and screen resolution for responsive layout optimization. No unique device identifiers are collected.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-blue mt-1.5 shrink-0" />
                  <span><strong className="text-gray-300">Usage Patterns</strong> — Time spent per puzzle, hint usage frequency, and game session duration for difficulty balancing.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-vault-card/60 border border-vault-border p-4">
              <h4 className="text-xs font-bold tracking-wider uppercase text-neon-yellow mb-2">Payment Information</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-yellow mt-1.5 shrink-0" />
                  <span><strong className="text-gray-300">Transaction Records</strong> — UTR number, payment amount, plan selected, payment status, and verification timestamp.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-yellow mt-1.5 shrink-0" />
                  <span><strong className="text-red-400">We do NOT collect:</strong> Credit/debit card numbers, bank account details, CVV, PINs, or any payment credentials. All payments are processed externally via PhonePe/UPI.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },

    /* 2 ── How We Use Your Information ───────────────────────────────── */
    {
      id: 'how-we-use',
      icon: Lock,
      title: 'How We Use Your Information',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 leading-relaxed">
            The information we collect is used exclusively for the following purposes:
          </p>
          <div className="grid gap-2">
            {[
              { purpose: 'Provide Core Game Experience', detail: 'Your game progress, scores, and preferences are used to deliver puzzle content, track achievements, and maintain your personalized gaming experience.' },
              { purpose: 'Subscription Management', detail: 'Payment records (UTR references) are used to verify and activate Pro (₹49/mo) and Premium (₹99/mo) subscription plans, manage billing status, and prevent fraudulent claims.' },
              { purpose: 'Leaderboard Functionality', detail: 'Your puzzle scores and player name are displayed on the in-app leaderboard to foster competitive gameplay (no personal identifiers beyond your chosen name).' },
              { purpose: 'App Improvement', detail: 'Anonymized usage patterns (e.g., average completion times, hint usage) help us balance puzzle difficulty and improve game design.' },
              { purpose: 'Customer Support', detail: 'If you contact us via email, we use your communication to resolve issues related to payments, subscriptions, or technical problems.' },
              { purpose: 'Security & Fraud Prevention', detail: 'Payment UTR records are checked for duplicates and amount mismatches to prevent fraudulent subscription claims.' },
            ].map((item) => (
              <div key={item.purpose} className="rounded-xl bg-vault-card/60 border border-vault-border p-3">
                <h4 className="text-sm font-semibold text-gray-200 mb-1">{item.purpose}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-green-500/5 border border-green-500/20 p-3">
            <p className="text-xs text-green-400/80 leading-relaxed">
              <strong className="text-green-400">Important:</strong> We do NOT use your data for advertising, marketing, profiling, or selling to third parties. Your data is used solely to operate and improve NeuroVault.
            </p>
          </div>
        </div>
      ),
    },

    /* 3 ── Information Sharing ───────────────────────────────────────── */
    {
      id: 'info-sharing',
      icon: Shield,
      title: 'Information Sharing',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 leading-relaxed">
            We are committed to protecting your privacy. Here is who we share data with, and who we don&apos;t:
          </p>

          <div className="rounded-xl bg-vault-card/60 border border-vault-border p-4 space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-neon-purple mb-2">Data Shared With</h4>
            <div className="flex items-start gap-2 text-sm text-gray-400">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neon-green/20 text-neon-green text-[10px] font-bold mt-0.5 shrink-0">
                1
              </span>
              <span><strong className="text-gray-300">PhonePe (Payment Verification)</strong> — When you make a UPI payment, the transaction is processed entirely by PhonePe. We only receive the UTR reference number that you manually submit for verification. We do not have access to your PhonePe account, bank details, or payment instruments.</span>
            </div>
          </div>

          <div className="rounded-xl bg-vault-card/60 border border-vault-border p-4 space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-red-400 mb-2">Data NOT Shared With</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                'Third-party advertising networks or ad SDKs',
                'Data brokers or analytics companies',
                'Social media platforms',
                'Government agencies (unless required by law)',
                'Any other third party not listed above',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-vault-card/60 border border-vault-border p-4">
            <h4 className="text-xs font-bold tracking-wider uppercase text-gray-300 mb-2">Public Information</h4>
            <p className="text-sm text-gray-400">
              Your <strong className="text-gray-300">player name</strong> and <strong className="text-gray-300">scores</strong> may be visible to other players on the in-app leaderboard. No other personal information is ever made public.
            </p>
          </div>
        </div>
      ),
    },

    /* 4 ── Data Storage & Security ───────────────────────────────────── */
    {
      id: 'data-storage',
      icon: Lock,
      title: 'Data Storage & Security',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 leading-relaxed">
            Your data is stored using two methods, designed to balance performance and security:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-neon-purple/5 border border-neon-purple/20 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-neon-purple/10">
                  <Lock className="w-4 h-4 text-neon-purple" />
                </div>
                <h4 className="text-sm font-bold text-neon-purple">Client-Side (localStorage)</h4>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li className="flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-gray-500 mt-1.5 shrink-0" />
                  <span>Player name & preferences</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-gray-500 mt-1.5 shrink-0" />
                  <span>Game progress & completed levels</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-gray-500 mt-1.5 shrink-0" />
                  <span>Scores, streaks, coins, hints, lives</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-gray-500 mt-1.5 shrink-0" />
                  <span>Theme & language selection</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-neon-blue/5 border border-neon-blue/20 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-neon-blue/10">
                  <Shield className="w-4 h-4 text-neon-blue" />
                </div>
                <h4 className="text-sm font-bold text-neon-blue">Server-Side (SQLite Database)</h4>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li className="flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-gray-500 mt-1.5 shrink-0" />
                  <span>Subscription plan & status</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-gray-500 mt-1.5 shrink-0" />
                  <span>Payment UTR & verification status</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-gray-500 mt-1.5 shrink-0" />
                  <span>Leaderboard scores</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-gray-500 mt-1.5 shrink-0" />
                  <span>Daily challenge records</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl bg-vault-card/60 border border-vault-border p-4">
            <h4 className="text-xs font-bold tracking-wider uppercase text-gray-300 mb-2">Security Measures</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green mt-1.5 shrink-0" />
                <span><strong className="text-gray-300">No sensitive payment data stored</strong> — We never store card numbers, CVVs, or bank details. Only UTR references for verification.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green mt-1.5 shrink-0" />
                <span><strong className="text-gray-300">HTTPS encryption</strong> — All communications between your device and our servers are encrypted using TLS/HTTPS.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green mt-1.5 shrink-0" />
                <span><strong className="text-gray-300">Minimal data footprint</strong> — We collect only what is essential for the app to function. No analytics SDKs, no tracking cookies, no fingerprinting.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green mt-1.5 shrink-0" />
                <span><strong className="text-gray-300">Admin access controls</strong> — Server-side data is accessible only via authenticated admin panel with password protection.</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },

    /* 5 ── Children&apos;s Privacy (COPPA) ────────────────────────────── */
    {
      id: 'children-privacy',
      icon: AlertTriangle,
      title: "Children's Privacy",
      content: (
        <div className="space-y-4">
          <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <h4 className="text-sm font-bold text-yellow-400">COPPA Compliance Notice</h4>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              NeuroVault is a brain puzzle game <strong className="text-gray-200">accessible to users of all ages</strong>, but it is <strong className="text-gray-200">not specifically directed at children under 13</strong>. We are committed to complying with the Children&apos;s Online Privacy Protection Act (COPPA) and applicable Indian data protection regulations.
            </p>
          </div>

          <div className="space-y-2">
            {[
              { heading: 'No collection from children under 13', body: 'We do not knowingly collect personal information from children under 13 years of age. If we become aware that a child under 13 has provided personal data, we will take steps to delete such information promptly.' },
              { heading: 'Parental access', body: 'If you are a parent or guardian and believe your child under 13 has provided us with personal information, please contact us at support@neurovault.in and we will remove the data immediately.' },
              { heading: 'No behavioral advertising', body: 'We do not serve targeted ads, use behavioral profiling, or employ any advertising SDK that could collect data from minors.' },
              { heading: 'Safe content', body: 'All puzzle content in NeuroVault is family-friendly and does not contain violence, inappropriate language, or adult themes.' },
            ].map((item) => (
              <div key={item.heading} className="rounded-xl bg-vault-card/60 border border-vault-border p-3">
                <h4 className="text-sm font-semibold text-gray-200 mb-1">{item.heading}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },

    /* 6 ── Third-Party Services ──────────────────────────────────────── */
    {
      id: 'third-party',
      icon: FileText,
      title: 'Third-Party Services',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 leading-relaxed">
            NeuroVault uses a minimal number of third-party services to function. Below is a complete and transparent list:
          </p>

          <div className="space-y-3">
            <div className="rounded-xl bg-vault-card/60 border border-vault-border p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <span className="text-base font-black text-purple-400">P</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-200">PhonePe / UPI Payment</h4>
                  <p className="text-[10px] text-gray-500">Payment Processing</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <span><strong className="text-gray-300">Purpose:</strong> Processes in-app subscription payments via UPI QR code scan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <span><strong className="text-gray-300">Data shared:</strong> Only the UTR reference number (manually entered by you). No bank details or payment credentials are shared with us.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <span><strong className="text-gray-300">Their privacy policy:</strong> Please refer to <span className="text-purple-400 underline">phonepe.com/privacy-policy</span> for PhonePe&apos;s own data practices.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-vault-card/60 border border-vault-border p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <span className="text-base font-black text-blue-400">N</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-200">Next.js Hosting</h4>
                  <p className="text-[10px] text-gray-500">Application Hosting</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span><strong className="text-gray-300">Purpose:</strong> Hosts the web application and API server.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span><strong className="text-gray-300">Data shared:</strong> Standard server logs (IP, request path, timestamp) are generated automatically. These logs are not used for profiling or tracking.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl bg-green-500/5 border border-green-500/20 p-3">
            <p className="text-xs text-green-400/80 leading-relaxed">
              <strong className="text-green-400">What we do NOT use:</strong> No advertising SDKs (AdMob, Unity Ads, etc.), no analytics platforms (Google Analytics, Firebase Analytics, Mixpanel, etc.), no social login providers (Google, Facebook, etc.), no crash reporting SDKs, and no third-party tracking scripts.
            </p>
          </div>
        </div>
      ),
    },

    /* 7 ── Subscription & Payment Policy ─────────────────────────────── */
    {
      id: 'subscription-payment',
      icon: FileText,
      title: 'Subscription & Payment Policy',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 leading-relaxed">
            NeuroVault offers optional in-app subscription plans to unlock premium features:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4">
              <h4 className="text-sm font-black text-blue-400 tracking-wider mb-2">PRO PLAN</h4>
              <p className="text-2xl font-black text-white mb-1">₹49<span className="text-sm text-gray-500">/month</span></p>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li>2x coin multiplier</li>
                <li>10 hints per session</li>
                <li>Ad-free experience</li>
                <li>+10s timer bonus</li>
                <li>4 exclusive themes</li>
              </ul>
            </div>
            <div className="rounded-xl bg-neon-purple/5 border border-neon-purple/30 p-4">
              <h4 className="text-sm font-black text-neon-purple tracking-wider mb-2">PREMIUM PLAN</h4>
              <p className="text-2xl font-black text-white mb-1">₹99<span className="text-sm text-gray-500">/month</span></p>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li>3x coin multiplier</li>
                <li>Unlimited hints</li>
                <li>Ad-free experience</li>
                <li>+15s timer bonus</li>
                <li>All themes + daily mystery box</li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl bg-vault-card/60 border border-vault-border p-4 space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-gray-300 mb-2">Payment Process</h4>
            <div className="space-y-3">
              {[
                { step: '1', title: 'Choose Plan', desc: 'Select Pro or Premium from the Subscription screen.' },
                { step: '2', title: 'Scan QR Code', desc: 'Scan the PhonePe UPI QR code displayed in the app and pay the exact amount (₹49 or ₹99).' },
                { step: '3', title: 'Submit UTR', desc: 'Enter the 12-digit UTR (Unique Transaction Reference) from your PhonePe payment receipt.' },
                { step: '4', title: 'Verification', desc: 'Our team verifies the payment (typically within a few minutes to a few hours) and activates your subscription.' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-neon-purple/20 text-neon-purple text-xs font-bold shrink-0">
                    {s.step}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-200">{s.title}</p>
                    <p className="text-xs text-gray-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-vault-card/60 border border-vault-border p-4 space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-gray-300 mb-2">Important Payment Terms</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-yellow mt-1.5 shrink-0" />
                <span><strong className="text-gray-300">Auto-renewal:</strong> Subscriptions auto-renew monthly. You can disable auto-renewal anytime from the Subscription screen.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-yellow mt-1.5 shrink-0" />
                <span><strong className="text-gray-300">Cancellation:</strong> Upon cancellation, your plan remains active until the current billing period expires. No partial refunds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-yellow mt-1.5 shrink-0" />
                <span><strong className="text-gray-300">Refunds:</strong> Since payments are made via PhonePe UPI, refund requests must be raised through PhonePe support. We recommend verifying your plan choice before payment.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-yellow mt-1.5 shrink-0" />
                <span><strong className="text-gray-300">Alternative payment:</strong> You can also activate subscriptions using in-game coins (200 for Pro, 350 for Premium) as a free alternative.</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },

    /* 8 ── User Rights ───────────────────────────────────────────────── */
    {
      id: 'user-rights',
      icon: Eye,
      title: 'User Rights',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 leading-relaxed">
            You have the following rights regarding your personal data:
          </p>

          <div className="space-y-3">
            {[
              {
                icon: Eye,
                title: 'Right to Access',
                color: 'text-neon-blue',
                bgColor: 'bg-neon-blue/10 border-neon-blue/20',
                desc: 'You can request a copy of all personal data we hold about you. This includes your game progress, payment records, and subscription status. Contact us at support@neurovault.in to make a request.',
              },
              {
                icon: Trash2,
                title: 'Right to Deletion',
                color: 'text-red-400',
                bgColor: 'bg-red-500/10 border-red-500/20',
                desc: 'You can request that we delete all your personal data. You can also clear your local game data at any time by clearing your browser\'s localStorage. For server-side data, email us at support@neurovault.in. Deletion requests will be processed within 7 business days.',
              },
              {
                icon: RefreshCw,
                title: 'Right to Correction',
                color: 'text-neon-green',
                bgColor: 'bg-neon-green/10 border-neon-green/20',
                desc: 'You can update your player name and preferences directly in the app via the Profile screen. For corrections to server-side data (e.g., payment records), contact us at support@neurovault.in.',
              },
              {
                icon: AlertTriangle,
                title: 'Right to Withdraw Consent',
                color: 'text-neon-yellow',
                bgColor: 'bg-neon-yellow/10 border-neon-yellow/20',
                desc: 'You can withdraw consent for data processing at any time by deleting your account. Your subscription benefits will cease upon data deletion. Local data can be cleared independently by clearing browser storage.',
              },
            ].map((right) => (
              <div key={right.title} className={cn('rounded-xl border p-4', right.bgColor)}>
                <div className="flex items-center gap-2 mb-2">
                  <right.icon className={cn('w-4 h-4', right.color)} />
                  <h4 className={cn('text-sm font-bold', right.color)}>{right.title}</h4>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{right.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-vault-card/60 border border-vault-border p-4">
            <h4 className="text-xs font-bold tracking-wider uppercase text-gray-300 mb-2">How to Exercise Your Rights</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              To exercise any of the above rights, send an email to{' '}
              <a href="mailto:support@neurovault.in" className="text-neon-purple underline underline-offset-2 hover:text-neon-purple/80 transition-colors">
                support@neurovault.in
              </a>{' '}
              with your <strong className="text-gray-300">player name</strong> and <strong className="text-gray-300">player ID</strong> (found in the Profile screen). We will respond within 7 business days.
            </p>
          </div>
        </div>
      ),
    },

    /* 9 ── Data Retention ────────────────────────────────────────────── */
    {
      id: 'data-retention',
      icon: RefreshCw,
      title: 'Data Retention',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 leading-relaxed">
            We retain your data only for as long as necessary to provide the service:
          </p>

          <div className="space-y-2">
            {[
              { type: 'Client-side data (localStorage)', period: 'Until you clear browser storage or uninstall the PWA', note: 'You have full control over this data and can clear it anytime from browser settings.' },
              { type: 'Subscription records', period: 'Duration of active subscription + 12 months', note: 'Retained for billing verification and dispute resolution. Deleted 12 months after subscription expires or is cancelled.' },
              { type: 'Payment / UTR records', period: '24 months from payment date', note: 'Retained for fraud prevention and transaction verification as required under Indian financial regulations.' },
              { type: 'Leaderboard scores', period: 'Until account deletion or 36 months of inactivity', note: 'Inactive accounts (no login for 36+ months) are anonymized and removed from the leaderboard.' },
              { type: 'Daily challenge records', period: '12 months', note: 'Historical daily challenge data is retained for 12 months for potential future features, then automatically purged.' },
            ].map((item) => (
              <div key={item.type} className="rounded-xl bg-vault-card/60 border border-vault-border p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-gray-200">{item.type}</h4>
                  <span className="text-[10px] font-bold text-neon-purple whitespace-nowrap bg-neon-purple/10 px-2 py-0.5 rounded-full border border-neon-purple/20">
                    {item.period}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{item.note}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-3">
            <p className="text-xs text-yellow-400/80 leading-relaxed">
              <strong className="text-yellow-400">Data Minimization:</strong> We automatically purge expired and unnecessary data. When your data is no longer needed for the purposes described in this policy, it is securely deleted.
            </p>
          </div>
        </div>
      ),
    },

    /* 10 ── Changes to This Policy ───────────────────────────────────── */
    {
      id: 'policy-changes',
      icon: RefreshCw,
      title: 'Changes to This Policy',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 leading-relaxed">
            We may update this Privacy Policy from time to time. Here is how we handle changes:
          </p>

          <div className="space-y-2">
            {[
              { heading: 'Notification of Changes', body: 'When we make material changes to this policy, we will update the "Last Updated" date at the top and notify you via an in-app banner or notification within the game.' },
              { heading: 'Review Period', body: 'We recommend reviewing this policy periodically. Continued use of NeuroVault after changes are posted constitutes acceptance of the updated policy.' },
              { heading: 'Version History', body: 'Previous versions of this policy are archived and available upon request by emailing support@neurovault.in.' },
              { heading: 'Material Changes', body: 'If a change significantly affects how we use your personal data (e.g., new data collection, new sharing partners), we will provide at least 15 days advance notice before the changes take effect.' },
            ].map((item) => (
              <div key={item.heading} className="rounded-xl bg-vault-card/60 border border-vault-border p-3">
                <h4 className="text-sm font-semibold text-gray-200 mb-1">{item.heading}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },

    /* 11 ── Contact Information ──────────────────────────────────────── */
    {
      id: 'contact',
      icon: Mail,
      title: 'Contact Information',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 leading-relaxed">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please reach out:
          </p>

          <div className="rounded-xl bg-neon-purple/5 border border-neon-purple/20 p-5 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-neon-purple/10 border border-neon-purple/30">
              <Mail className="w-7 h-7 text-neon-purple" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-300 mb-1">Email Support</h4>
              <a
                href="mailto:support@neurovault.in"
                className="text-lg font-black text-neon-purple hover:text-neon-purple/80 transition-colors underline underline-offset-4 decoration-neon-purple/30 hover:decoration-neon-purple/60"
              >
                support@neurovault.in
              </a>
            </div>
            <p className="text-xs text-gray-500">
              We typically respond within 24-48 business hours.
            </p>
          </div>

          <div className="rounded-xl bg-vault-card/60 border border-vault-border p-4 space-y-2">
            <h4 className="text-xs font-bold tracking-wider uppercase text-gray-300 mb-2">Developer Information</h4>
            <div className="space-y-1.5 text-sm text-gray-400">
              <p><strong className="text-gray-300">App Name:</strong> NeuroVault — Extreme Puzzle Lab</p>
              <p><strong className="text-gray-300">Developer:</strong> NeuroVault Team</p>
              <p><strong className="text-gray-300">CEO &amp; Founder:</strong> <span className="text-neon-purple font-bold">Arjun Kumar Das</span></p>
              <p><strong className="text-gray-300">Platform:</strong> Web App (PWA)</p>
              <p><strong className="text-gray-300">Support:</strong> support@neurovault.in</p>
            </div>
          </div>

          <div className="rounded-xl bg-vault-card/60 border border-vault-border p-4">
            <h4 className="text-xs font-bold tracking-wider uppercase text-gray-300 mb-2">Data Protection Authority</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              If you are located in India and believe your data protection rights have been violated, you may also file a complaint with the <strong className="text-gray-300">Data Protection Board of India</strong> under the Digital Personal Data Protection Act, 2023 (DPDPA).
            </p>
          </div>
        </div>
      ),
    },

    /* 12 ── Your Consent ─────────────────────────────────────────────── */
    {
      id: 'your-consent',
      icon: Shield,
      title: 'Your Consent',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 leading-relaxed">
            By using NeuroVault — Extreme Puzzle Lab, you acknowledge and consent to the following:
          </p>

          <div className="space-y-2">
            {[
              'You have read and understood this Privacy Policy in its entirety.',
              'You consent to the collection, storage, and use of your data as described in this policy.',
              'You understand that your player name and scores may be visible on the in-app leaderboard.',
              'You understand that payment verification is performed via UTR reference submitted to PhonePe/UPI, and that no payment credentials are stored by us.',
              'You acknowledge that the app may store data locally on your device (localStorage) and on our secure servers.',
              'You understand that you can withdraw consent at any time by deleting your data and discontinuing use of the app.',
              'You agree to review this policy periodically for updates and changes.',
              'You confirm that you are at least 13 years of age, or that you have parental/guardian consent to use this app.',
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-xl bg-vault-card/60 border border-vault-border p-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neon-green/10 text-neon-green text-[10px] font-bold mt-0.5 shrink-0">
                  ✓
                </span>
                <p className="text-sm text-gray-400 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-neon-purple/5 border border-neon-purple/20 p-4 text-center">
            <p className="text-sm text-gray-400 leading-relaxed">
              By continuing to use NeuroVault after reading this policy, you indicate your acceptance. If you do not agree with any part of this policy, please discontinue use of the app and contact us at{' '}
              <a href="mailto:support@neurovault.in" className="text-neon-purple underline underline-offset-2">
                support@neurovault.in
              </a>{' '}
              to request data deletion.
            </p>
          </div>
        </div>
      ),
    },
  ];

  /* ──────────────────────────────────── render ─────────────────────────── */

  return (
    <div className="min-h-screen bg-vault-bg text-white flex flex-col">
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-40 bg-vault-bg/80 backdrop-blur-xl border-b border-vault-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="p-2 rounded-lg border border-vault-border bg-vault-card text-gray-400 hover:text-white hover:border-neon-purple/50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="p-1.5 rounded-lg bg-neon-purple/10 border border-neon-purple/20">
                <Shield className="w-5 h-5 text-neon-purple" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-black tracking-widest uppercase neon-text-purple truncate">
                  Privacy Policy
                </h1>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-gray-600" />
                  <p className="text-[10px] text-gray-600 font-mono">
                    Last Updated: July 15, 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto px-4 py-6 space-y-5"
        >
          {/* ── Intro Card ── */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-5 text-center"
            style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.1)' }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-neon-purple/10 border border-neon-purple/30 mb-3">
              <Shield className="w-6 h-6 text-neon-purple" />
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-wider uppercase text-white mb-2">
              NeuroVault — Extreme Puzzle Lab
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-md mx-auto">
              Your privacy matters to us. This policy explains what data we collect, why we collect it, and how we protect it.
              NeuroVault is designed with minimal data collection and maximum transparency.
            </p>
          </motion.div>

          {/* ── Table of Contents ── */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold tracking-wider uppercase text-gray-300">Table of Contents</h3>
              <div className="flex gap-1.5">
                <button
                  onClick={expandAll}
                  className="text-[10px] text-neon-purple hover:text-neon-purple/80 font-semibold px-2 py-0.5 rounded-md bg-neon-purple/10 hover:bg-neon-purple/20 transition-colors cursor-pointer"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="text-[10px] text-gray-500 hover:text-gray-300 font-semibold px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Collapse
                </button>
              </div>
            </div>
            <div className="grid gap-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isOpen = openSections.has(section.id);
                const isActive = activeAnchor === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      'flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer group',
                      isActive
                        ? 'bg-neon-purple/10 border border-neon-purple/30'
                        : 'hover:bg-white/5 border border-transparent',
                    )}
                  >
                    <Icon className={cn(
                      'w-3.5 h-3.5 shrink-0 transition-colors',
                      isActive ? 'text-neon-purple' : 'text-gray-600 group-hover:text-gray-400',
                    )} />
                    <span className={cn(
                      'text-xs transition-colors flex-1',
                      isActive ? 'text-neon-purple font-semibold' : 'text-gray-400 group-hover:text-gray-200',
                    )}>
                      {section.title}
                    </span>
                    <span className="text-[9px] text-gray-600 font-mono">{String(sections.indexOf(section) + 1).padStart(2, '0')}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* ── Policy Sections ── */}
          {sections.map((section) => {
            const Icon = section.icon;
            const isOpen = openSections.has(section.id);
            const sectionIndex = sections.indexOf(section) + 1;

            return (
              <motion.div
                key={section.id}
                variants={itemVariants}
                data-section={section.id}
                className="glass-card rounded-2xl overflow-hidden"
              >
                {/* Section Header — collapsible toggle */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center gap-3 px-4 sm:px-5 py-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-vault-card border border-vault-border group-hover:border-neon-purple/30 transition-colors shrink-0">
                    <Icon className="w-4 h-4 text-neon-purple" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-600">
                        {String(sectionIndex).padStart(2, '0')}
                      </span>
                      <h3 className="text-sm font-bold tracking-wider uppercase text-gray-200 truncate">
                        {section.title}
                      </h3>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </motion.div>
                </button>

                {/* Section Content — collapsible */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-vault-border">
                        {section.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* ── Contact Footer ── */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-5 text-center"
            style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.08)' }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Mail className="w-5 h-5 text-neon-purple" />
              <h3 className="text-sm font-bold tracking-wider uppercase text-gray-300">
                Questions or Concerns?
              </h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              We&apos;re here to help with any privacy-related questions.
            </p>
            <a
              href="mailto:support@neurovault.in"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm tracking-wider uppercase text-white neon-button cursor-pointer transition-all hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)',
              }}
            >
              <Mail className="w-4 h-4" />
              support@neurovault.in
            </a>
          </motion.div>

          {/* ── Legal Footer ── */}
          <motion.div
            variants={itemVariants}
            className="text-center py-6 space-y-2"
          >
            <div className="flex items-center justify-center gap-1.5 text-gray-600">
              <Shield className="w-3 h-3" />
              <span className="text-[10px] font-medium tracking-wider uppercase">
                NeuroVault — Extreme Puzzle Lab
              </span>
            </div>
            <p className="text-[10px] text-gray-700">
              © {new Date().getFullYear()} NeuroVault. Founded by <span className="text-neon-purple">Arjun Kumar Das</span>. All rights reserved.
            </p>
            <p className="text-[10px] text-gray-700">
              This policy is compliant with Google Play Store requirements, COPPA, and DPDPA 2023.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
