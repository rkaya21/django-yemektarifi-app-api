import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { obtainToken } from '../api/users'
import { setToken } from '../api/auth'
import type { LoginPayload } from '../types/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = handleSubmit(async (payload) => {
    setLoading(true)
    setError(null)

    try {
      const { token } = await obtainToken(payload)
      setToken(token)
      navigate('/recipes')
    } catch {
      setError('Giriş yapılamadı. E-posta ve şifreyi kontrol et.')
    } finally {
      setLoading(false)
    }
  })

  return (
    <main className="shell auth-shell">
      <AuthForm
        title="Giriş yap"
        description="Token al ve tarif paneline geç."
        onSubmit={onSubmit}
        submitLabel={loading ? 'Giriş yapılıyor...' : 'Giriş yap'}
        error={error}
        helpText={<Link to="/register">Hesabın yok mu? Kayıt ol.</Link>}
        footer={<Link to="/">Ana sayfaya dön</Link>}
      >
        <label className="field">
          <span>E-posta</span>
          <input
            type="email"
            placeholder="user@example.com"
            autoComplete="email"
            {...register('email', { required: 'E-posta zorunlu.' })}
          />
          {errors.email ? <small>{errors.email.message}</small> : null}
        </label>

        <label className="field">
          <span>Şifre</span>
          <input
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register('password', { required: 'Şifre zorunlu.' })}
          />
          {errors.password ? <small>{errors.password.message}</small> : null}
        </label>
      </AuthForm>
    </main>
  )
}
