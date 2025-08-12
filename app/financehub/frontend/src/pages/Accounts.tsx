import { useEffect, useState } from 'react'
import { api } from '../lib/api'

type Account = { id: string, name: string, type: string, currency: string, balance: number }

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  useEffect(() => {
    api.get('/api/accounts').then(r => setAccounts(r.data.content || [])).catch(() => setAccounts([]))
  }, [])
  return (
    <div>
      <h2>Accounts</h2>
      <ul>
        {accounts.map(a => <li key={a.id}>{a.name} ({a.type}) {a.currency} {a.balance}</li>)}
      </ul>
    </div>
  )
}


