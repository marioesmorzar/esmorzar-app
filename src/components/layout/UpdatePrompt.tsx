import { useTranslation } from 'react-i18next'
import { usePWAUpdate } from '../../hooks/usePWAUpdate'
import { Button } from '../ui/Button'

export function UpdatePrompt() {
  const { t } = useTranslation()
  const { needRefresh, update, close } = usePWAUpdate()

  if (!needRefresh) return null

  return (
    <div className="bg-primary text-white px-4 py-3 flex items-center justify-between">
      <span className="text-sm">Nueva versión disponible</span>
      <div className="flex gap-2">
        <button
          onClick={close}
          className="text-sm underline hover:no-underline"
        >
          Más tarde
        </button>
        <button
          onClick={update}
          className="bg-white text-primary px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
        >
          Actualizar
        </button>
      </div>
    </div>
  )
}

