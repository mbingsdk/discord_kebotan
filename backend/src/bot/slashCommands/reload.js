import { SlashCommandBuilder } from 'discord.js'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'url'
import { ownerOnly } from '../middleware/ownerOnly.js'
import { mergeDb } from '../../services/guildConfigService.js'

export const data = new SlashCommandBuilder()
  .setName('reload')
  .setDescription('Reload slash or context menu commands')
  .addStringOption(option =>
    option.setName('target')
      .setDescription('Command name or "all"')
      .setRequired(true)
  )

export async function execute(interaction) {
  const middleware = ownerOnly()
  middleware(interaction, async () => {
    const target = interaction.options.getString('target')
    await mergeDb()
    if (target === 'all') {
      const base = path.resolve('./src/bot')

      let count = 0
      try {
        // Reload slashCommands
        const slashDir = path.join(base, 'slashCommands')
        const slashFiles = fs.readdirSync(slashDir).filter(f => f.endsWith('.js'))

        for (const file of slashFiles) {
          const filePath = path.join(slashDir, file)
          const url = pathToFileURL(filePath).href + `?update=${Date.now()}`

          const mod = await import(url)
          if (!mod.data || !mod.execute) continue

          interaction.client.slashCommands.set(mod.data.name, mod)
          count++
        }

        // Reload musicCommands
        const musicDir = path.join(base, 'music/commands')
        const musicFiles = fs.readdirSync(musicDir).filter(f => f.endsWith('.js'))

        for (const file of musicFiles) {
          const filePath = path.join(musicDir, file)
          const url = pathToFileURL(filePath).href + `?update=${Date.now()}`

          const mod = await import(url)
          if (!mod.data || !mod.execute) continue

          interaction.client.slashCommands.set(mod.data.name, mod)
          count++
        }

        // Reload contextMenus
        const ctxDir = path.join(base, 'contextMenus')
        if (fs.existsSync(ctxDir)) {
          const ctxFiles = fs.readdirSync(ctxDir).filter(f => f.endsWith('.js'))
          for (const file of ctxFiles) {
            const filePath = path.join(ctxDir, file)
            const url = pathToFileURL(filePath).href + `?update=${Date.now()}`

            const mod = await import(url)
            if (!mod.data || !mod.execute) continue

            interaction.client.contextMenus.set(mod.data.name, mod)
            count++
          }
        }

        await interaction.reply({ content: `✅ Reloaded ${count} commands`, ephemeral: true })
      } catch (err) {
        console.error('[Reload all error]', err)
        await interaction.reply({ content: `❌ Failed to reload`, ephemeral: true })
      }

    } else {
      // Reload 1 file
      const filePath = path.resolve(`./src/bot/slashCommands/${target}.js`)
      if (!fs.existsSync(filePath)) {
        return interaction.reply({ content: `❌ Command \`${target}\` not found`, ephemeral: true })
      }

      try {
        const url = pathToFileURL(filePath).href + `?update=${Date.now()}`
        const mod = await import(url)

        if (!mod.data || !mod.execute) {
          return interaction.reply({ content: `❌ Command invalid`, ephemeral: true })
        }

        interaction.client.slashCommands.set(mod.data.name, mod)
        await interaction.reply({ content: `✅ Reloaded \`${mod.data.name}\``, ephemeral: true })
      } catch (err) {
        console.error('[Reload single error]', err)
        await interaction.reply({ content: `❌ Failed to reload \`${target}\``, ephemeral: true })
      }
    }
  })
}
