import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { useEsmorzar } from '../hooks/useEsmorzar'
import { Layout } from '../components/layout/Layout'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { formatDate } from '../lib/utils'

export default function History() {
  const { t } = useTranslation()
  const { profile } = useAuth()
  const { esmorzars, loading } = useEsmorzar(profile?.id)

  return (
    <Layout>
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/home" className="text-text/70 hover:text-text">
            ←
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text">
              {t('history.title')}
            </h1>
            <p className="text-sm text-text/70 mt-1">
              {t('history.orderedByDate')}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-text/70">{t('common.loading')}</div>
        ) : esmorzars.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🍽️</div>
              <p className="font-bold text-text mb-1">{t('dashboard.noEsmorzarYet')}</p>
              <p className="text-sm text-text/70">{t('dashboard.addFirst')}</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {esmorzars.map((esmorzar) => (
              <Link key={esmorzar.id} to={`/esmorzar/${esmorzar.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-text text-lg">
                        {esmorzar.bars?.name || 'Bar'}
                      </h3>
                      <p className="text-sm text-text/70">
                        {formatDate(esmorzar.date)}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      {t('history.seeEsmorzar')}
                    </Button>
                  </div>
                  <div className="space-y-1 mt-3">
                    {esmorzar.bocadillo && (
                      <div className="text-sm text-text/80">🍞 {esmorzar.bocadillo}</div>
                    )}
                    {esmorzar.gasto && esmorzar.gasto.length > 0 && (
                      <div className="text-sm text-text/80">🥜 {esmorzar.gasto.join(', ')}</div>
                    )}
                    {esmorzar.bebida && (
                      <div className="text-sm text-text/80">🍷 {esmorzar.bebida}</div>
                    )}
                    {esmorzar.cafe && (
                      <div className="text-sm text-text/80">☕ {esmorzar.cafe}</div>
                    )}
                    {esmorzar.price && (
                      <div className="text-sm font-medium text-text mt-2">
                        {new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(esmorzar.price)}
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

