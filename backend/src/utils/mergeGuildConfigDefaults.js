// /utils/mergeGuildConfigDefaults.js
import _ from 'lodash'

const DEFAULT_CONFIG = {
  guildId: "",
  autorole: {
    enabled: false,
    roleId: []
  },
  greeting: {
    leave: { enabled: false },
    welcome: { enabled: false }
  },
  language: "en",
  logs: {
    memberJoin: { channelId: null, enabled: false },
    memberLeave: { channelId: null, enabled: false },
    messageDelete: { channelId: null, enabled: false },
    messageEdit: { channelId: null, enabled: false },
    voiceStateUpdate: { channelId: null, enabled: false }
  },
  moderation: {
    antiLink: {
      enabled: false,
      punish: "delete",
      whitelist: ["discord.com", "youtube.com", "mbingsdk.my.id"]
    },
    antiSpam: {
      enabled: false,
      interval: 5,
      threshold: 5
    },
    channelFilters: {
      userOnlyChannels: [],
      botOnlyChannels: [],
    }
  },
  nickname: "SDK-Dev",
  prefix: "!",
  reactionRoles: [],
  tempVoice: {
    enabled: false,
    triggerChannelId: null,
    categoryId: null,
    nameFormat: "{username}'s Room",
    customNames: {}
  },
  status: {
    disabled: false,
    premium: false,
    premiumUntil: null
  }
}

export function mergeGuildConfigDefaults(config = {}) {
  return _.merge(_.cloneDeep(DEFAULT_CONFIG), config)
}
