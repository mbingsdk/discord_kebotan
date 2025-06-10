import { useRef, useState, useEffect } from 'react'

export default function GuildEmojiPicker({ emojis = [], value, onSelect }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const selected = emojis.find(e => {
    const code = e.animated ? `<a:${e.name}:${e.id}>` : `<:${e.name}:${e.id}>`
    return code === value
  })

  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block w-full" ref={ref}>
      <button
        className="btn btn-outline px-2 w-full justify-start"
        onClick={() => setOpen(!open)}
      >
        {selected ? (
          <img
            src={`https://cdn.discordapp.com/emojis/${selected.id}.${selected.animated ? 'gif' : 'png'}`}
            alt={selected.name}
            className="w-6 h-6"
          />
        ) : (
          <img
            alt="DiscordJS"
            className="w-6 h-6"
            src="https://cdn.discordapp.com/emojis/1377726448600875128.png"
          />
        )}
      </button>

      {open && (
        <div className="absolute z-50 bottom-full mb-2 right-0 bg-base-100 shadow-lg rounded-box p-2 w-full min-w-[12rem] max-w-xs max-h-64 overflow-y-auto">
          <div className="grid grid-cols-6 gap-2">
            {emojis.map(e => {
              const emojiCode = e.animated
                ? `<a:${e.name}:${e.id}>`
                : `<:${e.name}:${e.id}>`

              return (
                <button
                  key={e.id}
                  className="hover:ring-2 rounded"
                  onClick={() => {
                    onSelect(emojiCode)
                    setOpen(false)
                  }}
                  title={e.name}
                >
                  <img
                    src={`https://cdn.discordapp.com/emojis/${e.id}.${e.animated ? 'gif' : 'png'}`}
                    alt={e.name}
                    className="w-6 h-6"
                  />
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
