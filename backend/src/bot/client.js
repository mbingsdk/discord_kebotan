import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js'

export const client = new Client({
  intents: Object.values(GatewayIntentBits),
  partials: [Partials.Channel, Partials.Message, Partials.Reaction],
})

client.commands = new Collection()
client.slashCommands = new Collection()
client.contextMenus = new Collection()
