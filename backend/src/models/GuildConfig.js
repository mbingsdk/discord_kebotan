import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  greeting: {
    welcome: {
      enabled: { type: Boolean, default: false },
      channelId: String,
      message: String
    },
    leave: {
      enabled: { type: Boolean, default: false },
      channelId: String,
      message: String
    }
  },
  autorole: {
    enabled: { type: Boolean, default: false },
    roleId: [String]
  },
  reactionRoles: [{
    channelId: String,
    messageText: String,
    messageId: String,
    mappings: [{
      emoji: String,
      roleId: String
    }]
  }],
  tempVoice: {
    enabled: { type: Boolean, default: false },
    triggerChannelId: { type: String, default: null },
    categoryId: { type: String, default: null },
    nameFormat: { type: String, default: "{username}'s Room" },
    customNames: { type: Map, of: String, default: {} }
  },
  logs: {
    memberJoin: {
      enabled: { type: Boolean, default: false },
      channelId: { type: String, default: null }
    },
    memberLeave: {
      enabled: { type: Boolean, default: false },
      channelId: { type: String, default: null }
    },
    messageDelete: {
      enabled: { type: Boolean, default: false },
      channelId: { type: String, default: null }
    },
    messageEdit: {
      enabled: { type: Boolean, default: false },
      channelId: { type: String, default: null }
    },
    voiceStateUpdate: {
      enabled: { type: Boolean, default: false },
      channelId: { type: String, default: null }
    }
  },
  prefix: { type: String, default: '!' },
  language: { type: String, default: 'en' },
  status: {
    disabled: { type: Boolean, default: false },
    premium: { type: Boolean, default: false },
    premiumUntil: { type: Date, default: null }
  },
  nickname: { type: String, default: 'SDK-Dev' },
  moderation: {
    antiLink: {
      enabled: { type: Boolean, default: false },
      punish: { type: String, enum: ['warn', 'kick', 'ban', 'delete'], default: 'delete' },
      whitelist: { type: Array, default: ["discord.com", "youtube.com", "mbingsdk.my.id"] }
    },
    antiSpam: {
      enabled: { type: Boolean, default: false },
      threshold: { type: Number, default: 5 },
      interval: { type: Number, default: 5 }
    },
    channelFilters: {
      userOnlyChannels: { type: Array, default: [] },
      botOnlyChannels: { type: Array, default: [] },
    }
  }
}, { timestamps: true })

export default mongoose.model('GuildConfig', schema)
