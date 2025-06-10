import { fetchGuildMembers } from "../handlers/guildHandler.js"

export const getGuildMembers = async (req, res) => {
  const { id } = req.params

  try {
    const members = await fetchGuildMembers(id)
    res.json({ members })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch members' })
  }
}