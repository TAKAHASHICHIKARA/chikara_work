import type { SystemItem } from '../types/system'

export async function fetchSystems(userId: string): Promise<SystemItem[]> {
  const res = await fetch(`/api/systems?userId=${encodeURIComponent(userId)}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
