import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CaloriasProvider } from './context/CaloriasContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CaloriasProvider>
      <App />
    </CaloriasProvider>
  </React.StrictMode>,
)
