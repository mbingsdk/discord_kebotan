import { client } from '../bot/index.js'
import GuildConfig from '../models/GuildConfig.js'
import { mergeGuildConfigDefaults } from '../utils/mergeGuildConfigDefaults.js'

export const getGuildConfig = async (guildId) => {
  return GuildConfig.findOneAndUpdate({ guildId }, {}, { upsert: true, new: true })
}

export const updateLogs = async (guildId, logs) => {
  return GuildConfig.findOneAndUpdate({ guildId }, { logs }, { upsert: true, new: true })
}

export const updateSettings = async (guildId, body) => {
  const update = {
    ...(body.prefix && { prefix: body.prefix }),
    ...(body.language && { language: body.language }),
    ...(body.nickname !== undefined && { nickname: body.nickname }),
    ...(body.status && { status: body.status }),
  }

  const guilds = client.guilds.cache.get(guildId)
  if (guilds && body.nickname) {
    const botMember = await guilds.members.fetchMe();
    await botMember.setNickname(body.nickname, "Update bot settings")
  }

  return GuildConfig.findOneAndUpdate({ guildId }, { $set: update }, { upsert: true, new: true })
}

export const updateModerations = async (guildId, body) => {
  return await GuildConfig.findOneAndUpdate(
    { guildId },
    { $set: body },
    { upsert: true, new: true }
  )
}

export const updateFullConfig = async (guildId, update) => {
  return GuildConfig.findOneAndUpdate({ guildId }, update, { upsert: true, new: true })
}

export const mergeDb = async () => {
  const allConfigs = await GuildConfig.find({}).lean();
  const bulkOps = [];

  for (const config of allConfigs) {
    const merged = mergeGuildConfigDefaults(config);

    bulkOps.push({
      updateOne: {
        filter: { guildId: config.guildId },
        update: { $set: merged }
      }
    });
  }

  if (bulkOps.length > 0) {
    await GuildConfig.bulkWrite(bulkOps);
  }
  
  return bulkOps;
}