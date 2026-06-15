import { useState, useEffect, useCallback } from 'react'
import { fetchDailySummary, fetchBranchSummary } from '../api/salesApi'
import type { DailySalesSummary, BranchSummary, SortOrder } from '../types/sales'
import type { CurrentUser, Lang } from '../types/user'
import { useT } from '../i18n'
import { DonutChart } from './DonutChart'
import { SystemsDrawer } from './SystemsDrawer'
import { NotificationBell } from './NotificationBell'

const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'ja', label: '日本語',   flag: '🇯🇵' },
  { code: 'en', label: 'English',  flag: '🇺🇸' },
  { code: 'zh', label: '中文',     flag: '🇨🇳' },
  { code: 'ko', label: '한국어',   flag: '🇰🇷' },
  { code: 'th', label: 'ภาษาไทย', flag: '🇹🇭' },
]

const fmt  = (n: number) => n.toLocaleString('ja-JP') + ' 円'
const rate = (a: number, b: number) => b === 0 ? '-' : ((a / b) * 100).toFixed(1) + '%'

interface Props {
  user: CurrentUser
  lang: Lang
  onLangChange: (l: Lang) => void
  onLogout: () => void
}

export function Dashboard({ user, lang, onLangChange, onLogout }: Props) {
  const t = useT(lang)
  const [rows, setRows]           = useState<DailySalesSummary[]>([])
  const [branches, setBranches]   = useState<BranchSummary[]>([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [startDate, setStartDate] = useState('2026-01-01')
  const [endDate, setEndDate]     = useState('2026-01-31')
  const [sort, setSort]           = useState<SortOrder>('dateDesc')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [langOpen, setLangOpen]     = useState(false)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const [daily, branch] = await Promise.all([
        fetchDailySummary({ startDate, endDate, sort }),
        fetchBranchSummary({ startDate, endDate }),
      ])
      setRows(daily)
      setBranches(branch)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate, sort])

  useEffect(() => { load() }, [load])

  const currentLang = LANGUAGES.find(l => l.code === lang)!

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Noto Sans JP','Noto Sans',sans-serif", color: '#f1f5f9' }}>
      <div style={{ position: 'fixed', inset: 0, opacity: 0.03, backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)', pointerEvents: 'none' }} />

      <SystemsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} userId={user.id} lang={lang} />

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 58, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setDrawerOpen(true)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, width: 38, height: 38, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 18, height: 2, background: '#94a3b8', borderRadius: 1 }} />)}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏪</div>
            <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15 }}>店舗管理システム</span>
          </div>
          <div style={{ flex: 1 }} />

          {/* Language switcher */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setLangOpen(o => !o)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', color: '#e2e8f0', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              {currentLang.flag} {currentLang.label} ▾
            </button>
            {langOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 6, minWidth: 150, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 200 }}>
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => { onLangChange(l.code); setLangOpen(false) }} style={{ width: '100%', textAlign: 'left', background: lang === l.code ? 'rgba(99,102,241,0.2)' : 'transparent', border: 'none', color: lang === l.code ? '#a5b4fc' : '#cbd5e1', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <NotificationBell userId={user.id} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{lang === 'en' ? user.nameEn : user.name}</div>
              <div style={{ color: '#475569', fontSize: 11 }}>{user.id}</div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 15, fontWeight: 700 }}>
              {user.name[0]}
            </div>
            <button onClick={onLogout} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', padding: '6px 12px', borderRadius: 9, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
          {t.welcome}、{lang === 'en' ? user.nameEn : user.name} 👋
        </h1>
        <p style={{ color: '#475569', fontSize: 13, marginBottom: 28 }}>{t.dashboard}</p>

        {/* Filter */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {([['startDate', startDate, setStartDate], ['endDate', endDate, setEndDate]] as const).map(([key, val, set]) => (
            <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
              {t[key]}
              <input type="date" value={val} onChange={e => set(e.target.value)} style={{ padding: '7px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#f1f5f9', fontSize: 13, outline: 'none' }} />
            </label>
          ))}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
            {t.sort}
            <select value={sort} onChange={e => setSort(e.target.value as SortOrder)} style={{ padding: '7px 10px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#f1f5f9', fontSize: 13, outline: 'none' }}>
              <option value="dateDesc">{t.dateDesc}</option>
              <option value="dateAsc">{t.dateAsc}</option>
            </select>
          </label>
          <button onClick={load} disabled={loading} style={{ padding: '8px 24px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13, alignSelf: 'flex-end' }}>
            {loading ? '...' : t.search}
          </button>
        </div>

        {error && <p style={{ color: '#fca5a5', marginBottom: 16 }}>{error}</p>}

        {/* Donut Chart */}
        {branches.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 24px', marginBottom: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 20 }}>{t.chart}</h2>
            <DonutChart data={branches} />
          </div>
        )}

        {/* Table */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t.table}</h2>
            <span style={{ color: '#475569', fontSize: 12 }}>{rows.length} 件</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {(['salesDate', 'area', 'branch', 'budget', 'actual', 'rate'] as const).map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{t[h]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#475569' }}>{t.noData}</td></tr>
                ) : rows.map((r, i) => {
                  const pct = r.budgetAmount === 0 ? 0 : (r.actualAmount / r.budgetAmount) * 100
                  return (
                    <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '10px 16px', fontSize: 13, color: '#cbd5e1' }}>{r.salesDate}</td>
                      <td style={{ padding: '10px 16px', fontSize: 13, color: '#94a3b8' }}>{r.areaName}</td>
                      <td style={{ padding: '10px 16px', fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>{r.branchName}</td>
                      <td style={{ padding: '10px 16px', fontSize: 13, color: '#94a3b8', textAlign: 'right' }}>{fmt(r.budgetAmount)}</td>
                      <td style={{ padding: '10px 16px', fontSize: 13, color: '#e2e8f0', textAlign: 'right' }}>{fmt(r.actualAmount)}</td>
                      <td style={{ padding: '10px 16px', fontSize: 13, textAlign: 'right', fontWeight: 700, color: pct >= 100 ? '#34d399' : '#f87171' }}>
                        {rate(r.actualAmount, r.budgetAmount)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
