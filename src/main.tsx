
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.tsx'

// Initialize performance monitoring
import { performanceMonitor } from './utils/performance-metrics'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <div className="min-h-screen bg-background font-sans antialiased">
        <App />
      </div>
    </ThemeProvider>
  </React.StrictMode>,
)

// Log metrics on window load
window.addEventListener('load', () => {
  // Allow some time for metrics to be collected
  setTimeout(() => {
    performanceMonitor.logMetrics();
    
    // Save metrics to session storage for debugging
    performanceMonitor.saveMetrics();
  }, 3000);
});
