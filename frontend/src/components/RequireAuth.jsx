import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function RequireAuth({ children }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) return <span className="loading loading-spinner text-secondary"></span>
  if (!user) return <Navigate to="/" replace />

  return children
}
