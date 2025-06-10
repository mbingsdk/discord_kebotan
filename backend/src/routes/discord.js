import express from 'express'
import { verifyToken } from '../middleware/verifyToken.js'
import { getGuildByIds, getGuildInfo, getGuilds } from '../controllers/guildController.js'
import { getGuildMembers } from '../controllers/guildMemberController.js'
import { bulkSendReactionRoleMessage, sendReactionRoleMessage } from '../controllers/reactionRoleController.js'
import { addGuildEmoji, getGuildEmoji } from '../controllers/guildEmojiController.js'
import { addRole, deleteRole, getGuildRole, reorderRole, updateRole } from '../controllers/guildRoleController.js'
import { getGuildChannels, reorderGuildChannels } from '../controllers/guildChannelController.js'
import { client } from '../bot/index.js'

const router = express.Router()

router.get('/guilds', verifyToken, getGuilds)
router.get('/guilds/:id/info', verifyToken, getGuildInfo)
router.get('/guilds/:id', verifyToken, getGuildByIds)

router.get('/guilds/:id/members', verifyToken, getGuildMembers)

router.post('/guilds/:id/reaction-roles/send/:index', verifyToken, sendReactionRoleMessage)
router.post('/guilds/:id/reaction-roles/send', verifyToken, bulkSendReactionRoleMessage)

router.get('/guilds/:id/emojis', verifyToken, getGuildEmoji)
router.post('/guilds/:id/emojis', verifyToken, addGuildEmoji)
router.delete('/guilds/:id/emojis/:emojiId', verifyToken, async (req, res) => {
  const guild = await client.guilds.fetch(req.params.id)
  const emoji = await guild.emojis.fetch(req.params.emojiId)
  await emoji.delete()
  res.json({ success: true })
})

router.get('/guilds/:id/roles', verifyToken, getGuildRole)
router.post('/guilds/:id/roles', verifyToken, addRole)
router.delete('/guilds/:id/roles/:roleId', verifyToken, deleteRole)
router.post('/guilds/:id/roles/reorder', verifyToken, reorderRole)
router.post('/guilds/:id/roles/:roleId', verifyToken, updateRole)

router.get('/guilds/:id/channels', verifyToken, getGuildChannels)
router.post('/guilds/:id/channels/reorder', verifyToken, reorderGuildChannels)
router.post('/guilds/:id/channels/:channelId', async (req, res) => {
  try {
    const guild = await client.guilds.fetch(req.params.id)
    const channel = await guild.channels.fetch(req.params.channelId)

    const update = {
      name: req.body.name,
      type: req.body.type,
      parent: req.body.parent_id || null,
      permissionOverwrites: req.body.permission_overwrites
    }

    await channel.edit(update)
    res.json({ success: true })
  } catch (err) {
    console.error('Edit channel error:', err)
    res.status(500).json({ error: 'Failed to edit channel' })
  }
})

export default router