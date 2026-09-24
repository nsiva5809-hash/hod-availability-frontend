import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Viewer from './Viewer.jsx'

const isViewer = window.location.pathname === '/viewer'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isViewer ? <Viewer /> : <App />}
  </StrictMode>,
)