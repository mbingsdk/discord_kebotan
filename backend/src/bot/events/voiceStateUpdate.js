// events/voiceStateUpdate.js
import { getGuildConfig } from '../../services/guildConfigService.js'
import { createTempChannelMenu } from '../components/tempChannelMenu.js'
import { tempChannelMap } from '../utils/tempChannelMap.js'

export const name = 'voiceStateUpdate'

export async function execute(oldState, newState) {
  const member = newState.member
  const guild = newState.guild

  if (!newState.channelId) return
  const config = await getGuildConfig(guild.id)
  const settings = config?.tempVoice
  if (!settings?.enabled) return

  const joinedTrigger = newState.channelId === settings.triggerChannelId
  if (!joinedTrigger) return

  // Create temp voice channel
  const memId = String(member.id)
  const custom = config?.tempVoice?.customNames.get(memId)
  const channelName = custom || settings.nameFormat.replace('{username}', member.user.username)
  const channel = await guild.channels.create({
    name: channelName,
    type: 2,
    parent: settings.categoryId || null,
    permissionOverwrites: [
      {
        id: guild.id,
        allow: ['Connect', 'ViewChannel']
      },
      {
        id: member.id,
        allow: ['ManageChannels', 'MoveMembers']
      }
    ]
  })

  await member.voice.setChannel(channel)

  tempChannelMap.set(channel.id, {
    ownerId: member.id
  })

  channel.send({
    content: `Hi <@${member.id}>, use the menu below to manage your channel:`,
    components: [createTempChannelMenu(channel.id)]
  })

  // Auto delete if empty
  const collector = setInterval(async () => {
    const ch = guild.channels.cache.get(channel.id)
    if (!ch || ch.members.size > 0) return
    clearInterval(collector)
    await ch.delete().catch(() => {})
  }, 10_000)
}
