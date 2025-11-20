import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { useEsmorzar } from '../hooks/useEsmorzar'
import { Layout } from '../components/layout/Layout'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { formatDate, formatPrice } from '../lib/utils'
import { EsmorzarWithBar } from '../types/esmorzar'

export default function EsmorzarDetail() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { getEsmorzar, deleteEsmorzar } = useEsmorzar(profile?.id)
  const [esmorzar, setEsmorzar] = useState<EsmorzarWithBar | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (id) {
      loadEsmorzar()
    }
  }, [id])

  const loadEsmorzar = async () => {
    if (!id) return
    setLoading(true)
    const data = await getEsmorzar(id)
    setEsmorzar(data)
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!id || !confirm('¿Estás seguro de que quieres eliminar este esmorzar?')) return

    try {
      setDeleting(true)
      await deleteEsmorzar(id)
      navigate('/history')
    } catch (err) {
      console.error('Error deleting esmorzar:', err)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="px-4 py-6 max-w-4xl mx-auto">
          <div className="text-center py-8 text-text/70">{t('common.loading')}</div>
        </div>
      </Layout>
    )
  }

  if (!esmorzar) {
    return (
      <Layout>
        <div className="px-4 py-6 max-w-4xl mx-auto">
          <Card>
            <div className="text-center py-8">
              <p className="text-text/70">Esmorzar no encontrado</p>
              <Link to="/history" className="text-primary hover:underline mt-4 inline-block">
                Volver al historial
              </Link>
            </div>
          </Card>
        </div>
      </Layout>
    )
  }

  const isOwner = esmorzar.user_id === profile?.id

  return (
    <Layout>
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/history" className="text-text/70 hover:text-text">
            ←
          </Link>
          <h1 className="text-2xl font-bold text-text">
            {esmorzar.bars?.name || 'Bar'}
          </h1>
        </div>

        <Card className="mb-4">
          <div className="space-y-4">
            <div>
              <div className="text-sm text-text/70">{t('esmorzar.date')}</div>
              <div className="font-medium text-lg">{formatDate(esmorzar.date)}</div>
            </div>

            {esmorzar.bocadillo && (
              <div>
                <div className="text-sm text-text/70">{t('esmorzar.bocadillo')}</div>
                <div className="font-medium">🍞 {esmorzar.bocadillo}</div>
              </div>
            )}

            {esmorzar.gasto && esmorzar.gasto.length > 0 && (
              <div>
                <div className="text-sm text-text/70">{t('esmorzar.gasto')}</div>
                <div className="font-medium">🥜 {esmorzar.gasto.join(', ')}</div>
              </div>
            )}

            {esmorzar.bebida && (
              <div>
                <div className="text-sm text-text/70">{t('esmorzar.bebida')}</div>
                <div className="font-medium">🍷 {esmorzar.bebida}</div>
              </div>
            )}

            {esmorzar.cafe && (
              <div>
                <div className="text-sm text-text/70">{t('esmorzar.cafe')}</div>
                <div className="font-medium">☕ {esmorzar.cafe}</div>
              </div>
            )}

            {esmorzar.price && (
              <div>
                <div className="text-sm text-text/70">Precio total</div>
                <div className="font-medium text-xl">{formatPrice(esmorzar.price)}</div>
              </div>
            )}

            {esmorzar.review && (
              <div>
                <div className="text-sm text-text/70">{t('esmorzar.review')}</div>
                <div className="mt-1 p-3 bg-background rounded-lg text-text/80">
                  {esmorzar.review}
                </div>
              </div>
            )}

            {esmorzar.photos && esmorzar.photos.length > 0 && (
              <div>
                <div className="text-sm text-text/70 mb-2">Fotos</div>
                <div className="grid grid-cols-2 gap-2">
                  {esmorzar.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {isOwner && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? t('common.loading') : t('common.delete')}
            </Button>
          </div>
        )}
      </div>
    </Layout>
  )
}

