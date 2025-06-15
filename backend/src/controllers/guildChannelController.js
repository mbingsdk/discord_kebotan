import { fetchChannels, reorderGuildChannel, updateChannel } from "../handlers/guildHandler.js"

// export const getGuildChannels = async (req, res) => {
//   const result = await fetchChannels(req.params.id)
//   res.json({ channels: result })
// }

export const getGuildChannels = async (req, res) => {
  try {
    const categories = await fetchChannels(req.params.id)
    res.json({ channels: categories })
  } catch (err) {
    console.error('Fetch channels error:', err)
    res.status(500).json({ error: 'Failed to fetch channels' })
  }
}

export const reorderGuildChannels = async (req, res) => {
  try {
    const { reordered } = req.body
    await reorderGuildChannel(req.params.id, reordered)
    res.json({ success: true })
  } catch (err) {
    console.error('Reorder channels error:', err)
    res.status(500).json({ error: 'Failed to reorder channels' })
  }
}

export const updateChannels = async (req, res) => {
  try {
    await updateChannel(req.params.id, req.params.channelId, req.body)
    res.json({ success: true })
  } catch (err) {
    console.error('Edit channel error:', err)
    res.status(500).json({ error: 'Failed to edit channel' })
  }
}