import { useEffect, useState } from 'react'
import api from '../../../lib/api'
import { useAlert } from '../../../context/AlertContext'

const logEvents = [
  { key: 'memberJoin', label: 'Member Join' },
  { key: 'memberLeave', label: 'Member Leave' },
  { key: 'messageDelete', label: 'Message Delete' },
  { key: 'messageEdit', label: 'Message Edit' },
  { key: 'voiceUpdate', label: 'Voice Channel Update' }
]

export default function LogsTab({ guildId }) {
  const [channels, setChannels] = useState([])
  const [logs, setLogs] = useState({})
  const [loading, setLoading] = useState(true)
    const { showAlert } = useAlert()

  useEffect(() => {
    Promise.all([
      api.get(`/discord/guilds/${guildId}/channels`),
      api.get(`/guilds/${guildId}/config`)
    ]).then(([ch, cfg]) => {
      const flat = ch.data.channels.flatMap(c => c.children || [])
      setChannels(flat)
      setLogs(cfg.data.logs || {})
    }).finally(() => setLoading(false))
  }, [guildId])

  const updateLog = (key, field, value) => {
    setLogs(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }))
  }

  const save = () => {
    api.post(`/guilds/${guildId}/config/logs`, { logs }).then(() => showAlert('✅ Log config saved!', 'success'))
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner text-secondary"></span>
      </div>
    )

  return (
    <div className="space-y-6">
      {logEvents.map(({ key, label }) => (
        <div key={key} className="flex items-center gap-4">
          <label className="flex text-xs sm:text-sm items-center gap-2">
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={logs[key]?.enabled || false}
              onChange={(e) => updateLog(key, 'enabled', e.target.checked)}
            />
            {label}
          </label>

          <select
            disabled={!logs[key]?.enabled}
            value={logs[key]?.channelId || ''}
            onChange={(e) => updateLog(key, 'channelId', e.target.value)}
            className="select select-bordered select-sm w-52"
          >
            <option value="">Select channel</option>
            {channels.map(c => (
              <option key={c.id} value={c.id}>#{c.name}</option>
            ))}
          </select>
        </div>
      ))}

      <div className="text-right">
        <button className="btn btn-success" onClick={save}>💾 Save</button>
      </div>
    </div>
  )
}
