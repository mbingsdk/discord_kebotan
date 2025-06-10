import { useEffect, useState } from 'react'
import api from '../../../lib/api'
import { useAlert } from '../../../context/AlertContext'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'id', label: 'Bahasa Indonesia' }
]

export default function SettingsTab({ guildId }) {
  const [prefix, setPrefix] = useState('!')
  const [language, setLanguage] = useState('en')
  const [disabled, setDisabled] = useState(false)
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(true)
  const { showAlert } = useAlert()

  useEffect(() => {
    api.get(`/guilds/${guildId}/config`).then(res => {
      const cfg = res.data
      setPrefix(cfg.prefix || '!')
      setLanguage(cfg.language || 'en')
      setDisabled(cfg?.status?.disabled || false)
      setNickname(cfg.nickname || '')
    }).finally(() => setLoading(false))
  }, [guildId])

  const save = () => {
    api.post(`/guilds/${guildId}/config/settings`, {
      prefix,
      language,
      nickname,
      status: { disabled }
    })
      .then(() => showAlert('✅ Settings saved!', 'success'))
      .catch(() => showAlert('Failed!', 'error'))
  }

  const reset = () => {
    if (confirm('Are you sure to reset config to default?')) {
      api.post(`/guilds/${guildId}/config/settings`, {
        prefix: '!',
        language: 'en',
        nickname: '',
        status: { disabled: false }
      }).then(() => window.location.reload())
    }
  }


  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner text-secondary"></span>
      </div>
    )

  return (
    <div className="mx-auto w-full space-y-8">
      <div className="card p-6 space-y-6">
        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">
              <span className="label-text">Bot Prefix</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={prefix}
              onChange={e => setPrefix(e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Bot Nickname</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">
              <span className="label-text">Language</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="label cursor-pointer justify-between">
              <span className="label-text">Disable all bot features in this guild</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={disabled}
                onChange={e => setDisabled(e.target.checked)}
              />
            </label>
          </div>
        </fieldset>

        <div className="flex justify-between border-t pt-4">
          <button className="btn btn-outline btn-error" onClick={reset}>Reset</button>
          <button className="btn btn-primary" onClick={save}>💾 Save</button>
        </div>
      </div>
    </div>
  )
}
