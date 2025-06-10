// slashCommands/untimeout.js
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
  .setName('untimeout')
  .setDescription('Remove timeout from a member')
  .addUserOption(opt =>
    opt.setName('user')
      .setDescription('User to remove timeout')
      .setRequired(true))

export async function execute(interaction) {
  const middleware = [
    cooldownMiddleware('untimeout', 10),
    checkPermissions([PermissionFlagsBits.ModerateMembers]),
    botPermissionCheck(['ModerateMembers']),
    roleHierarchyCheck('user'),
  ]

  await runMiddleware(interaction, middleware, async () => {
    const member = interaction.options.getMember('user')

    if (!member) {
      return interaction.reply({ content: '⚠️ User not found.', ephemeral: true })
    }

    try {
      await member.timeout(null, `Timeout removed by ${interaction.user.tag}`)
      await interaction.reply(`✅ Removed timeout from ${member.user.tag}`)
    } catch (err) {
      console.error('UnTimeout error:', err)
      await interaction.reply({ content: '❌ Failed to remove timeout.', ephemeral: true })
    }
  })
}
