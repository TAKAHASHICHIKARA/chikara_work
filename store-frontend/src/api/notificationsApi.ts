import type { Notification } from '../types/notification'

export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const res = await fetch(`/api/notifications?userId=${encodeURIComponent(userId)}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function markAsRead(notificationId: number, userId: string): Promise<void> {
  await fetch(`/api/notifications/${notificationId}/read?userId=${encodeURIComponent(userId)}`, { method: 'PUT' })
}

export async function markAllAsRead(userId: string): Promise<void> {
  await fetch(`/api/notifications/read-all?userId=${encodeURIComponent(userId)}`, { method: 'PUT' })
}
