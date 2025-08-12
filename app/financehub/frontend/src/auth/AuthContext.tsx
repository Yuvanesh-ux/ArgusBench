import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

type User = { sub?: string; email?: string; name?: string } | null

type AuthContextType = {
  user: User
  token: string | null
  setToken: (t: string | null) => void
  tenant: string
  setTenant: (t: string) => void
  refreshMe: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, _setToken] = useState<string | null>(localStorage.getItem('token'))
  const [tenant, _setTenant] = useState<string>(localStorage.getItem('tenant') || 'demo-tenant')
  const [user, setUser] = useState<User>(null)

  const setToken = (t: string | null) => {
    _setToken(t)
    if (t) localStorage.setItem('token', t)
    else localStorage.removeItem('token')
  }
  const setTenant = (t: string) => {
    _setTenant(t)
    localStorage.setItem('tenant', t)
  }

  const refreshMe = async () => {
    try {
      const r = await api.get('/api/auth/me')
      setUser(r.data)
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    if (token) refreshMe()
  }, [token])

  const value = useMemo(() => ({ user, token, setToken, tenant, setTenant, refreshMe }), [user, token, tenant])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


