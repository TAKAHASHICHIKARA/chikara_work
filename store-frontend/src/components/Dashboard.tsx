import { useState, useEffect, useCallback } from 'react'
import { fetchDailySummary, fetchBranchSummary } from '../api/salesApi'
import type { DailySalesSummary, BranchSummary, SortOrder } from '../types/sales'
import type { CurrentUser, Lang } from '../types/user'
import { DonutChart } from './DonutChart'
import { SystemsDrawer } from './SystemsDrawer'
import { NotificationBell } from './NotificationBell'

const LANGUAGES = [
  { code: 'ja' as Lang, label: '日本語', flag: '🇯🇵' },
  { code: 'en' as Lang, label: 'English', flag: '🇺🇸' },
  { code: 'zh' as Lang, label: '中文', flag: '🇨🇳' },
  { code: 'ko' as Lang, label: '한국어', flag: '🇰🇷' },
  { code: 'th' as Lang, label: 'ภาษาไทย', flag: '🇹🇭' },
]

const TEXTS = {
  ja: { dashboard: '日次売上ダッシュボード', startDate: '開始日', endDate: '終了日', sort: '並び順', search: '検索', dateDesc: '日付降順', dateAsc: '日付昇順', salesDate: '売上日', area: 'エリア', branch: '拠点', budget: '予算', actual: '実績', rate: '達成率', noData: 'データがありません', logout: 'ログアウト', systems: 'システム一覧', chart: '拠点別実績', table: '日次明細', welcome: 'ようこそ' },
  en: { dashboard: 'Daily Sales Dashboard', startDate: 'Start Date', endDate: 'End Date', sort: 'Sort', search: 'Search', dateDesc: 'Date Desc', dateAsc: 'Date Asc', salesDate: 'Date', area: 'Area', branch: 'Branch', budget: 'Budget', actual: 'Actual', rate: 'Rate', noData: 'No data', logout: 'Logout', systems: 'Systems', chart: 'Sales by Branch', table: 'Daily Detail', welcome: 'Welcome' },
  zh: { dashboard: '日销售额仪表板', startDate: '开始日期', endDate: '结束日期', sort: '排序', search: '搜索', dateDesc: '日期降序', dateAsc: '日期升序', salesDate: '销售日', area: '区域', branch: '门店', budget: '预算', actual: '实绩', rate: '达成率', noData: '暂无数据', logout: '退出', systems: '系统列表', chart: '门店销售额', table: '日次明细', welcome: '欢迎' },
  ko: { dashboard: '일별 매출 대시보드', startDate: '시작일', endDate: '종료일', sort: '정렬', search: '검색', dateDesc: '날짜 내림차순', dateAsc: '날짜 오름차순', salesDate: '매출일', area: '지역', branch: '지점', budget: '예산', actual: '실적', rate: '달성률', noData: '데이터 없음', logout: '로그아웃', systems: '시스템 목록', chart: '지점별 실적', table: '일별 상세', welcome: '환영합니다' },
  th: { dashboard: 'แดชบอร์ดยอดขายรายวัน', startDate: 'วันเริ่มต้น', endDate: 'วันสิ้นสุด', sort: 'เรียง', search: 'ค้นหา', dateDesc: 'วันที่ลดลง', dateAsc: 'วันที่เพิ่มขึ้น', salesDate: 'วันขาย', area: 'พื้นที่', branch: 'สาขา', budget: 'งบประมาณ', actual: 'ยอดจริง', rate: 'อัตราสำเร็จ', noData: 'ไม่มีข้อมูล', logout: 'ออกจากระบบ', systems: 'รายการระบบ', chart: 'ยอดขายตามสาขา', table: 'รายละเอียดรายวัน', welcome: 'ยินดีต้อนรับ' },
}

const fmt  = (n: number) => n.toLocaleString('ja-JP') + ' 円'
const rate = (a: number, b: number) => b === 0 ? '-' : ((a / b) * 100).toFixed(1) + '%'

interface Props {
  user: CurrentUser
  lang: Lang
  onLangChange: (l: Lang) => void
  onLogout: () => void
}

export function Dashboard({ user, lang, onLangChange, onLogout }: Props) {
  const t = TEXTS[lang]
  const [rows, setRows]         = useState<DailySalesSummary[]>([])
  const [branches, setBranches] = useState<BranchSummary[]>([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [startDate, setStartDate] = useState('2026-01-01')
  const [endDate,   setEndDate]   = useState('2026-01-31')
  const [sort,      setSort]      = useState<SortOrder>('dateDesc')
  const [drawerOpen, setDrawerOpen]   = useState(false)
  const [langOpen,   setLangOpen]     = useState(false)

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
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, opacity: 0.03, backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)', pointerEvents: 'none' }} />

      {/* Systems Drawer */}
      <SystemsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} userId={user.id} lang={lang} />

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 58, display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Hamburger */}
          <button onClick={() => setDrawerOpen(true)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, width: 38, height: 38, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 18, height: 2, background: '#94a3b8', borderRadius: 1 }} />)}
          </button>

          {/* Logo + Title */}
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

          {/* Notification Bell */}
          <NotificationBell userId={user.id} />

          {/* Avatar + Logout */}
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
        {/* Welcome */}
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
          {t.welcome}、{lang === 'en' ? user.nameEn : user.name} 👋
        </h1>
        <p style={{ color: '#475569', fontSize: 13, marginBottom: 28 }}>{t.dashboard}</p>

        {/* Filter */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {[{ label: t.startDate, val: startDate, set: setStartDate }, { label: t.endDate, val: endDate, set: setEndDate }].map(({ label, val, set }) => (
            <label key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
              {label}
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
                  {[t.salesDate, t.area, t.branch, t.budget, t.actual, t.rate].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#475569' }}>{t.noData}</td></tr>
                ) : rows.map((r, i) => {
                  const pct = r.budgetAmount === 0 ? 0 : (r.actualAmount / r.budgetAmount) * 100
                  const achieved = pct >= 100
                  return (
                    <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '10px 16px', fontSize: 13, color: '#cbd5e1' }}>{r.salesDate}</td>
                      <td style={{ padding: '10px 16px', fontSize: 13, color: '#94a3b8' }}>{r.areaName}</td>
                      <td style={{ padding: '10px 16px', fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>{r.branchName}</td>
                      <td style={{ padding: '10px 16px', fontSize: 13, color: '#94a3b8', textAlign: 'right' }}>{fmt(r.budgetAmount)}</td>
                      <td style={{ padding: '10px 16px', fontSize: 13, color: '#e2e8f0', textAlign: 'right' }}>{fmt(r.actualAmount)}</td>
                      <td style={{ padding: '10px 16px', fontSize: 13, textAlign: 'right', fontWeight: 700, color: achieved ? '#34d399' : '#f87171' }}>
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
