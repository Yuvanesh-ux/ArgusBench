import { useEffect, useState } from 'react'
import { api } from '../lib/api'

type Tenant = { id: string, slug: string, name: string }

export default function Admin() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  useEffect(() => {
    api.get('/api/admin/tenants').then(r => setTenants(r.data)).catch(() => setTenants([]))
  }, [])
  return (
    <div>
      <h2>Admin</h2>
      <ul>
        {tenants.map(t => <li key={t.id}>{t.slug} - {t.name}</li>)}
      </ul>
    </div>
  )
}


