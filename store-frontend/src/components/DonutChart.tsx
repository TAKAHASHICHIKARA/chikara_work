import type { BranchSummary } from '../types/sales'

const COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

interface Props {
  data: BranchSummary[]
}

export function DonutChart({ data }: Props) {
  const total = data.reduce((s, d) => s + d.totalActual, 0)
  if (total === 0) return null

  const R = 70
  const CX = 100
  const CY = 100
  const circ = 2 * Math.PI * R

  let offset = 0
  const slices = data.map((d, i) => {
    const pct = d.totalActual / total
    const dash = pct * circ
    const slice = { ...d, color: COLORS[i % COLORS.length], dash, offset, pct }
    offset += dash
    return slice
  })

  const fmt = (n: number) => (n / 10000).toFixed(0) + '万'

  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
      {/* Donut */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg width={200} height={200} viewBox="0 0 200 200">
          {/* Background ring */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={28} />
          {slices.map((s, i) => (
            <circle
              key={i}
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={28}
              strokeDasharray={`${s.dash} ${circ}`}
              strokeDashoffset={-(s.offset - circ / 4)}
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          ))}
          {/* Center text */}
          <text x={CX} y={CY - 8} textAnchor="middle" fill="#f1f5f9" fontSize={11} fontWeight={600}>実績合計</text>
          <text x={CX} y={CY + 10} textAnchor="middle" fill="#f1f5f9" fontSize={13} fontWeight={800}>{fmt(total)}</text>
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minWidth: 200 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: s.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ color: '#cbd5e1', fontSize: 13, fontWeight: 600 }}>{s.branchName}</span>
                <span style={{ color: '#94a3b8', fontSize: 12 }}>{(s.pct * 100).toFixed(1)}%</span>
              </div>
              <div style={{ marginTop: 3, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${s.pct * 100}%`, height: '100%', background: s.color, borderRadius: 2 }} />
              </div>
              <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>
                実績 {s.totalActual.toLocaleString()} / 予算 {s.totalBudget.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
