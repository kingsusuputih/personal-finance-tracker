export async function sendChatMessage({ accessToken, message, history = [], summary = {} }) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      message,
      history,
      summary,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || data.error || "Gagal menghubungi asisten AI");
    error.status = res.status;
    error.retryAfter = data.retryAfter;
    error.code = data.error;
    throw error;
  }

  return data;
}
