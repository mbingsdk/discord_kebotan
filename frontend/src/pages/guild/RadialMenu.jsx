import { useState } from 'react'
import LazyIcon from '../../components/LazyIcon';

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

export default function RadialMenu({ setTab, setTabLabel, setIconTab, activeTab }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-20 right-4 z-70 md:hidden">
      <div className={`relative transition-all duration-300 ${open ? 'scale-100' : 'scale-0'}`}>
        {tabs.map((tab, i) => {
          const offset = 75
          const angle = (i * 30 + offset) * (Math.PI / 200)
          const x = 80 * Math.cos(angle)
          const y = 90 * Math.sin(angle)
          return (
            <button
              key={tab.key}
              className={`absolute btn btn-circle btn-sm text-xl shadow 
                ${activeTab === tab.key ? 'bg-primary text-base-100 ring ring-offset-2 ring-primary' : 'bg-base-300'}`}
              style={{
                transform: `translate(-50%, -50%) translate(${x}px, ${-y}px)`
              }}
              onClick={() => {
                setTab(tab.key)
                setTabLabel(tab.label)
                setIconTab(tab.icon)
                setOpen(false)
              }}
              title={tab.label}
            >
              {tab.icon}
            </button>
          )
        })}
      </div>

      <button
        className={`btn btn-circle btn-primary text-2xl shadow-lg transition-all duration-300 ${open ? 'rotate-45' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <LazyIcon lib="io5" name="IoLogoWindows" />
      </button>
    </div>
  )
}
