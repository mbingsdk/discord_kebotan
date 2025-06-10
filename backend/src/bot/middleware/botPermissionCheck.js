export function botPermissionCheck(requiredPerms = []) {
  return async (interactionOrMessage, next) => {
    const guild = interactionOrMessage.guild
    const me = guild?.members?.me

    if (!me || !guild) return

    const missing = requiredPerms.filter(p => !me.permissions.has(p))
    if (missing.length) {
      return interactionOrMessage.reply?.({
        content: `❌ Missing bot permissions:\n\`${missing.join(', ')}\``,
        ephemeral: true
      })
    }

    return next()
  }
}
