export default function RolePreviewEmbed({ emoji, roleName }) {
  return (
    <div className="flex items-start gap-3 bg-base-200 p-3 rounded-lg">
      <div className="text-2xl">{emoji}</div>
      <div className="flex flex-col">
        <div className="text-sm font-bold text-base-content">Role Reaction</div>
        <div className="bg-base-100 rounded-md p-2 text-sm">
          React with {emoji} to get the <b>{roleName}</b> role!
        </div>
      </div>
    </div>
  )
}
