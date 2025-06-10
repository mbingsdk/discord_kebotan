import { Link } from 'react-router-dom'

export default function Card(g) {
  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${import.meta.env.VITE_DISCORD_CLIENT_ID}&scope=bot+applications.commands&permissions=8&guild_id=${g.id}&disable_guild_select=true`

  return (
    <div key={g.id} className="group card bg-base-100 shadow hover:shadow-lg transition-shadow duration-300">
      <div className="card-body text-center items-center">
        <h2 className="card-title text-lg font-bold group-hover:text-primary">
          {g.name}
          <span className={`badge badge-xs ${g.owner ? 'badge-secondary' : 'badge-primary'} ml-1`}>
            {g.owner ? 'Owner' : 'Moderator'}
          </span>
        </h2>

        {g.icon && (
          <img
            src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`}
            className="w-16 h-16 mx-auto rounded"
            alt={`${g.name} icon`}
          />
        )}

        <div className="mt-3">
          {g.botIn ? (
            <Link to={`/guilds/${g.id}`} className="btn btn-soft btn-primary btn-sm group-hover:btn-secondary">
              Open Dashboard
            </Link>
          ) : (
            <a href={inviteUrl} className="btn btn-outline btn-accent btn-sm" target="_blank" rel="noopener noreferrer">
              ➕ Invite Bot
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
