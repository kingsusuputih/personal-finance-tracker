# Agent Instructions

## Package Manager
Use **npm**: `npm install`, `npm run dev`, `npm run build`, `npm run check`

## Verification & Commands
| Task | Command |
|---|---|
| Self-check & Chat Test | `npm run check` |
| Chat Edge Function Test | `npm run check:chat` |
| Production Build | `npm run build` |
| Dev Server | `npm run dev` |

## Architecture & Conventions
- **Decentralized Storage:** Financial records and chat sessions live exclusively in user's Google Drive (`Finance_Tracker_Data` spreadsheet). No centralized database for financial data.
- **Google Sheets Tabs:** `Income`, `AdditionalIncome`, `Expenses`, `Settings`, `Budgets`, `ChatHistory`. Use `ensureSchemaSheets()` in `src/api/googleSheets.js` for migrations.
- **Serverless AI Proxy:** Supabase Edge Function (`/api/chat`) proxies Gemini free-tier with Bearer token validation and rate limiting. Ephemeral processing only.
- **State Management:** Zustand in `src/store/financeStore.js` and `src/store/authStore.js`.
- **Date & Cycle Logic:** Cycle calculations must use `src/utils/dateTime.js` respecting user cutoff day (1–28) and timezone.
- **Styling & Tokens:** Tailwind CSS v4 with OKLCH theme tokens in `src/tokens.css`.
- **i18n:** Every user-facing string must be registered in `src/i18n/translations.js` for both `en` and `id`.

## Commit Attribution
AI commits MUST include:
```
Co-Authored-By: Claude Sonnet 4 <noreply@anthropic.com>
```
