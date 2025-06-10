import { useEffect, useState } from 'react'
import api from '../../../lib/api'
import { useAlert } from '../../../context/AlertContext'

export default function AutoroleTab({ guildId }) {
  const [enabled, setEnabled] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [roleId, setroleId] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const { showAlert } = useAlert()

  useEffect(() => {
    Promise.all([
      api.get(`/discord/guilds/${guildId}/roles`),
      api.get(`/guilds/${guildId}/config`)
    ]).then(([roleRes, configRes]) => {
      setRoles(roleRes.data.roles.filter(r => !r.isEveryone && !r.isBotRole))
      const a = configRes.data.autorole || {}
      setEnabled(a.enabled)
      setroleId(a.roleId || [])
    }).finally(() => setLoading(false))
  }, [guildId])

  const addRole = () => {
    if (!selectedRoleId || roleId.includes(selectedRoleId)) return
    setroleId([...roleId, selectedRoleId])
    setSelectedRoleId('')
  }

  const removeRole = (id) => {
    setroleId(roleId.filter(r => r !== id))
  }

  const save = () => {
    api.post(`/guilds/${guildId}/config`, {
      autorole: {
        enabled,
        roleId
      }
    }).then(() => showAlert('✅ Autorole saved', 'success'))
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner text-secondary"></span>
      </div>
    )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="toggle"
          checked={enabled}
          onChange={() => setEnabled(!enabled)}
        />
        <span className="font-medium">Enable Autorole</span>
      </div>

      <div className="flex gap-3 items-center">
        <select
          className="select select-bordered w-full"
          value={selectedRoleId}
          onChange={(e) => setSelectedRoleId(e.target.value)}
        >
          <option value="">Select role to add</option>
          {roles.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={addRole}>+ Add</button>
      </div>

      <div className="space-y-2">
        {roleId.length === 0 ? (
          <p className="text-sm text-base-content/50 italic">No roles added yet.</p>
        ) : (
          roleId.map(id => {
            const role = roles.find(r => r.id === id)
            return (
              <div key={id} className="flex justify-between items-center px-4 py-2 bg-base-200 rounded-lg">
                <span>{role?.name || id}</span>
                <button className="btn btn-xs btn-outline btn-error" onClick={() => removeRole(id)}>
                  Remove
                </button>
              </div>
            )
          })
        )}
      </div>

      <div className="text-right">
        <button className="btn btn-success" onClick={save}>💾 Save</button>
      </div>
    </div>
  )
}
