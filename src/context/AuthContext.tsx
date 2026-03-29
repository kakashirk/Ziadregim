import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface Profile {
  id: string
  first_name: string
  last_name: string
  role: 'admin' | 'user'
  is_active: boolean
}

interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: Profile | null
  isAdmin: boolean
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

// Supabase auth uses email internally; we build a synthetic one from first+last name
export function buildEmail(firstName: string, lastName: string): string {
  const clean = (s: string) =>
    s.toLowerCase().trim().replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return `${clean(firstName)}.${clean(lastName)}@ziadregim.app`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const sessionIdRef = useRef<string | null>(null)

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) setProfile(data as Profile)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) fetchProfile(session.user.id).finally(() => setLoading(false))
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)

      if (event === 'SIGNED_IN' && session?.user) {
        const { data } = await supabase
          .from('user_sessions')
          .insert({ user_id: session.user.id })
          .select('id')
          .single()
        if (data) sessionIdRef.current = (data as { id: string }).id
      }

      if (event === 'SIGNED_OUT' && sessionIdRef.current) {
        await supabase
          .from('user_sessions')
          .update({ logged_out_at: new Date().toISOString() })
          .eq('id', sessionIdRef.current)
        sessionIdRef.current = null
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
  }

  const isAdmin =
    (session?.user?.app_metadata?.role === 'admin') ||
    (profile?.role === 'admin')

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, profile, isAdmin, loading, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
