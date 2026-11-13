import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import { initTheme } from './data/theme'

// Bootstrap styles and scripts (dropdowns, modals, etc.)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'

// Our own styles (darkmode.css stays last so it wins)
import './index.css'
import './darkmode.css'

// Light, dark or default colour mode (set before the page is shown)
initTheme()

// Google login works only when VITE_GOOGLE_CLIENT_ID is set
const googleId = import.meta.env.VITE_GOOGLE_CLIENT_ID

// Start the app inside <div id="root"> in index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {googleId ? <GoogleOAuthProvider clientId={googleId}><App /></GoogleOAuthProvider> : <App />}
  </StrictMode>
)