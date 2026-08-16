import { useAuthStore } from "../store/authStore.js";

export async function authedRequest(accessToken, url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) {
    useAuthStore.getState().clearAuth();
    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
    throw new Error("Session expired — sign in again");
  }
  return res;
}
