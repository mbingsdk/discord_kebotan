// slashCommands/timeout.js
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
  .setName('timeout')
  .setDescription('Temporarily mute a member')
  .addUserOption(opt =>
    opt.setName('user')
      .setDescription('User to timeout')
      .setRequired(true))
  .addStringOption(opt =>
    opt.setName('duration')
      .setDescription('Timeout duration')
      .setRequired(true)
      .addChoices(
        { name: '60 seconds', value: '60s' },
        { name: '5 minutes', value: '5m' },
        { name: '15 minutes', value: '15m' },
        { name: '1 hour', value: '1h' },
        { name: '1 day', value: '1d' },
        { name: '1 week', value: '7d' }
      )
  )
  .addStringOption(opt =>
    opt.setName('reason')
      .setDescription('Reason for timeout')
      .setRequired(false)
  )

export async function execute(interaction) {
  const middleware = [
    cooldownMiddleware('timeout', 10),
    checkPermissions([PermissionFlagsBits.ModerateMembers]),
    botPermissionCheck(['ModerateMembers']),
    roleHierarchyCheck('user'),
  ]

  await runMiddleware(interaction, middleware, async () => {
    const member = interaction.options.getMember('user')
    const duration = interaction.options.getString('duration')
    const reason = interaction.options.getString('reason') || 'No reason provided.'

    if (!member) {
      return interaction.reply({ content: '⚠️ User not found.', ephemeral: true })
    }

    const durationMap = {
      '60s': 60_000,
      '5m': 5 * 60_000,
      '15m': 15 * 60_000,
      '1h': 60 * 60_000,
      '1d': 24 * 60 * 60_000,
      '7d': 7 * 24 * 60 * 60_000
    }

    const ms = durationMap[duration]
    if (!ms) return interaction.reply({ content: '❌ Invalid duration.', ephemeral: true })

    try {
      await member.timeout(ms, `${reason} by ${interaction.user.tag}`)
      await interaction.reply(`✅ ${member.user.tag} has been timed out for ${duration}.`)
    } catch (err) {
      console.error('Timeout error:', err)
      await interaction.reply({ content: '❌ Failed to timeout user.', ephemeral: true })
    }
  })
}
