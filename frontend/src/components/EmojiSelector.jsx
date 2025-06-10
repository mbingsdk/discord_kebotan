import { useState, useRef, useEffect } from 'react'
import EmojiPicker from 'emoji-picker-react'

export default function EmojiSelector({ onSelect }) {
  const [open, setOpen] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState('😀')
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative inline-block" ref={ref}>
      <button className="btn btn-outline px-3" onClick={() => setOpen(!open)}>
        {selectedEmoji}
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 z-50 drop-shadow-lg">
          <EmojiPicker
            emojiStyle="google"
            searchDisabled={true}
            height={450}
            width={300}
            emojiVersion="5.0"
            skinTonesDisabled={true}
            lazyLoadEmojis={true}
            onEmojiClick={(e) => {
              setSelectedEmoji(e.emoji)
              onSelect(e.emoji)
              setOpen(false)
            }}
          />
        </div>
      )}
    </div>
  )
}
