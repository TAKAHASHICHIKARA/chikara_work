import { useEffect, useState } from 'react'
import type { SystemItem } from '../types/system'
import { fetchSystems } from '../api/systemsApi'
import type { Lang } from '../types/user'
import { useT } from '../i18n'

const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  admin:  { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
  user:   { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
  viewer: { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' },
}

interface Props {
  open: boolean
  onClose: () => void
  userId: string
  lang: Lang
}

export function SystemsDrawer({ open, onClose, userId, lang }: Props) {
  const t = useT(lang)
  const [systems, setSystems] = useState<SystemItem[]>([])

  useEffect(() => {
    if (userId) fetchSystems(userId).then(setSystems).catch(() => {})
  }, [userId])

  const grouped = systems.reduce<Record<string, SystemItem[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 150, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.25s' }} />

      <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 320, background: '#0f172a', borderRight: '1px solid rgba(255,255,255,0.08)', zIndex: 160, transform: open ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏪</div>
            <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15 }}>{t.systems}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ padding: '16px 16px 32px' }}>
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} style={{ marginBottom: 24 }}>
              <div style={{ color: '#475569', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10, paddingLeft: 4 }}>
                {category}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {items.map(s => {
                  const rc = ROLE_COLORS[s.role] ?? ROLE_COLORS.viewer
                  const roleKey = `role_${s.role}` as keyof typeof t
                  const roleLabel = t[roleKey] ?? s.role
                  return (
                    <button
                      key={s.systemId}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: s.color + '22', border: `1px solid ${s.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{lang === 'en' ? s.systemNameEn : s.systemName}</div>
                      </div>
                      <span style={{ padding: '2px 8px', borderRadius: 6, background: rc.bg, color: rc.text, border: `1px solid ${rc.border}`, fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                        {roleLabel}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
