import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} from 'discord.js'

export function createRenameModal(channelId) {
  const modal = new ModalBuilder()
    .setCustomId(`rename_modal:${channelId}`)
    .setTitle('Rename Voice Channel')

  const input = new TextInputBuilder()
    .setCustomId('new_name')
    .setLabel('Enter new name')
    .setStyle(TextInputStyle.Short)
    .setMinLength(2)
    .setMaxLength(100)
    .setPlaceholder('Ex: Chill Zone')
    .setRequired(true)

  modal.addComponents(new ActionRowBuilder().addComponents(input))
  return modal
}

export function createLimitModal(channelId) {
  const modal = new ModalBuilder()
    .setCustomId(`limit_modal:${channelId}`)
    .setTitle('Set User Limit')

  const input = new TextInputBuilder()
    .setCustomId('limit_input')
    .setLabel('Max users (1-99)')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Ex: 5')
    .setRequired(true)

  modal.addComponents(new ActionRowBuilder().addComponents(input))
  return modal
}