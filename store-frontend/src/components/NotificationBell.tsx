import { useState, useEffect, useRef } from 'react'
import type { Notification } from '../types/notification'
import { fetchNotifications, markAsRead, markAllAsRead } from '../api/notificationsApi'

interface Props {
  userId: string
}

function timeAgo(dt: string): string {
  const diff = Date.now() - new Date(dt).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'たった今'
  if (m < 60) return `${m}分前`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}時間前`
  return `${Math.floor(h / 24)}日前`
}

export function NotificationBell({ userId }: Props) {
  const [items, setItems] = useState<Notification[]>([])
  const [open, setOpen]   = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const load = async () => {
    try { setItems(await fetchNotifications(userId)) } catch { /* ignore */ }
  }

  useEffect(() => { load() }, [userId])

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unread = items.filter(n => !n.read).length

  const handleRead = async (id: number) => {
    await markAsRead(id, userId)
    setItems(prev => prev.map(n => n.notificationId === id ? { ...n, read: true } : n))
  }

  const handleReadAll = async () => {
    await markAllAsRead(userId)
    setItems(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ position: 'relative', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, width: 38, height: 38, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}
      >
        🔔
        {unread > 0 && (
          <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 360, maxHeight: 480, overflowY: 'auto', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.6)', zIndex: 200 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 14 }}>通知 {unread > 0 && <span style={{ color: '#6366f1' }}>({unread})</span>}</span>
            {unread > 0 && (
              <button onClick={handleReadAll} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                すべて既読
              </button>
            )}
          </div>

          {/* Items */}
          {items.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#475569', fontSize: 13 }}>通知はありません</div>
          ) : (
            items.map(n => (
              <div
                key={n.notificationId}
                onClick={() => !n.read && handleRead(n.notificationId)}
                style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: n.read ? 'transparent' : 'rgba(99,102,241,0.06)', cursor: n.read ? 'default' : 'pointer', transition: 'background 0.15s' }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  {!n.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1', marginTop: 5, flexShrink: 0 }} />}
                  <div style={{ flex: 1, marginLeft: n.read ? 17 : 0 }}>
                    <div style={{ color: n.read ? '#94a3b8' : '#f1f5f9', fontSize: 13, fontWeight: n.read ? 400 : 600, lineHeight: 1.4 }}>{n.title}</div>
                    {n.body && <div style={{ color: '#64748b', fontSize: 12, marginTop: 3, lineHeight: 1.4 }}>{n.body}</div>}
                    <div style={{ color: '#475569', fontSize: 11, marginTop: 4 }}>{timeAgo(n.createdAt)}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
