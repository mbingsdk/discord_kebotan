import axios from 'axios'
import { client } from '../bot/index.js'
import GuildConfig from '../models/GuildConfig.js'
import { Colors, AttachmentBuilder } from 'discord.js'

// ========= GUILD =========
export const fetchGuilds = async (token) => {
  const guilds = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })

  const botGuildIds = client.guilds.cache.map(g => g.id)

  return guilds.data
    .filter(g =>
        g.owner || (BigInt(g.permissions) & BigInt(0x20n)) // MANAGE_GUILD (Moderator/Owner)
      )
      .map(g => ({
        ...g,
        botIn: botGuildIds.includes(g.id) // ✅ tambahkan status bot
      }))
}

export const fetchGuildInfo = async (id) => {
  const guild = await client.guilds.fetch(id)
  const owner = await guild.fetchOwner()

  return {
    id: guild.id,
    name: guild.name,
    icon: guild.icon
      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
      : null,
    memberCount: guild.memberCount,
    ownerId: owner.id,
    createdAt: guild.createdAt.toISOString(),
    region: guild.preferredLocale || 'unknown'
  }
}

// ========= GUILD MEMBERS =========
export const fetchGuildMembers = async (id) => {
    const guild = await client.guilds.fetch(id)
    await guild.members.fetch() // make sure cache terisi

    return guild.members.cache.map((m) => ({
      id: m.id,
      username: m.user.username,
      discriminator: m.user.discriminator,
      avatar: m.user.displayAvatarURL(),
    }))
}

// ========= GUILD REACTION ROLE =========
export const sendReactionRoleMessages = async (guildId, i) => {
    const guild = await client.guilds.fetch(guildId)
    const config = await GuildConfig.findOne({ guildId })
    const set = config?.reactionRoles?.[i]
    if (!set || !set.channelId || !set.messageText || !set.mappings?.length)
      return 1

    const channel = await guild.channels.fetch(set.channelId)
    if (!channel?.isTextBased()) return 2

    const msg = await channel.send(set.messageText)
    for (const map of set.mappings) {
      try {
        await msg.react(map.emoji)
      } catch (err) {
        console.warn(`Failed to react with ${map.emoji}`, err.message)
      }
    }

    config.reactionRoles[i].messageId = msg.id
    await config.save()

    return msg
}

export const bulkSendReactionRoleMessages = async (guildId) => {
    const guild = await client.guilds.fetch(guildId)
    const config = await GuildConfig.findOne({ guildId })
    if (!config || !config.reactionRoles) return null

    const updated = []

    for (const set of config.reactionRoles) {
      const channel = await guild.channels.fetch(set.channelId)
      if (!channel || !channel.isTextBased()) continue

      const msg = await channel.send(set.messageText)
      for (const map of set.mappings) {
        await msg.react(map.emoji)
      }

      updated.push({
        ...set.toObject(),
        messageId: msg.id
      })
    }

    config.reactionRoles = updated
    await config.save()
    return true
}

// ========= GUILD EMOJI =========
export const getGuildEmojis = async (guildId) => {
    const guild = await client.guilds.fetch(guildId)
    const emojis = await guild.emojis.fetch()

    return emojis.map(emoji => ({
      id: emoji.id,
      name: emoji.name,
      animated: emoji.animated,
      url: emoji.url,
      raw: emoji.toString(), // ⬅️ ready to use in message
      code: emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`
    }))
}

export const createGuildEmojis = async (guildId, name, url) => {
    const guild = await client.guilds.fetch(guildId)
    const emoji = await guild.emojis.create({
      name: name,
      attachment: url
    })

    console.log(`✅ Emoji created: <${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`)
    return { success: true, id: emoji.id, emoji: `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>` }
}

// ========= GUILD ROLE =========
export const fetchGuildRoles = async (id) => {
  const guild = await client.guilds.fetch(id)
  const roles = await guild.roles.fetch()

  return roles.map(r => ({
    id: r.id,
    name: r.name,
    position: r.position,
    color: r.color,
    permissions: r.permissions.toArray(),
    isEveryone: r.name === '@everyone',
    isBotRole: r.managed, // Bot-managed roles
  })).sort((a, b) => b.position - a.position)
}

export const createRoles = async (id, name) => {
  const guild = await client.guilds.fetch(id)
  return await guild.roles.create({
    name: name,
    reason: 'Created via dashboard'
  })
}

export const removeRoles = async (id, roleId) => {
  const guild = await client.guilds.fetch(id)
  const role = await guild.roles.fetch(roleId)
  await role.delete('Deleted via dashboard')
}

export const reorderRoles = async (id, ordered) => {
  const guild = await client.guilds.fetch(id)

  // Hitung posisi dari bawah ke atas (Discord-style)
  const reordered = ordered.map((id, i) => ({
    role: id,
    position: ordered.length - i - 1
  }))
  await guild.roles.setPositions(reordered)
}

export const editRoles = async (id, roleId, name, perm, color) => {
  const guild = await client.guilds.fetch(id)
  const role = await guild.roles.fetch(roleId)
  await role.edit({
    name,
    permissions: perm || role.permissions,
    color: color
  })
}

// ========= GUILD CHANNEL =========
export const fetchChannels = async (id) => {
  const guild = await client.guilds.fetch(id)
  const channels = await guild.channels.fetch()
  const categories = []
  const others = []

  channels.forEach((c) => {
    if (c.type === 4) {
      categories.push({
        id: c.id,
        name: c.name,
        type: 4,
        position: c.position,
        permissionOverwrites: c.permissionOverwrites,
        children: []
      })
    } else {
      others.push({
        id: c.id,
        name: c.name,
        position: c.position,
        parent_id: c.parentId,
        permissionOverwrites: c.permissionOverwrites,
        type: c.type,
      })
    }
  })

  for (const child of others) {
    const parent = categories.find(c => c.id === child.parent_id)
    if (parent) {
      parent.children.push(child)
    } else {
      let uncategorized = categories.find(c => c.id === 'uncategorized')
      if (!uncategorized) {
        uncategorized = {
          id: 'uncategorized',
          name: 'Uncategorized',
          type: 'virtual',
          position: Infinity,
          children: []
        }
        categories.push(uncategorized)
      }
      uncategorized.children.push(child)
    }
  }

  // ✅ Sort categories
  categories.sort((a, b) => a.position - b.position)

  // ✅ Sort inside each category by type then position
  categories.forEach(cat => {
    cat.children.sort((a, b) => {
      if (a.type !== b.type) return a.type - b.type // type: text < voice
      return a.position - b.position
    })
  })

  return categories
}

export const reorderGuildChannel = async (id, reordered) => {
  const guild = await client.guilds.fetch(id)

  for (const ch of reordered) {
    const channel = await guild.channels.fetch(ch.id)
    await channel.edit({
      position: ch.position,
      parent: ch.parent_id || null
    })
  }
}