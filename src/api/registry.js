const REGISTRY_BASE = "/api/registry";

export async function fetchCommunityProof() {
  try {
    const res = await fetch(`${REGISTRY_BASE}/proof`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return { userCount: null, recent: [] };
    const data = await res.json();
    return {
      userCount: typeof data.userCount === "number" ? data.userCount : null,
      recent: Array.isArray(data.recent) ? data.recent : [],
    };
  } catch {
    return { userCount: null, recent: [] };
  }
}

export async function registerUser(token) {
  if (!token) return null;
  try {
    const res = await fetch(`${REGISTRY_BASE}/register`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function updatePublicationPreference(token, publishName, consentVersion = "2026-09-06") {
  if (!token) throw new Error("No authorization token");
  const res = await fetch(`${REGISTRY_BASE}/publication`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ publishName, consentVersion }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to update publication preference");
  }
  return await res.json();
}

export async function deleteRegistryUser(token) {
  if (!token) throw new Error("No authorization token");
  const res = await fetch(`${REGISTRY_BASE}/me`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok && res.status !== 204) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to delete registry record");
  }
  return true;
}
