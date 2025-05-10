
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <div className="min-h-screen bg-background font-sans antialiased">
        <App />
      </div>
    </ThemeProvider>
  </React.StrictMode>,
)
