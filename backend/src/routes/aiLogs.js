import express from 'express'
import { sendErrorToDiscord } from '../services/discordNotifier.js'

const router = express.Router()

router.post('/error', async (req, res) => {
  const { type, message, stack, route, file, line, column, userAgent } = req.body
  if (!type || !message) return res.status(400).json({ error: 'Missing required fields' })

  await sendErrorToDiscord({
    type,
    message,
    stack,
    route,
    file,
    line,
    column,
    userAgent
  })

  res.json({ success: true })
})

export default router
