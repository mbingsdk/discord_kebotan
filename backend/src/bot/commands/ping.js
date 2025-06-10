export const name = 'ping'

export async function execute(message, args) {
  await message.reply('🏓 Pong!')
}
