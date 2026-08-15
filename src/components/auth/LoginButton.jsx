import { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '../../hooks/useAuth.js'
import { useToast } from '../ui/Toast.jsx'
import { Button } from '../ui/Button.jsx'

const SCOPES = ['email', 'profile', 'drive.file', 'spreadsheets'].join(' ')

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.87-3c-1.08.72-2.45 1.15-4.08 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.29a12 12 0 0 0 0 10.74l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.23 0 12 0A12 12 0 0 0 1.29 6.63l3.98 3.09C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  )
}

export function LoginButton() {
  const { login } = useAuth()
  const toast = useToast()
  const [pending, setPending] = useState(false)

  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    scope: SCOPES,
    onSuccess: async (response) => {
      setPending(true)
      try {
        await login(response.access_token)
      } catch (err) {
        toast.error(err.message || 'Sign in failed')
      } finally {
        setPending(false)
      }
    },
    onError: () => toast.error('Google sign in was cancelled or failed'),
  })

  return (
    <Button
      variant="secondary"
      size="lg"
      className="w-full"
      loading={pending}
      onClick={() => googleLogin()}
    >
      {!pending && <GoogleMark />}
      Sign in with Google
    </Button>
  )
}
