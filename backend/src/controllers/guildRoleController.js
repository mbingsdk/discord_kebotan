// import { Colors } from "discord.js"
import {
  createRoles,
  editRoles,
  fetchGuildRoles,
  removeRoles,
  reorderRoles
} from "../handlers/guildHandler.js"

export const getGuildRole = async (req, res) => {
  const result = await fetchGuildRoles(req.params.id)
  res.json({ roles: result })
}

export const addRole = async (req, res) => {
  try {
    const role = await createRoles(req.params.id, req.body.name || 'New Role')
    res.json({ role })
  } catch (err) {
    console.error('Create role error:', err)
    res.status(500).json({ error: 'Failed to create role' })
  }
}

export const deleteRole = async (req, res) => {
  try {
    await removeRoles(req.params.id, req.params.roleId)
    res.json({ success: true })
  } catch (err) {
    console.error('Delete role error:', err)
    res.status(500).json({ error: 'Failed to delete role' })
  }
}

export const reorderRole = async (req, res) => {
  const { orderedIds } = req.body
  if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'orderedIds required' })

  try {
    const reordered = await reorderRoles(req.params.id, orderedIds)
    res.json({ success: true, data: reordered })
  } catch (err) {
    console.error('Reorder roles error:', err)
    res.status(500).json({ error: 'Failed to reorder roles' })
  }
}

export const updateRole = async (req, res) => {
  try {
    const { name, permissions, color } = req.body
    await editRoles(req.params.id, req.params.roleId, name, permissions, color)
    res.json({ success: true })
  } catch (err) {
    console.error('Edit role error:', err)
    res.status(500).json({ message: 'Failed to update role' })
  }
}