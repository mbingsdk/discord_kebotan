import { useState } from 'react'
import MembersPanel from './MembersPanel'
import RolesPanel from './RolesPanel'
import ChannelsPanel from './ChannelsPanel'
import EmojiPanel from './EmojiPanel'
import SecurityPanel from './SecurityPanel'

export default function ModerationPanel({ guildId }) {
  const [tab, setTab] = useState('members')

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div role="tablist" className="tabs tabs-boxed">
        <button className={`tab ${tab === 'members' ? 'tab-active' : ''}`} onClick={() => setTab('members')}>Members</button>
        <button className={`tab ${tab === 'roles' ? 'tab-active' : ''}`} onClick={() => setTab('roles')}>Roles</button>
        <button className={`tab ${tab === 'channels' ? 'tab-active' : ''}`} onClick={() => setTab('channels')}>Channels</button>
        <button className={`tab ${tab === 'emojis' ? 'tab-active' : ''}`} onClick={() => setTab('emojis')}>Emojis</button>
        <button className={`tab ${tab === 'security' ? 'tab-active' : ''}`} onClick={() => setTab('security')}>Security</button>
      </div>

      {/* Content */}
      {tab === 'members' && <MembersPanel guildId={guildId} />}
      {tab === 'roles' && <RolesPanel guildId={guildId} />}
      {tab === 'channels' && <ChannelsPanel guildId={guildId} />}
      {tab === 'emojis' && <EmojiPanel guildId={guildId} />}
      {tab === 'security' && <SecurityPanel guildId={guildId} />}
    </div>
  )
}
