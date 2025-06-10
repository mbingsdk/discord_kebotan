import { useState } from 'react'
import { useAlert } from '../../../../context/AlertContext'
import { useGuildMembers } from '../../../../hooks/useGuildMembers'
import api from '../../../../lib/api'

export default function MembersPanel({ guildId }) {
  const [reload, setReload] = useState(0)
  const { data, loading, error } = useGuildMembers(guildId, [guildId, reload])
  const { showAlert } = useAlert()

  const confirmAction = async (action, userId, username) => {
    const ok = confirm(`Are you sure you want to ${action} ${username}?`)
    if (!ok) return

    try {
      await api.post(`/mod/${guildId}/members/${userId}/${action}`, { reason: action })
      showAlert(`${action === 'kick' ? '✅ Kicked' : '✅ Banned'} successfully`, 'success')
      setReload(prev => prev + 1)
    } catch {
      showAlert(`❌ Failed to ${action}`, 'error')
    }
  }


  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner text-secondary"></span>
      </div>
    )
  if (error) return <p className="text-center text-error">Failed to load members</p>

  return (
    <div className="overflow-x-auto">
      <table className="table w-full table-zebra">
        <thead>
          <tr>
            <th>User</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.members.map((m) => (
            <tr key={m.id}>
              <td className="flex items-center gap-2">
                <img src={m.avatar} className="w-8 h-8 rounded-full" alt={m.username+"'s Avatar"} />
                {m.username}
              </td>
              <td className="text-right">
                <div className="flex flex-col md:flex-row md:justify-end gap-1">
                  <button
                    className="btn btn-xs btn-warning"
                    onClick={() => confirmAction('kick', m.id, m.username)}
                  >Kick</button>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => confirmAction('ban', m.id, m.username)}
                  >Ban</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
