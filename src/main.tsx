import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('🚀 Iniciando aplicación...')

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('No se encontró el elemento root')
}

try {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
  console.log('✅ Aplicación renderizada correctamente')
} catch (error) {
  console.error('❌ Error al renderizar:', error)
  rootElement.innerHTML = `
    <div style="padding: 20px; color: red;">
      <h1>Error al cargar la aplicación</h1>
      <pre>${String(error)}</pre>
    </div>
  `
}
