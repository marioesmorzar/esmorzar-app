import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { useEsmorzar } from '../hooks/useEsmorzar'
import { Layout } from '../components/layout/Layout'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { formatDate } from '../lib/utils'

export default function Dashboard() {
  const { t } = useTranslation()
  const { profile } = useAuth()
  const { esmorzars, loading } = useEsmorzar(profile?.id)

  const lastEsmorzar = esmorzars[0]

  return (
    <Layout>
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-text mb-6">
          {t('dashboard.title', { name: profile?.username || 'Usuario' })}
        </h1>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="text-3xl font-bold text-text mb-1">
              {profile?.total_esmorzars || 0}
            </div>
            <div className="text-sm text-text/70">{t('dashboard.esmorzars')}</div>
          </Card>
          <Card>
            <div className="text-3xl font-bold text-text mb-1">
              {profile?.total_bars || 0}
            </div>
            <div className="text-sm text-text/70">{t('dashboard.bars')}</div>
          </Card>
          <Card>
            <div className="text-2xl font-bold text-text mb-1">
              {profile?.level || t('levels.beginner')}
            </div>
            <div className="text-sm text-text/70">{t('dashboard.level')}</div>
          </Card>
        </div>

        <p className="text-sm text-text/70 mb-6">
          {t('dashboard.uploadToLevelUp')}
        </p>

        <Link to="/new" className="block mb-6">
          <Button size="lg" className="w-full flex items-center justify-center gap-2">
            <span className="text-xl">+</span>
            <span>{t('dashboard.newEsmorzar')}</span>
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text">{t('dashboard.latestEsmorzar')}</h2>
          <Link to="/history" className="text-primary text-sm hover:underline">
            {t('dashboard.seeAll')} →
          </Link>
        </div>

        {loading ? (
          <Card>
            <div className="text-center py-8 text-text/70">{t('common.loading')}</div>
          </Card>
        ) : lastEsmorzar ? (
          <Link to={`/esmorzar/${lastEsmorzar.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-text text-lg">
                    {lastEsmorzar.bars?.name || 'Bar'}
                  </h3>
                  <p className="text-sm text-text/70">
                    {formatDate(lastEsmorzar.date)}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  {t('history.seeEsmorzar')}
                </Button>
              </div>
              <div className="space-y-1 mt-3">
                {lastEsmorzar.bocadillo && (
                  <div className="text-sm text-text/80">🍞 {lastEsmorzar.bocadillo}</div>
                )}
                {lastEsmorzar.gasto && lastEsmorzar.gasto.length > 0 && (
                  <div className="text-sm text-text/80">🥜 {lastEsmorzar.gasto.join(', ')}</div>
                )}
                {lastEsmorzar.bebida && (
                  <div className="text-sm text-text/80">🍷 {lastEsmorzar.bebida}</div>
                )}
                {lastEsmorzar.cafe && (
                  <div className="text-sm text-text/80">☕ {lastEsmorzar.cafe}</div>
                )}
              </div>
            </Card>
          </Link>
        ) : (
          <Card>
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🍽️</div>
              <p className="font-bold text-text mb-1">{t('dashboard.noEsmorzarYet')}</p>
              <p className="text-sm text-text/70">{t('dashboard.addFirst')}</p>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  )
}

