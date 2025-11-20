import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../hooks/useAuth'
import { Layout } from '../components/layout/Layout'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

const registerSchema = z.object({
  username: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function Register() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true)
      setError(null)
      const language = (i18n.language === 'ca' ? 'ca' : 'es') as 'es' | 'ca'
      const { error } = await signUp(data.email, data.password, data.username, language)
      if (error) {
        setError(error.message)
      } else {
        navigate('/home')
      }
    } catch (err) {
      setError('Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-text mb-8 text-center">
            {t('auth.register')}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t('auth.whatShouldICallYou')}
              type="text"
              placeholder="Ej. Alberto"
              {...register('username')}
              error={errors.username?.message}
            />

            <Input
              label={t('auth.email')}
              type="email"
              placeholder={t('auth.writeEmail')}
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              label={t('auth.password')}
              type="password"
              placeholder={t('auth.createPassword')}
              {...register('password')}
              error={errors.password?.message}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('common.loading') : t('auth.register')}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link
              to="/login"
              className="text-text/70 hover:text-text text-sm"
            >
              {t('auth.alreadyHaveAccount')}
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

