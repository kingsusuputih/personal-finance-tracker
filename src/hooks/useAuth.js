import { useAuthStore } from "../store/authStore.js";
import { useFinanceStore } from "../store/financeStore.js";
import { fetchUserInfo, revokeAccessToken } from "../api/googleAuth.js";
import { registerUser } from "../api/registry.js";

export function useAuth() {
  const { user, accessToken, isAuthed, setAuth, clearAuth } = useAuthStore();

  async function login(accessTokenFromGoogle) {
    const info = await fetchUserInfo(accessTokenFromGoogle);
    setAuth(
      { email: info.email, name: info.name, picture: info.picture },
      accessTokenFromGoogle,
    );
    registerUser(accessTokenFromGoogle).catch(() => {});
  }

  async function logout() {
    const token = useAuthStore.getState().accessToken;
    clearAuth();
    useFinanceStore.getState().reset();
    if (token) revokeAccessToken(token);
  }

  return { user, accessToken, isAuthed, login, logout };
}
