import { useEffect, useState } from 'react'
import api from '../../../lib/api'

export default function OverviewTab({ guildId }) {
  const [guild, setGuild] = useState(null)
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get(`/discord/guilds/${guildId}/info`),
      api.get(`/guilds/${guildId}/config`)
    ]).then(([g, cfg]) => {
      setGuild(g.data)
      setConfig(cfg.data)
    }).finally(() => setLoading(false))
  }, [guildId])


  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner text-secondary"></span>
      </div>
    )

  const featureStatus = [
    { name: 'Welcome Message', enabled: config?.greeting?.welcome?.enabled },
    { name: 'Leave Message', enabled: config?.greeting?.leave?.enabled },
    { name: 'Autorole', enabled: config?.autorole?.enabled },
    { name: 'Logs', enabled: Object.values(config.logs || {}).some(v => v.enabled) },
    { name: 'Reaction Roles', enabled: (config.reactionRoles || []).length > 0 },,
    { name: 'Anti-Link', enabled: config?.moderation?.antiLink?.enabled },
    { name: 'Anti-Spam', enabled: config?.moderation?.antiSpam?.enabled },
    { name: 'Temp Voice', enabled: config?.tempVoice?.enabled },
  ]

  return (
    <div className="space-y-6">
      {/* Guild Info */}
      <div className="flex items-center gap-4">
        <img src={guild.icon} className="w-16 h-16 rounded-full" />
        <div>
          <h1 className="text-2xl font-bold">{guild.name}</h1>
          <p className="text-sm text-base-content/60">ID: {guild.id}</p>
          <p className="text-sm text-base-content/60">Members: {guild.memberCount}</p>
          <p className="text-sm text-base-content/60">Owner ID: {guild.ownerId}</p>
          <p className="text-sm text-base-content/60">Created: {new Date(guild.createdAt).toLocaleDateString()}</p>
          <p className="text-sm text-base-content/60">Region: {guild.region}</p>
        </div>
      </div>

      {/* Quick Config */}
      <div className="stats stats-vertical md:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Bot Prefix</div>
          <div className="stat-value">{config.prefix}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Autorole</div>
          <div className={`stat-value ${config.autorole?.enabled ? 'text-success' : 'text-error'}`}>
            {config.autorole?.enabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Reaction Roles</div>
          <div className="stat-value">{(config.reactionRoles || []).length}</div>
        </div>
      </div>

      {/* Feature Summary */}
      <div className="grid md:grid-cols-2 gap-4">
        {featureStatus.map((f, i) => (
          <div key={i} className="card bg-base-100 shadow-sm p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">{f.name}</span>
              <span className={`badge ${f.enabled ? 'badge-success' : 'badge-error'}`}>
                {f.enabled ? 'Active' : 'Disabled'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
