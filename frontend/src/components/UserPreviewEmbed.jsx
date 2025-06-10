export default function UserPreviewEmbed({ message, user = '@SDK-Dev', guild = 'SDK-Dev Guild' }) {
  const rendered = message
    ?.replaceAll('{user}', user)
    ?.replaceAll('{guild}', guild)

  return (
    <div className="flex items-start gap-3 bg-base-200 rounded-lg p-3 shadow-sm">
      <img
        src="https://cdn.discordapp.com/embed/avatars/1.png"
        alt="avatar"
        className="w-10 h-10 rounded-full"
      />
      <div className="flex flex-col">
        <div className="text-sm font-bold text-base-content">SDK-Bot <span className="text-xs text-base-content/50">BOT</span></div>
        <div className="bg-base-100 rounded-md p-2 text-sm whitespace-pre-wrap">
          {rendered || <span className="opacity-40">No message...</span>}
        </div>
      </div>
    </div>
  )
}
