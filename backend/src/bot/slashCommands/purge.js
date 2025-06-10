// slashCommands/purge.js
import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType
} from 'discord.js'
import { checkPermissions } from '../middleware/checkPermissions.js'
import { botPermissionCheck } from '../middleware/botPermissionCheck.js'
import { runMiddleware } from '../utils/runMiddleware.js'

export const data = new SlashCommandBuilder()
  .setName('purge')
  .setDescription('Delete multiple messages in bulk')
  .addIntegerOption(opt =>
    opt.setName('limit')
      .setDescription('Number of messages to delete (max 100)')
      .setMinValue(1)
      .setMaxValue(100)
  )
  .addUserOption(opt =>
    opt.setName('user')
      .setDescription('Only delete messages from this user')
  )
  .addChannelOption(opt =>
    opt.setName('channel')
      .setDescription('Target channel (default: current)')
      .addChannelTypes(ChannelType.GuildText)
  )

export async function execute(interaction) {
  const middleware = [
    checkPermissions([PermissionFlagsBits.ManageMessages]),
    botPermissionCheck(['ManageMessages']),
  ]

  await runMiddleware(interaction, middleware, async () => {
    const limit = interaction.options.getInteger('limit') ?? 10
    const targetUser = interaction.options.getUser('user')
    const targetChannel = interaction.options.getChannel('channel') || interaction.channel

    if (!targetChannel.isTextBased()) {
      return interaction.reply({ content: '❌ Channel must be text based.', ephemeral: true })
    }

    const messages = await targetChannel.messages.fetch({ limit: 100 })
    const filtered = [...messages.values()]
      .filter(m => !targetUser || m.author.id === targetUser.id)
      .slice(0, limit)

    if (filtered.length === 0) {
      return interaction.reply({ content: '⚠️ No messages found to delete.', ephemeral: true })
    }

    try {
      await targetChannel.bulkDelete(filtered, true)
      await interaction.reply({ content: `🧹 Deleted ${filtered.length} messages.`, ephemeral: true })
    } catch (err) {
      console.error('Purge error:', err)
      await interaction.reply({ content: '❌ Failed to delete messages.', ephemeral: true })
    }
  })
}
