// events/interactionCreate.js
import GuildConfig from '../../models/GuildConfig.js'
import { createRenameModal } from '../components/modalBuilder.js'
import { tempChannelMap } from '../utils/tempChannelMap.js'

export const name = 'interactionCreate'

export async function execute(interaction) {
  // Slash commands
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.slashCommands.get(interaction.commandName)
    if (command) await command.execute(interaction)
  }

  // Context menus
  if (interaction.isUserContextMenuCommand()) {
    const context = interaction.client.contextMenus.get(interaction.commandName)
    if (context) await context.execute(interaction)
  }

  // Form Modal
  if (interaction.isModalSubmit()) {
    const [prefix, channelId] = interaction.customId.split(':')

    // Rename
    if (prefix !== 'rename_modal') return

    const temp = tempChannelMap.get(channelId)
    if (!temp || interaction.user.id !== temp.ownerId)
      return interaction.reply({ content: '❌ Not your channel', ephemeral: true })

    const newName = interaction.fields.getTextInputValue('new_name')
    const voice = interaction.guild.channels.cache.get(channelId)

    if (!voice || voice.type !== 2)
      return interaction.reply({ content: '❌ Channel not found', ephemeral: true })

    await voice.setName(newName)
    const key = `tempVoice.customNames.${String(temp.ownerId)}`
    await GuildConfig.updateOne(
      { guildId: interaction.guild.id },
      { $set: { [key]: newName } }
    )
    await interaction.reply({ content: `✅ Renamed to **${newName}**`, ephemeral: true })
  
    // Set Limit
    if (prefix === 'limit_modal') {
      const temp = tempChannelMap.get(channelId)
      if (!temp || interaction.user.id !== temp.ownerId)
        return interaction.reply({ content: '❌ You are not the owner.', ephemeral: true })

      const input = interaction.fields.getTextInputValue('limit_input')
      const num = parseInt(input)

      if (isNaN(num) || num < 1 || num > 99)
        return interaction.reply({ content: '⚠️ Limit must be between 1–99.', ephemeral: true })

      const ch = interaction.guild.channels.cache.get(channelId)
      await ch.setUserLimit(num)
      await interaction.reply({ content: `✅ Limit set to ${num}`, ephemeral: true })
    }
  }

  // Select menus
  if (interaction.isStringSelectMenu()) {

    const [prefix, chanId] = interaction.customId.split(':')
    if (prefix !== 'temp_menu') return

    const temp = tempChannelMap.get(chanId)
    if (!temp || interaction.user.id !== temp.ownerId) {
      return interaction.reply({ content: '❌ You are not the owner of this channel.', ephemeral: true })
    }

    const member = interaction.member
    const voiceChannel = member.voice.channel

    if (!voiceChannel || voiceChannel.id !== chanId)
      return interaction.reply({ content: '❌ You must be in this voice channel!', ephemeral: true })

    const action = interaction.values[0]

    if (action === 'rename') {
      const modal = createRenameModal(chanId)
      await interaction.showModal(modal)
    }

    if (action === 'lock') {
      await voiceChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        Connect: false
      })
      await interaction.reply({ content: '🔒 Channel locked', ephemeral: true })
    }

    if (action === 'unlock') {
      await voiceChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        Connect: null  // NULL = remove explicit permission
      })
      await interaction.reply({ content: '🔓 Channel unlocked', ephemeral: true })
    }

    if (action === 'limit') {
      const modal = createLimitModal(chanId)
      return await interaction.showModal(modal)
    }
  }
}
