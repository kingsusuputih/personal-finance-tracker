export async function fetchUserInfo(accessToken) {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error('Failed to load profile')
  return res.json()
}

export async function revokeAccessToken(accessToken) {
  try {
    await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, { method: 'POST' })
  } catch {
    // revocation is best-effort; clearing local state is what matters
  }
}
