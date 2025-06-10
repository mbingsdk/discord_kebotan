import { useEffect, useState, Fragment } from 'react'
import api from '../../../lib/api'
import MappingEditor from '../../../components/MappingEditor'
import MenuChannelSelect from './MenuChannelSelect'
import { useAlert } from '../../../context/AlertContext'

export default function ReactionRoleTab({ guildId }) {
  const [channels, setChannels] = useState([])
  const [roles, setRoles] = useState([])
  const [entries, setEntries] = useState([])
  const { showAlert } = useAlert()

  useEffect(() => {
    Promise.all([
      api.get(`/discord/guilds/${guildId}/channels`),
      api.get(`/discord/guilds/${guildId}/roles`),
      api.get(`/guilds/${guildId}/config`)
    ]).then(([ch, rl, cfg]) => {
      setChannels(ch.data.channels)
      setRoles(rl.data.roles.filter(r => !r.isEveryone && !r.isBotRole))
      setEntries(cfg.data.reactionRoles || [])
    })
  }, [guildId])

  const addEntry = () => {
    setEntries([...entries, {
      channelId: '',
      messageText: '',
      mappings: [],
    }])
  }

  const updateEntry = (i, field, value) => {
    const updated = [...entries]
    updated[i][field] = value
    setEntries(updated)
  }

  const addMapping = (i, emoji, roleId) => {
    if (!emoji || !roleId) return
    const updated = [...entries]
    updated[i].mappings.push({ emoji, roleId })
    setEntries(updated)
  }

  const saveAll = () => {
    api.post(`/guilds/${guildId}/config`, {
      reactionRoles: entries
    }).then(() => showAlert('✅ Saved successfully!', 'success'))
  }

  const sendMessages = () => {
    api.post(`/discord/guilds/${guildId}/reaction-roles/send`)
      .then(() => showAlert('🚀 Sent to channel!', 'info'))
      .catch(() => showAlert('❌ Failed to send', 'error'))
  }

  const handleDelete = async (i) => {
    const updated = [...entries]
    updated.splice(i, 1)
    setEntries(updated)
    await api.post(`/guilds/${guildId}/config`, {
      reactionRoles: updated
    })
  }

  return (
    <div className="space-y-6">
      {entries.map((entry, i) => (
        <div key={i} className="card bg-base-100 shadow border border-base-300 relative">
          <button
            onClick={() => {
              const copy = [...entries]
              copy.splice(i, 1)
                setEntries(copy)
              }}
              className="btn btn-sm btn-circle btn-error absolute top-2 right-2"
              title="Delete block"
              >✕</button>
              <div className="card-body space-y-4">
              <h2 className="card-title text-lg">Reaction Role #{i + 1}</h2>

              <MenuChannelSelect
                value={entry.channelId}
                onChange={(val) => updateEntry(i, 'channelId', val)}
                channels={channels}
              />

              <textarea
                className="textarea textarea-bordered w-full"
                rows={2}
                placeholder="Message content"
                value={entry.messageText}
                onChange={(e) => updateEntry(i, 'messageText', e.target.value)}
              />

              <MappingEditor
                mappings={entry.mappings}
                roles={roles}
                onAdd={(emoji, roleId) => addMapping(i, emoji, roleId)}
                onDelete={(mapIdx) => {
                const copy = [...entries]
                copy[i].mappings.splice(mapIdx, 1)
                setEntries(copy)
              }}
              guildId={guildId}
            />
            <div className="flex items-center gap-2">
              <button
                className="btn btn-xs btn-error btn-outline"
                onClick={() => handleDelete(i)}
              >
                Delete
              </button>
              <button
                className="btn btn-xs btn-accent"
                onClick={() => api.post(`/discord/guilds/${guildId}/reaction-roles/send/${i}`)
                  .then(() => showAlert('✅ Sent!', 'success'))
                  .catch(() => showAlert('❌ Failed to send', 'error'))}
              >
                🚀 Send
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
        <button className="btn btn-outline btn-primary" onClick={addEntry}>+ Add</button>
        <button className="btn btn-success" onClick={saveAll}>💾 Save</button>
        <button className="btn btn-accent" onClick={sendMessages}>🚀 Send All</button>
      </div>
    </div>
  )
}
