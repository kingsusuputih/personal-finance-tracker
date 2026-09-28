import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth.js";
import { useBudgetAlertSync } from "./hooks/useBudgetAlertSync.js";
import LoginPage from "./pages/LoginPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.jsx";
import TermsOfServicePage from "./pages/TermsOfServicePage.jsx";
import ChangelogPage from "./pages/ChangelogPage.jsx";
import { Skeleton } from "./components/ui/Skeleton.jsx";

const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));
const RecapPage = lazy(() => import("./pages/RecapPage.jsx"));
const LedgerPage = lazy(() => import("./pages/LedgerPage.jsx"));
const ChatPage = lazy(() => import("./pages/ChatPage.jsx"));
const SettingsPage = lazy(() => import("./pages/SettingsPage.jsx"));

function PageFallback() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-32 pt-6 md:px-8 md:pt-10 md:pb-32 lg:pb-12">
      <div className="mb-8">
        <Skeleton className="mb-2 h-4 w-24" />
        <Skeleton className="h-10 w-56" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}

function BudgetAlertSyncHandler() {
  useBudgetAlertSync();
  return null;
}

function RequireAuth() {
  const { isAuthed } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  return (
    <>
      <BudgetAlertSyncHandler />
      <Outlet />
    </>
  );
}

function GuestOnly() {
  const { isAuthed } = useAuth();
  if (isAuthed) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestOnly />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<PageFallback />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="/recap"
            element={
              <Suspense fallback={<PageFallback />}>
                <RecapPage />
              </Suspense>
            }
          />
          <Route
            path="/ledger"
            element={
              <Suspense fallback={<PageFallback />}>
                <LedgerPage />
              </Suspense>
            }
          />
          <Route
            path="/chat"
            element={
              <Suspense fallback={<PageFallback />}>
                <ChatPage />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<PageFallback />}>
                <SettingsPage />
              </Suspense>
            }
          />
        </Route>
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
