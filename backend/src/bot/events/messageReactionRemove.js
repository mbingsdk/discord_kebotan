import { getGuildConfig } from '../../services/guildConfigService.js'

export const name = 'messageReactionRemove'

export async function execute(reaction, user) {
  if (user.bot) return

  const guild = reaction.message.guild
  if (!guild) return

  const config = await getGuildConfig(guild.id)
  if (!config?.reactionRoles?.length) return

  const emojiFull = reaction.emoji.id
    ? `<${reaction.emoji.animated ? 'a' : ''}:${reaction.emoji.name}:${reaction.emoji.id}>`
    : reaction.emoji.name

  for (const set of config.reactionRoles) {
    if (set.messageId !== reaction.message.id) continue

    const mapping = set.mappings.find(m => m.emoji === emojiFull)
    if (!mapping) continue

    const member = await guild.members.fetch(user.id)
    await member.roles.remove(mapping.roleId).catch(console.error)

    break // stop after 1 match
  }
}