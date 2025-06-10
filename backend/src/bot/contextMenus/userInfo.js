// src/bot/contextMenus/userInfo.js
import { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder, MessageFlags } from 'discord.js'

export const data = new ContextMenuCommandBuilder()
  .setName('User Info')
  .setType(ApplicationCommandType.User)

export async function execute(interaction) {
  const user = await interaction.guild.members.fetch(interaction.targetId)

  const embed = new EmbedBuilder()
    .setTitle(`${user.user.username}'s Info`)
    .setThumbnail(user.user.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: 'Username', value: `${user.user.tag}`, inline: true },
      { name: 'ID', value: `${user.user.id}`, inline: true },
      { name: 'Joined', value: `<t:${Math.floor(user.joinedTimestamp / 1000)}:R>`, inline: true },
      { name: 'Roles', value: user.roles.cache.map(r => r.name).join(', ') || 'None' }
    )
    .setColor('Random')

  await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
}
