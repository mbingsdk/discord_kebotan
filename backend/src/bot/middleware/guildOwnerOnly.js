export function guildOwnerOnly() {
  return async (interactionOrMessage, next) => {
    const member = interactionOrMessage.member
    const guild = interactionOrMessage.guild

    if (!guild || !member) return
    if (guild.ownerId !== member.user.id) {
      return interactionOrMessage.reply?.({
        content: '🚫 Only **server owner** can use this.',
        ephemeral: true
      })
    }

    return next()
  }
}
