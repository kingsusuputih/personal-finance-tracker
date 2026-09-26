import assert from "node:assert/strict";
import test from "node:test";

let envVars = {
  GOOGLE_CLIENT_ID: "test-client-id",
  REGISTRY_PEPPER: "test-pepper-12345678901234567890",
  GEMINI_API_KEY: "fake-gemini-key",
  GEMINI_MODEL: "",
};

let capturedHandler = null;

globalThis.Deno = {
  env: {
    get: (key) => envVars[key] || "",
  },
  serve: (handler) => {
    capturedHandler = handler;
  },
};

// Import the TypeScript chat edge function
await import("../supabase/functions/chat/index.ts");

assert.equal(typeof capturedHandler, "function", "Handler was not captured by Deno.serve");

function mockGoogleAuthSuccess() {
  return async (url) => {
    if (url.includes("oauth2.googleapis.com/tokeninfo") || url.includes("googleapis.com/oauth2/v3/userinfo")) {
      return new Response(JSON.stringify({ aud: "test-client-id", sub: "sub-12345", name: "Tester" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    throw new Error(`Unexpected fetch: ${url}`);
  };
}

test("rejects request without Authorization header with 401", async () => {
  const req = new Request("http://localhost/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Halo" }),
  });
  const res = await capturedHandler(req);
  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.error, "Unauthorized");
});

test("rejects request with empty message with 400", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = mockGoogleAuthSuccess();
  try {
    const req = new Request("http://localhost/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer fake-token",
      },
      body: JSON.stringify({ message: "   " }),
    });
    const res = await capturedHandler(req);
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.error, "Message is required");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("calls gemini with default model gemini-3.5-flash-lite and x-goog-api-key header", async () => {
  const originalFetch = globalThis.fetch;
  envVars.GEMINI_MODEL = "";
  let interceptedGeminiUrl = "";
  let interceptedHeaders = null;

  globalThis.fetch = async (url, opts) => {
    if (url.includes("oauth2.googleapis.com/tokeninfo") || url.includes("googleapis.com/oauth2/v3/userinfo")) {
      return new Response(JSON.stringify({ aud: "test-client-id", sub: "sub-12345", name: "Tester" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (url.includes("generativelanguage.googleapis.com")) {
      interceptedGeminiUrl = url;
      interceptedHeaders = opts.headers;
      return new Response(
        JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  { thought: true, text: "Thinking process..." },
                  { text: "Kondisi keuangan Anda bulan ini surplus." },
                ],
              },
              finishReason: "STOP",
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    throw new Error(`Unexpected fetch: ${url}`);
  };

  try {
    const req = new Request("http://localhost/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer fake-token",
      },
      body: JSON.stringify({ message: "Bagaimana kondisi keuanganku?" }),
    });
    const res = await capturedHandler(req);
    assert.equal(res.status, 200);
    const data = await res.json();

    assert(interceptedGeminiUrl.includes("models/gemini-3.5-flash-lite:generateContent"));
    assert(!interceptedGeminiUrl.includes("key="), "API key should not be in query string");
    assert.equal(interceptedHeaders["x-goog-api-key"], "fake-gemini-key");

    // Verified thinking part filtered out and normal text kept
    assert.equal(data.reply, "Kondisi keuangan Anda bulan ini surplus.");
    assert.equal(data.proposal, null);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("respects GEMINI_MODEL environment variable", async () => {
  const originalFetch = globalThis.fetch;
  envVars.GEMINI_MODEL = "gemini-3.8-flash";
  let interceptedGeminiUrl = "";

  globalThis.fetch = async (url) => {
    if (url.includes("oauth2.googleapis.com/tokeninfo") || url.includes("googleapis.com/oauth2/v3/userinfo")) {
      return new Response(JSON.stringify({ aud: "test-client-id", sub: "sub-12345", name: "Tester" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (url.includes("generativelanguage.googleapis.com")) {
      interceptedGeminiUrl = url;
      return new Response(
        JSON.stringify({
          candidates: [{ content: { parts: [{ text: "Siap." }] } }],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    throw new Error(`Unexpected fetch: ${url}`);
  };

  try {
    const req = new Request("http://localhost/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer fake-token",
      },
      body: JSON.stringify({ message: "Halo" }),
    });
    const res = await capturedHandler(req);
    assert.equal(res.status, 200);
    assert(interceptedGeminiUrl.includes("models/gemini-3.8-flash:generateContent"));
  } finally {
    globalThis.fetch = originalFetch;
    envVars.GEMINI_MODEL = "";
  }
});

test("handles 404 cleanly without blind fallback loops", async () => {
  const originalFetch = globalThis.fetch;
  let callCount = 0;

  globalThis.fetch = async (url) => {
    if (url.includes("oauth2.googleapis.com/tokeninfo") || url.includes("googleapis.com/oauth2/v3/userinfo")) {
      return new Response(JSON.stringify({ aud: "test-client-id", sub: "sub-12345", name: "Tester" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (url.includes("generativelanguage.googleapis.com")) {
      callCount += 1;
      return new Response(JSON.stringify({ error: { code: 404, message: "model not found" } }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    throw new Error(`Unexpected fetch: ${url}`);
  };

  try {
    const req = new Request("http://localhost/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer fake-token",
      },
      body: JSON.stringify({ message: "Halo" }),
    });
    const res = await capturedHandler(req);
    assert.equal(res.status, 502);
    const data = await res.json();
    assert(data.error.includes("tidak ditemukan"));
    assert.equal(callCount, 1, "Should only make one attempt for configured model");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("extracts proposal block accurately from model response", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url) => {
    if (url.includes("oauth2.googleapis.com/tokeninfo") || url.includes("googleapis.com/oauth2/v3/userinfo")) {
      return new Response(JSON.stringify({ aud: "test-client-id", sub: "sub-12345", name: "Tester" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (url.includes("generativelanguage.googleapis.com")) {
      const responseText = `Saya catat pengeluaran bensin Anda ya.
\`\`\`json
{
  "proposal": {
    "type": "expense",
    "amount": 50000,
    "category": "Needs",
    "description": "Bensin Pertalite",
    "date": "2026-09-27"
  }
}
\`\`\``;
      return new Response(
        JSON.stringify({
          candidates: [{ content: { parts: [{ text: responseText }] } }],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    throw new Error(`Unexpected fetch: ${url}`);
  };

  try {
    const req = new Request("http://localhost/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer fake-token",
      },
      body: JSON.stringify({ message: "Catat bensin 50rb" }),
    });
    const res = await capturedHandler(req);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.reply, "Saya catat pengeluaran bensin Anda ya.");
    assert.deepEqual(data.proposal, {
      type: "expense",
      amount: 50000,
      category: "Needs",
      description: "Bensin Pertalite",
      date: "2026-09-27",
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
