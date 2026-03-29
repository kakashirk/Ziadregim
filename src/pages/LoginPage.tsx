import { useState, type FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { buildEmail } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function LoginPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !password) {
      setError('Tous les champs sont requis')
      return
    }
    setLoading(true)
    setError('')
    const email = buildEmail(firstName, lastName)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError('Prénom, nom ou mot de passe incorrect')
    setLoading(false)
  }

  if (showRegister) return <RegisterForm onBack={() => setShowRegister(false)} />

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ZiadRegim</h1>
          <p className="text-sm text-gray-500 mt-1">Ton suivi nutritionnel personnel</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Connexion</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              label="Prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="ex. Yassine"
              autoFocus
            />
            <Input
              label="Nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="ex. Jost"
            />
            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>
            )}
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Première connexion ?{' '}
          <button
            onClick={() => setShowRegister(true)}
            className="text-brand-600 font-medium hover:underline"
          >
            Créer mon compte
          </button>
        </p>
      </div>
    </div>
  )
}

// ── Register form (embedded) ──────────────────────────────────────────────────
function RegisterForm({ onBack }: { onBack: () => void }) {
  const [token, setToken] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!token.trim() || !firstName.trim() || !lastName.trim() || !password) {
      setError('Tous les champs sont requis')
      return
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    setLoading(true)

    // 1. Verify token exists, is active, and not yet used
    const { data: tokenRow, error: tokenErr } = await supabase
      .from('invite_tokens')
      .select('id')
      .eq('token', token.trim())
      .eq('is_active', true)
      .is('used_by', null)
      .single()

    if (tokenErr || !tokenRow) {
      setError("Token d'invitation invalide ou déjà utilisé")
      setLoading(false)
      return
    }

    // 2. Create Supabase auth user
    const email = buildEmail(firstName, lastName)
    const { data: authData, error: signUpErr } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: undefined },
    })

    if (signUpErr || !authData.user) {
      if (signUpErr?.message?.includes('already registered')) {
        setError('Ce prénom/nom est déjà utilisé. Choisissez un autre.')
      } else {
        setError(signUpErr?.message ?? "Erreur lors de la création du compte")
      }
      setLoading(false)
      return
    }

    const userId = authData.user.id

    // 3. Create profile
    await supabase.from('profiles').insert({
      id: userId,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      role: 'user',
      is_active: true,
    })

    // 4. Mark token as used
    await supabase
      .from('invite_tokens')
      .update({ used_by: userId, used_at: new Date().toISOString() })
      .eq('id', tokenRow.id)

    // 5. Create default settings
    await supabase.from('user_settings').insert({ user_id: userId, daily_goal_kcal: 2000 })

    setLoading(false)
    // Auth state change will redirect automatically
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ZiadRegim</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Créer mon compte</h2>
          <p className="text-sm text-gray-500 mb-5">Tu as besoin d'un token d'invitation pour accéder à l'app.</p>
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <Input
              label="Token d'invitation"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ex. ABC123XYZ"
              hint="Demande ce code à l'administrateur"
              autoFocus
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="ex. Yassine"
              />
              <Input
                label="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="ex. Jost"
              />
            </div>
            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 caractères"
            />
            <Input
              label="Confirmer le mot de passe"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
            />
            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>
            )}
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Création…' : 'Créer mon compte'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Déjà un compte ?{' '}
          <button onClick={onBack} className="text-brand-600 font-medium hover:underline">
            Se connecter
          </button>
        </p>
      </div>
    </div>
  )
}
