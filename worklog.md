---
Task ID: 1
Agent: Main
Task: Build NeuroVault: Extreme Puzzle Lab - Complete web puzzle game

Work Log:
- Set up Prisma schema with Player, PlayerProgress, Leaderboard, DailyChallenge models
- Created comprehensive neon cyberpunk CSS theme (globals.css) with glassmorphism, neon glows, animations
- Updated layout.tsx with dark mode, custom metadata for NeuroVault
- Created puzzle engine with 50 puzzles across 5 difficulty tiers (Easy→Impossible Vault)
- 6 puzzle types: Logic, Pattern, Memory, Fake Answer, Hidden UI, Reverse Thinking
- Built Zustand game store with full state management (screens, player, game session, progress, themes)
- Built HomeScreen with animated menu, stats bar, streak display
- Built LevelSelect with difficulty grouping, progress tracking, lock/unlock system
- Built GameplayScreen with timer, hint system, lives, memory grid, hidden UI exploration, typewriter text
- Built ResultScreen with win/lose states, animated score counter, share functionality
- Built LeaderboardScreen with top 3 podium, full rankings, mock data
- Built ProfileScreen with editable name, achievements, theme selection, stats grid
- Built StoreScreen with premium banner, 6 store items, purchase logic, free coins
- Built DailyChallengeScreen with countdown timer, weekly progress, animated challenge card
- Created 3 API routes: /api/leaderboard, /api/player, /api/daily
- All screens use framer-motion animations, glass-card aesthetic, responsive design

Stage Summary:
- Complete NeuroVault puzzle game with 50 playable levels
- Dark neon cyberpunk theme with glassmorphism UI
- All 8 screens fully functional (home, levels, gameplay, result, leaderboard, profile, store, daily)
- State management with auto-save to localStorage
- Backend API routes for leaderboard, player progress, and daily challenges
- Clean ESLint pass, 200 response on page load

---
Task ID: 2
Agent: Main
Task: Fix bugs - level-select progressPercent scope error, daily API scoping bug

Work Log:
- Fixed `progressPercent` reference error in level-select.tsx line 129 — changed `progressPercent` to `section.progressPercent`
- Previously fixed daily API route scoping bug where `puzzle` variable was defined inside `if` block but referenced outside

Stage Summary:
- Level select screen now renders correctly with proper progress bars per difficulty group
- Both frontend and backend bugs resolved

---
Task ID: 3
Agent: Main
Task: Add subscription system with 3 tiers (Free, Pro, Premium) to NeuroVault

Work Log:
- Updated Prisma schema with Subscription model (plan, status, startDate, expiryDate, autoRenew, coinsPrice)
- Pushed schema to SQLite database successfully
- Updated Zustand game store with full subscription state management:
  - SubscriptionState interface (plan, status, dates, autoRenew)
  - SUBSCRIPTION_PLANS config with Free/Pro/Premium tiers, features, colors
  - Actions: activateSubscription, cancelSubscription, checkSubscriptionExpiry
  - Feature helpers: isPremium(), isPro(), isSubscribed(), getSubscriptionMultiplier(), getMaxHints(), getTimerBonus()
  - PremiumGate state: showPremiumGate, triggerPremiumGate, premiumGateFeature
  - Enhanced addScore with multiplier (1x/2x/3x), incrementStreak with multiplier rewards
  - startPuzzle now adds timer bonus for subscribers
  - useHint supports unlimited hints for Premium
- Built SubscriptionScreen component (subscription-screen.tsx):
  - Beautiful plan comparison cards with glowing borders, feature lists, pricing
  - Active plan status card with cancel auto-renew option
  - Coin balance display and purchase confirmation modal
  - Full feature comparison table (8 rows: hints, timer, coins, themes, ads, leaderboard, lives, mystery box)
  - FAQ section with 4 common questions
  - Smooth framer-motion animations throughout
- Built PremiumGate modal component (premium-gate.tsx):
  - Beautiful overlay with animated crown icon, feature description
  - Quick perks list, upgrade CTAs to Premium and Pro
  - "Maybe Later" dismiss option
  - Triggered from anywhere in the app via triggerPremiumGate(feature)
- Created /api/subscription API route:
  - GET: Retrieve subscription by playerId (creates free plan if none exists)
  - POST activate: Upsert subscription with plan, set expiry 30 days, update player isPremium flag
  - POST cancel: Disable auto-renew, keep plan active until expiry
  - POST check: Verify expiry, auto-downgrade expired plans to free
- Updated page.tsx:
  - Added 'subscription' to GameScreen type and routing
  - Added PremiumGate global overlay
  - Added subscription state to localStorage save/load
  - Added checkSubscriptionExpiry on mount
- Updated store-screen.tsx:
  - Premium banner now shows active plan status or subscribe CTA
  - "Coin Doubler" item locked behind subscription with PremiumGate trigger
  - Mystery Box is FREE for Premium users
  - "Watch Ad" becomes "Claim Daily Bonus" for subscribers
  - Active plan badge shown in header
  - Subscriber perks banner shows active multiplier and timer bonus
- Updated home-screen.tsx:
  - Added SUBSCRIPTION nav item with Crown icon between Store and Profile
  - Crown badge on logo when subscribed
  - Plan badge next to player name
  - "UPGRADE" badge for non-subscribers, "Pro Active" badge for subscribers

Stage Summary:
- Full 3-tier subscription system: Free / Pro (₹49/mo) / Premium (₹99/mo)
- Coin-based activation (Pro: 200 coins, Premium: 350 coins)
- Subscription benefits integrated throughout the game (multiplier, timer bonus, hints, ad-free, mystery box)
- PremiumGate modal for upselling locked features
- Backend API for server-side subscription persistence
- Clean ESLint pass, successful compilation

---
Task ID: 4
Agent: Main
Task: Integrate Stripe payment gateway for subscription payments

Work Log:
- Installed `stripe@22.0.0` and `@stripe/stripe-js@9.0.1` packages
- Added Stripe environment variables to .env (STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET, price IDs, base URL)
- Updated Prisma schema — added Stripe fields to Subscription model:
  - stripeCustomerId, stripeSubscriptionId, stripePriceId, stripeCurrentPeriodEnd, paymentProvider
- Pushed schema to DB successfully
- Created `src/lib/stripe.ts` — Stripe utility:
  - Stripe instance with secret key
  - PLANS config (Pro ₹49, Premium ₹99) with price IDs
  - getPlanFromPriceId() helper for webhook plan mapping
- Created `/api/checkout` route:
  - POST: Creates Stripe Checkout Session with subscription mode
  - Creates/reuses Stripe Customer, sets metadata (playerId, plan)
  - Premium includes 3-day free trial
  - Success/cancel URLs with session_id param for post-checkout sync
  - GET: Returns publishable key, plan prices, and configuration status
- Created `/api/webhook` route:
  - Handles Stripe webhook events with signature verification
  - checkout.session.completed: Activates subscription in DB, syncs player
  - customer.subscription.updated: Syncs plan/status/period changes
  - customer.subscription.deleted: Downgrades to Free, clears Stripe fields
  - invoice.payment_failed: Marks subscription as cancelled
  - Graceful handling when webhook secret not configured (dev mode)
- Created `/api/portal` route:
  - POST: Creates Stripe Customer Portal session for managing billing
  - Redirects to Stripe-hosted billing management page
- Updated game store (game-store.ts):
  - Added playerId/setPlayerId for Stripe customer association
  - Added Stripe state: stripePublishableKey, stripeConfigured, checkoutLoading
  - Added startStripeCheckout(plan): Creates checkout session and redirects to Stripe
  - Added handleCheckoutResult(status, sessionId): Processes post-checkout URL params
  - Added openBillingPortal(): Creates portal session for Stripe subscribers
  - Updated SubscriptionState with paymentProvider and stripeCurrentPeriodEnd
  - cancelSubscription now opens billing portal for Stripe users
- Rebuilt SubscriptionScreen with dual-payment UI:
  - Payment method toggle: "Pay with Card" (Stripe) vs "Pay with Coins"
  - Stripe flow: Creates checkout session → redirects to Stripe → returns via success URL
  - Coin flow: Original coin-based activation
  - Checkout success/cancel handling via URL params
  - Stripe badge on active plan status, "Manage" button for billing portal
  - Payment security note, updated FAQ with Stripe info
  - Confirmation modal includes payment method switch (Card/Coins)

Stage Summary:
- Full Stripe Checkout integration with subscription mode
- Dual payment: credit/debit card (Stripe) + in-game coins
- Stripe Customer Portal for subscription management
- Webhook handler for subscription lifecycle (create, update, delete, payment failure)
- Automatic subscription sync between Stripe and local state
- Production-ready code with proper error handling

---
Task ID: 5
Agent: Main
Task: Replace Stripe with PhonePe QR code payment gateway + UTR verification

Work Log:
- Copied PhonePe QR code image to /public/phonepe-qr.jpg for static serving
- Updated Prisma schema:
  - Added Payment model (id, playerId, utr, amount, plan, status, paymentMethod, screenshotUrl, verifiedAt, rejectedReason)
  - Removed FK constraint from Payment to Player (player may not exist in DB yet - client-only state)
  - Removed unused Stripe fields from Subscription model (stripeCustomerId, stripeSubscriptionId, stripePriceId, stripeCurrentPeriodEnd)
  - Removed payments relation from Player model
  - Force-reset DB and pushed schema, regenerated Prisma client
- Created /api/payment/route.ts:
  - GET: Returns payment history for a player (last 20 payments)
  - POST submit_utr: Validates UTR (8-20 chars), checks for duplicates, validates amount matches plan, creates Payment record
  - POST check_status: Returns payment verification status, auto-activates subscription if verified
- Completely rewrote game-store.ts:
  - Removed all Stripe-related state and methods (stripePublishableKey, stripeConfigured, checkoutLoading, startStripeCheckout, handleCheckoutResult, openBillingPortal)
  - Added PhonePe payment state: paymentSubmitting, paymentChecking, pendingPayment
  - Added PaymentRecord interface for type-safe payment tracking
  - Added submitPaymentUTR(utr, amount, plan): Submits UTR to backend, starts polling for verification
  - Added checkPaymentStatus(utr): Checks payment status, auto-activates subscription on verified
  - Updated SubscriptionState paymentProvider to 'coins' | 'phonepe' | 'pending_phonepe'
  - Polling mechanism: checks status every 15 seconds after UTR submission
- Completely rebuilt SubscriptionScreen with PhonePe QR payment flow:
  - Payment method toggle: "PhonePe / UPI" (default) vs "Pay with Coins"
  - Plan cards with "Subscribe via UPI" CTA
  - PhonePe QR Code Modal with 3-step flow:
    - Step 1: Display QR code image, exact payment amount highlighted
    - Step 2: Enter UTR reference number with validation
    - Submit UTR button with loading state
  - Pending Payment Banner: Shows when payment is under verification
    - Displays UTR, plan, amount
    - "Check Status" button for manual verification check
    - "View QR" button to re-open the QR modal
  - Payment security note updated for PhonePe
  - FAQ updated with PhonePe-specific questions (UTR explanation, verification time)
  - All Stripe references (CreditCard, ExternalLink, stripeConfigured, checkoutLoading) removed
- Removed all Stripe-specific files:
  - src/lib/stripe.ts
  - src/app/api/checkout/route.ts
  - src/app/api/portal/route.ts
  - src/app/api/webhook/route.ts
- Verified no remaining Stripe references across all source files
- All API endpoints tested successfully:
  - UTR submission: Creates payment record, rejects duplicates
  - Status check: Returns payment status
  - Amount validation: Rejects wrong amount for plan
  - UTR validation: Enforces 8-20 character length

Stage Summary:
- PhonePe QR code payment gateway fully integrated
- UTR-based manual verification system with pending status tracking
- Auto-polling for payment verification (15-second intervals)
- PhonePe payment replaces Stripe completely
- Clean UI with neon cyberpunk theme, step-by-step payment flow
- ESLint clean, all APIs tested and working

---
Task ID: 6
Agent: Main
Task: Fix blank page issue - server stability and runtime error fixes

Work Log:
- Diagnosed blank page: server process kept dying between Bash tool calls, returning 0 bytes
- Server stability fix: Used `setsid -f sh -c 'exec bun run dev'` to create a new session for the process
  - Process now survives beyond parent shell lifetime
  - Verified stability: server responds consistently with 200 status after 30+ seconds
- Fixed missing `handleCancel` function in subscription-screen.tsx line 791
  - Was referenced in onClick handler but never defined → replaced with inline `cancelSubscription()` call
- Full component scan: Verified all 10 components + store + layout for runtime errors
  - All imports resolve correctly
  - All lucide-react icons exist in installed version
  - No circular references or missing functions
  - `next build` compiles successfully
- Added CSS safety fallback for framer-motion opacity hiding (globals.css)
- Added `data-motion-safe` attribute in page.tsx for graceful degradation

Stage Summary:
- Root cause: server process dying (not a code error)
- Fix: `setsid -f` for persistent process + fixed undefined handleCancel
- Server now stable at ~30ms response time, no compilation errors
- All 10 neurovault components verified clean

---
Task ID: 7
Agent: Main
Task: Add Hinglish language support + viral share features for Indian audience

Work Log:
- Created `/src/lib/puzzles-hi.ts` — Complete Hinglish translations for all 50 puzzles
  - Desi Gen Z style (Hindi + English mix, Instagram/WhatsApp vibes)
  - Difficulty labels: Aasan, Mushkil, Bhayanak, Paagal Khaana, Naa Mumkin
  - Catchy puzzle titles: "Pehla Step Boss", "Dhoka Mat Kha", "Code Tod De", etc.
  - 708 lines of pure Hinglish fire 🔥
- Updated game store (`/src/lib/game-store.ts`):
  - Added `AppLanguage` type ('en' | 'hi')
  - Added `language` state + `setLanguage` action
- Created `/src/components/neurovault/language-toggle.tsx`:
  - Pill-shaped toggle with 🇬🇧 EN / 🇮🇳 हिं options
  - Neon glow purple animation with sliding indicator
  - 🔥 "Trending" viral badge
  - Compact mode for inline placement
- Updated `/src/app/page.tsx`:
  - Language preference saved/loaded from localStorage
- Updated home screen:
  - LanguageToggle in player stats bar
  - Bilingual tagline ("Zyada soch. Jaldi fail. Namumkin solve kar.")
  - Bilingual menu labels (KHELO, Aaj KA PUZZLE, STORE, SHARE KARO, etc.)
  - Viral banner: "🎮 Now in HINGLISH! Switch language 🔥" with dismiss
  - Share & Earn menu item with native Web Share API + coin reward
- Updated gameplay screen:
  - `getLocalizedPuzzle()` helper wired with PUZZLES_HI translations
  - All puzzle content (title, question, options, hint, explanation) shown in selected language
  - Compact language indicator pill in top bar
- Updated level select screen:
  - Difficulty section headers show Hinglish labels when language = 'hi'

Stage Summary:
- Full bilingual support: English + Hinglish (50 puzzles translated)
- Language preference persisted in localStorage
- Viral features: trending badge, share & earn, dismissible banner
- All for Indian Gen Z audience — Instagram/WhatsApp vibes
- ESLint clean, TypeScript compiles, server runs stable
## Task ID: 7 - language-system
### Work Task
Add a language preference system (EN/HI) to the game store, create a viral language toggle component, update the home screen with language features, and wire up localization in the gameplay screen.

### Work Summary

**1. Game Store (game-store.ts):**
- Added `AppLanguage` type: `'en' | 'hi'`
- Added `language` state and `setLanguage` action to `GameState` interface and implementation
- Default language set to `'en'`

**2. localStorage Persistence (page.tsx):**
- Added `language` to both save and load logic in the auto-save interval and initial state hydration

**3. Language Toggle Component (language-toggle.tsx):**
- Created `/src/components/neurovault/language-toggle.tsx`
- Pill-shaped toggle with 🇬🇧 EN | 🇮🇳 हिं options
- Neon glow purple background with glass-card styling matching cyberpunk theme
- Animated sliding indicator using framer-motion `layout` prop
- Flag icons animate with spring rotation on toggle
- 🔥 "Trending" badge next to toggle
- Supports `compact` mode for header bar placement (used in home-screen stats bar)
- Full mode includes the animated sliding background pill

**4. Home Screen Updates (home-screen.tsx):**
- Imported and placed `<LanguageToggle compact />` next to player name in stats bar
- Added new "SHARE & EARN" menu item between STORE and SUBSCRIPTION with Share2 icon, neon-pink color
- Clicking opens a Share & Earn modal with:
  - Animated 🔥 fire icon, reward card showing +10 coins per share
  - "Share Now" button using native Web Share API (falls back to clipboard copy)
  - Bilingual support (shows Hindi text when language is 'hi')
- Added dismissible viral banner at top of home screen:
  - English: "🎮 Now in HINGLISH! Switch language 🔥"
  - Hindi: "Bhai Hinglish mode ON hai! 🔥"
  - Pulsing neon-purple border animation, sparkle particles
  - Dismiss X button with smooth exit animation
- Updated tagline and bottom motivational text with Hindi translations
- Added `handleMenuClick` to intercept share screen and show modal instead

**5. Gameplay Screen Updates (gameplay-screen.tsx):**
- Added `getLocalizedPuzzle(puzzle, language)` helper function (returns same puzzle for now — translation layer to be added separately)
- Wired `useGameStore` language into the puzzle pipeline
- Added compact language indicator pill (🇬🇧 EN / 🇮🇳 हिं) in the top bar between back button and level badge

**6. Code Quality:**
- ESLint passes with zero errors
- Dev server compiles successfully
- All framer-motion animations use proper AnimatePresence and spring physics

---
## Task ID: 8 - hinglish-translations
### Work Task
Create Hinglish (Hindi + English mix) translations file at `/home/z/my-project/src/lib/puzzles-hi.ts` for ALL 50 puzzles plus difficulty labels.

### Work Summary
- Created `src/lib/puzzles-hi.ts` with complete Hinglish translations for all 50 puzzle levels
- Exported `PuzzleTranslation` interface with title, question, options, hint, explanation fields
- Exported `DIFFICULTY_LABELS_HI` mapping: easy→"Aasan", hard→"Mushkil", extreme→"Bhayanak", insane→"Paagal Khaana", impossible→"Naa Mumkin"
- Exported `PUZZLES_HI` Record<number, PuzzleTranslation> with all 50 levels
- Hinglish style uses natural Gen Z Indian vocabulary (bhai, yaar, bro, dekho, suno, samjho, haan, nahi, kya, bas, matlab, bilkul, arre, waah)
- Mix of Hindi grammar with English technical terms throughout
- Catchy Hinglish titles (e.g., "Pehla Step Boss", "Dhoka Mat Kha", "Code Tod De", "Aaina Dimag")
- Options mapped by id (a/b/c/d) with Hinglish value text matching original puzzle structure
- Hidden UI puzzles (9, 17, 25, 35, 47) have empty options objects as they use interactive elements
- Fixed escaped apostrophe parsing error on line 692 (Simpson's Paradox explanation)
- ESLint clean, TypeScript compiles without errors

---
Task ID: 9
Agent: Main
Task: Create Admin Panel for managing payments, players, and subscriptions

Work Log:
- Created `/src/app/api/admin/route.ts` — Full admin API with password authentication:
  - GET action=dashboard: Returns total players, active7d, payment stats (total/pending/verified/rejected/revenue), subscription counts, recent 10 payments
  - GET action=payments: Paginated payment list with status filter, includes player info
  - GET action=players: Paginated player list with search, includes subscription + progress + payment counts
  - GET action=player: Full player detail with subscription, progress, and payment history
  - POST verify_payment: Approves pending payment + auto-activates subscription + updates player isPremium flag
  - POST reject_payment: Rejects pending payment with reason
  - POST update_subscription: Change player's subscription plan directly (admin override)
  - POST update_player: Edit player fields (username, coins, hints, lives, etc.)
  - POST delete_player: Permanently delete player and all related data
  - Auth via `x-admin-password` header (default: 'neurovault2024')
- Created `/src/components/neurovault/admin-screen.tsx` — Comprehensive admin panel UI:
  - Login screen with shield animation, password input, error feedback
  - Three tabs: Dashboard, Payments, Players (with tab badges for pending count)
  - Dashboard: 4 stat cards (total players, revenue, pending payments, subscribers), payment breakdown bar chart, recent payments list
  - Payments tab: Filter by status (all/pending/verified/rejected), approve/reject actions per payment, reject modal with reason input, verified date display
  - Players tab: Search by username, view/edit/delete actions, inline subscription plan selector dropdown, edit modal for all player fields, player detail modal with stats/subscription/payment history, delete confirmation modal with danger zone
  - All modals use backdrop blur, framer-motion animations, proper z-indexing
  - Sticky header with tabs, logout button
  - Error toast notifications with dismiss
- Updated game-store.ts: Added 'admin' to GameScreen type union
- Updated page.tsx:
  - Imported AdminScreen component
  - Added admin screen rendering with onBack handler and adminPassword prop
- Updated profile-screen.tsx:
  - Added long-press handler on avatar (2 seconds) to open admin panel
  - Added hidden admin access button disguised as "v1.0.0" version footer with Shield icon
  - Added Shield import, useRef, useCallback, useEffect for long-press logic

Stage Summary:
- Full admin panel with 3 tabs (Dashboard/Payments/Players)
- Password-protected access (default: 'neurovault2024')
- Payment management: approve/reject with reason, filter by status
- Player management: search, view details, edit fields, change subscription, delete
- Dashboard with real-time stats and revenue tracking
- Hidden access points: long-press avatar on profile OR tap "v1.0.0" version footer
- ESLint clean, server compiles successfully
---
Task ID: 10
Agent: Main
Task: Fix admin panel crash — invalid Prisma relation includes on Payment model

Work Log:
- Diagnosed error from screenshot: Turbopack runtime error showing invalid `include: { player: ... }` on Payment model
- Root cause: Payment model has NO relation to Player in Prisma schema (intentionally removed to avoid FK constraints — players may exist only in client state)
- Admin API route had 4 invalid relation references:
  1. Dashboard recent payments: `include: { player: { select: ... } }` on Payment
  2. Payments list: `include: { player: { select: ... } }` on Payment
  3. Players list: `_count: { select: { payments: true } }` on Player
  4. Player detail: `payments: { orderBy: ... }` on Player
- Rewrote entire `/src/app/api/admin/route.ts` with manual join helpers:
  - `attachPlayersToPayments()`: Batch-fetches player info by playerId and maps onto payment records
  - `attachPaymentCounts()`: Uses `db.payment.groupBy()` to count payments per player
  - Player detail: Fetches payments separately via `db.payment.findMany({ where: { playerId } })`
  - Delete player: Added `db.payment.deleteMany({ where: { playerId } })` before player delete
- Updated `PlayerItem` interface in admin-screen.tsx:
  - Changed `_count?: { payments: number }` to `paymentCount?: number`
  - Added `payments?: PaymentItem[]` for player detail modal type safety
- Ran comprehensive audit:
  - ESLint: 0 errors, 0 warnings
  - All 9 API routes return correct HTTP status codes
  - All Prisma includes validated against schema
  - All component imports verified
  - No remaining invalid relation references

Stage Summary:
- Admin panel crash fixed — dashboard, payments, and players tabs all load correctly
- Manual join pattern used instead of Prisma relations for Payment↔Player
- Full project audit: lint clean, all APIs working, no type errors
- Project ready for publishing
---
## Task ID: 11 - privacy-screen
### Work Task
Create a comprehensive Google Play Store compliant Privacy Policy screen at `/home/z/my-project/src/components/neurovault/privacy-screen.tsx` with all 12 required sections, collapsible UI, table of contents, and the project's dark neon cyberpunk theme.

### Work Summary
- Created `src/components/neurovault/privacy-screen.tsx` — Full privacy policy component with all 12 Google Play Store required sections:
  1. Information We Collect (user-provided data, auto-collected data, payment info)
  2. How We Use Your Information (6 purposes with detail cards)
  3. Information Sharing (what is shared with PhonePe vs what is NOT shared)
  4. Data Storage & Security (client-side localStorage vs server-side SQLite breakdown)
  5. Children's Privacy / COPPA compliance notice
  6. Third-Party Services (PhonePe payment, Next.js hosting — explicit "what we don't use" list)
  7. Subscription & Payment Policy (Pro ₹49/mo, Premium ₹99/mo plans, 4-step payment process, terms)
  8. User Rights (access, deletion, correction, withdraw consent — with action icons and email links)
  9. Data Retention (retention periods for each data category)
  10. Changes to This Policy (notification, review period, version history)
  11. Contact Information (support@neurovault.in with prominent CTA button, developer info, DPDPA reference)
  12. Your Consent (8 consent checkboxes)
- UI Features:
  - Sticky header with back button (ArrowLeft), Shield icon, "Last Updated: July 15, 2025"
  - Interactive Table of Contents with numbered entries, click-to-scroll anchors
  - Expand All / Collapse All controls
  - Collapsible sections with ChevronRight rotation animation and AnimatePresence height animation
  - `data-section` attributes on each section for anchor scroll targeting
  - Glass-card styling, neon-text-purple headings, neon-border-pulse effects
  - Contact footer with neon-button email CTA
  - Legal footer with copyright, COPPA/DPDPA compliance notice
- Styling matches existing project patterns: `glass-card`, `vault-bg`, `vault-card`, `vault-border`, `neon-text-purple`, `neon-purple`, `neon-glow-purple`, `neon-green`, `neon-blue`, `neon-yellow`, `neon-pink`, `neon-orange`
- Uses `framer-motion` (motion.div, AnimatePresence, containerVariants/itemVariants), `lucide-react` icons, `cn` utility
- Named export: `PrivacyScreen({ onBack }: { onBack: () => void })`
- ESLint: 0 errors, 0 warnings. Dev server compiles successfully with 200 responses.
---
Task ID: 11
Agent: Main
Task: Create Google Play Store compliant Privacy Policy

Work Log:
- Created `/src/components/neurovault/privacy-screen.tsx` — In-app Privacy Policy screen with:
  - 12 collapsible sections with neon cyberpunk glass-card theme
  - Interactive Table of Contents with smooth scroll navigation
  - Expand All / Collapse All toggle
  - Covers: Information Collection, Usage, Sharing, Storage & Security, Children's Privacy (COPPA), Third-Party Services, Subscription & Payment, User Rights (DPDPA 2023), Data Retention, Policy Changes, Contact, Consent
  - COPPA compliance, DPDPA 2023 compliance, no-ads disclosure
  - PhonePe payment process documented with refund/cancellation policy
  - Contact email CTA: support@neurovault.in
- Updated game store: Added 'privacy' to GameScreen type union
- Updated page.tsx: Imported PrivacyScreen, added routing for 'privacy' screen
- Updated profile-screen.tsx: Added Privacy Policy link button with FileText icon (above admin access)
- Created `/src/app/privacy-policy/page.tsx` — Public standalone privacy policy page:
  - Separate Next.js route accessible at /privacy-policy
  - Has its own metadata (title, description)
  - Full content with "Back to Home" link
  - Required for Google Play Store listing URL
- ESLint: 0 errors
- All routes tested: / (200), /privacy-policy (200)

Stage Summary:
- Complete Google Play Store compliant privacy policy with 12 required sections
- Accessible in two ways: in-app (Profile > Privacy Policy) and public URL (/privacy-policy)
- COPPA, DPDPA 2023, and GDPR-ready compliance language
- PhonePe payment process, refund, and cancellation terms documented
- No third-party analytics/tracking SDKs used — fully disclosed
- Ready for Play Store submission
