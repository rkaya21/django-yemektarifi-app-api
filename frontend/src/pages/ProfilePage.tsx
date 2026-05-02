import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clearToken } from '../api/auth'
import { getProfile, updateProfile } from '../api/users'
import type { RegisterPayload, UserProfile } from '../types/auth'

export default function ProfilePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [success, setSuccess] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterPayload>()

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  useEffect(() => {
    if (profileQuery.data) {
      reset({
        name: profileQuery.data.name,
        email: profileQuery.data.email,
        password: '',
      })
    }
  }, [profileQuery.data, reset])

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async (data: UserProfile) => {
      setSuccess('Profil güncellendi.')
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
      reset({
        name: data.name,
        email: data.email,
        password: '',
      })
    },
  })

  const onSubmit = handleSubmit(async (payload) => {
    setSuccess(null)
    const requestBody: Partial<RegisterPayload> = {
      name: payload.name,
      email: payload.email,
    }

    if (payload.password) {
      requestBody.password = payload.password
    }

    profileMutation.mutate(requestBody)
  })

  if (profileQuery.isLoading) {
    return (
      <main className="shell auth-shell">
        <div className="status-card">Profil yükleniyor...</div>
      </main>
    )
  }

  if (profileQuery.isError) {
    return (
      <main className="shell auth-shell">
        <div className="status-card status-card--error">
          Profil alınamadı.
          <div className="status-card__actions">
            <button
              className="button button--primary"
              type="button"
              onClick={() => {
                clearToken()
                navigate('/login')
              }}
            >
              Girişe dön
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="shell auth-shell">
      <div className="auth-card">
        <div className="auth-card__header">
          <span className="eyebrow">Profil</span>
          <h1 className="page-title">Hesap bilgileri</h1>
          <p className="lede">Adını, e-postanı ve şifreni güncelle.</p>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <label className="field">
            <span>Ad</span>
            <input
              autoComplete="name"
              {...register('name', { required: 'Ad zorunlu.' })}
            />
            {errors.name ? <small>{errors.name.message}</small> : null}
          </label>

          <label className="field">
            <span>E-posta</span>
            <input
              type="email"
              autoComplete="email"
              {...register('email', { required: 'E-posta zorunlu.' })}
            />
            {errors.email ? <small>{errors.email.message}</small> : null}
          </label>

          <label className="field">
            <span>Yeni şifre</span>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Boş bırakılabilir"
              {...register('password')}
            />
          </label>

          {success ? <p className="form-success">{success}</p> : null}
          {profileMutation.isError ? (
            <p className="form-error" role="alert">
              Profil güncellenemedi.
            </p>
          ) : null}

          <button className="button button--primary auth-submit" type="submit">
            {profileMutation.isPending ? 'Kaydediliyor...' : 'Değişiklikleri kaydet'}
          </button>
        </form>

        <div className="auth-footer auth-footer--split">
          <Link to="/recipes">Tariflere dön</Link>
          <button
            className="button button--ghost"
            type="button"
            onClick={() => {
              clearToken()
              navigate('/login')
            }}
          >
            Çıkış yap
          </button>
        </div>
      </div>
    </main>
  )
}
