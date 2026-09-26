import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.jsx";
import { ToastProvider } from "./components/ui/Toast.jsx";
import { LanguageProvider } from "./i18n/LanguageProvider.jsx";
import "./index.css";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function SetupMissing() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <a
          href="/"
          className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent font-display text-xl font-bold text-accent-ink transition-colors hover:bg-accent-strong"
          title="Beranda">
          F
        </a>
        <h1 className="text-2xl font-bold">Configuration missing</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-3">
          Set the <code className="amount text-xs">VITE_GOOGLE_CLIENT_ID</code>{" "}
          environment variable and rebuild before signing in.
        </p>
      </div>
    </main>
  );
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {clientId ? (
      <GoogleOAuthProvider clientId={clientId}>
        <LanguageProvider>
          <ToastProvider>
            <App />
            <Analytics />
          </ToastProvider>
        </LanguageProvider>
      </GoogleOAuthProvider>
    ) : (
      <SetupMissing />
    )}
  </React.StrictMode>,
);
