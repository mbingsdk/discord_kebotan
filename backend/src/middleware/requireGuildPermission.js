// middleware/requireGuildPermission.js
export default function requireGuildPermission(permission = 'MANAGE_GUILD') {
  return async (req, res, next) => {
    const guildId = req.params.id
    const userGuilds = req.user.guilds || []

    const matchedGuild = userGuilds.find(g => g.id === guildId && (g.owner || BigInt(g.permissions) & BigInt(0x20)))
    if (!matchedGuild) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }

    next()
  }
}
