import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useState } from 'react'
import api from '../../../../lib/api'
import EditChannelModal from './EditChannelModal'

export default function ChannelsPanel({ guildId }) {
  const [groups, setGroups] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [editingChannel, setEditingChannel] = useState(null)

  useEffect(() => {
    api.get(`/discord/guilds/${guildId}/channels`).then(res => {
      setGroups(res.data.channels)
    })
  }, [guildId])

  function SortableChannel({ channel, onEdit }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: channel.id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    }

    return (
      <div className="flex justify-between items-center bg-base-200 p-3 rounded cursor-grab">
        <div
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          style={style}
        >
          <div className="font-semibold text-sm">
            {channel.type === 0 ? '#️⃣' : '🔊'}{channel.name}
          </div>
          <div className="text-xs text-base-content/50">
            Type: {channel.type === 0 ? 'Text' : 'Voice'} • Pos: {channel.position}
          </div>
        </div>
        {/* <button className="btn btn-xs btn-outline btn-primary" onClick={() => setEditingChannel(channel)}>Edit</button> */}
      </div>
    )
  }

  const sensors = useSensors(useSensor(PointerSensor))

  const onDragEnd = async (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const sourceGroup = groups.find(g => g.children.find(c => c.id === active.id))
    const destGroup = groups.find(g => g.children.find(c => c.id === over.id))

    if (!sourceGroup || !destGroup) return

    const sourceIndex = sourceGroup.children.findIndex(c => c.id === active.id)
    const destIndex = destGroup.children.findIndex(c => c.id === over.id)

    // Move item
    const movedItem = sourceGroup.children[sourceIndex]
    const newGroups = [...groups]

    // Remove from source
    newGroups.find(g => g.id === sourceGroup.id).children.splice(sourceIndex, 1)

    // Insert to dest
    newGroups.find(g => g.id === destGroup.id).children.splice(destIndex, 0, movedItem)

    setGroups(newGroups)

    // Sync to backend
    const reordered = []
    newGroups.forEach(group => {
      group.children.forEach((child, i) => {
        reordered.push({
          id: child.id,
          position: i,
          parent_id: group.type === 'virtual' ? null : group.id
        })
      })
    })

    await api.post(`/discord/guilds/${guildId}/channels/reorder`, { reordered })
  }

  return (
    <div className="space-y-6">
      {editingChannel && (
        <EditChannelModal
          channel={editingChannel}
          guildId={guildId}
          categories={groups.filter(g => g.type !== 'virtual')}
          onClose={() => setEditingChannel(null)}
          onSave={() => api.get(`/discord/guilds/${guildId}/channels`).then(res => setGroups(res.data.channels))}
        />
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd} onDragStart={(e) => setActiveId(e.active.id)}>
        {groups.map(group => (
          <div key={group.id} className="space-y-2">
            <div className="text-lg font-bold">
              {group.type === 'virtual' ? '📦 Uncategorized' : `📁 ${group.name}`}
            </div>

            <SortableContext
              items={group.children.map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 pl-3">
                {group.children.map(ch => (
                  <SortableChannel key={ch.id} channel={ch} />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
        <DragOverlay>{activeId}</DragOverlay>
      </DndContext>
    </div>
  )
}
