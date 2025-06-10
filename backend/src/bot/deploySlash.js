// src/bot/deploySlash.js
import { REST, Routes } from 'discord.js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

dotenv.config()

export const deploySlash = async () => {
  const commands = []
  const basePath = path.resolve('./src/bot')

  const folders = ['slashCommands', 'contextMenus', 'music/commands']
  for (const folder of folders) {
    const files = fs.readdirSync(path.join(basePath, folder)).filter(f => f.endsWith('.js'))

    for (const file of files) {
      const filePath = pathToFileURL(path.join(basePath, folder, file)).href
      const cmd = await import(filePath)
      if (cmd.data) {
        commands.push(cmd.data.toJSON())
        console.log(`✅ Loaded: ${cmd.data.name}`)
      }
    }
  }

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)

  try {
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands }
    )
    console.log('✅ Slash commands deployed')
  } catch (err) {
    console.error('❌ Deploy failed:', err)
  }
}
