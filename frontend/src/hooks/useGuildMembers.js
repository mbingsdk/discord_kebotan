import api from '../lib/api'
import { useApi } from './useApi'

export function useGuildMembers(guildId, deps = []) {
  return useApi(() => api.get(`/discord/guilds/${guildId}/members`), deps)
}