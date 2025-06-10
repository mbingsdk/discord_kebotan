export default function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm opacity-60">Last updated: May 2025</p>
        <div className="space-y-3 mt-4 text-sm leading-relaxed">
          <p>By inviting and using the SDK-Dev Discord Bot, you agree to these terms. If you do not agree, do not use the bot.</p>
          <p>You may not use the bot to harm servers, perform abuse, spam, or violate Discord's ToS and Community Guidelines.</p>
          <p>We strive to keep the bot online, but we do not guarantee uptime or performance. Use it at your own risk.</p>
        </div>
      </div>

      <hr className="border-base-content/20" />

      <div>
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm opacity-60">Last updated: May 2025</p>
        <div className="space-y-3 mt-4 text-sm leading-relaxed">
          <p>The bot stores minimal config data like welcome settings or roles. No personal user data is stored.</p>
          <p>All stored data is used solely for functionality and never shared or sold to third parties.</p>
          <p>Admins can delete config by removing the bot. For full deletion, contact the developer.</p>
          <p>We use cookies only for login/session. No analytics or tracking.</p>
        </div>
      </div>
    </div>
  )
}
