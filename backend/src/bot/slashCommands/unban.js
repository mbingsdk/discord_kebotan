// slashCommands/unban.js
import {
  SlashCommandBuilder,
  PermissionFlagsBits
} from 'discord.js'
import { checkPermissions } from '../middleware/checkPermissions.js'
import { cooldownMiddleware } from '../middleware/cooldownMiddleware.js'
import { botPermissionCheck } from '../middleware/botPermissionCheck.js'
import { runMiddleware } from '../utils/runMiddleware.js'

export const data = new SlashCommandBuilder()
  .setName('unban')
  .setDescription('Unban a user')
  .addStringOption(opt =>
    opt.setName('userid').setDescription('User ID to unban').setRequired(true))

export async function execute(interaction) {
  const middleware = [
    cooldownMiddleware('unban', 5),
    checkPermissions([PermissionFlagsBits.BanMembers]),
    botPermissionCheck(['BanMembers']),
  ]

  await runMiddleware(interaction, middleware, async () => {
    const userId = interaction.options.getString('userid')

    try {
      await interaction.guild.members.unban(userId)
      await interaction.reply(`✅ Unbanned <@${userId}>`)
    } catch (err) {
      await interaction.reply({ content: '❌ Failed to unban.', ephemeral: true })
    }
  })
}
