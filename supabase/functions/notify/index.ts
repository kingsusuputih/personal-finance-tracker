import webpush from "npm:web-push@3.6.7";

const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID") || "";
const REGISTRY_PEPPER = Deno.env.get("REGISTRY_PEPPER") || "default_pepper_change_in_prod";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const ALLOWED_ORIGINS_RAW = Deno.env.get("ALLOWED_ORIGINS") || "";
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY") || "";
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY") || "";
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") || "mailto:harsa.aditya.ha@gmail.com";
const CRON_SECRET = Deno.env.get("CRON_SECRET") || "";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  try {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  } catch (err) {
    console.error("Failed to configure VAPID:", err);
  }
}

const allowedOrigins = ALLOWED_ORIGINS_RAW.split(",")
  .map((s) => s.trim().toLowerCase().replace(/\/+$/, ""))
  .filter(Boolean);

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = (req.headers.get("origin") || "").trim();
  const originLower = origin.toLowerCase().replace(/\/+$/, "");
  const isAllowed =
    allowedOrigins.length === 0 ||
    allowedOrigins.includes(originLower) ||
    originLower.includes("localhost") ||
    originLower.includes("127.0.0.1");

  const allowOrigin = isAllowed && origin ? origin : allowedOrigins[0] || "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, x-cron-secret",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function jsonResponse(
  body: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}

async function hashSub(sub: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(REGISTRY_PEPPER),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(`google:${sub}`),
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyGoogleToken(token: string): Promise<{ sub: string; name: string } | null> {
  if (!token) return null;
  const isJwt = token.split(".").length === 3;

  try {
    if (isJwt) {
      const res = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`,
        { signal: AbortSignal.timeout(6000) },
      );
      if (!res.ok) return null;
      const data = await res.json();
      if (GOOGLE_CLIENT_ID && data.aud !== GOOGLE_CLIENT_ID && data.azp !== GOOGLE_CLIENT_ID) {
        return null;
      }
      if (!data.sub) return null;
      return { sub: String(data.sub), name: String(data.name || "") };
    } else {
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(6000),
      });

      if (!userInfoRes.ok) return null;
      const userInfo = await userInfoRes.json();
      if (!userInfo.sub) return null;
      return { sub: String(userInfo.sub), name: String(userInfo.name || "") };
    }
  } catch {
    return null;
  }
}

function getBearerToken(req: Request): string {
  const auth = req.headers.get("authorization") || "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

function isQuietHour(date: Date, timeZone: string): boolean {
  try {
    const hourStr = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone || "Asia/Jakarta",
      hour: "numeric",
      hour12: false,
    }).format(date);
    const hour = parseInt(hourStr, 10);
    return hour >= 22 || hour < 7;
  } catch {
    return false;
  }
}

function validatePushEndpoint(endpointStr: string): boolean {
  try {
    const url = new URL(endpointStr);
    if (url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase();
    const allowedDomains = [
      "fcm.googleapis.com",
      "push.apple.com",
      "notify.windows.com",
      "updates.push.services.mozilla.com",
      "push.services.mozilla.com",
    ];
    return allowedDomains.some((d) => host === d || host.endsWith("." + d));
  } catch {
    return false;
  }
}

async function ensureUserRegistry(identityHash: string): Promise<void> {
  await fetch(`${SUPABASE_URL}/rest/v1/user_registry`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates",
    },
    body: JSON.stringify([{ identity_hash: identityHash }]),
    signal: AbortSignal.timeout(5000),
  }).catch(() => {});
}

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^.*\/notify/, "").replace(/\/+$/, "") || "/";

  // Public config endpoint
  if (req.method === "GET" && path === "/config") {
    return jsonResponse(
      { vapidPublicKey: VAPID_PUBLIC_KEY },
      200,
      { ...corsHeaders, "Cache-Control": "public, max-age=3600" },
    );
  }

  // Cron dispatch endpoint (protected by CRON_SECRET)
  if ((req.method === "POST" || req.method === "GET") && path === "/dispatch") {
    const providedSecret =
      req.headers.get("x-cron-secret") ||
      getBearerToken(req) ||
      url.searchParams.get("secret");

    if (!CRON_SECRET || providedSecret !== CRON_SECRET) {
      return jsonResponse({ error: "Unauthorized dispatch" }, 401, corsHeaders);
    }

    try {
      // Find due alerts (near, reached, exceeded)
      const nowIso = new Date().toISOString();
      const alertsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/budget_alert_states?status=in.(near,reached,exceeded)&or=(next_reminder_at.is.null,next_reminder_at.lte.${encodeURIComponent(nowIso)})&select=*`,
        {
          headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
        },
      );

      const dueAlerts: any[] = alertsRes.ok ? await alertsRes.json() : [];
      let sentCount = 0;
      let postponedCount = 0;

      for (const alert of dueAlerts) {
        // Fetch subscriptions for this user
        const subsRes = await fetch(
          `${SUPABASE_URL}/rest/v1/push_subscriptions?identity_hash=eq.${alert.identity_hash}&select=*`,
          {
            headers: {
              apikey: SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
          },
        );

        const subs: any[] = subsRes.ok ? await subsRes.json() : [];
        if (!subs.length) continue;

        let sentForThisAlert = false;
        const now = new Date();

        for (const sub of subs) {
          if (isQuietHour(now, sub.timezone)) {
            postponedCount += 1;
            continue;
          }

          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          };

          const isId = sub.lang === "id";
          let title = "Finance Tracker";
          let body = "";

          if (alert.status === "exceeded") {
            title = isId ? "Budget Melebihi Batas!" : "Budget Exceeded!";
            body = isId
              ? `Pengeluaran untuk "${alert.budget_name}" telah melebihi batas budget.`
              : `Spending for "${alert.budget_name}" has exceeded your budget limit.`;
          } else if (alert.status === "reached") {
            title = isId ? "Budget Mencapai Batas (100%)" : "Budget Reached (100%)";
            body = isId
              ? `Pengeluaran untuk "${alert.budget_name}" telah mencapai 100% budget.`
              : `Spending for "${alert.budget_name}" has reached 100% of your budget.`;
          } else if (alert.status === "near") {
            title = isId ? "Budget Mendekati Batas (80%)" : "Budget Near Limit (80%)";
            body = isId
              ? `Pengeluaran untuk "${alert.budget_name}" sudah mencapai 80% dari batas budget.`
              : `Spending for "${alert.budget_name}" has reached 80% of your budget limit.`;
          }

          const payload = JSON.stringify({
            title,
            body,
            tag: `budget-${alert.budget_id}`,
            data: {
              url: "/recap",
              budgetId: alert.budget_id,
              cycleKey: alert.cycle_key,
              status: alert.status,
            },
          });

          try {
            await webpush.sendNotification(pushSubscription, payload);
            sentCount += 1;
            sentForThisAlert = true;
          } catch (err: any) {
            console.error("Push send error:", err?.statusCode, err?.message);
            // If subscription is expired or unsubscribed (404/410), delete it
            if (err?.statusCode === 404 || err?.statusCode === 410) {
              await fetch(
                `${SUPABASE_URL}/rest/v1/push_subscriptions?id=eq.${sub.id}`,
                {
                  method: "DELETE",
                  headers: {
                    apikey: SUPABASE_SERVICE_ROLE_KEY,
                    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                  },
                },
              ).catch(() => {});
            }
          }
        }

        // Reschedule reminder for 3 hours later
        const nextTime = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();
        await fetch(
          `${SUPABASE_URL}/rest/v1/budget_alert_states?id=eq.${alert.id}`,
          {
            method: "PATCH",
            headers: {
              apikey: SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              last_notified_at: sentForThisAlert ? now.toISOString() : alert.last_notified_at,
              next_reminder_at: nextTime,
              updated_at: new Date().toISOString(),
            }),
          },
        ).catch(() => {});
      }

      // 2. Process recurring transaction reminders (every 3 hours)
      const txSubsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/push_subscriptions?next_tx_reminder_at=lte.${encodeURIComponent(nowIso)}&select=*`,
        {
          headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
        },
      );
      const dueTxSubs: any[] = txSubsRes.ok ? await txSubsRes.json() : [];

      for (const sub of dueTxSubs) {
        const now = new Date();
        if (isQuietHour(now, sub.timezone)) {
          postponedCount += 1;
          continue;
        }

        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        const isId = sub.lang === "id";
        const title = "Finance Tracker";
        const body = isId
          ? "Jangan lupa mencatat transaksi keuanganmu hari ini!"
          : "Don't forget to log your transactions today!";

        const payload = JSON.stringify({
          title,
          body,
          tag: "tx-reminder",
          data: {
            url: "/dashboard",
          },
        });

        try {
          await webpush.sendNotification(pushSubscription, payload);
          sentCount += 1;
        } catch (err: any) {
          console.error("Push send error (tx reminder):", err?.statusCode, err?.message);
          if (err?.statusCode === 404 || err?.statusCode === 410) {
            await fetch(
              `${SUPABASE_URL}/rest/v1/push_subscriptions?id=eq.${sub.id}`,
              {
                method: "DELETE",
                headers: {
                  apikey: SUPABASE_SERVICE_ROLE_KEY,
                  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                },
              },
            ).catch(() => {});
            continue;
          }
        }

        const nextTime = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();
        await fetch(
          `${SUPABASE_URL}/rest/v1/push_subscriptions?id=eq.${sub.id}`,
          {
            method: "PATCH",
            headers: {
              apikey: SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              next_tx_reminder_at: nextTime,
            }),
          },
        ).catch(() => {});
      }

      return jsonResponse({
        success: true,
        sent: sentCount,
        postponed: postponedCount,
      });
    } catch (err: any) {
      console.error("Dispatch error:", err);
      return jsonResponse({ error: "Dispatch failed", details: String(err) }, 500);
    }
  }

  // All other endpoints require Google Auth token
  const token = getBearerToken(req);
  if (!token) {
    return jsonResponse({ error: "Unauthorized" }, 401, corsHeaders);
  }

  const authUser = await verifyGoogleToken(token);
  if (!authUser) {
    return jsonResponse({ error: "Invalid Google credential" }, 401, corsHeaders);
  }

  const identityHash = await hashSub(authUser.sub);
  await ensureUserRegistry(identityHash);

  // Subscribe device
  if (req.method === "POST" && path === "/subscribe") {
    try {
      const body = await req.json();
      const sub = body.subscription;
      if (!sub || !sub.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) {
        return jsonResponse({ error: "Invalid push subscription object" }, 400, corsHeaders);
      }

      if (!validatePushEndpoint(sub.endpoint)) {
        return jsonResponse({ error: "Unsupported or insecure push endpoint" }, 400, corsHeaders);
      }

      const timezone = body.timezone || "Asia/Jakarta";
      const cutoffDay = Number(body.cutoffDay) || 25;
      const lang = body.lang === "en" ? "en" : "id";
      const consentVersion = body.consentVersion || "2026-09-06";

      await fetch(`${SUPABASE_URL}/rest/v1/push_subscriptions`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          identity_hash: identityHash,
          endpoint: sub.endpoint,
          p256dh: sub.keys.p256dh,
          auth: sub.keys.auth,
          timezone,
          cutoff_day: cutoffDay,
          lang,
          consent_version: consentVersion,
          last_seen_at: new Date().toISOString(),
          next_tx_reminder_at: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        }),
      });

      return jsonResponse({ success: true }, 200, corsHeaders);
    } catch {
      return jsonResponse({ error: "Failed to save subscription" }, 500, corsHeaders);
    }
  }

  // Activity ping to reset 3-hour transaction reminder (POST /activity)
  if (req.method === "POST" && (path === "/activity" || path === "/ping")) {
    try {
      const nextReminder = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();
      await fetch(
        `${SUPABASE_URL}/rest/v1/push_subscriptions?identity_hash=eq.${identityHash}`,
        {
          method: "PATCH",
          headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            next_tx_reminder_at: nextReminder,
            last_seen_at: new Date().toISOString(),
          }),
        },
      );

      return jsonResponse({ success: true }, 200, corsHeaders);
    } catch {
      return jsonResponse({ error: "Failed to update activity" }, 500, corsHeaders);
    }
  }

  // Unsubscribe device
  if (req.method === "POST" && path === "/unsubscribe") {
    try {
      const body = await req.json();
      if (!body.endpoint) {
        return jsonResponse({ error: "Endpoint required" }, 400, corsHeaders);
      }

      await fetch(
        `${SUPABASE_URL}/rest/v1/push_subscriptions?identity_hash=eq.${identityHash}&endpoint=eq.${encodeURIComponent(body.endpoint)}`,
        {
          method: "DELETE",
          headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
        },
      );

      return jsonResponse({ success: true }, 200, corsHeaders);
    } catch {
      return jsonResponse({ error: "Failed to unsubscribe" }, 500, corsHeaders);
    }
  }

  // Sync alert state
  if (req.method === "POST" && path === "/state") {
    try {
      const body = await req.json();
      const { cycleKey, alerts } = body;
      if (!cycleKey || !Array.isArray(alerts)) {
        return jsonResponse({ error: "Invalid state payload" }, 400, corsHeaders);
      }

      for (const item of alerts) {
        if (!item.budgetId) continue;
        const status = ["safe", "near", "reached", "exceeded"].includes(item.status)
          ? item.status
          : "safe";

        // Query existing state
        const existingRes = await fetch(
          `${SUPABASE_URL}/rest/v1/budget_alert_states?identity_hash=eq.${identityHash}&cycle_key=eq.${cycleKey}&budget_id=eq.${item.budgetId}&select=*`,
          {
            headers: {
              apikey: SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
          },
        );
        const rows: any[] = existingRes.ok ? await existingRes.json() : [];
        const existing = rows[0];

        let nextReminder = existing?.next_reminder_at;
        // If status escalated or first time warning, set reminder immediately (now)
        if (status !== "safe" && (!existing || existing.status === "safe" || existing.status !== status)) {
          nextReminder = new Date().toISOString();
        } else if (status === "safe") {
          nextReminder = null;
        }

        await fetch(`${SUPABASE_URL}/rest/v1/budget_alert_states`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "resolution=merge-duplicates",
          },
          body: JSON.stringify({
            identity_hash: identityHash,
            cycle_key: cycleKey,
            budget_id: item.budgetId,
            budget_name: String(item.name || "").trim().slice(0, 100),
            status,
            next_reminder_at: nextReminder,
            updated_at: new Date().toISOString(),
          }),
        });
      }

      return jsonResponse({ success: true }, 200, corsHeaders);
    } catch {
      return jsonResponse({ error: "Failed to update alert state" }, 500, corsHeaders);
    }
  }

  return jsonResponse({ error: "Method not allowed" }, 405, corsHeaders);
});
