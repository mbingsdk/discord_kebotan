import { fetchGuildInfo, fetchGuilds } from '../handlers/guildHandler.js'

export const getGuilds = async (req, res) => {
  const users = req.user
  try {
    const filtered = await fetchGuilds(users.access_token)
    res.json({ guilds: filtered })
  } catch (err) {
    console.error(err)
    res.status(500).send('Failed to fetch guilds')
  }
}

export const getGuildByIds = async (req, res) => {
  const { id } = req.params
  const users = req.user
  try {
    const guilds = await fetchGuilds(users.access_token)

    const guild = guilds.find(g => g.id === id)
    if (!guild) return res.status(404).json({ message: 'Guild not found or no access' })

    res.json({ guild })
  } catch (err) {
    console.error(err)
    res.status(500).send('Failed to fetch guild')
  }
}

export const getGuildInfo = async (req, res) => {
  try {
    const owner = await fetchGuildInfo(req.params.id)
    res.json(owner)
  } catch (err) {
    console.error('Failed to fetch guild info:', err)
    res.status(500).json({ error: 'Failed to fetch guild info' })
  }
}