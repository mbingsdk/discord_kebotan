import { useState, useEffect } from 'react'
import RolePreviewEmbed from '../components/RolePreviewEmbed.jsx'
import EmojiSelector from './EmojiSelector'
import api from '../lib/api.js'
import GuildEmojiPicker from './GuildEmojiPicker.jsx'

export default function MappingEditor({ mappings, roles, onAdd, onDelete, guildId = null }) {
  const [emoji, setEmoji] = useState('')
  const [roleId, setRoleId] = useState('')
  const [source, setSource] = useState('picker') // 'picker', 'guild', 'manual'
  const [guildEmojis, setGuildEmojis] = useState([])

  const selectedRole = roles.find(r => r.id === roleId)

  useEffect(() => {
    if (!guildId) return
    api.get(`/discord/guilds/${guildId}/emojis`)
      .then(res => setGuildEmojis(res.data.emojis))
      .catch(err => console.error('Failed to fetch emojis', err))
  }, [])

  const handleAdd = () => {
    if (!emoji || !roleId) return
    onAdd(emoji, roleId)
    setEmoji('')
    setRoleId('')
  }

  return (
    <div className="space-y-6">
      {/* Source selector */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          className="select select-bordered w-full sm:w-48"
          value={source}
          onChange={e => setSource(e.target.value)}
        >
          <option value="picker">Emoji Picker</option>
          <option value="guild">Guild Emoji</option>
          {/* <option value="manual">Manual Input</option> */}
        </select>

        {source === 'picker' && (
          <div className="w-full sm:w-auto">
            <EmojiSelector onSelect={(e) => setEmoji(e)} />
          </div>
        )}

        {source === 'guild' && (
          <GuildEmojiPicker
            emojis={guildEmojis}
            value={emoji}
            onSelect={setEmoji}
          />
        )}

        {source === 'manual' && (
          <input
            type="text"
            className="input input-bordered w-full sm:w-24 text-center"
            placeholder="emoji or emoji code"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
          />
        )}

        <select
          className="select select-bordered w-full"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
        >
          <option value="">Select role</option>
          {roles.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>

        <button className="btn btn-primary w-full sm:w-auto" onClick={handleAdd}>
          Add
        </button>
      </div>

      {/* Live Preview */}
      {emoji && roleId && (
        <RolePreviewEmbed emoji={emoji} roleName={selectedRole?.name || roleId} />
      )}

      {/* Mapping List */}
      <div className="space-y-2">
        {mappings.length === 0 && (
          <p className="text-sm text-base-content/50 italic">No emoji-role mappings yet.</p>
        )}
        {mappings.map((m, i) => {
          const r = roles.find(r => r.id === m.roleId)
          return (
            <div
              key={i}
              className="flex justify-between items-center bg-base-200 p-2 rounded-lg"
            >
              <span className="text-sm">
                <span className="font-semibold">{m.emoji}</span> → {r?.name || m.roleId}
              </span>
              <button
                className="btn btn-xs btn-outline btn-error btn-circle"
                onClick={() => onDelete(i)}
              >✕</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
