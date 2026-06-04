import { useState } from 'react'
import { LoginFlow } from './components/LoginFlow'
import { Dashboard } from './components/Dashboard'
import type { CurrentUser, Lang } from './types/user'

export default function App() {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [lang, setLang] = useState<Lang>('ja')

  if (!user) {
    return <LoginFlow lang={lang} onLangChange={setLang} onLogin={setUser} />
  }

  return (
    <Dashboard
      user={user}
      lang={lang}
      onLangChange={setLang}
      onLogout={() => setUser(null)}
    />
  )
}
