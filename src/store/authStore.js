import { create } from 'zustand'

const TOKEN_KEY = 'pft_token'
const USER_KEY = 'pft_user'

function loadPersisted() {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const userRaw = localStorage.getItem(USER_KEY)
    return {
      user: userRaw ? JSON.parse(userRaw) : null,
      accessToken: token || null,
      isAuthed: Boolean(token),
    }
  } catch {
    return { user: null, accessToken: null, isAuthed: false }
  }
}

export const useAuthStore = create((set) => ({
  ...loadPersisted(),
  setAuth: (user, accessToken) => {
    try {
      localStorage.setItem(TOKEN_KEY, accessToken)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } catch {
      // ignore storage failures — state still updates in memory
    }
    set({ user, accessToken, isAuthed: true })
  },
  clearAuth: () => {
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    } catch {
      // ignore storage failures
    }
    set({ user: null, accessToken: null, isAuthed: false })
  },
}))
