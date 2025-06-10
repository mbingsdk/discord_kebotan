import { client } from '../bot.js'

export const getGuild = async (guildId) => {
  return await client.guilds.fetch(guildId)
}

export const getGuildRoles = async (guildId) => {
  const guild = await client.guilds.fetch(guildId)
  const roles = await guild.roles.fetch()
  return roles.map(r => ({
    id: r.id,
    name: r.name,
    position: r.position,
    color: r.color,
    permissions: r.permissions.toArray() // to human-readable
  }))
}

export const getGuildChannels = async (guildId) => {
  const guild = await client.guilds.fetch(guildId)
  const channels = await guild.channels.fetch()
  return channels.map(c => ({
    id: c.id,
    name: c.name,
    type: c.type,
    position: c.position,
    parentId: c.parentId,
    permissionOverwrites: c.permissionOverwrites
  }))
}

export const getGuildMembers = async (guildId, limit = 1000) => {
  const guild = await client.guilds.fetch(guildId)
  const members = await guild.members.fetch({ limit })
  return members.map(m => ({
    id: m.user.id,
    username: m.user.username,
    avatar: m.user.avatarURL(),
    joinedAt: m.joinedAt
  }))
}
