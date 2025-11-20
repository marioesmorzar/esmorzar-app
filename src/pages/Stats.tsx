import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { Layout } from '../components/layout/Layout'
import { Card } from '../components/ui/Card'

export default function Stats() {
  const { t } = useTranslation()
  const { profile } = useAuth()

  return (
    <Layout>
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/home" className="text-text/70 hover:text-text">
            ←
          </Link>
          <h1 className="text-2xl font-bold text-text">
            {t('stats.title')}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="text-4xl font-bold text-text mb-2">
              {profile?.total_esmorzars || 0}
            </div>
            <div className="text-sm text-text/70">{t('stats.totalEsmorzars')}</div>
          </Card>

          <Card>
            <div className="text-4xl font-bold text-text mb-2">
              {profile?.total_bars || 0}
            </div>
            <div className="text-sm text-text/70">{t('stats.totalBars')}</div>
          </Card>

          <Card>
            <div className="text-3xl font-bold text-text mb-2">
              {profile?.level || t('levels.beginner')}
            </div>
            <div className="text-sm text-text/70">{t('stats.level')}</div>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

