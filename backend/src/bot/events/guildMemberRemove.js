import { EmbedBuilder } from 'discord.js'
import { renderGreeting } from '../../utils/renderGreeting.js'
import { getGuildConfig } from '../../services/guildConfigService.js'

export const name = 'guildMemberRemove'

export async function execute(member) {
  const config = await getGuildConfig(member.guild.id)
  const g = config?.greeting?.leave
  const log = config?.logs?.memberLeave

  if (log?.enabled && log?.channelId) {
    const channel = member.guild.channels.cache.get(log.channelId)
    if (channel?.isTextBased()) {
      channel.send(`<@${member.id}> left the server!`)
    }
  }

  if (!g?.enabled || !g.channelId || !g.message) return

  const channel = member.guild.channels.cache.get(g.channelId)
  if (!channel?.isTextBased()) return

  const embed = new EmbedBuilder()
    .setColor('#ff5e5e')
    .setAuthor({ name: `${member.user.username} left`, iconURL: member.user.displayAvatarURL() })
    .setDescription(renderGreeting(g.message, member))
    .setTimestamp()

  await channel.send({ embeds: [embed] })
}