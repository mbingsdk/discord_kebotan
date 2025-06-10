import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const WEBHOOK_URL = process.env.DISCORD_LOGGERS_WEBHOOK

export async function sendErrorToDiscord(error) {
  const embed = {
    title: `🚨 ${error.type.toUpperCase()} Error`,
    color: 0xff5555,
    fields: [
      { name: 'Message', value: error.message?.slice(0, 1000) || 'N/A' },
      { name: 'Location', value: error.route || error.file || 'Unknown', inline: true },
      { name: 'Line:Column', value: `${error.line || '?'}:${error.column || '?'}`, inline: true },
      ...(error.userAgent ? [{ name: 'User-Agent', value: error.userAgent.slice(0, 100), inline: false }] : []),
      ...(error.stack ? [{ name: 'Stack Trace', value: '```' + error.stack.slice(0, 1000) + '```' }] : [])
    ],
    timestamp: new Date().toISOString()
  }

  await axios.post(WEBHOOK_URL, {
    username: 'Error Logger',
    avatar_url: 'https://cdn-icons-png.flaticon.com/512/564/564619.png',
    embeds: [embed]
  })
}

// IF YOU HAVE OPEN AI API KEY
// import axios from 'axios'
// import { analyzeError } from './aiSuggest.js'

// const WEBHOOK_URL = process.env.DISCORD_LOGGERS_WEBHOOK

// export async function sendErrorToDiscord(error) {
//   const suggestion = await analyzeError({
//     message: error.message,
//     stack: error.stack
//   })

//   const embed = {
//     title: `🚨 ${error.type.toUpperCase()} Error`,
//     color: 0xff5555,
//     fields: [
//       { name: 'Message', value: error.message?.slice(0, 1000) || 'N/A' },
//       { name: 'Location', value: error.route || error.file || 'Unknown', inline: true },
//       { name: 'Line:Column', value: `${error.line || '?'}:${error.column || '?'}`, inline: true },
//       ...(error.userAgent ? [{ name: 'User-Agent', value: error.userAgent.slice(0, 100), inline: false }] : []),
//       ...(error.stack ? [{ name: 'Stack', value: '```' + error.stack.slice(0, 900) + '```' }] : []),
//       ...(suggestion ? [{ name: '🧠 AI Suggestion', value: suggestion.slice(0, 1000) }] : [])
//     ],
//     timestamp: new Date().toISOString()
//   }

//   await axios.post(WEBHOOK_URL, {
//     username: 'AI Error Logger',
//     avatar_url: 'https://cdn-icons-png.flaticon.com/512/3039/3039430.png',
//     embeds: [embed]
//   })
// }
