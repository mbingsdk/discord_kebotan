import express from 'express'
import { verifyToken } from '../middleware/verifyToken.js'
import { getGuildByIds, getGuildInfo, getGuilds } from '../controllers/guildController.js'
import { getGuildMembers } from '../controllers/guildMemberController.js'
import { bulkSendReactionRoleMessage, sendReactionRoleMessage } from '../controllers/reactionRoleController.js'
import { addGuildEmoji, deleteGuildEmoji, getGuildEmoji } from '../controllers/guildEmojiController.js'
import { addRole, deleteRole, getGuildRole, reorderRole, updateRole } from '../controllers/guildRoleController.js'
import { getGuildChannels, reorderGuildChannels, updateChannels } from '../controllers/guildChannelController.js'


const router = express.Router()

router.get('/guilds', verifyToken, getGuilds)
router.get('/guilds/:id/info', verifyToken, getGuildInfo)
router.get('/guilds/:id', verifyToken, getGuildByIds)

router.get('/guilds/:id/members', verifyToken, getGuildMembers)

router.post('/guilds/:id/reaction-roles/send/:index', verifyToken, sendReactionRoleMessage)
router.post('/guilds/:id/reaction-roles/send', verifyToken, bulkSendReactionRoleMessage)

router.get('/guilds/:id/emojis', verifyToken, getGuildEmoji)
router.post('/guilds/:id/emojis', verifyToken, addGuildEmoji)
router.delete('/guilds/:id/emojis/:emojiId', verifyToken, deleteGuildEmoji)

router.get('/guilds/:id/roles', verifyToken, getGuildRole)
router.post('/guilds/:id/roles', verifyToken, addRole)
router.delete('/guilds/:id/roles/:roleId', verifyToken, deleteRole)
router.post('/guilds/:id/roles/reorder', verifyToken, reorderRole)
router.post('/guilds/:id/roles/:roleId', verifyToken, updateRole)

router.get('/guilds/:id/channels', verifyToken, getGuildChannels)
router.post('/guilds/:id/channels/reorder', verifyToken, reorderGuildChannels)
router.post('/guilds/:id/channels/:channelId', verifyToken, updateChannels)

export default router