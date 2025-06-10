import { useEffect, useState } from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import CreatableSelect from 'react-select/creatable'
import api from '../../../../lib/api'
import { useAlert } from '../../../../context/AlertContext'
import { selectStylesCustom } from '../../../../constants/SelectStyles';

function isValidDomain(str) {
  return /^[a-z0-9-]+\.[a-z]{2,}$/i.test(str.trim())
}

export default function SecurityPanel({ guildId }) {
  const { showAlert } = useAlert()
  const [antiSpam, setAntiSpam] = useState({ enabled: false, threshold: 5, interval: 5 })
  const [antiLink, setAntiLink] = useState({ enabled: false, punish: 'delete', whitelist: [] })
  const [channelFilters, setChannelFilters] = useState({ userOnlyChannels: [], botOnlyChannels: [] })
  const [channels, setChannels] = useState([])
  const animatedComponents = makeAnimated();
  // const selectStyles = {
  //   menuPortal: base => ({ ...base, zIndex: 9999 })
  // }
  const selectStyles = selectStylesCustom()

  useEffect(() => {
    api.get(`/guilds/${guildId}/config`).then(res => {
      const cfg = res.data
      setAntiSpam(cfg.moderation.antiSpam || antiSpam)
      setAntiLink(cfg.moderation.antiLink || antiLink)
      setChannelFilters(cfg.moderation.channelFilters || { userOnlyChannels: [], botOnlyChannels: [] })
    })

    api.get(`/discord/guilds/${guildId}/channels`).then(res => {
      const allChannels = res.data.channels.flatMap(g => g.children || [])
      setChannels(allChannels)
    })
  }, [guildId])

  const save = async () => {
    await api.post(`/guilds/${guildId}/config/moderations`, {
       moderation: { antiSpam, antiLink, channelFilters } })
    showAlert('Security settings updated', 'success')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Anti-Spam Settings</h2>
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          className="toggle"
          checked={antiSpam.enabled}
          onChange={e => setAntiSpam(prev => ({ ...prev, enabled: e.target.checked }))}
        />
        Enable Anti-Spam
      </label>
      <div className="grid grid-cols-2 gap-4">
        <span>Threshold (sec)</span>
        <input
          className="input input-bordered"
          type="number"
          min={1}
          value={antiSpam.threshold}
          onChange={e => setAntiSpam(prev => ({ ...prev, threshold: Number(e.target.value) }))}
          placeholder="Message threshold"
        />
        <span>Interval (sec)</span>
        <input
          className="input input-bordered"
          type="number"
          min={1}
          value={antiSpam.interval}
          onChange={e => setAntiSpam(prev => ({ ...prev, interval: Number(e.target.value) }))}
          placeholder="Interval (sec)"
        />
      </div>

      <h2 className="text-lg font-bold">Anti-Link Settings</h2>
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          className="toggle"
          checked={antiLink.enabled}
          onChange={e => setAntiLink(prev => ({ ...prev, enabled: e.target.checked }))}
        />
        Enable Anti-Link
      </label>
      <select
        className="select select-bordered w-full"
        value={antiLink.punish}
        onChange={e => setAntiLink(prev => ({ ...prev, punish: e.target.value }))}
      >
        <option value="delete">Delete Message</option>
        <option value="warn">Warn</option>
        <option value="kick">Kick</option>
        <option value="ban">Ban</option>
      </select>

      <h2 className="text-lg font-bold">Anti-Link Whitelist</h2>
      <CreatableSelect
        isMulti
        className="w-full"
        placeholder="Add allowed domains..."
        components={animatedComponents}
        styles={selectStyles}
        value={(antiLink.whitelist || []).map(d => ({ label: d, value: d }))}
        onChange={(selected) => {
          const list = selected.map(s => s.value.trim()).filter(Boolean)
          setAntiLink(prev => ({ ...prev, whitelist: list }))
        }}
        formatCreateLabel={(inputValue) =>
          isValidDomain(inputValue)
            ? `Add "${inputValue}"`
            : `"${inputValue}" is not valid domain`
        }
        isValidNewOption={(inputValue, _, __) => isValidDomain(inputValue)}
        noOptionsMessage={() => 'Type to add new domain'}
      />

      <h2 className="text-lg font-bold">Channel Filter Settings</h2>
      <label className="label">
        <span className="label-text">User-only Channels</span>
      </label>
      <Select
        isMulti
        components={animatedComponents}
        closeMenuOnSelect={false}
        className="w-full pb-2"
        menuPortalTarget={document.body}
        styles={selectStyles}
        value={channels
          .filter(c => channelFilters.userOnlyChannels.includes(c.id))
          .map(c => ({ value: c.id, label: `#${c.name}` }))}
        onChange={(selected) => {
          const values = selected.map(s => s.value)
          setChannelFilters(prev => ({ ...prev, userOnlyChannels: values }))
        }}
        options={channels.map(c => ({ value: c.id, label: `#${c.name}` }))}
        placeholder="Select user-only channels"
      />

      <label className="label mt-4">
        <span className="label-text">Bot-only Channels</span>
      </label>
      <Select
        isMulti
        components={animatedComponents}
        closeMenuOnSelect={false}
        className="w-full pb-2"
        menuPortalTarget={document.body}
        styles={selectStyles}
        value={channels
          .filter(c => channelFilters.botOnlyChannels.includes(c.id))
          .map(c => ({ value: c.id, label: `#${c.name}` }))}
        onChange={(selected) => {
          const values = selected.map(s => s.value)
          setChannelFilters(prev => ({ ...prev, botOnlyChannels: values }))
        }}
        options={channels.map(c => ({ value: c.id, label: `#${c.name}` }))}
        placeholder="Select bot-only channels"
      />

      <div className="flex justify-end">
        <button className="btn btn-primary" onClick={save}>Save Settings</button>
      </div>
    </div>
  )
}
