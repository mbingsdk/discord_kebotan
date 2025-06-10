import axios from 'axios'

const BASE_URL = process.env.DISCORD_BASE_API_URI || 'https://discord.com/api/v10'

export const getUserInfo = async (accessToken) => {
  const res = await axios.get(`${BASE_URL}/users/@me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return res.data
}

export const getUserGuilds = async (accessToken) => {
  const res = await axios.get(`${BASE_URL}/users/@me/guilds`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return res.data
}
