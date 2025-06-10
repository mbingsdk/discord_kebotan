// commands/kick.js
import { checkPermissions } from '../middleware/checkPermissions.js'

export const name = 'kick'

export async function execute(message, args) {
  const middleware = checkPermissions(['KICK_MEMBERS'])
  middleware(message, async () => {
    const user = message.mentions.members.first()
    if (!user) return message.reply('⚠️ Please mention a user to kick.')

    await user.kick()
    message.reply(`✅ Kicked ${user.user.tag}`)
  })
}
