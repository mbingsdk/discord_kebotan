export function roleHierarchyCheck(optionName = 'user') {
  return async (interaction, next) => {
    const target = interaction.options.getMember(optionName)
    const bot = interaction.guild.members.me

    if (!target) {
      return interaction.reply({
        content: '⚠️ Target user not found.',
        ephemeral: true
      })
    }

    const botHighest = bot.roles.highest.position
    const targetHighest = target.roles.highest.position

    if (botHighest <= targetHighest) {
      return interaction.reply({
        content: `❌ I can't perform action on ${target.user.tag} due to role hierarchy.`,
        ephemeral: true
      })
    }

    return next()
  }
}
