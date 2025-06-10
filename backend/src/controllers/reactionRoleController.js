import { bulkSendReactionRoleMessages, sendReactionRoleMessages } from "../handlers/guildHandler.js"

export const sendReactionRoleMessage = async (req, res) => {
  const { id: guildId, index } = req.params
  const i = parseInt(index)

  try {
    const r = await sendReactionRoleMessages(guildId, i)
    if (r === 1) return res.status(400).send({ message: 'Invalid reaction role set' })
    if (r === 2) return res.status(400).json({ message: 'Invalid channel' })
    res.json({ success: true, messageId: r.id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to send reaction role message' })
  }
}

export const bulkSendReactionRoleMessage = async (req, res) => {
  const { id: guildId } = req.params

  try {
    const r = await bulkSendReactionRoleMessages(guildId)
    if (!r) return res.status(400).send('No reaction roles')
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to send reaction role message' })
  }
}