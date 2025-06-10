import express from 'express'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

router.get('/profile', verifyToken, (req, res) => {
  const data = req.user
  delete data.access_token
  res.json({ user: data })
})

export default router
