import { createGuildEmojis, deleteGuildEmojis, getGuildEmojis } from "../handlers/guildHandler.js"

export const getGuildEmoji = async (req, res) => {
  try {
    const { id: guildId } = req.params
    const data = await getGuildEmojis(guildId)
    res.json({ emojis: data })
  } catch (err) {
    console.error('Failed to fetch emojis:', err)
    res.status(500).json({ message: 'Failed to fetch emojis' })
  }
}

export const addGuildEmoji = async (req, res) => {
  try {
    const { id: guildId } = req.params
    const { name, url } = req.body
    const emojis = createGuildEmojis(guildId, name, url)
    res.json(emojis)
  } catch (err) {
    console.error('Failed to create emojis:', err)
    res.status(500).json({ message: 'Failed to create emojis' })
  }
}

export const deleteGuildEmoji = async (req, res) => {
  try {
    await deleteGuildEmojis(req.params.id, req.params.emojiId)
    res.json({ success: true })
  } catch (err) {
    console.error('Failed to create emojis:', err)
    res.status(500).json({ message: 'Failed to delete emojis' })
  }
}