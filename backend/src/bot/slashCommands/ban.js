// slashCommands/ban.js
import {
  SlashCommandBuilder,
  PermissionFlagsBits
} from 'discord.js'
import { checkPermissions } from '../middleware/checkPermissions.js'
import { cooldownMiddleware } from '../middleware/cooldownMiddleware.js'
import { botPermissionCheck } from '../middleware/botPermissionCheck.js'
import { roleHierarchyCheck } from '../middleware/roleHierarchyCheck.js'
import { runMiddleware } from '../utils/runMiddleware.js'

export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Ban a member')
  .addUserOption(opt => opt.setName('user').setDescription('User to ban').setRequired(true))

export async function execute(interaction) {
  const middleware = [
    cooldownMiddleware('ban', 10),
    checkPermissions([PermissionFlagsBits.BanMembers]),
    botPermissionCheck(['BanMembers']),
    roleHierarchyCheck('user'),
  ]

  await runMiddleware(interaction, middleware, async () => {
    const member = interaction.options.getMember('user')
    if (!member) {
      return interaction.reply({ content: '⚠️ User not found.', ephemeral: true })
    }

    await member.ban({ reason: `Banned by ${interaction.user.tag}` })
    await interaction.reply(`✅ Banned ${member.user.tag}`)
  })
}
