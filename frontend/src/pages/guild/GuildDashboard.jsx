import { useParams } from 'react-router-dom'
import { useGuild } from '../../hooks/useGuild'
import { useState } from 'react'

import ModerationPanels from './tabs/ModerationTab'
import GreetingTab from './tabs/GreetingTab'
import AutoroleTab from './tabs/AutoroleTab.jsx'
import ReactionRoleTab from './tabs/ReactionRoleTab.jsx'
import LogsTab from './tabs/LogsTab.jsx'
import SettingsTab from './tabs/SettingsTab.jsx'
import OverviewTab from './tabs/OverviewTab.jsx'
import RadialMenu from './RadialMenu.jsx'
import LazyIcon from '../../components/LazyIcon.jsx';
import VoiceTab from './tabs/VoiceTab.jsx'

export default function GuildDashboard() {
  const { guildId } = useParams()
  const { data, loading, error } = useGuild(guildId)
  const [tab, setTab] = useState('overview')
  const [tabLabel, setTabLabel] = useState('Overview')
  const [iconTab, setIconTab] = useState(<LazyIcon name="FiHome" />)

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner text-secondary"></span>
      </div>
    )
  if (error || !data) return <p className="text-center text-error p-6">Server not found or access denied</p>

  const guild = data.guild

  const tabs = [
    { key: 'overview', icon: <LazyIcon name="FiHome" />, label: 'Overview' },
    { key: 'greeting', icon: <LazyIcon name="FiSmile" />, label: 'Greeting' },
    { key: 'autorole', icon: <LazyIcon name="FiZap" />, label: 'Autorole' },
    { key: 'reactionroles', icon: <LazyIcon name="FiUsers" />, label: 'Reaction' },
    { key: 'moderation', icon: <LazyIcon name="FiShield" />, label: 'Moderation' },
    { key: 'tempvoice', icon: <LazyIcon name="RiVoiceAiFill" />, label: 'Temp Voice' },
    { key: 'logs', icon: <LazyIcon name="TbLogs" />, label: 'Logs' },
    { key: 'settings', icon: <LazyIcon name="FiSettings" />, label: 'Settings' }
  ]

  return (
    <>
      <div className="space-y-8 px-4 max-w-6xl mx-auto mt-6">
        {/* Server Info */}
        <div className="card bg-base-100 shadow items-center p-6">
          {guild.icon && (
            <img
              src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
              alt={guild.name}
              className="w-20 h-20 rounded-full mb-2"
            />
          )}
          <h1 className="text-2xl font-bold">{guild.name}</h1>
          <p className="text-sm text-base-content/60">Guild ID: {guild.id}</p>
        </div>
        <legend className="flex items-center justify-center gap-2 text-lg font-bold col-span-full mb-2">
          <span className="text-xl">{iconTab}</span>
          <span>{tabLabel}</span>
        </legend>

        {/* Tab List (Desktop) */}
        <div role="tablist" className="tabs tabs-boxed flex-wrap justify-center hidden md:flex">
          {tabs.map(t => (
            <button
              key={t.key}
              role="tab"
              className={`tab gap-2 ${tab === t.key ? 'tab-active' : ''}`}
              onClick={() => {
                setTab(t.key)
                setTabLabel(t.label)
                setIconTab(t.icon)
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4 animate-fade-in">
          {tab === 'overview' && <OverviewTab guildId={guild.id} />}
          {tab === 'greeting' && <GreetingTab guildId={guild.id} />}
          {tab === 'autorole' && <AutoroleTab guildId={guild.id} />}
          {tab === 'reactionroles' && <ReactionRoleTab guildId={guild.id} />}
          {tab === 'moderation' && <ModerationPanels guildId={guild.id} />}
          {tab === 'tempvoice' && <VoiceTab guildId={guild.id} />}
          {tab === 'logs' && <LogsTab guildId={guild.id} />}
          {tab === 'settings' && <SettingsTab guildId={guild.id} />}
        </div>
      </div>

      {/* Floating FAB menu */}
      <RadialMenu
        setTab={setTab}
        setTabLabel={setTabLabel}
        setIconTab={setIconTab}
        activeTab={tab}
      />
    </>
  )
}
