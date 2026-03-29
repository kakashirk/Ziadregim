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

interface UserSession {
  id: string
  logged_in_at: string
  logged_out_at: string | null
}

interface UserDetail {
  daily_goal_kcal: number | null
  foods: { id: string; name: string; calories_per_100g: number; quantity_in_stock: number }[]
  sessions: UserSession[]
  pageStats: { page: string; count: number }[]
}

function generateToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const PAGE_LABELS: Record<string, string> = {
  '/': 'Tableau de bord',
  '/plan': 'Repas',
  '/inventory': 'Garde-manger',
  '/settings': 'Réglages',
  '/admin': 'Admin',
}

function formatDuration(ms: number): string {
  const totalMin = Math.floor(ms / 60000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (h > 0) return `${h}h ${m}min`
  return `${m}min`
}

export function AdminPage() {
  const { isAdmin, user } = useAuth()
  const [tab, setTab] = useState<'users' | 'tokens' | 'settings'>('users')
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [tokens, setTokens] = useState<InviteToken[]>([])
  const [loading, setLoading] = useState(true)
  const [newLabel, setNewLabel] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)

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
    const { error } = await supabase.rpc('set_user_role', { target_user_id: profile.id, new_role: 'admin' })
    if (!error) setProfiles((prev) => prev.map((p) => p.id === profile.id ? { ...p, role: 'admin' } : p))
  }

  const removeAdmin = async (profile: Profile) => {
    const { error } = await supabase.rpc('set_user_role', { target_user_id: profile.id, new_role: 'user' })
    if (!error) setProfiles((prev) => prev.map((p) => p.id === profile.id ? { ...p, role: 'user' } : p))
  }

  const createToken = async () => {
    const token = generateToken()
    const { data } = await supabase.from('invite_tokens').insert({ token, label: newLabel.trim() || null }).select().single()
    if (data) { setTokens((prev) => [data as InviteToken, ...prev]); setNewLabel('') }
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
        <button onClick={() => setTab('users')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'users' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'}`}>
          Utilisateurs
        </button>
        <button onClick={() => setTab('tokens')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'tokens' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'}`}>
          Tokens
        </button>
        <button onClick={() => setTab('settings')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'settings' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'}`}>
          Réglages
        </button>
      </div>

      {tab === 'settings' ? (
        <SettingsPage />
      ) : loading ? (
        <p className="text-sm text-gray-400 text-center py-8">Chargement…</p>
      ) : tab === 'users' ? (
        <UsersTab
          profiles={profiles}
          onToggle={toggleUserActive}
          onMakeAdmin={makeAdmin}
          onRemoveAdmin={removeAdmin}
          onSelect={setSelectedProfile}
          currentUserId={user?.id}
        />
      ) : (
        <TokensTab tokens={tokens} newLabel={newLabel} onLabelChange={setNewLabel} onCreate={createToken} onRevoke={revokeToken} onCopy={copyToken} copied={copied} />
      )}

      {selectedProfile && (
        <UserProfileModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onDataDeleted={() => {
            setSelectedProfile(null)
            loadData()
          }}
        />
      )}
    </div>
  )
}

// ─── Users Tab ───────────────────────────────────────────────────────────────

function UsersTab({
  profiles, onToggle, onMakeAdmin, onRemoveAdmin, onSelect, currentUserId,
}: {
  profiles: Profile[]
  onToggle: (p: Profile) => void
  onMakeAdmin: (p: Profile) => void
  onRemoveAdmin: (p: Profile) => void
  onSelect: (p: Profile) => void
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
            <button className="flex-1 min-w-0 text-left" onClick={() => onSelect(p)}>
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
              <p className="text-xs text-gray-400 mt-0.5">Inscrit le {new Date(p.created_at).toLocaleDateString('fr-FR')}</p>
            </button>
            {!isSelf && (
              <div className="flex flex-col gap-1.5 shrink-0">
                {p.role === 'admin' ? (
                  <button onClick={() => onRemoveAdmin(p)} className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-600 text-xs font-semibold hover:bg-orange-100 transition-colors">
                    Retirer admin
                  </button>
                ) : (
                  <>
                    <button onClick={() => onMakeAdmin(p)} className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100 transition-colors">
                      Rendre admin
                    </button>
                    <button onClick={() => onToggle(p)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${p.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
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

// ─── User Profile Modal ───────────────────────────────────────────────────────

function UserProfileModal({ profile, onClose, onDataDeleted }: {
  profile: Profile
  onClose: () => void
  onDataDeleted: () => void
}) {
  const [detail, setDetail] = useState<UserDetail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(true)
  const [showFoods, setShowFoods] = useState(false)
  const [showSessions, setShowSessions] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function load() {
      setLoadingDetail(true)
      const [{ data: settings }, { data: foods }, { data: sessions }, { data: pageViews }] = await Promise.all([
        supabase.from('user_settings').select('daily_goal_kcal').eq('user_id', profile.id).single(),
        supabase.from('foods').select('id, name, calories_per_100g, quantity_in_stock').eq('user_id', profile.id).order('name'),
        supabase.from('user_sessions').select('id, logged_in_at, logged_out_at').eq('user_id', profile.id).order('logged_in_at', { ascending: false }),
        supabase.from('page_views').select('page').eq('user_id', profile.id),
      ])

      // Aggregate page views
      const pageCounts: Record<string, number> = {}
      for (const pv of (pageViews ?? [])) {
        pageCounts[pv.page] = (pageCounts[pv.page] ?? 0) + 1
      }
      const pageStats = Object.entries(pageCounts)
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)

      setDetail({
        daily_goal_kcal: (settings as any)?.daily_goal_kcal ?? null,
        foods: (foods ?? []) as UserDetail['foods'],
        sessions: (sessions ?? []) as UserSession[],
        pageStats,
      })
      setLoadingDetail(false)
    }
    load()
  }, [profile.id])

  const handleDeleteData = async () => {
    setDeleting(true)
    await Promise.all([
      supabase.from('foods').delete().eq('user_id', profile.id),
      supabase.from('daily_plans').delete().eq('user_id', profile.id),
      supabase.from('user_settings').delete().eq('user_id', profile.id),
      supabase.from('user_sessions').delete().eq('user_id', profile.id),
      supabase.from('page_views').delete().eq('user_id', profile.id),
    ])
    setDeleting(false)
    onDataDeleted()
  }

  // Analytics calculations
  const totalSessionMs = detail?.sessions.reduce((acc, s) => {
    if (!s.logged_out_at) return acc
    return acc + (new Date(s.logged_out_at).getTime() - new Date(s.logged_in_at).getTime())
  }, 0) ?? 0

  const lastSeen = detail?.sessions[0]
    ? detail.sessions[0].logged_out_at ?? detail.sessions[0].logged_in_at
    : null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={onClose}>
      <div
        className="bg-gray-50 w-full max-w-md mx-auto rounded-t-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-brand-600 text-white px-4 py-4 rounded-t-3xl flex items-center gap-3">
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <p className="font-bold text-lg">{profile.first_name} {profile.last_name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${profile.role === 'admin' ? 'bg-purple-200 text-purple-900' : 'bg-white/20 text-white'}`}>
                {profile.role === 'admin' ? 'Admin' : 'Utilisateur'}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${profile.is_active ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>
                {profile.is_active ? 'Actif' : 'Bloqué'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-4 pb-10">
          {loadingDetail ? (
            <p className="text-sm text-gray-400 text-center py-8">Chargement du profil…</p>
          ) : (
            <>
              {/* Info générale */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Informations</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Inscrit le</span>
                  <span className="font-medium">{new Date(profile.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Objectif calorique</span>
                  <span className="font-medium text-brand-600">
                    {detail?.daily_goal_kcal ? `${detail.daily_goal_kcal} kcal/jour` : 'Non défini'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Aliments enregistrés</span>
                  <span className="font-medium">{detail?.foods.length ?? 0}</span>
                </div>
              </div>

              {/* Aliments */}
              {(detail?.foods.length ?? 0) > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-2">
                  <button
                    className="flex items-center justify-between w-full"
                    onClick={() => setShowFoods(!showFoods)}
                  >
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Aliments ({detail!.foods.length})
                    </p>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${showFoods ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showFoods && (
                    <div className="flex flex-col gap-1 mt-1">
                      {detail!.foods.map((f) => (
                        <div key={f.id} className="flex items-center justify-between py-1.5 border-t border-gray-50">
                          <span className="text-sm text-gray-800">{f.name}</span>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{f.calories_per_100g} kcal/100g</span>
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded">{f.quantity_in_stock}g</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Analytics */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Analytiques</p>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-brand-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-brand-600">{detail?.sessions.length ?? 0}</p>
                    <p className="text-xs text-gray-500">connexions</p>
                  </div>
                  <div className="bg-brand-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-brand-600">{totalSessionMs > 0 ? formatDuration(totalSessionMs) : '—'}</p>
                    <p className="text-xs text-gray-500">temps total</p>
                  </div>
                </div>

                {lastSeen && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Dernière activité</span>
                    <span className="font-medium">
                      {new Date(lastSeen).toLocaleDateString('fr-FR')} à {new Date(lastSeen).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}

                {(detail?.pageStats.length ?? 0) > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-gray-500 font-medium">Pages les plus visitées</p>
                    {detail!.pageStats.slice(0, 4).map(({ page, count }) => (
                      <div key={page} className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-brand-400 h-2 rounded-full"
                            style={{ width: `${Math.min(100, (count / detail!.pageStats[0].count) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 w-28 truncate">{PAGE_LABELS[page] ?? page}</span>
                        <span className="text-xs font-semibold text-gray-700 w-6 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Historique sessions */}
                {(detail?.sessions.length ?? 0) > 0 && (
                  <div className="flex flex-col gap-1">
                    <button
                      className="flex items-center justify-between w-full"
                      onClick={() => setShowSessions(!showSessions)}
                    >
                      <p className="text-xs text-gray-500 font-medium">Historique des connexions</p>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${showSessions ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showSessions && (
                      <div className="flex flex-col gap-1 mt-1">
                        {detail!.sessions.slice(0, 10).map((s) => (
                          <div key={s.id} className="flex items-center justify-between py-1 border-t border-gray-50 text-xs text-gray-600">
                            <span>{new Date(s.logged_in_at).toLocaleDateString('fr-FR')} {new Date(s.logged_in_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="text-gray-400">→</span>
                            <span>
                              {s.logged_out_at
                                ? new Date(s.logged_out_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                                : <span className="text-green-500">En ligne</span>}
                            </span>
                            {s.logged_out_at && (
                              <span className="text-brand-500 font-medium">
                                {formatDuration(new Date(s.logged_out_at).getTime() - new Date(s.logged_in_at).getTime())}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Zone de danger */}
              <div className="bg-white rounded-2xl border border-red-100 p-4 flex flex-col gap-3">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Zone de danger</p>
                <p className="text-xs text-gray-500">
                  Supprime tous les aliments, repas, réglages et historique de <strong>{profile.first_name}</strong>. Le compte reste actif.
                </p>
                {!confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
                  >
                    Supprimer toutes les données
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-red-600 font-semibold">Confirmer la suppression ?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setConfirmDelete(false)} className="flex-1 px-3 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold">
                        Annuler
                      </button>
                      <button
                        onClick={handleDeleteData}
                        disabled={deleting}
                        className="flex-1 px-3 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold disabled:opacity-50"
                      >
                        {deleting ? 'Suppression…' : 'Confirmer'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Tokens Tab ───────────────────────────────────────────────────────────────

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
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3">
        <p className="text-sm font-semibold text-gray-900">Créer un token d'invitation</p>
        <input
          type="text"
          placeholder="Label (ex. prénom de l'ami)"
          value={newLabel}
          onChange={(e) => onLabelChange(e.target.value)}
          className="block w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <Button onClick={onCreate} fullWidth>Générer un token</Button>
      </div>
      <div className="flex flex-col gap-2">
        {tokens.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Aucun token créé</p>}
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
                    <button onClick={() => onCopy(t.token)} className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-600 text-xs font-semibold hover:bg-brand-100 transition-colors">
                      {copied === t.token ? 'Copié ✓' : 'Copier'}
                    </button>
                    <button onClick={() => onRevoke(t.id)} className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors">
                      Révoquer
                    </button>
                  </>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-400">
              {t.used_by ? `Utilisé le ${new Date(t.used_at!).toLocaleDateString('fr-FR')}` : t.is_active ? 'Disponible' : 'Révoqué'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
