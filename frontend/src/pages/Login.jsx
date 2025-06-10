// import AuthCallback from "../auth/callback"
import LazyIcon from "../components/LazyIcon"

export default function Login() {
  const loginDiscord = () => {
    window.location.href = import.meta.env.VITE_REDIRECT_URL
    // const url = new URL('https://discord.com/oauth2/authorize')
    // url.searchParams.set('client_id', import.meta.env.VITE_DISCORD_CLIENT_ID)
    // url.searchParams.set('redirect_uri', 'http://localhost:5173/auth/callback')
    // url.searchParams.set('response_type', 'code')
    // url.searchParams.set('scope', 'identify guilds')
    // window.location.href = url.toString()
  }

  return (
    <div className="min-h-[calc(100vh-170px)] flex items-center justify-center bg-base-200 px-4">
      <div className="max-w-md w-full bg-base-100 shadow-lg rounded-xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <LazyIcon name="FaDiscord" className="text-5xl text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Login with Discord</h1>
        <p className="text-base-content/70 text-sm">
          Access your server dashboard to configure roles, moderation, greetings, and more.
        </p>
        <button className="btn btn-primary w-full gap-2 text-lg" onClick={loginDiscord}>
          <LazyIcon name="FaDiscord" className="text-xl" />
          Connect Discord
        </button>
        <p className="text-xs text-base-content/50">
          We only request basic info and server access.
        </p>
        <p className="text-xs text-base-content/50">
          By continuing, you agree to our <a className="link" href="/legal">Terms</a> and <a className="link" href="/legal">Privacy</a>.
        </p>
      </div>
    </div>
  )
}
