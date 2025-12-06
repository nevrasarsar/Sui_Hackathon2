import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AppWalletProvider } from './AppWalletProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWalletProvider>
      <App />
    </AppWalletProvider>
  </React.StrictMode>,
)