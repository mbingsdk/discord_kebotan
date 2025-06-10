// /middleware/ownerOnly.js
import dotenv from 'dotenv'
dotenv.config()

const OWNER_IDS = process.env.BOT_OWNERS?.split(',') || [] // misal: "123,456"

export function ownerOnly() {
  return async (interactionOrMessage, next) => {
    const userId = interactionOrMessage.user?.id || interactionOrMessage.author?.id

    if (!OWNER_IDS.includes(userId)) {
      return interactionOrMessage.reply?.({
          content: '🚫 Only bot owner can use this.',
          ephemeral: true
        }) || interactionOrMessage.channel?.send({
          content: '🚫 Only bot owner can use this.',
          ephemeral: true
        })
    }

    return next()
  }
}
