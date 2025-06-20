# SDK-Dev Discord Dashboard

A modern Discord bot dashboard and backend, built with React (Vite), Node.js, and Discord.js.  
Easily manage your Discord server with visual tools, advanced moderation, logging, and fun AI-powered commands.

## Features

- **Visual Dashboard**: Manage roles, channels, logs, and bot settings via a web UI.
- **Moderation Tools**: Anti-spam, anti-link, channel filters, and more.
- **Role & Channel Management**: Drag-and-drop sorting, editing, and creation.
- **Logging**: Track member joins/leaves, message edits/deletes, and voice updates.
- **AI Commands**: Fun slash commands for motivation, gombal (pickup lines), zodiak, and more.
- **Holiday Checker**: Check Indonesian national holidays via slash command.
- **Virus Scanner**: Scan URLs for malware/phishing using VirusTotal API.
- **Secure Auth**: Discord OAuth2 login with JWT and secure cookies.
- **Error Reporting**: Automatic frontend/backend error logging to Discord via webhook.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, DaisyUI, react-select, dnd-kit
- **Backend**: Node.js, Express, MongoDB, Discord.js, Helmet, CORS, Rate Limiting
- **AI/ML**: Gemini (for motivator, gombal, zodiak, etc)
- **Other**: VirusTotal API, Cheerio (scraping), dotenv

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB
- Discord Bot Token & App credentials
- (Optional) VirusTotal API Key, Gemini API Key

### Setup

1. **Clone the repo**  
   `git clone https://github.com/mbingsdk/discord_kebotan.git`

2. **Install dependencies**  
   ```bash
   cd discord-dashboard/frontend
   npm install
   cd ../backend
   npm install
   ```

3. **Configure environment variables**  
   Copy `.env.example` to `.env` in both `frontend` and `backend`, then fill in your credentials.

4. **Start the backend**  
   ```bash
   cd backend
   npx nodemon src/index.js
   ```

5. **Start the frontend**  
  Development
   ```bash
   cd ../frontend
   npm run dev
   ```
   Build for production and run from backend
   ```bash
   cd ../frontend
   npm run build
   cd ../backend
   node src/index.js
   ```

6. **Access the dashboard**  
   Open [http://localhost:5173](http://localhost:5173) (or your configured frontend URL).

   If u build for production, just open your Backend URL.

## Usage

- **Login**: Use Discord OAuth2 to log in.
- **Manage**: Select a guild/server to manage roles, channels, logs, and settings.
- **Slash Commands**: Use `/motivator`, `/gombalin`, `/zodiak`, `/libur`, `/virusscann` in Discord.

## Project Structure

```
discord-dashboard/
  frontend/   # React + Vite app (dashboard UI)
  backend/    # Node.js + Express API & Discord bot
```

- **frontend/src/pages/**: Main dashboard pages (Dashboard, About, Legal, Guild tabs)
- **backend/src/bot/**: Discord bot logic, commands, slash commands, presence, etc.
- **backend/src/services/**: External integrations (VirusTotal, Discord webhook, etc)
- **backend/src/models/**: Mongoose models (GuildConfig, DayOff, etc)
- **backend/src/routes/**: Express API routes

## Demo

[https://discord.mbingsdk.my.id/](https://discord.mbingsdk.my.id/)

## License

MIT

---