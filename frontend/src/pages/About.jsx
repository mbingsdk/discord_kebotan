import { useEffect, useState } from 'react'
import api from '../lib/api'

export default function About() {
  const [info, setInfo] = useState(null)

  useEffect(() => {
    api.get('/info').then(res => setInfo(res.data))
  }, [])

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 mt-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">🤖 About This Bot</h1>
        <p className="text-base-content/60 mt-1">
          Manage your Discord server visually with ease and full control.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Features */}
        <div className="card bg-base-100 shadow p-5">
          <h2 className="text-lg font-bold mb-2">📦 Features</h2>
          <ul className="text-sm list-disc ml-5 space-y-1">
            <li>Auto Role + Reaction Role</li>
            <li>Greeting Messages</li>
            <li>Moderation Tools</li>
            <li>Logs Tracking</li>
            <li>Role & Channel Control</li>
          </ul>
        </div>

        {/* Developer */}
        <div className="card bg-base-100 shadow p-5">
          <h2 className="text-lg font-bold mb-2">👤 Developer</h2>
          <p className="text-sm mb-1">
            Made with ❤️ by <span className="font-semibold text-primary">{info?.author}</span>
          </p>
          <p className="text-sm">
            Website: <a href="https://mbingsdk.my.id" className="link">mbingsdk.my.id</a>
          </p>
          <p className="text-sm">
            GitHub: <a href={info?.repository.url.replace('/discord_kebotan', '')} className="link">github.com/mbingsdk</a>
          </p>
        </div>

        {/* Dynamic Version Info */}
        <div className="card bg-base-100 shadow p-5">
          <h2 className="text-lg font-bold mb-2">📅 Version</h2>
          {info ? (
            <>
              <p className="text-sm">Name: <code className="font-mono">{info.description}</code></p>
              <p className="text-sm">Version: <code className="font-mono">{info.version}</code></p>
              <p className="text-sm">Last Updated: <code className="font-mono">{new Date(info.buildDate).toLocaleString()}</code></p>
            </>
          ) : (
            <p className="text-sm">Loading...</p>
          )}
        </div>

        {/* Feedback / Help */}
        <div className="card bg-base-100 shadow p-5 lg:col-span-2">
          <h2 className="text-lg font-bold mb-2">📢 Feedback & Support</h2>
          <p className="text-sm mb-1">Found a bug? Want a new feature?</p>
          <a href={info?.repository.url} className="btn btn-success btn-sm mt-2">
            Submit via GitHub
          </a>
        </div>

        {/* Legal */}
        <div className="card bg-base-100 shadow p-5">
          <h2 className="text-lg font-bold mb-2">📜 Legal</h2>
          <p className="text-sm">Read our terms and privacy policies.</p>
          <a href="/legal" className="btn btn-outline btn-sm mt-2">View Legal</a>
        </div>
      </div>
    </div>
  )
}
