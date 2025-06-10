import express from 'express'
import { client } from '../bot/index.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

// Kick Member
router.post('/:guildId/members/:userId/kick', verifyToken, async (req, res) => {
  const guild = await client.guilds.fetch(req.params.guildId)
  const member = await guild.members.fetch(req.params.userId)

  await member.kick(req.body.reason || 'Kicked via dashboard')
  res.json({ success: true })
})

// Ban Member
router.post('/:guildId/members/:userId/ban', verifyToken, async (req, res) => {
  const guild = await client.guilds.fetch(req.params.guildId)
  await guild.members.ban(req.params.userId, {
    reason: req.body.reason || 'Banned via dashboard'
  })
  res.json({ success: true })
})

export default router
