import { useState, useEffect } from 'react'
import type { CurrentUser, Lang } from '../types/user'
import { useT } from '../i18n'

const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'ja', label: '日本語',   flag: '🇯🇵' },
  { code: 'en', label: 'English',  flag: '🇺🇸' },
  { code: 'zh', label: '中文',     flag: '🇨🇳' },
  { code: 'ko', label: '한국어',   flag: '🇰🇷' },
  { code: 'th', label: 'ภาษาไทย', flag: '🇹🇭' },
]

const DEMO_USERS: Record<string, { password: string; user: CurrentUser }> = {
  'EMP001': { password: 'Password123!', user: { id: 'EMP001', name: '田中 太郎', nameEn: 'Taro Tanaka', groups: [{ dept: '店舗', deptEn: 'Store', role: 'admin', icon: '🏪' }, { dept: '本部_商品部', deptEn: 'HQ Merchandise', role: 'viewer', icon: '📦' }] } },
  'EMP002': { password: 'Password123!', user: { id: 'EMP002', name: '鈴木 花子', nameEn: 'Hanako Suzuki', groups: [{ dept: '本部_会計', deptEn: 'HQ Accounting', role: 'admin', icon: '💰' }, { dept: '本部_貿易', deptEn: 'HQ Trade', role: 'user', icon: '🌏' }] } },
  'EMP003': { password: 'Password123!', user: { id: 'EMP003', name: '佐藤 健', nameEn: 'Ken Sato', groups: [{ dept: '配送センター', deptEn: 'Distribution', role: 'user', icon: '🚚' }, { dept: 'DC', deptEn: 'DC', role: 'user', icon: '🏭' }, { dept: 'EC', deptEn: 'EC', role: 'viewer', icon: '🛒' }] } },
}

type Screen = 'top' | 'login' | 'barcode' | 'loading'

interface Props {
  lang: Lang
  onLangChange: (l: Lang) => void
  onLogin: (user: CurrentUser) => void
}

export function LoginFlow({ lang, onLangChange, onLogin }: Props) {
  const t = useT(lang)
  const [screen, setScreen]     = useState<Screen>('top')
  const [empId, setEmpId]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [animIn, setAnimIn]     = useState(false)
  const [scanAnim, setScanAnim] = useState(false)
  const [hint, setHint]         = useState(false)

  useEffect(() => {
    setAnimIn(false)
    const id = setTimeout(() => setAnimIn(true), 50)
    return () => clearTimeout(id)
  }, [screen])

  const handleLogin = () => {
    setError('')
    const entry = DEMO_USERS[empId.toUpperCase()]
    if (!entry || entry.password !== password) { setError(t.loginError); return }
    setScreen('loading')
    setTimeout(() => onLogin(entry.user), 1400)
  }

  const handleBarcodeScan = () => {
    setScanAnim(true)
    setTimeout(() => onLogin(DEMO_USERS['EMP001'].user), 2000)
  }

  const fade: React.CSSProperties = { transition: 'opacity 0.4s', opacity: animIn ? 1 : 0 }
  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%', padding: '13px 16px', borderRadius: 12,
    border: `1.5px solid ${hasError ? '#ef4444' : 'rgba(255,255,255,0.12)'}`,
    background: 'rgba(255,255,255,0.06)', color: '#f1f5f9', fontSize: 15,
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Noto Sans JP','Noto Sans',sans-serif", position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, opacity: 0.03, backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: '-20%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />

      {/* TOP */}
      {screen === 'top' && (
        <div style={{ ...fade, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ textAlign: 'center', maxWidth: 440 }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg,#6366f1,#0ea5e9)', margin: '0 auto 28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>🏪</div>
            <div style={{ fontSize: 12, letterSpacing: '0.25em', color: '#64748b', textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 }}>Store Management System</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#f8fafc', margin: '0 0 10px', letterSpacing: '-0.02em' }}>店舗管理システム</h1>
            <p style={{ color: '#64748b', fontSize: 15, marginBottom: 48 }}>{t.subtitle}</p>
            <button onClick={() => setScreen('login')} style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', padding: '18px 48px', borderRadius: 14, fontSize: 18, fontWeight: 700, cursor: 'pointer', width: '100%', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}>
              {t.newSystem} →
            </button>
            <div style={{ marginTop: 32 }}>
              <button onClick={() => setHint(!hint)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#475569', fontSize: 12, padding: '6px 14px', borderRadius: 8, cursor: 'pointer' }}>
                💡 {t.demo}
              </button>
              {hint && (
                <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, textAlign: 'left' }}>
                  {Object.entries(DEMO_USERS).map(([id, { user }]) => (
                    <div key={id} style={{ marginBottom: 8, color: '#94a3b8', fontSize: 13 }}>
                      <span style={{ color: '#a5b4fc', fontWeight: 600 }}>{id}</span> / Password123! — {user.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOGIN */}
      {screen === 'login' && (
        <div style={{ ...fade, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#6366f1,#0ea5e9)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🏪</div>
              <h2 style={{ color: '#f8fafc', fontSize: 22, fontWeight: 700, margin: 0 }}>{t.loginTitle}</h2>
              <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>{t.loginSub}</p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>{t.selectLang}</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => onLangChange(l.code)} style={{ flex: 1, minWidth: 70, padding: '8px 6px', borderRadius: 10, border: lang === l.code ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.1)', background: lang === l.code ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)', color: lang === l.code ? '#a5b4fc' : '#64748b', cursor: 'pointer', fontSize: 12, fontWeight: lang === l.code ? 700 : 400 }}>
                    <div>{l.flag}</div><div style={{ marginTop: 2 }}>{l.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, padding: 32, backdropFilter: 'blur(12px)' }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>{t.idLabel}</label>
                <input value={empId} onChange={e => { setEmpId(e.target.value); setError('') }} placeholder={t.idPlaceholder} onKeyDown={e => e.key === 'Enter' && handleLogin()} style={inputStyle(!!error)} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>{t.pwLabel}</label>
                <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError('') }} placeholder={t.pwPlaceholder} onKeyDown={e => e.key === 'Enter' && handleLogin()} style={inputStyle(!!error)} />
              </div>
              {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 20, color: '#fca5a5', fontSize: 13 }}>
                  ⚠️ {error}
                </div>
              )}
              <button onClick={handleLogin} style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
                {t.loginBtn}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                <span style={{ color: '#475569', fontSize: 12 }}>{t.or}</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              </div>
              <button onClick={() => setScreen('barcode')} style={{ width: '100%', padding: 13, background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>▌▌ ▌ ▌▌▌</span> {t.barcodeBtn}
              </button>
            </div>
            <button onClick={() => setScreen('top')} style={{ display: 'block', margin: '20px auto 0', background: 'none', border: 'none', color: '#475569', fontSize: 13, cursor: 'pointer' }}>{t.backToTop}</button>
          </div>
        </div>
      )}

      {/* BARCODE */}
      {screen === 'barcode' && (
        <div style={{ ...fade, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 24, padding: 40, backdropFilter: 'blur(12px)' }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>📷</div>
              <h3 style={{ color: '#f8fafc', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>{t.scanTitle}</h3>
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 36 }}>{t.scanSub}</p>
              <div onClick={handleBarcodeScan} style={{ border: '2px dashed rgba(99,102,241,0.5)', borderRadius: 16, padding: '40px 24px', cursor: 'pointer', marginBottom: 28, background: scanAnim ? 'rgba(99,102,241,0.1)' : 'transparent', transition: 'all 0.2s' }}>
                {scanAnim
                  ? <div><div style={{ fontSize: 32, marginBottom: 8 }}>✅</div><div style={{ color: '#a5b4fc', fontSize: 14, fontWeight: 600 }}>認証中...</div></div>
                  : <div><div style={{ fontSize: 40, marginBottom: 8, letterSpacing: '-4px', color: '#6366f1' }}>▌▌▌ ▌ ▌▌ ▌▌▌</div><div style={{ color: '#475569', fontSize: 13 }}>クリックでスキャンをシミュレート</div></div>
                }
              </div>
              <button onClick={() => setScreen('login')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', padding: '10px 24px', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>
                {t.scanBack}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOADING */}
      {screen === 'loading' && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#6366f1,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🔐</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
          </div>
          <p style={{ color: '#64748b', fontSize: 14 }}>{t.loading}</p>
          <style>{`@keyframes pulse{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
        </div>
      )}
    </div>
  )
}
