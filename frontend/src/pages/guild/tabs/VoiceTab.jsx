import { useEffect, useState } from 'react'
import api from '../../../lib/api'
import { useAlert } from '../../../context/AlertContext'

export default function VoiceTab({ guildId }) {
  const [tempVoice, setTempVoice] = useState({
    enabled: false,
    triggerChannelId: '',
    categoryId: '',
    nameFormat: "{username}'s Room"
  })
  const [channels, setChannels] = useState([])
  const { showAlert } = useAlert()

  useEffect(() => {
    api.get(`/discord/guilds/${guildId}/channels`).then(res => {
      setChannels(res.data.channels)
    })
    api.get(`/guilds/${guildId}/config`).then(res => {
      setTempVoice(res.data.tempVoice || tempVoice)
    })
  }, [guildId])

  const save = async () => {
    await api.post(`/guilds/${guildId}/config/moderations`, { tempVoice })
    showAlert('Temp Voice config updated', 'success')
  }

  return (
    <div className="mx-auto w-full space-y-8">
      <div className="card p-6 space-y-6">
        <label className="label cursor-pointer">
          <span className="label-text">Enable Temp Voice</span>
          <input
            type="checkbox"
            className="toggle"
            checked={tempVoice.enabled}
            onChange={e => setTempVoice(p => ({ ...p, enabled: e.target.checked }))}
          />
        </label>

        <label className="label">Trigger Channel</label>
        <select
          className="select select-bordered w-full"
          value={tempVoice.triggerChannelId || ""}
          onChange={e => setTempVoice(p => ({ ...p, triggerChannelId: e.target.value }))}
        >
          <option value="">Select trigger voice</option>
          {channels.flatMap(group => group.children).filter(c => c.type === 2).map(c => (
            <option key={c.id} value={c.id}>🎤 {c.name}</option>
          ))}
        </select>

        <label className="label">Target Category</label>
        <select
          className="select select-bordered w-full"
          value={tempVoice.categoryId || ""}
          onChange={e => setTempVoice(p => ({ ...p, categoryId: e.target.value }))}
        >
          <option value="">Optional: Choose category</option>
          {channels.filter(c => c.type === 4).map(c => (
            <option key={c.id} value={c.id}>📁 {c.name}</option>
          ))}
        </select>

        <label className="label">Channel Name Format</label>
        <input
          className="input input-bordered w-full"
          value={tempVoice.nameFormat}
          onChange={e => setTempVoice(p => ({ ...p, nameFormat: e.target.value }))}
        />

        <div className="flex justify-between pt-4">
          <button className="btn btn-primary" onClick={save}>💾 Save</button>
        </div>
      </div>
    </div>
  )
}