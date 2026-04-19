import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

const rootEl = document.querySelector<HTMLDivElement>('#app')
if (!rootEl) throw new Error('#app not found')

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
)
