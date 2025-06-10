import express from 'express'
import axios from 'axios'
import jwt from 'jsonwebtoken'

const router = express.Router()

const BASE_URL = process.env.DISCORD_BASE_API_URI || 'https://discord.com/api/v10'

// Arahkan user ke Discord OAuth
router.get('/discord', (_, res) => {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify guilds'
  })

  res.redirect(`https://discord.com/oauth2/authorize?${params.toString()}`)
})

router.get('/discord/callback', async (req, res) => {
  const code = req.query.code
  if (!code) return res.status(400).send('No code')
  console.log(process.env.DISCORD_REDIRECT_URI)

  try {
    const params = new URLSearchParams()
    params.append('client_id', process.env.DISCORD_CLIENT_ID)
    params.append('client_secret', process.env.DISCORD_CLIENT_SECRET)
    params.append('grant_type', 'authorization_code')
    params.append('code', code)
    params.append('redirect_uri', process.env.DISCORD_REDIRECT_URI)
    params.append('scope', 'identify guilds')

    const tokenRes = await axios.post(`${BASE_URL}/oauth2/token`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })

    const access_token = tokenRes.data.access_token

    const userRes = await axios.get(`${BASE_URL}/users/@me`, {
      headers: { Authorization: `Bearer ${access_token}` }
    })

    const user = userRes.data

    const jwtToken = jwt.sign({
      user,
      access_token
    }, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.cookie('discord_token', jwtToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: true,
      // sameSite: 'Lax',
      sameSite: 'Strict',
      maxAge: 1 * 24 * 60 * 60 * 1000 // 1 hari
    })
    // res.redirect(`${process.env.FRONTEND_URL}/auth/callback`)
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?discord_token=${jwtToken}`)
  } catch (err) {
    console.error(err)
    res.status(500).send('OAuth failed')
  }
})

export default router
