const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID") || "";
const REGISTRY_PEPPER = Deno.env.get("REGISTRY_PEPPER") || "default_pepper_change_in_prod";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const ALLOWED_ORIGINS_RAW = Deno.env.get("ALLOWED_ORIGINS") || "";

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
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
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

function maskName(name: string): string {
  if (!name || typeof name !== "string") return "Anonymous";
  const clean = name.normalize("NFKC").trim();
  if (!clean) return "Anonymous";
  const words = clean.split(/\s+/).filter(Boolean).slice(0, 2);
  if (!words.length) return "Anonymous";

  const segmenter =
    typeof Intl !== "undefined" && "Segmenter" in Intl
      ? new (Intl as any).Segmenter(undefined, { granularity: "grapheme" })
      : null;

  return words
    .map((w) => {
      let firstChar = "";
      if (segmenter) {
        const segs = Array.from(segmenter.segment(w)) as Array<{ segment: string }>;
        firstChar = segs.length ? segs[0].segment.toUpperCase() : "";
      } else {
        firstChar = Array.from(w)[0]?.toUpperCase() || "";
      }
      return `${firstChar}***`;
    })
    .join(" ");
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

interface GoogleAuthResult {
  sub: string;
  name: string;
}

async function verifyGoogleToken(token: string): Promise<GoogleAuthResult | null> {
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
      const [tokenInfoRes, userInfoRes] = await Promise.all([
        fetch(
          `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(token)}`,
          { signal: AbortSignal.timeout(6000) },
        ),
        fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(6000),
        }),
      ]);

      if (!tokenInfoRes.ok) return null;
      const tokenInfo = await tokenInfoRes.json();
      if (
        GOOGLE_CLIENT_ID &&
        tokenInfo.aud !== GOOGLE_CLIENT_ID &&
        tokenInfo.azp !== GOOGLE_CLIENT_ID
      ) {
        return null;
      }

      let sub = String(tokenInfo.sub || "");
      let name = "";

      if (userInfoRes.ok) {
        const userInfo = await userInfoRes.json();
        if (userInfo.sub) sub = String(userInfo.sub);
        if (userInfo.name) name = String(userInfo.name);
      }

      if (!sub) return null;
      return { sub, name };
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

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^.*\/registry/, "").replace(/\/+$/, "") || "/";

  if (req.method === "GET" && (path === "/proof" || path === "/")) {
    try {
      const [countRes, recentRes] = await Promise.all([
        fetch(
          `${SUPABASE_URL}/rest/v1/user_registry?select=identity_hash`,
          {
            method: "HEAD",
            headers: {
              apikey: SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              Prefer: "count=exact",
            },
            signal: AbortSignal.timeout(5000),
          },
        ),
        fetch(
          `${SUPABASE_URL}/rest/v1/user_registry?publish_name=eq.true&select=masked_name&order=created_at.desc&limit=10`,
          {
            headers: {
              apikey: SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
            signal: AbortSignal.timeout(5000),
          },
        ),
      ]);

      let userCount = 0;
      const contentRange = countRes.headers.get("content-range") || "";
      const match = contentRange.match(/\/(\d+)$/);
      if (match) {
        userCount = parseInt(match[1], 10) || 0;
      }

      const recentRows = recentRes.ok ? await recentRes.json() : [];
      const recent = (Array.isArray(recentRows) ? recentRows : [])
        .map((r: { masked_name?: string }) => ({
          maskedName: r.masked_name || "Anonymous",
        }))
        .filter((r: { maskedName: string }) => r.maskedName !== "Anonymous");

      return jsonResponse(
        { userCount, recent },
        200,
        {
          ...corsHeaders,
          "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=300",
        },
      );
    } catch (err) {
      return jsonResponse(
        { error: "Failed to fetch proof" },
        500,
        corsHeaders,
      );
    }
  }

  const token = getBearerToken(req);
  if (!token) {
    return jsonResponse({ error: "Unauthorized" }, 401, corsHeaders);
  }

  const authUser = await verifyGoogleToken(token);
  if (!authUser) {
    return jsonResponse({ error: "Invalid Google credential" }, 401, corsHeaders);
  }

  const identityHash = await hashSub(authUser.sub);

  if (req.method === "POST" && (path === "/register" || path === "/")) {
    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/user_registry`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "resolution=ignore-duplicates",
          },
          body: JSON.stringify([{ identity_hash: identityHash }]),
          signal: AbortSignal.timeout(5000),
        },
      );

      const checkRes = await fetch(
        `${SUPABASE_URL}/rest/v1/user_registry?identity_hash=eq.${identityHash}&select=publish_name,masked_name`,
        {
          headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          signal: AbortSignal.timeout(5000),
        },
      );

      const rows = checkRes.ok ? await checkRes.json() : [];
      const row = Array.isArray(rows) && rows.length ? rows[0] : null;

      return jsonResponse(
        {
          registered: true,
          publishName: Boolean(row?.publish_name),
          maskedName: row?.masked_name || maskName(authUser.name),
        },
        200,
        { ...corsHeaders, "Cache-Control": "no-store" },
      );
    } catch {
      return jsonResponse({ error: "Registration failed" }, 500, corsHeaders);
    }
  }

  if (req.method === "PUT" && path === "/publication") {
    try {
      const text = await req.text();
      let body: { publishName?: boolean; consentVersion?: string } = {};
      try {
        body = JSON.parse(text);
      } catch {
        return jsonResponse({ error: "Invalid JSON" }, 400, corsHeaders);
      }

      const publishName = Boolean(body.publishName);
      const masked = publishName ? maskName(authUser.name) : null;
      const consentedAt = publishName ? new Date().toISOString() : null;
      const consentVersion = publishName ? body.consentVersion || "2026-09-06" : null;

      const patchRes = await fetch(
        `${SUPABASE_URL}/rest/v1/user_registry?identity_hash=eq.${identityHash}`,
        {
          method: "PATCH",
          headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            publish_name: publishName,
            masked_name: masked,
            consented_at: consentedAt,
            consent_version: consentVersion,
          }),
          signal: AbortSignal.timeout(5000),
        },
      );

      if (!patchRes.ok) {
        return jsonResponse({ error: "Failed to update publication preference" }, 500, corsHeaders);
      }

      return jsonResponse(
        { publishName, maskedName: masked },
        200,
        { ...corsHeaders, "Cache-Control": "no-store" },
      );
    } catch {
      return jsonResponse({ error: "Server error" }, 500, corsHeaders);
    }
  }

  if (req.method === "DELETE" && path === "/me") {
    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/user_registry?identity_hash=eq.${identityHash}`,
        {
          method: "DELETE",
          headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          signal: AbortSignal.timeout(5000),
        },
      );
      return new Response(null, { status: 204, headers: corsHeaders });
    } catch {
      return jsonResponse({ error: "Failed to delete registry entry" }, 500, corsHeaders);
    }
  }

  return jsonResponse({ error: "Method not allowed" }, 405, corsHeaders);
});
