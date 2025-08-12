import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const { tenant, setTenant, setToken, refreshMe, user } = useAuth()
  const [tmpToken, setTmpToken] = useState('')
  return (
    <div>
      <h2>Login (Mock)</h2>
      <p>For dev, set tenant header:</p>
      <input value={tenant} onChange={e => setTenant(e.target.value)} />
      <button onClick={() => void 0}>Save Tenant</button>
      <div style={{ marginTop: 12 }}>
        <p>Paste JWT (optional for protected endpoints):</p>
        <textarea value={tmpToken} onChange={e => setTmpToken(e.target.value)} rows={3} cols={60} />
        <div>
          <button onClick={() => { setToken(tmpToken); refreshMe(); }}>Save Token</button>
        </div>
      </div>
      {user && <p>Signed in as {user.email || user.sub}</p>}
    </div>
  )
}


