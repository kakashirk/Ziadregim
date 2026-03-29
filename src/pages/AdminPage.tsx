import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { Navigate } from 'react-router-dom'
import { SettingsPage } from '@/pages/SettingsPage'

interface Profile {
  id: string
  first_name: string
  last_name: string
  role: string
  is_active: boolean
  created_at: string
}

interface InviteToken {
  id: string
  token: string
  label: string | null
  used_by: string | null
  used_at: string | null
  is_active: boolean
  created_at: string
}

function generateToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export function AdminPage() {
  const { isAdmin, user } = useAuth()
  const [tab, setTab] = useState<'users' | 'tokens' | 'settings'>('users')
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [tokens, setTokens] = useState<InviteToken[]>([])
  const [loading, setLoading] = useState(true)
  const [newLabel, setNewLabel] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  if (!isAdmin) return <Navigate to="/" replace />

  const loadData = useCallback(async () => {
    setLoading(true)
    const [{ data: prof }, { data: tok }] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('invite_tokens').select('*').order('created_at', { ascending: false }),
    ])
    setProfiles((prof ?? []) as Profile[])
    setTokens((tok ?? []) as InviteToken[])
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const toggleUserActive = async (profile: Profile) => {
    await supabase.from('profiles').update({ is_active: !profile.is_active }).eq('id', profile.id)
    setProfiles((prev) => prev.map((p) => p.id === profile.id ? { ...p, is_active: !p.is_active } : p))
  }

  const makeAdmin = async (profile: Profile) => {
    const { error } = await supabase.rpc('set_user_role', {
      target_user_id: profile.id,
      new_role: 'admin',
    })
    if (!error) {
      setProfiles((prev) => prev.map((p) => p.id === profile.id ? { ...p, role: 'admin' } : p))
    }
  }

  const removeAdmin = async (profile: Profile) => {
    const { error } = await supabase.rpc('set_user_role', {
      target_user_id: profile.id,
      new_role: 'user',
    })
    if (!error) {
      setProfiles((prev) => prev.map((p) => p.id === profile.id ? { ...p, role: 'user' } : p))
    }
  }

  const createToken = async () => {
    const token = generateToken()
    const { data } = await supabase
      .from('invite_tokens')
      .insert({ token, label: newLabel.trim() || null })
      .select()
      .single()
    if (data) {
      setTokens((prev) => [data as InviteToken, ...prev])
      setNewLabel('')
    }
  }

  const revokeToken = async (id: string) => {
    await supabase.from('invite_tokens').update({ is_active: false }).eq('id', id)
    setTokens((prev) => prev.map((t) => t.id === id ? { ...t, is_active: false } : t))
  }

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token)
    setCopied(token)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="flex flex-col gap-4 pb-24">
      <div className="bg-brand-600 text-white px-4 py-3 -mx-4 -mt-4 mb-2 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="font-semibold">Panel Administrateur</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setTab('users')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'users' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'}`}
        >
          Utilisateurs
        </button>
        <button
          onClick={() => setTab('tokens')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'tokens' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'}`}
        >
          Tokens
        </button>
        <button
          onClick={() => setTab('settings')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'settings' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'}`}
        >
          Réglages
        </button>
      </div>

      {tab === 'settings' ? (
        <SettingsPage />
      ) : loading ? (
        <p className="text-sm text-gray-400 text-center py-8">Chargement…</p>
      ) : tab === 'users' ? (
        <UsersTab profiles={profiles} onToggle={toggleUserActive} onMakeAdmin={makeAdmin} onRemoveAdmin={removeAdmin} currentUserId={user?.id} />
      ) : (
        <TokensTab
          tokens={tokens}
          newLabel={newLabel}
          onLabelChange={setNewLabel}
          onCreate={createToken}
          onRevoke={revokeToken}
          onCopy={copyToken}
          copied={copied}
        />
      )}
    </div>
  )
}

function UsersTab({
  profiles,
  onToggle,
  onMakeAdmin,
  onRemoveAdmin,
  currentUserId,
}: {
  profiles: Profile[]
  onToggle: (p: Profile) => void
  onMakeAdmin: (p: Profile) => void
  onRemoveAdmin: (p: Profile) => void
  currentUserId: string | undefined
}) {
  if (profiles.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">Aucun utilisateur inscrit</p>
  }
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-500">{profiles.length} utilisateur{profiles.length > 1 ? 's' : ''}</p>
      {profiles.map((p) => {
        const isSelf = p.id === currentUserId
        return (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {p.first_name} {p.last_name}
                {isSelf && <span className="ml-1.5 text-xs text-brand-500 font-normal">(moi)</span>}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                  {p.role === 'admin' ? 'Admin' : 'Utilisateur'}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {p.is_active ? 'Actif' : 'Bloqué'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Inscrit le {new Date(p.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
            {!isSelf && (
              <div className="flex flex-col gap-1.5 shrink-0">
                {p.role === 'admin' ? (
                  <button
                    onClick={() => onRemoveAdmin(p)}
                    className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-600 text-xs font-semibold hover:bg-orange-100 transition-colors"
                  >
                    Retirer admin
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onMakeAdmin(p)}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100 transition-colors"
                    >
                      Rendre admin
                    </button>
                    <button
                      onClick={() => onToggle(p)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        p.is_active
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {p.is_active ? 'Bloquer' : 'Réactiver'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function TokensTab({
  tokens, newLabel, onLabelChange, onCreate, onRevoke, onCopy, copied,
}: {
  tokens: InviteToken[]
  newLabel: string
  onLabelChange: (v: string) => void
  onCreate: () => void
  onRevoke: (id: string) => void
  onCopy: (token: string) => void
  copied: string | null
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Create token */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3">
        <p className="text-sm font-semibold text-gray-900">Créer un token d'invitation</p>
        <input
          type="text"
          placeholder="Label (ex. prénom de l'ami)"
          value={newLabel}
          onChange={(e) => onLabelChange(e.target.value)}
          className="block w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <Button onClick={onCreate} fullWidth>
          Générer un token
        </Button>
      </div>

      {/* Token list */}
      <div className="flex flex-col gap-2">
        {tokens.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">Aucun token créé</p>
        )}
        {tokens.map((t) => (
          <div key={t.id} className={`bg-white rounded-2xl border p-4 flex flex-col gap-2 ${t.is_active && !t.used_by ? 'border-green-200' : 'border-gray-100 opacity-60'}`}>
            <div className="flex items-center justify-between gap-2">
              <div>
                {t.label && <p className="text-xs text-gray-500 mb-0.5">{t.label}</p>}
                <p className="font-mono font-bold text-gray-900 text-base tracking-widest">{t.token}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {t.is_active && !t.used_by && (
                  <>
                    <button
                      onClick={() => onCopy(t.token)}
                      className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-600 text-xs font-semibold hover:bg-brand-100 transition-colors"
                    >
                      {copied === t.token ? 'Copié ✓' : 'Copier'}
                    </button>
                    <button
                      onClick={() => onRevoke(t.id)}
                      className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors"
                    >
                      Révoquer
                    </button>
                  </>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-400">
              {t.used_by
                ? `Utilisé le ${new Date(t.used_at!).toLocaleDateString('fr-FR')}`
                : t.is_active
                ? 'Disponible'
                : 'Révoqué'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
