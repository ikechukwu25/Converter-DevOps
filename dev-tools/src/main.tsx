import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import './tw.css';
import App from './App.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { Analytics } from "@vercel/analytics/react"

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

createRoot(document.getElementById('BS2GHRGSXY')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_API_KEY}>
      <App />
      <Toaster />
      <Analytics />
    </GoogleOAuthProvider>
  </StrictMode>,
)
