import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthed: false,
  setAuth: (user, accessToken) => set({ user, accessToken, isAuthed: true }),
  clearAuth: () => set({ user: null, accessToken: null, isAuthed: false }),
}))
