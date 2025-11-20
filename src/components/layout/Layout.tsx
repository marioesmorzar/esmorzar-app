import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import { UpdatePrompt } from './UpdatePrompt'

interface LayoutProps {
  children: ReactNode
  showHeader?: boolean
}

export function Layout({ children, showHeader = true }: LayoutProps) {
  const { i18n } = useTranslation()
  const { profile, signOut } = useAuth()

  const changeLanguage = (lng: 'es' | 'ca') => {
    i18n.changeLanguage(lng)
    localStorage.setItem('language', lng)
    // Actualizar perfil si está logueado
    if (profile) {
      // TODO: Actualizar perfil en Supabase
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {showHeader && (
        <header className="bg-white border-b border-text/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">E</span>
            </div>
            <span className="font-bold text-text">Esmorzapp</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 border border-text/20 rounded-lg overflow-hidden">
              <button
                onClick={() => changeLanguage('es')}
                className={`px-3 py-1 text-sm transition-colors ${
                  i18n.language === 'es'
                    ? 'bg-primary text-white'
                    : 'bg-white text-text hover:bg-background'
                }`}
                aria-label="Cambiar a español"
              >
                ES
              </button>
              <button
                onClick={() => changeLanguage('ca')}
                className={`px-3 py-1 text-sm transition-colors ${
                  i18n.language === 'ca'
                    ? 'bg-primary text-white'
                    : 'bg-white text-text hover:bg-background'
                }`}
                aria-label="Canviar a valencià"
              >
                CA
              </button>
            </div>
            {profile && (
              <button
                onClick={() => signOut()}
                className="text-text/70 hover:text-text text-sm"
                aria-label="Cerrar sesión"
              >
                Salir
              </button>
            )}
          </div>
        </header>
      )}

      <UpdatePrompt />

      <main>{children}</main>
    </div>
  )
}

