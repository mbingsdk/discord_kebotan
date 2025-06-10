export function renderGreeting(template, member) {
  return template
    .replaceAll('{user}', `<@${member.user.id}>`)
    .replaceAll('{guild}', member.guild.name)
}