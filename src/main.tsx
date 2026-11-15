import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/newsreader/standard.css'
import '@fontsource-variable/newsreader/standard-italic.css'
import '@fontsource-variable/inter'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from '@/hooks/use-theme'

const app = (
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
)

const root = document.getElementById('root')!

// Pre-rendered pages arrive with their markup in place: hydrate it. The 404 shell and the dev server start empty.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
