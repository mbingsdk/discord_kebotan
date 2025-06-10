import { useEffect, useState } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import api from '../../../../lib/api'
import EditRoleModal from './EditRoleModal'

export default function RolesPanel({ guildId }) {
  const [roles, setRoles] = useState([])
  const [editingRole, setEditingRole] = useState(null)

  useEffect(() => {
    api.get(`/discord/guilds/${guildId}/roles`).then(res => {
      // Sorted highest → lowest (posisi terbesar = atas)
      const sorted = res.data.roles.sort((a, b) => b.position - a.position)
      setRoles(sorted)
    })
  }, [guildId])

  const SortableRole = ({ role }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: role.id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    }

    return (
      <div className="flex justify-between items-center bg-base-200 p-3 rounded cursor-grab">
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
        >
          <div className="font-bold text-sm">{role.name}</div>
          <div className="text-xs text-base-content/50">Position: {role.position}</div>
        </div>

        <div className="flex items-center gap-2 ml-3">
          <button
            className="btn btn-xs btn-outline btn-error"
            onClick={async () => {
              if (confirm(`Delete role "${role.name}"?`)) {
                await api.delete(`/discord/guilds/${guildId}/roles/${role.id}`)
                const res = await api.get(`/discord/guilds/${guildId}/roles`)
                setRoles(res.data.roles.sort((a, b) => b.position - a.position))
              }
            }}
          >
            Delete
          </button>
          <button className="btn btn-xs btn-outline btn-primary" onClick={() => setEditingRole(role)}>Edit</button>
        </div>

      </div>
    )
  }

  const sensors = useSensors(useSensor(PointerSensor))

  const onDragEnd = async (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = roles.findIndex(r => r.id === active.id)
      const newIndex = roles.findIndex(r => r.id === over.id)
      const newOrder = arrayMove(roles, oldIndex, newIndex)

      setRoles(newOrder)

      // Hit API untuk update posisi
      await api.post(`/discord/guilds/${guildId}/roles/reorder`, {
        orderedIds: newOrder.map((r) => r.id)
      })
    }
  }

  return (
    <div className="space-y-4">
      {editingRole && (
        <EditRoleModal
          role={editingRole}
          guildId={guildId}
          onClose={() => setEditingRole(null)}
          onSave={() => api.get(`/discord/guilds/${guildId}/roles`).then(res => {
            const sorted = res.data.roles.sort((a, b) => b.position - a.position)
            setRoles(sorted)
          })}
        />
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Manage Roles</h2>
        <button
          className="btn btn-sm btn-success"
          onClick={async () => {
            await api.post(`/discord/guilds/${guildId}/roles`, { name: 'New Role' })
            const res = await api.get(`/discord/guilds/${guildId}/roles`)
            setRoles(res.data.roles.sort((a, b) => b.position - a.position))
          }}
        >
          + Add Role
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={roles.map(r => r.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {roles.map(role =>
              !role.isEveryone && !role.isBotRole ? (
                <SortableRole key={role.id} role={role} />
              ) : null
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
