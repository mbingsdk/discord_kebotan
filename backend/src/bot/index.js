import { client } from './client.js'
import { ActivityType } from 'discord.js'
import fs from 'node:fs'
import dotenv from 'dotenv'
import { loggerMiddleware } from './middleware/loggerMiddleware.js'
import { sendErrorToDiscord } from '../services/discordNotifier.js'
import { startStatusRotation } from './presence/statusRotator.js'
// import { lavalinkClient } from './music/lavalinkClient'

dotenv.config()

export async function startBot() {
  // Load Events
  const eventFiles = fs.readdirSync('./src/bot/events').filter(file => file.endsWith('.js'))
  for (const file of eventFiles) {
    const event = await import(`./events/${file}`)
    client.on(event.name, (...args) => {
      loggerMiddleware(event.name, ...args)
      event.execute(...args)
    })
  }

  // Load Commands
  const commandFiles = fs.readdirSync('./src/bot/commands').filter(file => file.endsWith('.js'))
  for (const file of commandFiles) {
    const command = await import(`./commands/${file}`)
    client.commands.set(command.name, command)
  }

  // Load Slash Commands
  const slashFiles = fs.readdirSync('./src/bot/slashCommands').filter(file => file.endsWith('.js'))
  for (const file of slashFiles) {
    const slash = await import(`./slashCommands/${file}`)
    // console.log(slash.data)
    client.slashCommands.set(slash.data.name, slash)
  }

  // Load Music Slash Commands
  const slashMusic = fs.readdirSync('./src/bot/music/commands').filter(file => file.endsWith('.js'))
  for (const file of slashMusic) {
    const slash = await import(`./music/commands/${file}`)
    // console.log(slash.data)
    client.slashCommands.set(slash.data.name, slash)
  }

  // Load Context
  const contextFiles = fs.readdirSync('./src/bot/contextMenus').filter(f => f.endsWith('.js'))
  for (const file of contextFiles) {
    const context = await import(`./contextMenus/${file}`)
    client.contextMenus.set(context.data.name, context)
  }

  // // Slash Handler
  // client.on('interactionCreate', async interaction => {
  //   if (interaction.isUserContextMenuCommand()) {
  //     const context = client.contextMenus.get(interaction.commandName)
  //     if (context) await context.execute(interaction)
  //   }

  //   if (interaction.isChatInputCommand()) {
  //     const cmd = client.slashCommands.get(interaction.commandName)
  //     if (cmd) await cmd.execute(interaction)
  //   }
  // })

  client.once('ready', () => {
    console.log(`🤖 Bot ready as ${client.user.tag}`)

    startStatusRotation(client, 10_000)
  })

  process.on('unhandledRejection', (reason) => {
    sendErrorToDiscord({
      type: 'Bot Rejection',
      message: reason?.message || String(reason),
      stack: reason?.stack
    }).catch(console.error)
  })

  process.on('uncaughtException', (err) => {
    sendErrorToDiscord({
      type: 'Bot Crash',
      message: err.message,
      stack: err.stack
    }).catch(console.error)
  })

  await client.login(process.env.DISCORD_TOKEN)
}

export { client }