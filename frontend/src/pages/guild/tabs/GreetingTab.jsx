import { useEffect, useState } from 'react'
import api from '../../../lib/api'
import UserPreviewEmbed from '../../../components/UserPreviewEmbed'
import MenuChannelSelect from './MenuChannelSelect'
import { useAlert } from '../../../context/AlertContext'

export default function GreetingTab({ guildId }) {
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
    const { showAlert } = useAlert()

  const [welcome, setWelcome] = useState({ enabled: false, channelId: '', message: '' })
  const [leave, setLeave] = useState({ enabled: false, channelId: '', message: '' })

  useEffect(() => {
    Promise.all([
      api.get(`/discord/guilds/${guildId}/channels`),
      api.get(`/guilds/${guildId}/config`)
    ]).then(([chRes, cfgRes]) => {
      setChannels(chRes.data.channels)

      const greeting = cfgRes.data.greeting || {}
      setWelcome({
        enabled: greeting.welcome?.enabled ?? false,
        channelId: greeting.welcome?.channelId || '',
        message: greeting.welcome?.message || ''
      })
      setLeave({
        enabled: greeting.leave?.enabled ?? false,
        channelId: greeting.leave?.channelId || '',
        message: greeting.leave?.message || ''
      })
    }).finally(() => setLoading(false))
  }, [guildId])

  const save = () => {
    api.post(`/guilds/${guildId}/config`, {
      greeting: { welcome, leave }
    }).then(() => showAlert('✅ Saved greeting config!', 'success'))
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner text-secondary"></span>
      </div>
    )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WELCOME */}
        <div className="card bg-base-100 shadow">
          <div className="card-body space-y-4">
            <h2 className="card-title">👋 Welcome Message</h2>

            <label className="flex items-center gap-2">
              <input type="checkbox" className="toggle" checked={welcome.enabled}
                onChange={() => setWelcome(prev => ({ ...prev, enabled: !prev.enabled }))} />
              Enable Welcome
            </label>

            <MenuChannelSelect
              value={welcome.channelId}
              onChange={(val) => setWelcome(prev => ({ ...prev, channelId: val }))}
              channels={channels}
            />

            <textarea
              className="textarea textarea-bordered w-full"
              rows={3}
              placeholder="Welcome message (e.g. Welcome {user})"
              value={welcome.message}
              onChange={(e) => setWelcome(prev => ({ ...prev, message: e.target.value }))}
            />

            <div className="mt-1">
              <p className="text-sm text-base-content/70">Preview:</p>
              <UserPreviewEmbed message={welcome.message} />
            </div>

            <div className="text-xs text-base-content/60 mt-2">
              <p><b>Template tags:</b> <code>{'{user}'}</code>, <code>{'{guild}'}</code></p>
            </div>
          </div>
        </div>

        {/* LEAVE */}
        <div className="card bg-base-100 shadow">
          <div className="card-body space-y-4">
            <h2 className="card-title">🚪 Leave Message</h2>

            <label className="flex items-center gap-2">
              <input type="checkbox" className="toggle" checked={leave.enabled}
                onChange={() => setLeave(prev => ({ ...prev, enabled: !prev.enabled }))} />
              Enable Leave
            </label>

            <MenuChannelSelect
              value={leave.channelId}
              onChange={(val) => setLeave(prev => ({ ...prev, channelId: val }))}
              channels={channels}
            />

            <textarea
              className="textarea textarea-bordered w-full"
              rows={3}
              placeholder="Leave message (e.g. {user} has left the server)"
              value={leave.message}
              onChange={(e) => setLeave(prev => ({ ...prev, message: e.target.value }))}
            />

            <div className="mt-1">
              <p className="text-sm text-base-content/70">Preview:</p>
              <UserPreviewEmbed message={leave.message} />
            </div>

            <div className="text-xs text-base-content/60 mt-2">
              <p><b>Template tags:</b> <code>{'{user}'}</code>, <code>{'{guild}'}</code></p>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION */}
      <div className="text-right">
        <button className="btn btn-primary" onClick={save}>💾 Save</button>
      </div>
    </div>
  )
}
