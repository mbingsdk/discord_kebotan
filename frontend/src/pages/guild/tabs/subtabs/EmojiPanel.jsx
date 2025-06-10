import { useEffect, useState } from 'react'
import api from '../../../../lib/api'

export default function EmojiPanel({ guildId }) {
  const [emojis, setEmojis] = useState([])
  const [emojiUrl, setEmojiUrl] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/discord/guilds/${guildId}/emojis`).then(res => {
      setEmojis(res.data.emojis)
    })
  }, [guildId])

  const isValidName = (str) => /^[a-zA-Z0-9_]+$/.test(str)
  const isValidUrl = (url) =>
    /^https?:\/\/.+\.(png|gif)$/.test(url)

  const addEmoji = async () => {
    setError('')
    if (!isValidName(name)) {
      return setError('❌ Name must be alphanumeric or underscore only.')
    }
    if (!isValidUrl(emojiUrl)) {
      return setError('❌ URL must be valid and end with .png or .gif')
    }

    try {
      await api.post(`/discord/guilds/${guildId}/emojis`, { name, url: emojiUrl })
      await new Promise(resolve => setTimeout(resolve, 2000))
      const res = await api.get(`/discord/guilds/${guildId}/emojis`)
      setEmojis(res.data.emojis)
      setEmojiUrl('')
      setName('')
    } catch {
      setError('❌ Failed to add emoji.')
    }
  }

  const deleteEmoji = async (id) => {
    await api.delete(`/discord/guilds/${guildId}/emojis/${id}`)
    setEmojis(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <input
          className="input input-bordered"
          placeholder="emoji_name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="input input-bordered"
          placeholder="emoji URL"
          value={emojiUrl}
          onChange={e => setEmojiUrl(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addEmoji}>Add</button>
      </div>

      {error && <div className="text-error text-sm">{error}</div>}

      <div className="grid gap-3">
        {emojis.length === 0 ? (
          <div className="p-4 text-sm text-center text-base-content/60 italic">
            No emojis found. Try adding one!
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {emojis.map(e => (
              <div
                key={e.id}
                className="card bg-base-200 shadow items-center p-4 w-full max-w-[100px] mx-auto"
              >
                <img
                  src={`https://cdn.discordapp.com/emojis/${e.id}.${e.animated ? 'gif' : 'png'}`}
                  className="w-12 h-12"
                  alt="Emojis"
                />
                <p className="text-xs text-center truncate w-full">{e.name}</p>
                <button
                  className="btn btn-xs btn-error mt-2"
                  onClick={() => deleteEmoji(e.id)}
                >Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
