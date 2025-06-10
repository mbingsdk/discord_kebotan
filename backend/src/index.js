import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import csrf from 'csurf'
import crypto from 'crypto'
// import fs from 'node:fs'

import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import discordRoutes from './routes/discord.js'
import guildConfigRoutes from './routes/guild-config.js'
import moderationRoutes from './routes/moderation.js'
import infoRoute from './routes/info.js'
import aiLogRoutes from './routes/aiLogs.js'
import { deploySlash } from './bot/deploySlash.js'
import { startBot } from './bot/index.js'
import { sendErrorToDiscord } from './services/discordNotifier.js'

// ==== INIT ====
const app = express()
dotenv.config()
mongoose.set('bufferCommands', false)

// ==== MIDDLEWARE: Security ====
const allowedOrigins = [
  process.env.BACKEND_URL,
  process.env.NODE_ENV === 'development' && process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn('Blocked CORS:', origin)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}));
app.use(cookieParser())

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: 'Strict',
    secure: true,
  }
});
// app.use(csrfProtection);

// app.set('trust proxy', true);
// app.set('trust proxy', 'loopback')        // hanya localhost
// app.set('trust proxy', '127.0.0.1')       // spesifik IP proxy
app.set('trust proxy', 1) 

app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString('hex');
  res.locals.nonce = nonce;
  // res.setHeader(
  //   'Content-Security-Policy',
  //   // `default-src 'none'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}'; font-src 'self' 'nonce-${nonce}'; img-src 'self' 'nonce-${nonce}';`
    // `style-src-elem 'self' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=';`,
    // `style-src 'self' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=';`,
    // `script-src-elem 'self' 'https://static.cloudflareinsights.com' `
  // );
  
  res.setHeader(
    'Permissions-Policy',
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), browsing-topics=()'
  );
  next();
});


app.use(
  helmet({
    contentSecurityPolicy: {
      // useDefaults: true,
      directives: {
        defaultSrc: ["'none'"],
        connectSrc: ["'self'", process.env.BACKEND_URL, process.env.NODE_ENV === 'development' && process.env.FRONTEND_URL],
        imgSrc: ["'self'", 'data:',(req, res) => `'nonce-${res.locals.nonce}'`, 'https://cdn.discordapp.com', 'https://cdn.jsdelivr.net', 'https://emoji.gg'],
        // scriptSrc: ["'self'", "'unsafe-inline'"],
        // styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
        // styleSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
        scriptSrcElem: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
        // styleSrcElem: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
        // fontSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
        // requireTrustedTypesFor: ["'script'"],
        // frameAncestors: ["'none'", 'https://static.cloudflareinsights.com'], // ✅ tidak boleh di-embed di iframe manapun
      }
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    frameguard: { action: 'deny' },
    xssFilter: true,
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    dnsPrefetchControl: { allow: false },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'same-origin' },
  })
)

// ==== MIDDLEWARE: Performance ====
app.use(compression())
app.use(express.json({ limit: '10kb' })) // Hindari DDoS dengan payload besar
app.use(express.static('public', {
  maxAge: '1d',
  immutable: true
}))
app.set('json spaces', 0)
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  next()
})

// ==== RATE LIMIT ====
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: 'Too many requests, try again soon.'
})



app.use('/api/', apiLimiter)

// ==== ROUTES ====
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/discord', discordRoutes)
app.use('/api/guilds', guildConfigRoutes)
app.use('/api/mod', moderationRoutes)
app.use('/api/info', infoRoute)
app.use('/api/ai-logs', aiLogRoutes)

// ==== ERROR TRIGGERS ====
app.use((err, req, res, next) => {
  sendErrorToDiscord({
    type: 'Backend',
    message: err.message,
    stack: err.stack,
    route: req.originalUrl,
    userAgent: req.headers['user-agent']
  }).catch(console.error)

  res.status(500).json({ error: 'Internal Server Error' })
})

// ==== SPA fallback (fix for Vite) ====
app.get('*splat', (req, res) => {
  res.sendFile(path.resolve('public', 'index.html'))
})

// ==== CONNECT DB & START ====
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('✅ MongoDB Connected')
  deploySlash()
  startBot()
  app.listen(process.env.PORT || 3000, () =>
    console.log(`🚀 Server ready at :${process.env.PORT}`)
  )
})

