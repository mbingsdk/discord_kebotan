import express from 'express'
import { verifyToken } from '../middleware/verifyToken.js'
import {
  getConfig,
  postLogs,
  postSettings,
  postFullConfig,
  postModerations,
  mergeAllDefaults
} from '../controllers/guildConfigController.js'

const router = express.Router()

router.get('/:id/config', getConfig)
router.post('/:id/config/logs', postLogs)
router.post('/:id/config/settings', postSettings)
router.post('/:id/config', verifyToken, postFullConfig)
router.post('/:id/config/moderations', verifyToken, postModerations)
router.post('/config/merge-all-defaults', verifyToken, mergeAllDefaults);

export default router
