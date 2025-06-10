import Card from '../components/Card'
import { useApi } from '../hooks/useApi'
import api from '../lib/api'

export default function GuildList() {
  const { data, loading, error } = useApi(() => api.get('/discord/guilds'))

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner text-secondary"></span>
      </div>
    )
  if (error || !data) return <p className="p-5 text-error">Error loading guilds</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {data.guilds.map((g) => (
        Card(g)
      ))}
    </div>
  )
}
