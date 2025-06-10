import ModerationPanel from './subtabs/ModerationPanel'


export default function ModerationPanels({ guildId }) {
  // const { data, loading, error } = useGuildMembers(guildId)

  // if (loading) return <p className="text-center">Loading members...</p>
  // if (error) return <p className="text-center text-error">Failed to load members</p>

  return (
    <ModerationPanel guildId={guildId} />
  )
}
