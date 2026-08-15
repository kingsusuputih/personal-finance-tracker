# PRD: Personal Finance Tracker
**Version:** 1.0.0
**Status:** Ready for Execution
**Last Updated:** 2026-08-16
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

---

## 4. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | ^18.x |
| Build Tool | Vite | ^5.x |
| Styling | Tailwind CSS | ^4.x |
| Auth | @react-oauth/google | latest |
| Google API Client | googleapis (browser) via gapi | v3 |
| State Management | Zustand | ^4.x |
| Charts | Recharts | ^2.x |
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

### Vercel Environment Variables (set in dashboard)
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

### Feature 4: Ledger Module — Expense Input

**User Story:** As a user, I want to record my daily/monthly expenses by category.

**Acceptance Criteria:**
- [ ] Form fields:
  - Date (date picker, defaults to today)
  - Category (dropdown: Needs, Lifestyle, Investment)
  - Description (text, optional)
  - Amount (numeric, in IDR)
- [ ] On submit: append a row to the `Expenses` sheet
- [ ] Validation: amount > 0, category required
- [ ] Show success toast on save
- [ ] Transaction table below the form shows the last 30 entries

**Sheet written to:** `Expenses` (see Data Schema)
**Components:** `ExpenseForm.jsx`, `TransactionTable.jsx`, `LedgerPage.jsx`

---

### Feature 5: Financial Formula Calculator & Dashboard

**User Story:** As a user, I want to see a clear breakdown of how my income should be allocated and what my financial targets are.

**Acceptance Criteria:**
- [ ] Dashboard fetches current month's income and all-time expenses from Sheets
- [ ] Display **Allocation Cards** (based on monthly income):
  - Needs: 50% of income → show target amount + actual spending in "Needs" category
  - Investments: 30% of income → show target amount + actual spending in "Investment" category
  - Lifestyle: 20% of income → show target amount + actual spending in "Lifestyle" category
- [ ] Display **Fund Target Cards** (based on total monthly expenses):
  - Emergency Fund Target = 6 × Total Monthly Expenses
  - Retirement Fund Target = 300 × Total Monthly Expenses
- [ ] Display **Spending Chart**: bar or donut chart showing expense breakdown by category for current month
- [ ] All currency displayed in IDR format (`Rp 1.000.000`)

**Components:** `DashboardPage.jsx`, `AllocationCard.jsx`, `FundTargetCard.jsx`, `SpendingChart.jsx`
**Hook:** `useFinanceCalc.js`

---

## 8. Data Schema (Google Sheets)

The spreadsheet `Finance_Tracker_Data` must contain exactly **2 sheets (tabs)**:

### Sheet 1: `Income`

| Column | Header | Type | Notes |
|---|---|---|---|
| A | `month` | String | Format: `YYYY-MM` (e.g., `2026-08`) |
| B | `amount` | Number | Monthly income in IDR |
| C | `created_at` | String | ISO 8601 timestamp |

### Sheet 2: `Expenses`

| Column | Header | Type | Notes |
|---|---|---|---|
| A | `date` | String | Format: `YYYY-MM-DD` |
| B | `category` | String | Enum: `Needs`, `Lifestyle`, `Investment` |
| C | `description` | String | Optional, free text |
| D | `amount` | Number | Expense amount in IDR |
| E | `created_at` | String | ISO 8601 timestamp |

### Initialization Logic
When creating the spreadsheet for the first time:
1. Rename default "Sheet1" → `Income`
2. Add headers row to `Income!A1:C1`
3. Create new sheet tab `Expenses`
4. Add headers row to `Expenses!A1:E1`

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
| Route | Component | Guard |
|---|---|---|
| `/` | Redirect to `/login` or `/dashboard` | — |
| `/login` | `LoginPage.jsx` | Redirect to `/dashboard` if authed |
| `/dashboard` | `DashboardPage.jsx` | Require auth |
| `/ledger` | `LedgerPage.jsx` | Require auth |

### Responsive Breakpoints
- Mobile: default (single column layout)
- Desktop `md:`: 2-column grid for allocation cards

### Loading States
- Skeleton loaders for dashboard cards while fetching Sheets data
- Spinner on form submit buttons

### Error States
- Toast notification for API errors (Sheets write failure, auth failure)
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
npm install @react-oauth/google zustand react-router-dom recharts

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
  - Recharts `PieChart` or `BarChart` showing spending by category for current month
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

---

*End of PRD — Finance Tracker v1.0.0*