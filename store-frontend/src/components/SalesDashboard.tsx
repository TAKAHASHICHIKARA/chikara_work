import { useState, useEffect, useCallback } from 'react'
import { fetchDailySummary } from '../api/salesApi'
import type { DailySalesSummary, SortOrder } from '../types/sales'

const fmt = (n: number) => n.toLocaleString('ja-JP') + ' 円'
const achievementRate = (actual: number, budget: number) =>
  budget === 0 ? '-' : ((actual / budget) * 100).toFixed(1) + '%'

export function SalesDashboard() {
  const [rows, setRows]           = useState<DailySalesSummary[]>([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [startDate, setStartDate] = useState('2026-01-01')
  const [endDate, setEndDate]     = useState('2026-01-31')
  const [sort, setSort]           = useState<SortOrder>('dateDesc')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchDailySummary({ startDate, endDate, sort })
      setRows(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : '不明なエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate, sort])

  useEffect(() => { load() }, [load])

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>日次売上ダッシュボード</h1>

      {/* フィルター */}
      <div style={styles.filter}>
        <label style={styles.label}>
          開始日
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={styles.input} />
        </label>
        <label style={styles.label}>
          終了日
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={styles.input} />
        </label>
        <label style={styles.label}>
          並び順
          <select value={sort} onChange={e => setSort(e.target.value as SortOrder)} style={styles.input}>
            <option value="dateDesc">日付降順</option>
            <option value="dateAsc">日付昇順</option>
          </select>
        </label>
        <button onClick={load} style={styles.button} disabled={loading}>
          {loading ? '読み込み中...' : '検索'}
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* テーブル */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>売上日</th>
              <th style={styles.th}>エリア</th>
              <th style={styles.th}>拠点</th>
              <th style={styles.th}>予算</th>
              <th style={styles.th}>実績</th>
              <th style={styles.th}>達成率</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !loading ? (
              <tr><td colSpan={6} style={styles.empty}>データがありません</td></tr>
            ) : (
              rows.map((row, i) => {
                const rate = parseFloat(achievementRate(row.actualAmount, row.budgetAmount))
                const achieved = rate >= 100
                return (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                    <td style={styles.td}>{row.salesDate}</td>
                    <td style={styles.td}>{row.areaName}</td>
                    <td style={styles.td}>{row.branchName}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>{fmt(row.budgetAmount)}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>{fmt(row.actualAmount)}</td>
                    <td style={{ ...styles.td, textAlign: 'right', color: achieved ? '#2e7d32' : '#c62828', fontWeight: 'bold' }}>
                      {achievementRate(row.actualAmount, row.budgetAmount)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <p style={styles.count}>{rows.length} 件</p>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1000, margin: '32px auto', padding: '0 16px' },
  heading:   { fontSize: 24, fontWeight: 700, marginBottom: 24, color: '#1a237e' },
  filter:    { display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 24,
               background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,.1)' },
  label:     { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 600 },
  input:     { padding: '6px 8px', border: '1px solid #ccc', borderRadius: 4, fontSize: 14 },
  button:    { padding: '8px 24px', background: '#1a237e', color: '#fff', border: 'none',
               borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: 14, alignSelf: 'flex-end' },
  error:     { color: '#c62828', marginBottom: 16 },
  tableWrap: { overflowX: 'auto' },
  table:     { width: '100%', borderCollapse: 'collapse', background: '#fff',
               boxShadow: '0 1px 4px rgba(0,0,0,.1)', borderRadius: 8, overflow: 'hidden' },
  theadRow:  { background: '#1a237e', color: '#fff' },
  th:        { padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600 },
  td:        { padding: '10px 16px', fontSize: 14, borderBottom: '1px solid #eee' },
  empty:     { padding: 32, textAlign: 'center', color: '#999' },
  count:     { marginTop: 8, fontSize: 13, color: '#666', textAlign: 'right' },
}
