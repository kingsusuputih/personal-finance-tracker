const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID") || "";
const REGISTRY_PEPPER = Deno.env.get("REGISTRY_PEPPER") || "default_pepper_change_in_prod";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";
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
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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

const userMinuteLimits = new Map<string, { count: number; resetAt: number }>();
let globalCooldownUntil = 0;

function checkQuota(userId: string): { allowed: boolean; retryAfter?: number; error?: string } {
  const now = Date.now();

  if (now < globalCooldownUntil) {
    const retryAfter = Math.ceil((globalCooldownUntil - now) / 1000);
    return {
      allowed: false,
      retryAfter,
      error: "QUOTA_EXCEEDED",
    };
  }

  const userRecord = userMinuteLimits.get(userId) || { count: 0, resetAt: now + 60000 };
  if (now > userRecord.resetAt) {
    userRecord.count = 1;
    userRecord.resetAt = now + 60000;
  } else {
    userRecord.count += 1;
  }
  userMinuteLimits.set(userId, userRecord);

  if (userRecord.count > 5) {
    const retryAfter = Math.ceil((userRecord.resetAt - now) / 1000);
    return {
      allowed: false,
      retryAfter,
      error: "RATE_LIMITED",
    };
  }

  return { allowed: true };
}

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, corsHeaders);
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
  const quotaCheck = checkQuota(identityHash);
  if (!quotaCheck.allowed) {
    return jsonResponse(
      {
        error: quotaCheck.error,
        message: "Batas permintaan tercapai. Silakan coba kembali nanti.",
        retryAfter: quotaCheck.retryAfter,
      },
      429,
      corsHeaders,
    );
  }

  let body: { message?: string; history?: Array<{ role: string; text: string }>; summary?: unknown };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400, corsHeaders);
  }

  const userMessage = String(body.message || "").trim();
  if (!userMessage) {
    return jsonResponse({ error: "Message is required" }, 400, corsHeaders);
  }

  if (!GEMINI_API_KEY) {
    return jsonResponse(
      {
        reply: "Asisten AI saat ini beroperasi dalam mode pengujian lokal (kunci API Gemini belum dikonfigurasi di server). Silakan konfigurasi GEMINI_API_KEY di Supabase Secrets.",
        proposal: null,
      },
      200,
      corsHeaders,
    );
  }

  const systemPrompt = `Anda adalah asisten keuangan pribadi cerdas untuk aplikasi Finance Tracker (dalam Bahasa Indonesia).
Data ringkasan keuangan pengguna saat ini:
${JSON.stringify(body.summary || {}, null, 2)}

Tugas Anda:
1. Menjawab pertanyaan pengguna mengenai kondisi keuangan, sisa uang yang bisa ditabung/investasi, surplus/defisit, dan analisis pengeluaran dengan bahasa Indonesia yang santun, ringkas, dan jelas.
2. Jika pengguna meminta atau menyatakan ingin mencatat pengeluaran atau pemasukan (misal: "tadi beli rokok 30rb", "tambah pemasukan bonus 500rb", "gaji bulan ini 10jt"), sertakan satu blok JSON proposal di akhir respons dengan format:
\`\`\`json
{
  "proposal": {
    "type": "expense" | "income" | "additional_income",
    "amount": 30000,
    "category": "Needs" | "Lifestyle" | "Investment",
    "description": "Beli rokok",
    "date": "YYYY-MM-DD",
    "source": "Bonus"
  }
}
\`\`\`
Kategori untuk expense hanya boleh salah satu dari: "Needs", "Lifestyle", "Investment".
Jika tidak ada permintaan mencatat, jangan sertakan blok JSON proposal.`;

  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
  const history = Array.isArray(body.history) ? body.history.slice(-6) : [];
  history.forEach((h) => {
    contents.push({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: String(h.text || "") }],
    });
  });
  contents.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 800,
        },
      }),
      signal: AbortSignal.timeout(25000),
    });

    if (geminiRes.status === 429) {
      const retryHeader = geminiRes.headers.get("retry-after");
      const retrySeconds = retryHeader ? parseInt(retryHeader, 10) || 60 : 60;
      globalCooldownUntil = Date.now() + retrySeconds * 1000;
      return jsonResponse(
        {
          error: "QUOTA_EXCEEDED",
          message: "Kuota Google Gemini gratis sementara telah habis.",
          retryAfter: retrySeconds,
        },
        429,
        corsHeaders,
      );
    }

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return jsonResponse({ error: "Gemini error: " + errText }, 502, corsHeaders);
    }

    const data = await geminiRes.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let proposal = null;
    const jsonMatch = candidate.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.proposal && typeof parsed.proposal === "object") {
          proposal = parsed.proposal;
        }
      } catch {
        proposal = null;
      }
    }

    const cleanReply = candidate.replace(/```json[\s\S]*?```/g, "").trim();

    return jsonResponse(
      {
        reply: cleanReply || candidate,
        proposal,
      },
      200,
      corsHeaders,
    );
  } catch (err: any) {
    return jsonResponse(
      { error: "Service unavailable: " + (err.message || "Timeout") },
      503,
      corsHeaders,
    );
  }
});
