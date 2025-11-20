import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { useBars } from '../hooks/useBars'
import { useEsmorzar } from '../hooks/useEsmorzar'
import { Layout } from '../components/layout/Layout'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { NewEsmorzarForm } from '../types/esmorzar'

const GASTO_OPTIONS = [
  'Cacau del Collaret',
  'Olivas',
  'Tramussos',
  'Ensalada',
  'Vino con Gaseosa',
  'Cerveza',
]

const BEBIDA_OPTIONS = [
  'Vino y Gaseosa',
  'Cerveza',
  'Refresco',
  'Agua',
  'Otro',
]

const CAFE_OPTIONS = [
  'Café Solo',
  'Cortado',
  'Bombón',
  'Del Temps',
  'Cremaet',
  'Nada',
]

export default function NewEsmorzar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { bars, searchBars, createBar, loading: barsLoading } = useBars()
  const { createEsmorzar } = useEsmorzar(profile?.id)

  const [step, setStep] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredBars, setFilteredBars] = useState(bars)
  const [showAddBar, setShowAddBar] = useState(false)
  const [newBarName, setNewBarName] = useState('')
  const [newBarMunicipality, setNewBarMunicipality] = useState('')
  const [newBarProvince, setNewBarProvince] = useState('Valencia')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<NewEsmorzarForm>({
    bar_id: '',
    date: new Date().toISOString().split('T')[0],
    bocadillo: '',
    gasto: [],
    bebida: '',
    cafe: '',
    price: undefined,
    review: '',
    photos: [],
  })

  // Cargar datos del localStorage al montar
  useEffect(() => {
    const saved = localStorage.getItem('newEsmorzarForm')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setFormData(parsed)
      } catch (e) {
        console.error('Error loading form data:', e)
      }
    }
  }, [])

  // Guardar en localStorage cuando cambie formData
  useEffect(() => {
    localStorage.setItem('newEsmorzarForm', JSON.stringify(formData))
  }, [formData])

  useEffect(() => {
    if (searchQuery) {
      searchBars(searchQuery).then(setFilteredBars)
    } else {
      setFilteredBars(bars)
    }
  }, [searchQuery, bars])

  const handleAddBar = async () => {
    if (!newBarName || !newBarMunicipality || !profile) return

    try {
      setLoading(true)
      const bar = await createBar(newBarName, newBarMunicipality, newBarProvince, profile.id)
      if (bar) {
        setFormData({ ...formData, bar_id: bar.id })
        setShowAddBar(false)
        setNewBarName('')
        setNewBarMunicipality('')
      }
    } catch (err) {
      setError('Error al crear el bar')
    } finally {
      setLoading(false)
    }
  }

  const toggleGasto = (item: string) => {
    const current = formData.gasto || []
    if (current.includes(item)) {
      setFormData({ ...formData, gasto: current.filter((g) => g !== item) })
    } else {
      setFormData({ ...formData, gasto: [...current, item] })
    }
  }

  const handleSubmit = async () => {
    if (!formData.bar_id || !formData.date) {
      setError('Por favor completa todos los campos obligatorios')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await createEsmorzar(formData)
      localStorage.removeItem('newEsmorzarForm')
      navigate('/home')
    } catch (err) {
      setError('Error al guardar el esmorzar')
    } finally {
      setLoading(false)
    }
  }

  const selectedBar = bars.find((b) => b.id === formData.bar_id)

  return (
    <Layout>
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : navigate('/home'))}
            className="text-text/70 hover:text-text"
          >
            ← {t('common.back')}
          </button>
          <div className="text-sm text-text/70">
            {step} / 5
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-text mb-4">
              {t('esmorzar.whereDidYouEat')}
            </h2>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                {t('esmorzar.bar')}
              </label>
              <Input
                type="text"
                placeholder={t('esmorzar.searchBar')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {!showAddBar ? (
              <>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredBars.map((bar) => (
                    <Card
                      key={bar.id}
                      className={`cursor-pointer transition-colors ${
                        formData.bar_id === bar.id ? 'border-primary border-2' : ''
                      }`}
                      onClick={() => setFormData({ ...formData, bar_id: bar.id })}
                    >
                      <div className="font-medium text-text">{bar.name}</div>
                      <div className="text-sm text-text/70">{bar.location}</div>
                    </Card>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowAddBar(true)}
                >
                  + {t('esmorzar.addBar')}
                </Button>
              </>
            ) : (
              <Card className="space-y-4">
                <Input
                  label="Nombre del bar"
                  value={newBarName}
                  onChange={(e) => setNewBarName(e.target.value)}
                  placeholder="Ej. Bar Manolo"
                />
                <Input
                  label="Municipio"
                  value={newBarMunicipality}
                  onChange={(e) => setNewBarMunicipality(e.target.value)}
                  placeholder="Ej. Valencia"
                />
                <Input
                  label="Provincia"
                  value={newBarProvince}
                  onChange={(e) => setNewBarProvince(e.target.value)}
                  placeholder="Valencia"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddBar(false)}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleAddBar}
                    disabled={loading || !newBarName || !newBarMunicipality}
                  >
                    {t('common.save')}
                  </Button>
                </div>
              </Card>
            )}

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                {t('esmorzar.date')}
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <Button
              className="w-full"
              onClick={() => setStep(2)}
              disabled={!formData.bar_id || !formData.date}
            >
              {t('common.next')}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-text mb-4">
              {t('esmorzar.bocadillo')} y {t('esmorzar.gasto')}
            </h2>

            <Input
              label={t('esmorzar.bocadillo')}
              placeholder="Ej. Llom, formatge i bacon"
              value={formData.bocadillo || ''}
              onChange={(e) => setFormData({ ...formData, bocadillo: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                {t('esmorzar.gasto')} (selección múltiple)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {GASTO_OPTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleGasto(item)}
                    className={`p-3 rounded-lg border-2 transition-colors text-sm ${
                      formData.gasto?.includes(item)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-text/20 hover:border-primary/50'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                {t('common.back')}
              </Button>
              <Button
                className="flex-1"
                onClick={() => setStep(3)}
              >
                {t('common.next')}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-text mb-4">
              {t('esmorzar.bebida')}
            </h2>

            <div className="grid grid-cols-2 gap-2">
              {BEBIDA_OPTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFormData({ ...formData, bebida: item })}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    formData.bebida === item
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-text/20 hover:border-primary/50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep(2)}
              >
                {t('common.back')}
              </Button>
              <Button
                className="flex-1"
                onClick={() => setStep(4)}
              >
                {t('common.next')}
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-text mb-4">
              {t('esmorzar.cafe')}
            </h2>

            <div className="grid grid-cols-2 gap-2">
              {CAFE_OPTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFormData({ ...formData, cafe: item })}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    formData.cafe === item
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-text/20 hover:border-primary/50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep(3)}
              >
                {t('common.back')}
              </Button>
              <Button
                className="flex-1"
                onClick={() => setStep(5)}
              >
                {t('common.next')}
              </Button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-text mb-4">
              {t('esmorzar.summary')}
            </h2>

            <Card>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-text/70">{t('esmorzar.bar')}</div>
                  <div className="font-medium">{selectedBar?.name}</div>
                  <div className="text-sm text-text/70">{selectedBar?.location}</div>
                </div>
                <div>
                  <div className="text-sm text-text/70">{t('esmorzar.date')}</div>
                  <div className="font-medium">{new Date(formData.date).toLocaleDateString('es-ES')}</div>
                </div>
                {formData.bocadillo && (
                  <div>
                    <div className="text-sm text-text/70">{t('esmorzar.bocadillo')}</div>
                    <div className="font-medium">{formData.bocadillo}</div>
                  </div>
                )}
                {formData.gasto && formData.gasto.length > 0 && (
                  <div>
                    <div className="text-sm text-text/70">{t('esmorzar.gasto')}</div>
                    <div className="font-medium">{formData.gasto.join(', ')}</div>
                  </div>
                )}
                {formData.bebida && (
                  <div>
                    <div className="text-sm text-text/70">{t('esmorzar.bebida')}</div>
                    <div className="font-medium">{formData.bebida}</div>
                  </div>
                )}
                {formData.cafe && (
                  <div>
                    <div className="text-sm text-text/70">{t('esmorzar.cafe')}</div>
                    <div className="font-medium">{formData.cafe}</div>
                  </div>
                )}
              </div>
            </Card>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                {t('esmorzar.review')}
              </label>
              <p className="text-xs text-text/70 mb-2">{t('esmorzar.reviewPrivate')}</p>
              <textarea
                className="w-full px-4 py-2 rounded-lg border border-text/20 bg-white text-text placeholder:text-text/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px]"
                placeholder="El bocadillo de calamares estaba espectacular..."
                value={formData.review || ''}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              />
            </div>

            <Input
              label={t('esmorzar.price')}
              type="number"
              step="0.01"
              placeholder="9.50"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : undefined })}
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep(4)}
              >
                {t('common.back')}
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? t('common.loading') : t('esmorzar.saveEsmorzar')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

