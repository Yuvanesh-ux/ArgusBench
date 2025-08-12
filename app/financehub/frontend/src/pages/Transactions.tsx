import { useEffect, useState } from 'react'
import { api } from '../lib/api'

type Txn = { id: string, reference: string, status: string }

export default function Transactions() {
  const [txns, setTxns] = useState<Txn[]>([])
  useEffect(() => {
    api.get('/api/transactions').then(r => setTxns(r.data.content || [])).catch(() => setTxns([]))
  }, [])
  return (
    <div>
      <h2>Transactions</h2>
      <ul>
        {txns.map(t => <li key={t.id}>{t.reference} [{t.status}]</li>)}
      </ul>
    </div>
  )
}


