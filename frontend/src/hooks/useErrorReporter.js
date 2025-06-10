// src/hooks/useErrorReporter.js
import { useEffect } from 'react'
import axios from 'axios'

export function useErrorReporter() {
  useEffect(() => {
    const handleGlobalError = (msg, url, line, column, error) => {
      axios.post('/error', {
        type: 'frontend',
        message: msg,
        file: url,
        line,
        column,
        stack: error?.stack,
        userAgent: navigator.userAgent
      }).catch(console.warn)
    }

    const handleUnhandledRejection = (event) => {
      axios.post('/api/logs/error', {
        type: 'frontend',
        message: event.reason?.message || 'Unhandled rejection',
        stack: event.reason?.stack,
        userAgent: navigator.userAgent
      }).catch(console.warn)
    }

    window.onerror = handleGlobalError
    window.onunhandledrejection = handleUnhandledRejection

    return () => {
      window.onerror = null
      window.onunhandledrejection = null
    }
  }, [])
}
