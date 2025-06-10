// /middleware/checkPermissions.js
export function checkPermissions(requiredPerms = []) {
  return async (interactionOrMessage, next) => {
    const member = interactionOrMessage.member

    if (!member || !member.permissions) {
      return interactionOrMessage.reply?.({
        content: '🚫 Could not verify permissions.',
        ephemeral: true
      }) || interactionOrMessage.channel?.send({
        content: '🚫 Could not verify permissions.',
        ephemeral: true
      })
    }

    const hasAll = requiredPerms.every(perm => member.permissions.has(perm))
    if (!hasAll) {
      return interactionOrMessage.reply?.({
        content: '🚫 You lack the required permissions.',
        ephemeral: true
      }) || interactionOrMessage.channel?.send({
        content: '🚫 You lack the required permissions.',
        ephemeral: true
      })
    }

    return next()
  }
}
