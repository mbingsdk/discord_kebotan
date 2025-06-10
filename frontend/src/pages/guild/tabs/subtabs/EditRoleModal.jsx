import { useEffect, useState } from 'react'
import { ChromePicker, CirclePicker } from 'react-color'
import { FLAG_MAP } from '../../../../constants/PermissionFlags'
import api from '../../../../lib/api'

export default function EditRoleModal({ role, onClose, guildId, onSave }) {
  const [name, setName] = useState(role.name)
  const [color, setColor] = useState(`#${(role.color || 0).toString(16).padStart(6, '0')}`)
  const [selectedPerms, setSelectedPerms] = useState(new Set())
  const [showPicker, setShowPicker] = useState(false)
  const [PERMISSION_FLAGS, setPermissionFlags] = useState([])
  const DEFAULT_COLORS = [
    '#5865F2', '#57F287', '#FEE75C', '#EB459E',
    '#ED4245', '#FAA61A', '#3498db', '#1abc9c',
    '#9b59b6', '#e67e22', '#e74c3c', '#95a5a6',
  ]

  useEffect(() => {
    if (role.permissions) {
      setSelectedPerms(new Set(role.permissions))
    }
    setPermissionFlags(Object.values(FLAG_MAP))
  }, [role])

  const togglePerm = (perm) => {
    const newSet = new Set(selectedPerms)
    newSet.has(perm) ? newSet.delete(perm) : newSet.add(perm)
    setSelectedPerms(newSet)
  }

  const save = async () => {
    await api.post(`/discord/guilds/${guildId}/roles/${role.id}`, {
      name,
      permissions: Array.from(selectedPerms),
      color: parseInt(color.replace('#', ''), 16)
    })
    onSave()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-base-100 p-6 rounded-lg w-full max-w-md space-y-4">
        <div className="text-lg font-bold">Edit Role</div>

        <input
          className="input input-bordered w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="form-control">
          <label className="label text-sm font-medium">Role Color</label>

          {/* Circle Picker */}
          <CirclePicker
            colors={DEFAULT_COLORS}
            color={color}
            circleSize={28}
            onChange={(c) => setColor(c.hex)}
            className="!justify-start"
          />

          <div className="flex justify-between items-center mt-3">
            <button className="btn btn-sm btn-outline" onClick={() => setShowPicker(!showPicker)}>
              {showPicker ? 'Hide Picker' : 'Custom'}
            </button>
            <span className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs font-mono" style={{ color: color }}>{name}</span>
            </span>
          </div>

          {showPicker && (
            <div className="absolute z-50 mt-2">
              <ChromePicker color={color} onChange={(c) => setColor(c.hex)} disableAlpha />
            </div>
          )}
        </div>

        <div className="max-h-48 overflow-y-auto space-y-1">
          {PERMISSION_FLAGS.map(perm => (
            <label key={perm} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={selectedPerms.has(perm)}
                onChange={() => togglePerm(perm)}
              />
              {perm}
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button className="btn btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  )
}
