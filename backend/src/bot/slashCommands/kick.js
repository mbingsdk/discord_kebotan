// slashCommands/kick.js
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js'
import { checkPermissions } from '../middleware/checkPermissions.js'
import { cooldownMiddleware } from '../middleware/cooldownMiddleware.js'
import { botPermissionCheck } from '../middleware/botPermissionCheck.js'
import { roleHierarchyCheck } from '../middleware/roleHierarchyCheck.js'

export const data = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Kick a member')
  .addUserOption(opt => opt.setName('user').setDescription('User to kick').setRequired(true))

export async function execute(interaction) {
  const middleware = [
    cooldownMiddleware('kick', 10),
    checkPermissions([PermissionFlagsBits.KickMembers]),
    botPermissionCheck(['KickMembers']),
    roleHierarchyCheck('user'),
  ]

  let i = 0
  const next = async () => {
    const fn = middleware[i++]
    if (fn) return fn(interaction, next)

    const member = interaction.options.getMember('user')
    if (!member) return interaction.reply({ content: '⚠️ User not found.', ephemeral: true })

    await member.kick()
    await interaction.reply(`✅ Kicked ${member.user.tag}`)
  }

  await next()
}