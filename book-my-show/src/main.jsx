import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { LocationProvider } from './context/LocationContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <LocationProvider>
        <App />
      </LocationProvider>
    </AuthProvider>
  </StrictMode>
)
