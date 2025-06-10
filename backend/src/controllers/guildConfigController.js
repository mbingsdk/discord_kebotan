import * as configService from '../services/guildConfigService.js'

export const getConfig = async (req, res) => {
  try {
    const config = await configService.getGuildConfig(req.params.id)
    res.json(config)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch config' })
  }
}

export const postLogs = async (req, res) => {
  try {
    const config = await configService.updateLogs(req.params.id, req.body.logs)
    res.json({ success: true, config })
  } catch (err) {
    console.error('Update config error:', err)
    res.status(500).json({ error: 'Failed to update config' })
  }
}

export const postSettings = async (req, res) => {
  try {
    const config = await configService.updateSettings(req.params.id, req.body)
    res.json({ success: true, config })
  } catch (err) {
    console.error('Update config error:', err)
    res.status(500).json({ error: 'Failed to update config' })
  }
}

export const postModerations = async (req, res) => {
  try {
    const config = await configService.updateModerations(req.params.id, req.body)
    res.json({ success: true, config })
  } catch (err) {
    console.error('Update moderation error:', err)
    res.status(500).json({ error: 'Failed to update moderation config' })
  }
}

export const postFullConfig = async (req, res) => {
  try {
    const config = await configService.updateFullConfig(req.params.id, req.body)
    res.json(config)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update full config' })
  }
}

export const mergeAllDefaults = async (req, res) => {
  try {
    const bulkOps = await configService.mergeDb();
    res.json({ success: true, updated: bulkOps.length });
  } catch (err) {
    console.error('Mass merge error:', err);
    res.status(500).json({ error: 'Failed to merge defaults to all configs' });
  }
}