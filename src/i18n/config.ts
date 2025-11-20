import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import esTranslations from './locales/es/translation.json'
import caTranslations from './locales/ca/translation.json'

const savedLanguage = typeof window !== 'undefined' ? (localStorage.getItem('language') || 'es') : 'es'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: esTranslations
      },
      ca: {
        translation: caTranslations
      }
    },
    lng: savedLanguage,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n

