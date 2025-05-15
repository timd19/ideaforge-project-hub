import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/markdown.css'
import { initLogger, error, LogLevel } from './utils/logger'

// Initialize logger with debug level in development
initLogger({
  level: import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO,
  consoleOutput: true,
  storeLogs: true,
  maxStoredLogs: 500
});

// Global error handler
window.addEventListener('error', (event) => {
  error('Unhandled error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack
  });
});

// Global promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  error('Unhandled promise rejection', {
    reason: event.reason?.message || String(event.reason),
    stack: event.reason?.stack
  });
});

// Render the app
try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  createRoot(rootElement).render(<App />);
} catch (err: any) {
  error('Error rendering application', {
    message: err.message,
    stack: err.stack
  });
  
  // Display a fallback UI for critical errors
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="font-family: system-ui, sans-serif; padding: 2rem; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e11d48;">Application Error</h1>
        <p>The application failed to initialize. Please try refreshing the page.</p>
        <p>If the problem persists, check the console for more details or contact support.</p>
        <pre style="background: #f1f5f9; padding: 1rem; border-radius: 0.5rem; overflow: auto; margin-top: 1rem; font-size: 0.875rem;">
          ${err.message}
        </pre>
      </div>
    `;
  }
}
