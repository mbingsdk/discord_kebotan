import { SlashCommandBuilder } from 'discord.js'
import { ownerOnly } from '../middleware/ownerOnly.js'

export const data = new SlashCommandBuilder()
  .setName('shutdown')
  .setDescription('Shutdown the bot (Owner only)')

export async function execute(interaction) {
  const middleware = ownerOnly()
  middleware(interaction, async () => {
    await interaction.reply('🛑 Shutting down...')
    process.exit(0)
  })
}
