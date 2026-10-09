async function parseJsonResponse(res, defaultError) {
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    if (/^\s*(<!doctype|<html)/i.test(text)) {
      throw new Error("Layanan notifikasi belum terpasang atau URL endpoint mengembalikan HTML");
    }
    throw new Error(defaultError);
  }

  if (!res.ok) {
    const message = data?.message || data?.error || defaultError;
    throw new Error(message);
  }

  return data;
}

export function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function getVapidPublicKey() {
  const res = await fetch("/api/notify/config");
  const data = await parseJsonResponse(res, "Failed to fetch notification config");
  return data?.vapidPublicKey || "";
}

export async function subscribeDevice(accessToken, payload) {
  const res = await fetch("/api/notify/subscribe", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return parseJsonResponse(res, "Failed to register push subscription");
}

export async function syncAlertState(accessToken, payload) {
  const res = await fetch("/api/notify/state", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return parseJsonResponse(res, "Failed to sync alert state");
}

export async function pingActivity(accessToken) {
  const res = await fetch("/api/notify/activity", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  return parseJsonResponse(res, "Failed to ping activity");
}

export async function unsubscribeDevice(accessToken, endpoint) {
  const res = await fetch("/api/notify/unsubscribe", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ endpoint }),
  });
  return parseJsonResponse(res, "Failed to unsubscribe");
}
