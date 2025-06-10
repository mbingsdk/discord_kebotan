import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Dashboard() {
  const { user, loading } = useContext(AuthContext)

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner text-secondary"></span>
      </div>
    )
  if (!user) return <p className="p-6 text-error">Not logged in</p>

  const { id, username, discriminator, avatar, global_name } = user.user
  const avatarUrl = avatar
    ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(discriminator) % 5}.png`

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 mt-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome, {global_name}</h1>
        <p className="text-base-content/60">Your personalized dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Widget */}
        <div className="card bg-base-100 shadow items-center p-4">
          <img src={avatarUrl} className="w-20 h-20 rounded-full" alt={username+"'s Avatar"} />
          <h2 className="font-bold text-lg mt-2">{username}</h2>
          <span className="badge badge-neutral mt-1">User ID: {id}</span>
        </div>
        {/* <div className="card bg-base-100 shadow items-center p-0 overflow-hidden">
        {user.user.banner && (
          <div className="w-full h-24 bg-cover bg-center" style={{ backgroundImage: `url(https://cdn.discordapp.com/banners/${user.user.id}/${user.user.banner}?size=512)` }} />
        )}

        <div className="p-4 flex flex-col items-center -mt-12">
          <img src={avatarUrl} className="w-20 h-20 rounded-full border-4 border-base-100" />
          <h2 className="font-bold text-lg mt-2">{username}</h2>
          <span className="badge badge-neutral mt-1">User ID: {id}</span>
        </div>
      </div> */}

        {/* Bot Access Widget */}
        <div className="card bg-base-100 shadow p-4">
          <h3 className="font-semibold">Bot Access</h3>
          <div className="mt-2">
            <span className="badge badge-success">✅ Valid</span>
            <p className="text-xs mt-1">Your token is active</p>
          </div>
        </div>

        {/* Guild Count */}
        <div className="card bg-base-100 shadow p-4">
          <h3 className="font-semibold">Guilds Connected</h3>
          <p className="text-4xl font-bold text-primary mt-2">
            {user.guilds?.length || '—'}
          </p>
          <p className="text-sm text-base-content/60">With Manage access</p>
        </div>

        {/* Setup Progress */}
        <div className="card bg-base-100 shadow p-4">
          <h3 className="font-semibold mb-2">Setup Progress</h3>
          <ul className="steps steps-vertical">
            <li className="step step-success">OAuth2 Login</li>
            <li className="step step-success">Guild Access</li>
            <li className="step">Configure Reaction Roles</li>
            <li className="step">Enable Logs</li>
          </ul>
        </div>

        {/* Logs / Activity */}
        <div className="card bg-base-100 shadow p-4">
          <h3 className="font-semibold mb-2">Recent Activity</h3>
          <div className="chat chat-start">
            <div className="chat-bubble">Updated autorole config</div>
          </div>
          <div className="chat chat-start">
            <div className="chat-bubble">Logged in from web</div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card bg-base-100 shadow p-4">
          <h3 className="font-semibold mb-2">Notifications</h3>
          <div className="alert alert-info mb-2">Welcome message is active</div>
          <div className="alert alert-success mb-2">All logs saved</div>
          <div className="alert alert-warning">New version available</div>
        </div>
      </div>
    </div>
  )
}
