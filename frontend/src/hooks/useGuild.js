import { useApi } from './useApi'
import api from '../lib/api'

export function useGuild(guildId) {
  return useApi(() => api.get(`/discord/guilds/${guildId}`), [guildId])
}
