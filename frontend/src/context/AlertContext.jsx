import { createContext, useContext, useState } from 'react'

const AlertContext = createContext()

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([])

  const showAlert = (text, type = 'info', duration = 3000) => {
    const id = Date.now()
    setAlerts(prev => [...prev, { id, text, type }])
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== id))
    }, duration)
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div className="fixed top-4 right-4 space-y-2 z-[100]">
        {alerts.map(({ id, text, type }) => (
          <div key={id} role="alert" className={`alert alert-${type} shadow`}>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  )
}

export const useAlert = () => useContext(AlertContext)
