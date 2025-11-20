import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { ErrorBoundary } from './components/ErrorBoundary'
import './i18n/config'

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

export default App
