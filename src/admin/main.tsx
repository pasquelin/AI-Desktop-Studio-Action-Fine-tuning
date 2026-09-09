import './theme.css'
import { createRoot } from 'react-dom/client'
import { App } from './app.tsx'

const root = document.getElementById('app')
if (!root) throw new Error('Missing application root')
createRoot(root).render(<App />)
