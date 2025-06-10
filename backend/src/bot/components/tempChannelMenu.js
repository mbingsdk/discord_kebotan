import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  PermissionFlagsBits
} from 'discord.js'

export function createTempChannelMenu(id) {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(`temp_menu:${id}`)
    .setPlaceholder('🔧 Manage your voice channel')
    .addOptions([
      new StringSelectMenuOptionBuilder()
        .setLabel('Rename Channel')
        .setValue('rename')
        .setEmoji('✏️'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Lock Channel')
        .setValue('lock')
        .setEmoji('🔒'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Unlock Channel')
        .setValue('unlock')
        .setEmoji('🔓'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Set User Limit')
        .setValue('limit')
        .setEmoji('👥')
    ])

  return new ActionRowBuilder().addComponents(menu)
}
