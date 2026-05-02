import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { clearToken, setToken } from '../api/auth'
import { createUser, obtainToken } from '../api/users'
import type { RegisterPayload } from '../types/auth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPayload>()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = handleSubmit(async (payload) => {
    setLoading(true)
    setError(null)

    try {
      await createUser(payload)
      clearToken()
      const { token } = await obtainToken({
        email: payload.email,
        password: payload.password,
      })
      setToken(token)
      navigate('/recipes')
    } catch {
      setError('Kayıt oluşturulamadı. Bilgileri kontrol et.')
    } finally {
      setLoading(false)
    }
  })

  return (
    <main className="shell auth-shell">
      <AuthForm
        title="Kayıt ol"
        description="Yeni hesap oluştur ve otomatik olarak giriş yap."
        onSubmit={onSubmit}
        submitLabel={loading ? 'Kayıt oluşturuluyor...' : 'Kayıt ol'}
        error={error}
        helpText={<Link to="/login">Zaten hesabın var mı? Giriş yap.</Link>}
        footer={<Link to="/">Ana sayfaya dön</Link>}
      >
        <label className="field">
          <span>Ad</span>
          <input
            placeholder="Recep"
            autoComplete="name"
            {...register('name', { required: 'Ad zorunlu.' })}
          />
          {errors.name ? <small>{errors.name.message}</small> : null}
        </label>

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
            placeholder="En az 5 karakter"
            autoComplete="new-password"
            {...register('password', { required: 'Şifre zorunlu.' })}
          />
          {errors.password ? <small>{errors.password.message}</small> : null}
        </label>
      </AuthForm>
    </main>
  )
}
