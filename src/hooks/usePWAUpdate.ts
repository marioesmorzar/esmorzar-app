import { useState, useEffect } from 'react'

export function usePWAUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [updateServiceWorker, setUpdateServiceWorker] = useState<(() => void) | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Escuchar actualizaciones del service worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Hay una nueva versión disponible
                setNeedRefresh(true)
                setUpdateServiceWorker(() => () => {
                  newWorker.postMessage({ type: 'SKIP_WAITING' })
                  window.location.reload()
                })
              }
            })
          }
        })

        // Escuchar mensajes del service worker
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload()
        })
      })
    }
  }, [])

  const update = () => {
    if (updateServiceWorker) {
      updateServiceWorker()
    } else {
      window.location.reload()
    }
  }

  const close = () => {
    setNeedRefresh(false)
  }

  return {
    needRefresh,
    update,
    close,
  }
}
