import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthCallback() {
  const nav = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    // console.log('AuthCallback params:', params.toString())
    const token = params.get('discord_token')
    if (token) {
      // localStorage.setItem('discord_token', token)
      nav('/dashboard')
    } else {
      nav('/')
    }
  }, [])

  return <p className="p-5 text-center">Loading...</p>
}
