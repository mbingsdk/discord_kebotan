const cooldowns = new Map()

export function cooldownMiddleware(commandName, cooldownSecs = 5) {
  return async (interactionOrMessage, next) => {
    const userId = interactionOrMessage.user?.id || interactionOrMessage.author?.id
    const now = Date.now()

    const key = `${commandName}-${userId}`
    const lastUsed = cooldowns.get(key)

    if (lastUsed && now - lastUsed < cooldownSecs * 1000) {
      const remaining = ((cooldownSecs * 1000 - (now - lastUsed)) / 1000).toFixed(1)
      return interactionOrMessage.reply?.({
        content: `⏳ Wait ${remaining}s before using again.`,
        ephemeral: true
      })
    }

    cooldowns.set(key, now)
    return next()
  }
}
