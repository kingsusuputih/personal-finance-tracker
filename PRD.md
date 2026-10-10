# PRD: Personal Finance Tracker
**Version:** 1.6.0
**Status:** Implemented (Recap, Additional Income, Smart Grouping, Multi-Session AI Chat in Google Sheets, Custom Budgets, Day Progress, Ledger Search & Pagination, Modal Edit, Web Push, PWA, Modern Landing Redesign, Centered Toast System)
**Last Updated:** 2026-10-10
**Prepared for:** AI Agent CLI Execution

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [Architecture Decision Records (ADR)](#3-architecture-decision-records-adr)
4. [Tech Stack](#4-tech-stack)
5. [Folder Structure](#5-folder-structure)
6. [Environment Variables](#6-environment-variables)
7. [Feature Specifications](#7-feature-specifications)
8. [Data Schema (Google Sheets)](#8-data-schema-google-sheets)
9. [Business Logic & Formulas](#9-business-logic--formulas)
10. [UI/UX Specification](#10-uiux-specification)
11. [Execution Plan (Phased)](#11-execution-plan-phased)
12. [Constraints & Rules](#12-constraints--rules)

---

## 1. Project Overview

**Product Name:** Finance Tracker
**Type:** Serverless Personal Finance Dashboard (SPA)
**Target User:** Individual users who want to track income & expenses and calculate financial fund targets — without relying on a third-party backend.

### Problem Statement
Most personal finance apps either cost money, store data on a centralized server (privacy risk), or require complex setup. This app solves that by using the user's own Google Drive as a zero-cost, private database.

### Solution
A React-based SPA that authenticates via Google SSO, automatically provisions a spreadsheet in the user's own Google Drive, and performs all read/write operations directly against that spreadsheet using the Google Sheets API.

---

## 2. Goals & Success Metrics

| Goal | Metric |
|---|---|
| Zero infrastructure cost | $0/month — no backend server, no paid DB |
| Full data privacy | Each user's data lives only in their own Google Drive |
| Fast load time | Initial load < 3 seconds on 4G |
| Mobile responsive | Usable on 375px viewport (iPhone SE) |
| Auth reliability | Google OAuth PKCE flow — no client secret exposed |

---

## 3. Architecture Decision Records (ADR)

### ADR-001: Decentralized Database via Google Sheets
- **Decision:** Each authenticated user gets their own Google Spreadsheet created automatically inside their Google Drive.
- **Rationale:** Zero cost, full privacy, no centralized data risk.
- **Consequence:** App must handle first-time setup (spreadsheet creation) gracefully.

### ADR-002: PKCE OAuth Flow (No Backend)
- **Decision:** Use OAuth 2.0 with PKCE via `@react-oauth/google`. No client secret in the codebase.
- **Rationale:** Client secret must never be exposed in a public SPA. PKCE is the correct standard for public clients.
- **Consequence:** Only `VITE_GOOGLE_CLIENT_ID` is required as an env variable. Access tokens are persisted to `localStorage` (`pft_token`, `pft_user`) so the session survives a page refresh. Trade-off accepted: the app is a public SPA that renders no user-generated HTML (React auto-escapes output), limiting XSS exposure. Tokens are revoked on logout.

### ADR-003: Google Drive Scope — `drive.file` Only
- **Decision:** Request `https://www.googleapis.com/auth/drive.file` instead of full `drive` scope.
- **Rationale:** `drive.file` only grants access to files the app itself created. This is the minimum necessary privilege and passes Google's OAuth verification more easily.
- **Consequence:** The app can only access the spreadsheet it created — not the user's entire Drive.

### ADR-004: State Management — Zustand
- **Decision:** Use Zustand for global state (auth, finance data).
- **Rationale:** Lightweight, no boilerplate, works well for this scale.

### ADR-005: Pseudonymous User Registry via Supabase (Social Proof & User Count)
- **Decision:** Use Supabase Edge Functions + private Postgres table in `ap-southeast-1` to maintain an anonymous count of unique Google accounts using an irreversible cryptographic hash: `identity_hash = HMAC-SHA256(REGISTRY_PEPPER, google_sub)`.
- **Rationale:** The app's financial data is 100% decentralized in user Google Sheets, meaning no central count existed. Storing only a cryptographic hash protects user privacy while allowing an authentic, deduplicated community count and optional masked name (`H*** A***`) social proof.
- **Consequence:** Zero financial data touches Supabase. RLS strictly denies anon/authenticated access; only the Edge Function interacts with the database. Users can opt out or delete their registry record in Settings.

---

## 4. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | ^18.x |
| Build Tool | Vite | ^5.x |
| Styling | Tailwind CSS | ^4.x |
| Auth | @react-oauth/google | latest |
| Financial Database | Google Sheets API | v4 |
| Storage | User's Google Drive | — |
| Community Registry | Supabase Postgres & Edge Functions | ap-southeast-1 |
| State Management | Zustand | ^4.x |
| Charts | Apache ECharts | ^6.x (modular import) |
| Routing | React Router DOM | ^6.x |
| Deployment | Vercel | Free tier |
| Database | Google Sheets API | v4 |
| Storage | User's Google Drive | — |

---

## 5. Folder Structure

```
finance-tracker/
├── public/
│   └── favicon.ico
│
├── src/
│   ├── api/
│   │   ├── googleAuth.js           # OAuth token management, PKCE helpers
│   │   ├── googleSheets.js         # CRUD: read rows, append rows, update cells
│   │   └── googleDrive.js          # Find or create "Finance_Tracker_Data" spreadsheet
│   │
│   ├── components/
│   │   ├── ui/                     # Primitives: Button, Card, Badge, Spinner, Modal
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── auth/
│   │   │   └── LoginButton.jsx
│   │   ├── ledger/
│   │   │   ├── IncomeForm.jsx
│   │   │   ├── ExpenseForm.jsx
│   │   │   └── TransactionTable.jsx
│   │   └── dashboard/
│   │       ├── AllocationCard.jsx   # 50/30/20 rule display
│   │       ├── FundTargetCard.jsx   # Emergency & Retirement fund targets
│   │       └── SpendingChart.jsx    # Monthly spending bar/pie chart
│   │
│   ├── hooks/
│   │   ├── useAuth.js              # Expose: user, accessToken, login(), logout()
│   │   ├── useSpreadsheet.js       # Expose: sheetId, transactions, addTransaction()
│   │   └── useFinanceCalc.js       # Expose: allocations, fundTargets (derived from store)
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── LedgerPage.jsx
│   │
│   ├── store/
│   │   ├── authStore.js            # Zustand: { user, accessToken, setAuth, clearAuth }
│   │   └── financeStore.js         # Zustand: { transactions, income, setData }
│   │
│   ├── utils/
│   │   ├── financeFormulas.js      # Pure functions, no side effects
│   │   └── sheetsHelpers.js        # Row serialization/deserialization helpers
│   │
│   ├── constants/
│   │   └── sheets.js               # SPREADSHEET_NAME, SHEET_NAMES, COLUMN_HEADERS
│   │
│   ├── App.jsx                     # Route definitions + auth guard
│   ├── main.jsx                    # GoogleOAuthProvider wrapper
│   └── index.css                   # Tailwind directives
│
├── .env.local                      # Local dev env (gitignored)
├── .env.example                    # Template, committed to repo
├── .gitignore
├── tailwind.config.js
├── vite.config.js
├── vercel.json                     # SPA redirect config
└── package.json
```

---

## 6. Environment Variables

### `.env.example` (commit this file)
```env
# Google OAuth 2.0 Client ID (from Google Cloud Console)
# NEVER add GOOGLE_CLIENT_SECRET here — this is a public SPA
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

### `.env.local` (gitignored, for development)
```env
VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
```

### `.env.production` (committed — client ID is public)
Vite loads this file automatically for `vite build`. Committing it guarantees the production build carries a valid `client_id` without dashboard configuration. Optionally set the same value in Vercel dashboard — if both exist, the Vercel variable wins.
```env
VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
```

### Vercel Environment Variables (set in dashboard, optional)
| Key | Value |
|---|---|
| `VITE_GOOGLE_CLIENT_ID` | OAuth Client ID from GCP |

---

## 7. Feature Specifications

### Feature 1: Authentication Module

**User Story:** As a user, I want to log in with my Google account so the app can access my Drive securely.

**Acceptance Criteria:**
- [ ] Login page shows a "Sign in with Google" button
- [ ] On click, triggers Google OAuth PKCE popup/redirect
- [ ] Requested scopes: `email`, `profile`, `spreadsheets`, `drive.file`
- [ ] On success: store `user` object and `accessToken` in Zustand `authStore` (memory only)
- [ ] On success: redirect to `/dashboard`
- [ ] Logout clears Zustand state and revokes token
- [ ] If user is not authenticated, any route redirects to `/login`
- [ ] Access token is persisted to `localStorage` (restored on boot), never written to server logs, and revoked on logout

**Components:** `LoginPage.jsx`, `LoginButton.jsx`, `useAuth.js`, `authStore.js`, `googleAuth.js`

---

### Feature 2: Spreadsheet Auto-Provisioning

**User Story:** As a user, on first login, I want the app to automatically set up my personal finance spreadsheet in my Google Drive.

**Acceptance Criteria:**
- [ ] After successful auth, app calls `googleDrive.js` to search for a file named `Finance_Tracker_Data` in the user's Drive
- [ ] If not found: create a new Google Spreadsheet with that name
- [ ] On creation, initialize the spreadsheet with the correct sheet tabs and headers (see Data Schema)
- [ ] If already found: use the existing spreadsheet ID
- [ ] Store `spreadsheetId` in Zustand `financeStore`
- [ ] Show loading state while provisioning

**Files:** `googleDrive.js`, `googleSheets.js`, `financeStore.js`, `useSpreadsheet.js`

---

### Feature 3: Ledger Module — Income Input

**User Story:** As a user, I want to input my monthly income so the app can calculate my financial allocations.

**Acceptance Criteria:**
- [ ] Form field: Month (month picker, defaults to current month)
- [ ] Form field: Total Monthly Income (numeric, in IDR)
- [ ] On submit: write a row to the `Income` sheet in the user's spreadsheet
- [ ] Validation: amount must be > 0
- [ ] Show success toast on save
- [ ] Saved income is immediately reflected in the dashboard calculations

**Sheet written to:** `Income` (see Data Schema)
**Components:** `IncomeForm.jsx`, `LedgerPage.jsx`

---

### Feature 4: Ledger Module — Expense Input & Transaction Management

**User Story:** As a user, I want to record my daily/monthly expenses by category, search through transaction history, navigate pages, and edit transactions via a clean popup modal.

**Acceptance Criteria:**
- [x] Form fields:
  - Date (date picker, defaults to today)
  - Category (dropdown: Needs, Lifestyle, Investment)
  - Description (text, optional)
  - Amount (numeric, in IDR)
  - Custom Group Override (optional, manual grouping)
- [x] On submit: append a row to the `Expenses` sheet
- [x] Validation: amount > 0, category required
- [x] Show success toast on save
- [x] Real-time client-side transaction search filtering across description, category, group, date, and amount
- [x] Transaction table pagination (15 records per page) with previous/next navigation and record count indicators
- [x] Editing a transaction opens a focused Modal dialog (`Modal.jsx`), leaving the main creation workspace clean and uncluttered

**Sheet written to:** `Expenses` (see Data Schema)
**Components:** `ExpenseForm.jsx`, `TransactionTable.jsx`, `LedgerPage.jsx`, `Modal.jsx`

---

### Feature 5: Financial Formula Calculator & Dashboard

**User Story:** As a user, I want to see a clear breakdown of how my income should be allocated, my day progress in the active payday cycle, and what my financial targets are.

**Acceptance Criteria:**
- [x] Dashboard fetches current month's income and all-time expenses from Sheets
- [x] Active payday cycle day progress indicator (`getCycleDayProgress`) showing current day of cycle and days remaining
- [x] Display **Allocation Cards** (based on monthly income):
  - Needs: 50% of income → show target amount + actual spending in "Needs" category
  - Investments: 30% of income → show target amount + actual spending in "Investment" category
  - Lifestyle: 20% of income → show target amount + actual spending in "Lifestyle" category
- [x] Display **Fund Target Cards** (based on total monthly expenses):
  - Emergency Fund Target = 6 × Total Monthly Expenses
  - Retirement Fund Target = 300 × Total Monthly Expenses
- [x] Display **Spending Chart**: Apache ECharts donut (pie) chart showing expense breakdown by category for current month
- [x] All currency displayed in IDR format (`Rp 1.000.000`)

**Components:** `DashboardPage.jsx`, `AllocationCard.jsx`, `FundTargetCard.jsx`, `SpendingChart.jsx`
**Hook:** `useFinanceCalc.js`, `dateTime.js`

---

### Feature 6: Historical Recap & Savings Tracker

**User Story:** As a user, I want to review past payday cycles to see if my spending exceeded income (surplus vs deficit), how much money remains available to save/invest, track cycle completion, and monitor total accumulated money placed in investments.

**Acceptance Criteria:**
- [x] Dedicated `/recap` page accessible from sidebar and bottom navigation
- [x] Cycle selector allowing users to switch between historical and current payday cycles
- [x] Displays date bounds (e.g. 25 Aug – 24 Sep) and indicates if it is the active cycle along with cycle day progress / completed badge
- [x] Calculates:
  - Total Income: Main Salary (latest entry for the cycle) + Additional Incomes in cycle
  - Consumption Expenses: Needs + Lifestyle expenses
  - Period Investment: Total `Investment` category contributions during cycle
  - Surplus/Deficit Before Investment: Total Income − Consumption Expenses
  - Remaining After Investment: Total Income − Consumption Expenses − Investment Expenses
  - Cumulative Saved: Total sum of all recorded `Investment` entries up to the cycle cutoff
- [x] Does not double-count investment expenses as consumption

**Components:** `RecapPage.jsx`
**Hook:** `useFinanceCalc.js`, `financeFormulas.js`, `dateTime.js`

---

### Feature 7: Additional Income & Smart Expense Grouping

**User Story:** As a user, I want to log extra income sources (bonuses, side jobs, ride-hailing) separately from my primary salary, and see my expenses automatically grouped by item (e.g. Cigarettes, Coffee) with the ability to override groups.

**Acceptance Criteria:**
- [ ] Ledger includes tabs for "Gaji Utama" (Main Salary) and "Pemasukan Tambahan" (Additional Income)
- [ ] Additional income records: date, source name, amount, created_at, and unique ID
- [ ] Automatic keyword-based item grouping (e.g. "beli rokok", "rokok surya" → "Rokok") within category boundaries without splitting mixed transactions
- [ ] Expense form supports manual `group_override` field to customize or separate groups
- [ ] Transaction table displays group override tags when present

**Components:** `IncomeForm.jsx`, `ExpenseForm.jsx`, `TransactionTable.jsx`
**Utilities:** `expenseGrouping.js`, `sheetsHelpers.js`

---

### Feature 8: AI Financial Assistant (Gemini Free Tier & Google Sheets Multi-Session Chat History)

**User Story:** As a user, I want an intelligent chatbot inside the member area to analyze my financial numbers, draft new transactions with explicit confirmation, and maintain persistent multi-session chat history saved exclusively in my own Google Sheet for total privacy.

**Acceptance Criteria:**
- [x] Dedicated `/chat` route with mobile & desktop navigation links
- [x] Multi-session chat management: Desktop session sidebar and mobile session drawer with `+ Chat Baru` button
- [x] Auto-titling of chat sessions based on the user's opening prompt
- [x] Persistent chat history stored directly in user's own Google Sheet tab (`ChatHistory`) with 8 columns; zero chat transcripts saved on servers
- [x] Ability to switch between previous conversations, delete specific chat sessions, or clear all history with atomic row deletion
- [x] Explicit consent dialog previewing financial metrics before sending data to AI
- [x] Client calls Supabase Edge Function (`/api/chat`) with Google OAuth bearer token
- [x] Server validates token audience and expiry before calling Google Gemini API (gemini-3.5-flash-lite / configurable GEMINI_MODEL)
- [x] Displays transaction proposals as editable cards; user must explicitly click "Confirm & save" to write to Google Sheets
- [x] Rate limit & quota guard (429 handling) with countdown timer when retry headers are present; no paid fallback
- [x] Multi-period historical analysis & comparison via period selector dropdowns
- [x] Rich markdown bold text rendering (`**bold**`) in assistant message bubbles

**Components:** `ChatPage.jsx`, `api/chat.js`, `api/googleSheets.js`, `utils/chatContext.js`, `utils/chatFormatting.js`
**Backend:** `supabase/functions/chat/index.ts`

---

### Feature 9: Custom Budgets per Cycle

**User Story:** As a user, I want to create manual spending limits for specific expense groups within a category for the current cycle without changing the 50/30/20 allocation.

**Acceptance Criteria:**
- [x] Add/edit/delete custom budget entries stored in a dedicated `Budgets` sheet
- [x] Automatic spending attribution based on existing keyword-based and custom expense groups
- [x] Strict category and date range matching for active cycle bounds
- [x] Progress visualization in Recap (`/recap`) and summary cards in Dashboard (`/dashboard`)
- [x] Zero impact on baseline 50/30/20 allocation calculations

**Components:** `components/budget/BudgetSection.jsx`, `hooks/useBudgetProgress.js`, `utils/budgetCalculations.js`

---

### Feature 10: Web Push Notifications & PWA

**User Story:** As a user, I want device push notifications when budget thresholds (80%, 100%, >100%) are reached, with 3-hour recurring reminders and quiet hours.

**Acceptance Criteria:**
- [x] Web App Manifest (`manifest.webmanifest`) and service worker (`sw.js`) for standalone install
- [x] Settings page device push subscription toggle with VAPID web-push registration
- [x] Quiet hours enforced (22:00–07:00) based on user's timezone
- [x] Edge function dispatch endpoint (`/notify/dispatch`) for cron invocation

**Components:** `public/manifest.webmanifest`, `public/sw.js`, `hooks/usePushNotifications.js`, `hooks/useBudgetAlertSync.js`, `supabase/functions/notify/index.ts`

---

## 8. Data Schema (Google Sheets)

The spreadsheet `Finance_Tracker_Data` contains **6 sheets (tabs)**:

### Sheet 1: `Income`

| Column | Header | Type | Notes |
|---|---|---|---|
| A | `month` | String | Format: `YYYY-MM` (e.g., `2026-08`) |
| B | `amount` | Number | Monthly income in IDR |
| C | `created_at` | String | ISO 8601 timestamp |

### Sheet 2: `AdditionalIncome`

| Column | Header | Type | Notes |
|---|---|---|---|
| A | `date` | String | Format: `YYYY-MM-DD` |
| B | `source` | String | Source name (e.g. Bonus, Side job) |
| C | `amount` | Number | Income amount in IDR |
| D | `created_at` | String | ISO 8601 timestamp |
| E | `id` | String | Unique ID / UUID |

### Sheet 3: `Expenses`

| Column | Header | Type | Notes |
|---|---|---|---|
| A | `date` | String | Format: `YYYY-MM-DD` |
| B | `category` | String | Enum: `Needs`, `Lifestyle`, `Investment` |
| C | `description` | String | Optional, free text |
| D | `amount` | Number | Expense amount in IDR |
| E | `created_at` | String | ISO 8601 timestamp |
| F | `group_override` | String | Optional manual grouping tag |
| G | `id` | String | Unique ID / UUID |

### Sheet 4: `Settings`

| Column | Header | Type | Notes |
|---|---|---|---|
| A | `timezone_mode` | String | `auto` or `manual` |
| B | `timezone` | String | IANA timezone string |
| C | `cutoff_day` | Number | Cutoff day integer (1–28) |

### Sheet 5: `Budgets`

| Column | Header | Type | Notes |
|---|---|---|---|
| A | `id` | String | Unique ID / UUID |
| B | `cycle_key` | String | Format: `YYYY-MM` |
| C | `cutoff_day` | Number | Cutoff day snapshot integer (1–28) |
| D | `name` | String | Custom budget display name |
| E | `category` | String | Enum: `Needs`, `Lifestyle`, `Investment` |
| F | `group_key` | String | Stable expense group key (e.g. `bensin-bbm`, `custom:kopi`) |
| G | `amount` | Number | Limit in IDR |
| H | `created_at` | String | ISO 8601 timestamp |

### Sheet 6: `ChatHistory`

| Column | Header | Type | Notes |
|---|---|---|---|
| A | `id` | String | Unique message ID / UUID |
| B | `session_id` | String | Conversation session UUID |
| C | `session_title` | String | Auto-generated session title from prompt |
| D | `timestamp` | String | ISO 8601 UTC timestamp |
| E | `cycle_key` | String | Associated payday cycle key (e.g. `2026-09`) |
| F | `role` | String | `user` or `assistant` |
| G | `message` | String | Message text |
| H | `proposal_json` | String | JSON string of proposed transaction (or empty) |

### Initialization & Migration Logic
When connecting to a spreadsheet:
1. Ensure all 6 sheets (`Income`, `AdditionalIncome`, `Expenses`, `Settings`, `Budgets`, `ChatHistory`) exist via idempotent `ensureSchemaSheets`.
2. Existing 5-column `Expenses` rows remain compatible; new columns `group_override` and `id` are appended gracefully.
3. Chat history is initialized with 8 columns; older chat rows without `session_id` are gracefully grouped under default session.

---

## 9. Business Logic & Formulas

All formulas are pure functions in `src/utils/financeFormulas.js`.

```javascript
// Input: monthlyIncome (number)
// Output: allocation targets in IDR
function calculateAllocations(monthlyIncome) {
  return {
    needs:       monthlyIncome * 0.50,
    investments: monthlyIncome * 0.30,
    lifestyle:   monthlyIncome * 0.20,
  };
}

// Input: totalMonthlyExpenses (number) — sum of ALL expenses in current month
// Output: fund targets in IDR
function calculateFundTargets(totalMonthlyExpenses) {
  return {
    emergencyFund:   totalMonthlyExpenses * 6,
    retirementFund:  totalMonthlyExpenses * 300,
  };
}

// Input: transactions array, category string, month string (YYYY-MM)
// Output: total spending for that category in that month
function sumByCategory(transactions, category, month) {
  return transactions
    .filter(t => t.category === category && t.date.startsWith(month))
    .reduce((sum, t) => sum + t.amount, 0);
}

// Input: number
// Output: "Rp 1.000.000"
function formatIDR(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}
```

---

## 10. UI/UX Specification

### Color Palette (Tailwind Classes)
| Role | Class |
|---|---|
| Primary | `blue-600` |
| Success / On Track | `green-500` |
| Warning / Over Budget | `red-500` |
| Background | `gray-50` |
| Card | `white` with `shadow-md rounded-2xl` |
| Text Primary | `gray-900` |
| Text Secondary | `gray-500` |

### Pages & Routes
| Route | Component | Guard | Description |
|---|---|---|---|
| `/` | `LandingPage.jsx` | Public | Conversion-optimized responsive SaaS landing page with high-fidelity dashboard mockup, floating expanding theme/lang dock, floating support widget, smooth anchor scrolling, alternating background tones, founder backstory (@susuputih), real feature matrix, FAQ, and privacy clarity |
| `/login` | `LoginPage.jsx` | Guest only | Google OAuth authentication, spreadsheet preparation context |
| `/dashboard` | `DashboardPage.jsx` | Require auth | Financial overview, active cycle day progress, 50/30/20 cards, spending charts, inline first-transaction onboarding for empty accounts |
| `/recap` | `RecapPage.jsx` | Require auth | Monthly and cycle history recap, cycle day progress / completion status, custom budget controls |
| `/ledger` | `LedgerPage.jsx` | Require auth | Monthly income and expense transaction logs with multi-field search, pagination, and modal popup edit |
| `/chat` | `ChatPage.jsx` | Require auth | AI financial assistant with multi-session chat history saved directly to Google Sheets |
| `/settings` | `SettingsPage.jsx` | Require auth | Timezone, cutoff day, and community registry preferences |
| `/privacy` | `PrivacyPolicyPage.jsx` | Public | Data processing disclosures (Google Drive, Supabase, Gemini AI, Web Push) |
| `/terms` | `TermsOfServicePage.jsx` | Public | Terms and conditions of service |
| `/changelog` | `ChangelogPage.jsx` | Public | Release history and version updates |

### First-Transaction Onboarding & Consent Timing
1. **Empty-Account Detection:** Checked strictly against total history across all transaction-bearing sheets (`income`, `additionalIncome`, `transactions`, `budgets`) after successful readiness verification (`isReady: true`).
2. **Inline Fast Entry:** Empty accounts immediately present an inline expense recording form on the dashboard to eliminate initial friction.
3. **Deferred Consent:** Community social proof consent prompt never interrupts first-time onboarding; it only appears upon subsequent return visits after actual financial data has been recorded.

### Responsive Breakpoints
- Mobile: default (single column layout)
- Desktop `md:`: 2-column grid for allocation cards

### Loading States
- Skeleton loaders for dashboard cards while fetching Sheets data
- Spinner on form submit buttons

### Notification & Feedback States
- Top-centered toast notifications (`Toast.jsx`) for API successes, warnings, and errors (Sheets write failure, auth failure) with slide-down animation
- Top-centered community join notifications (`SocialProof.jsx`) on landing and login pages
- Empty state illustration on TransactionTable when no data

---

## 11. Execution Plan (Phased)

### Phase 0: Google Cloud Console Setup
> **Precondition:** Must be completed manually before any code is written.

- [ ] Create new GCP project: `finance-tracker-prod`
- [ ] Enable `Google Sheets API`
- [ ] Enable `Google Drive API`
- [ ] Configure OAuth Consent Screen (External, Testing mode)
  - App name: `Finance Tracker`
  - Scopes: `email`, `profile`, `spreadsheets`, `drive.file`
- [ ] Create OAuth 2.0 Credentials → Web Application type
  - Authorized JS Origins: `http://localhost:5173`
  - Authorized Redirect URIs: `http://localhost:5173`
- [ ] Save `Client ID` (not secret) for use in `.env.local`

---

### Phase 1: Project Initialization
> **Agent instructions:** Scaffold the project from scratch.

```bash
# 1. Scaffold Vite + React project
npm create vite@latest finance-tracker -- --template react
cd finance-tracker

# 2. Install dependencies
npm install @react-oauth/google zustand react-router-dom echarts

# 3. Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. Create environment files
cp .env.example .env.local
```

**Tasks:**
- [ ] Scaffold Vite + React project
- [ ] Install all dependencies from Tech Stack
- [ ] Configure `tailwind.config.js` with content paths
- [ ] Add Tailwind directives to `src/index.css`
- [ ] Create `.env.example` with `VITE_GOOGLE_CLIENT_ID` placeholder
- [ ] Create `.gitignore` (include `.env.local`, `node_modules`, `dist`)
- [ ] Create `vercel.json` for SPA rewrites:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- [ ] Wrap `main.jsx` with `<GoogleOAuthProvider clientId={...}>`

---

### Phase 2: Auth Module
> **Agent instructions:** Implement Google OAuth login/logout.

**Tasks:**
- [ ] Create `src/store/authStore.js` (Zustand store with `user`, `accessToken`, `setAuth()`, `clearAuth()`)
- [ ] Create `src/api/googleAuth.js` with helper to extract access token from Google credential response
- [ ] Create `src/hooks/useAuth.js` that consumes `authStore`
- [ ] Create `src/pages/LoginPage.jsx` with centered Google Sign-In button
- [ ] Create `src/components/auth/LoginButton.jsx` using `useGoogleLogin` hook (PKCE flow, not credential flow)
- [ ] Create `src/components/layout/Navbar.jsx` with user avatar, name, and logout button
- [ ] Create `src/App.jsx` with route definitions and auth guard
  - Unauthenticated → redirect to `/login`
  - Authenticated → access `/dashboard` and `/ledger`
- [ ] Test: login → token stored in Zustand + `localStorage` → logout clears both

---

### Phase 3: Google Sheets Integration
> **Agent instructions:** Implement Drive provisioning and Sheets CRUD.

**Tasks:**
- [ ] Create `src/constants/sheets.js`:
  ```javascript
  export const SPREADSHEET_NAME = 'Finance_Tracker_Data';
  export const SHEETS = { INCOME: 'Income', EXPENSES: 'Expenses' };
  export const INCOME_HEADERS = ['month', 'amount', 'created_at'];
  export const EXPENSE_HEADERS = ['date', 'category', 'description', 'amount', 'created_at'];
  ```
- [ ] Create `src/api/googleDrive.js`:
  - `findSpreadsheet(accessToken)` — search Drive for file named `Finance_Tracker_Data`
  - `createSpreadsheet(accessToken)` — create spreadsheet and initialize sheets + headers
  - `getOrCreateSpreadsheet(accessToken)` — orchestrator: find or create
- [ ] Create `src/api/googleSheets.js`:
  - `appendRow(accessToken, spreadsheetId, sheetName, rowValues)` — append one row
  - `getRows(accessToken, spreadsheetId, sheetName)` — get all rows as array of objects
- [ ] Create `src/store/financeStore.js` (Zustand: `spreadsheetId`, `transactions`, `income`, setters)
- [ ] Create `src/hooks/useSpreadsheet.js` — call `getOrCreateSpreadsheet` on mount, expose loading state
- [ ] Test: on login → spreadsheet created in user's Drive → headers present in both sheets

---

### Phase 4: Ledger Module
> **Agent instructions:** Build income and expense input forms.

**Tasks:**
- [ ] Create `src/utils/sheetsHelpers.js`:
  - `serializeIncomeRow(month, amount)` → array for Sheets API
  - `serializeExpenseRow(date, category, description, amount)` → array for Sheets API
  - `deserializeRows(headers, rawRows)` → array of objects
- [ ] Create `src/components/ledger/IncomeForm.jsx`
  - Fields: month picker, amount input
  - On submit: call `appendRow` to `Income` sheet
- [ ] Create `src/components/ledger/ExpenseForm.jsx`
  - Fields: date picker, category dropdown (`Needs`/`Lifestyle`/`Investment`), description, amount
  - On submit: call `appendRow` to `Expenses` sheet
- [ ] Create `src/components/ledger/TransactionTable.jsx`
  - Fetch last 30 expense rows from Sheets on mount
  - Display in a sortable table
- [ ] Create `src/pages/LedgerPage.jsx` — compose IncomeForm, ExpenseForm, TransactionTable
- [ ] Test: add income → appears in Google Sheets → add expense → appears in table

---

### Phase 5: Dashboard & Formula Calculator
> **Agent instructions:** Build the dashboard with financial calculations.

**Tasks:**
- [ ] Create `src/utils/financeFormulas.js` with all pure functions (see Section 9)
- [ ] Create `src/hooks/useFinanceCalc.js`:
  - Read `income` and `transactions` from `financeStore`
  - Return: `allocations`, `fundTargets`, `actualSpending`, `currentMonth`
- [ ] Create `src/components/dashboard/AllocationCard.jsx`
  - Props: `label`, `targetAmount`, `actualAmount`, `color`
  - Show progress bar (green if under, red if over)
- [ ] Create `src/components/dashboard/FundTargetCard.jsx`
  - Props: `label`, `targetAmount`
  - Display large formatted IDR amount
- [ ] Create `src/components/dashboard/SpendingChart.jsx`
  - Apache ECharts (modular import: `echarts/core` + `PieChart` + `TooltipComponent` + `CanvasRenderer`) donut showing spending by category for current month
- [ ] Create `src/pages/DashboardPage.jsx` — compose all dashboard components
- [ ] Test: income + expenses → correct allocation targets → correct fund targets

---

### Phase 6: Polish & Deploy
> **Agent instructions:** Final polish and Vercel deployment.

**Tasks:**
- [ ] Add loading skeleton components to all data-fetching components
- [ ] Add error toast system (simple React state-based toasts)
- [ ] Add empty state illustrations for no-data views
- [ ] Ensure all currency displays use `formatIDR()`
- [ ] Mobile responsiveness audit (test at 375px)
- [ ] Push to GitHub repository
- [ ] Connect GitHub repo to Vercel
- [ ] Set `VITE_GOOGLE_CLIENT_ID` in Vercel environment variables
- [ ] Add production URL to GCP OAuth Authorized Origins & Redirect URIs
- [ ] Smoke test production build

---

## 12. Constraints & Rules

### Security Rules — MUST ENFORCE
1. **No client secret in codebase** — ever. Not in env, not hardcoded.
2. **Access tokens persisted to `localStorage`** — restored on app boot so a refresh keeps the session. Revoked on logout. Trade-off: XSS risk accepted (public SPA, no user-generated HTML, React auto-escapes).
3. **Minimum OAuth scopes** — only `drive.file` (not `drive`), only `spreadsheets` (not `drive.readonly`).
4. **PKCE flow only** — use `useGoogleLogin` with `flow: 'auth-code'` or `flow: 'implicit'` from `@react-oauth/google`. Do not use `GoogleLogin` credential flow for Drive scopes.

### API Rules
5. **All Google API calls must include the user's `accessToken`** in the `Authorization: Bearer` header.
6. **Spreadsheet operations must use `spreadsheetId`** stored in `financeStore` — never hardcode a sheet ID.
7. **On API 401 error** — clear auth store and redirect to `/login`.

### Code Style Rules
8. **Pure functions in `/utils`** — no side effects, no API calls, fully testable.
9. **No business logic in components** — components only render and call hooks.
10. **All monetary amounts stored as integers (in IDR, no decimals)** in Google Sheets.
11. **Date format in Sheets: `YYYY-MM-DD`**, month format: `YYYY-MM`.

### Deployment Rules
12. **`vercel.json` must have SPA rewrite rule** — all routes serve `index.html`.
13. **`.env.local` must be in `.gitignore`** — never commit real credentials.

### Documentation & History Synchronization Rules — MUST ENFORCE
14. **Always-sync documentation upon any change** — Any addition, update, or removal of features, behavior, data schemas, API integrations, or privacy handling must synchronize `PRD.md`, `README.md`, `src/constants/changelog.js`, and `src/constants/legalContent.js` in the same change set.
15. **Truthful versioning, dates, and status** — Always accurately distinguish code implementation, local self-check verification, and actual production deployment. Never claim a feature is deployed or verified without concrete evidence.
16. **Pre-completion documentation checklist**:
    - [ ] `PRD.md` reflects actual codebase behavior, schemas, routes, and constraints.
    - [ ] `src/constants/changelog.js` updated with version entry and bilingual items (`en` and `id`).
    - [ ] `README.md` updated with current features, routes, tech stack, and privacy explanations.
    - [ ] Terms and Privacy Policy in `src/constants/legalContent.js` updated for all data transit or AI flows in both English and Indonesian.
    - [ ] `npm run check` and `npm run build` pass without error.

---

*End of PRD — Finance Tracker v1.6.0*