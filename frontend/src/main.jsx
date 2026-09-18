import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Set base URL for API requests if deployed to production host (e.g. Netlify)
if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

// Global error logger for frontend crashes
window.onerror = function (message, source, lineno, colno, error) {
  fetch('/api/log-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: message,
      stack: error ? error.stack : `Source: ${source}, Line: ${lineno}:${colno}`
    })
  }).catch(() => {});
};

window.addEventListener('unhandledrejection', function (event) {
  fetch('/api/log-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Unhandled Promise Rejection: ' + event.reason,
      stack: event.reason ? (event.reason.stack || String(event.reason)) : 'No stack trace'
    })
  }).catch(() => {});
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
