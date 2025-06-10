import { useEffect, useState } from 'react'
import api from '../../../../lib/api'
import { FLAG_MAP } from '../../../../constants/PermissionFlags'

export default function EditChannelModal({ channel, guildId, categories, onClose, onSave }) {
  const [name, setName] = useState(channel.name)
  const [type, setType] = useState(channel.type)
  const [roles, setRoles] = useState([])
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [role, setRole] = useState([])
  const [parentId, setParentId] = useState(channel.parent_id || '')
  const [selectedPerms, setSelectedPerms] = useState(new Set())
  const [PERMISSION_FLAGS, setPermissionFlags] = useState([])
  const [isPrivate, setIsPrivate] = useState(false)
  const [permissions, setPermissions] = useState(channel.permission_overwrites || [])

  useEffect(() => {
    // Cek permission overwrite yang bukan @everyone
    setIsPrivate(permissions.some(p => p.id !== channel.guild_id))
  }, [permissions])

  useEffect(() => {
    api.get(`/discord/guilds/${guildId}/roles`).then(res => {
      // Sorted highest → lowest (posisi terbesar = atas)
      const sorted = res.data.roles.sort((a, b) => b.position - a.position)
      setRoles(sorted)
    })
  }, [guildId])

  useEffect(() => {
    if (role.permissions) {
      setSelectedPerms(new Set(role.permissions))
    }
    setPermissionFlags(Object.values(FLAG_MAP))
  }, [role])

  const save = async () => {
    await api.post(`/discord/guilds/${guildId}/channels/${channel.id}`, {
      name,
      type,
      parent_id: parentId || null,
      position,
      permission_overwrites: permissions
    })
    onSave()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-base-100 p-6 rounded-lg w-full max-w-md space-y-4">
        <h2 className="text-lg font-bold">Edit Channel</h2>

        <input className="input input-bordered w-full" value={name} onChange={e => setName(e.target.value)} />

        <select className="select select-bordered w-full" value={type} onChange={e => setType(Number(e.target.value))}>
          <option value={0}>Text</option>
          <option value={2}>Voice</option>
        </select>

        <select className="select select-bordered w-full" value={parentId} onChange={e => setParentId(e.target.value)}>
          <option value="">Uncategorized</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <label className="label cursor-pointer">
          <span className="label-text">Private Channel</span>
          <input
            type="checkbox"
            className="toggle"
            checked={isPrivate}
            onChange={e => setIsPrivate(e.target.checked)}
          />
        </label>

        {isPrivate ? (
          <div className="space-y-2">
            {permissions.map((p, i) => (
              <div key={i} className="bg-base-200 p-2 rounded">
                <div className="text-sm font-semibold">{p.id === channel.guild_id ? '@everyone' : `Role: ${p.id}`}</div>
                <textarea
                  className="textarea textarea-bordered w-full mt-1"
                  rows={2}
                  value={JSON.stringify(p, null, 2)}
                  onChange={e => {
                    try {
                      const updated = [...permissions]
                      updated[i] = JSON.parse(e.target.value)
                      setPermissions(updated)
                    } catch (_) {}
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-sm font-semibold">@everyone Permissions</div>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={3}
              value={JSON.stringify(permissions.find(p => p.id === channel.guild_id) || {}, null, 2)}
              onChange={e => {
                try {
                  const updated = permissions.map(p =>
                    p.id === channel.guild_id ? JSON.parse(e.target.value) : p
                  )
                  setPermissions(updated)
                } catch (_) {}
              }}
            />
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button className="btn btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  )
}
