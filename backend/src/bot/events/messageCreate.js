import { getGuildConfig } from '../../services/guildConfigService.js'

// GLOBAL STORE
const recentMessages = new Map()
const warnings = new Map()

export const name = 'messageCreate'

export async function execute(message) {
  if (message.author.bot || !message.guild) return

  const config = await getGuildConfig(message.guild.id)
  if (!config) return

  // ============ ANTI LINK ============
  if (config?.moderation?.antiLink?.enabled) {
    const { whitelist = [], punish = 'delete' } = config.moderation.antiLink
    const linkRegex = /https?:\/\/[^\s]+/g
    const links = message.content.match(linkRegex)

    if (links?.length) {
      const hasBadLink = links.some(link =>
        !whitelist.some(domain => link.includes(domain))
      )

      if (hasBadLink) {
        if (punish === 'delete') {
          await message.delete().catch(() => {})
        } else {
          const member = message.member
          if (!member) return
          if (punish === 'kick') await member.kick('Anti-Link Rule')
          else if (punish === 'ban') await member.ban({ reason: 'Anti-Link Rule' })
          else if (punish === 'timeout') await member.timeout?.(60_000, 'Anti-Link Rule')
        }

        return message.channel.send(`🚫 <@${message.author.id}>, that link is not allowed.`)
      }
    }
  }

  // ============ ANTI SPAM ============
  if (config?.moderation?.antiSpam?.enabled) {
    const { interval = 5, threshold = 5, punish = 'delete' } = config.moderation.antiSpam
    const now = Date.now()
    const key = `${message.guild.id}-${message.author.id}`

    if (!recentMessages.has(key)) recentMessages.set(key, [])
    const timestamps = recentMessages.get(key).filter(t => now - t < interval * 1000)
    timestamps.push(now)
    recentMessages.set(key, timestamps)

    if (timestamps.length > threshold) {
      const member = message.member
      if (!member) return

      if (punish === 'delete') {
        await message.delete().catch(() => {})
      } else if (punish === 'warn') {
        warnings.set(key, (warnings.get(key) || 0) + 1)
        message.reply(`⚠️ Stop spamming! This is warning #${warnings.get(key)}`)
      } else if (punish === 'timeout') {
        await member.timeout?.(60_000, 'Spamming').catch(() => {})
        message.channel.send(`🔇 <@${member.id}> has been timed out for spam.`)
      } else if (punish === 'kick') {
        await member.kick('Spamming').catch(() => {})
        message.channel.send(`👢 <@${member.id}> was kicked for spam.`)
      } else if (punish === 'ban') {
        await member.ban({ reason: 'Spamming' }).catch(() => {})
        message.channel.send(`⛔ <@${member.id}> was banned for spam.`)
      }

      recentMessages.delete(key) // reset spam counter
    }
  }

  // ============ ANTI SPAM ============
  const filter = config?.moderation?.channelFilters
  if (filter) {
    if (filter.botOnlyChannels?.includes(message.channel.id) && !message.author.bot) {
      await message.delete().catch(() => {})
      return
    }

    if (filter.userOnlyChannels?.includes(message.channel.id) && message.author.bot) {
      await message.delete().catch(() => {})
      return
    }
  }

  // ============ COMMAND HANDLER ============
  if (message.author.bot || !message.content.startsWith(config.prefix)) return

  const args = message.content.slice(1).trim().split(/\s+/)
  const cmdName = args.shift().toLowerCase()

  const command = message.client.commands.get(cmdName)
  if (!command) return

  try {
    await command.execute(message, args)
  } catch (err) {
    console.error(`❌ Error in command ${cmdName}:`, err)
    message.reply('❌ Command error.')
  }
}
