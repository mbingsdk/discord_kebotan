// bot/statusRotator.js
import { ActivityType } from 'discord.js'

const activityTypes = [
  { type: ActivityType.Playing, label: 'SDK Commands' },
  { type: ActivityType.Watching, label: 'member behavior' },
  { type: ActivityType.Listening, label: 'user feedback' },
  { type: ActivityType.Competing, label: 'bug reports' }
]

const presenceStatuses = ['online', 'idle', 'dnd', 'invisible']

let typeIndex = 0
let statusIndex = 0

export function startStatusRotation(client, interval = 15_000) {
  setInterval(() => {
    const currentType = activityTypes[typeIndex]
    const currentStatus = presenceStatuses[statusIndex]

    client.user.setPresence({
      status: currentStatus,
      activities: [
        {
          name: currentType.label,
          type: currentType.type,
          // name: 'SDK-Dev Dashboard',
          // type: 0, // Playing
          url: 'https://discord.mbingsdk.my.id',
          buttons: ['Open Dashboard'] // TIDAK berfungsi jika bukan verified bot!
        }
      ]
    })

    statusIndex++
    if (statusIndex >= presenceStatuses.length) {
      statusIndex = 0
      typeIndex = (typeIndex + 1) % activityTypes.length
    }
  }, interval)
}
