import { EmbedBuilder } from 'discord.js'
import { renderGreeting } from '../../utils/renderGreeting.js'
import { getGuildConfig } from '../../services/guildConfigService.js'

export const name = 'guildMemberAdd'

export async function execute(member) {
  const config = await getGuildConfig(member.guild.id)
  const g = config?.greeting?.welcome
  const log = config?.logs?.memberJoin
  const auto = config?.autorole

  if (log?.enabled && log?.channelId) {
    const channel = member.guild.channels.cache.get(log.channelId)
    if (channel?.isTextBased()) {
      channel.send(`<@${member.id}> joined to the server!`)
    }
  }

  if (auto?.enabled && auto.roleId?.length) {
    for (const roleId of auto.roleId) {
      const role = member.guild.roles.cache.get(roleId)
      if (role) await member.roles.add(role).catch(console.error)
    }
  }

  if (!g?.enabled || !g.channelId || !g.message) return

  const channel = member.guild.channels.cache.get(g.channelId)
  if (!channel?.isTextBased()) return

  const embed = new EmbedBuilder()
    .setColor('#00b0f4')
    .setAuthor({ name: `${member.user.username} joined`, iconURL: member.user.displayAvatarURL() })
    .setDescription(renderGreeting(g.message, member))
    .setTimestamp()

  channel.send({ embeds: [embed] })
}
