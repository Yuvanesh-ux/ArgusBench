import { useEffect, useState } from 'react'
import { api } from '../lib/api'

type Report = { id: string, type: string, filePath: string }

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([])
  useEffect(() => {
    api.get('/api/reports').then(r => setReports(r.data.content || [])).catch(() => setReports([]))
  }, [])
  const generate = async (type: string) => {
    await api.post(`/api/reports/${type}`)
    const r = await api.get('/api/reports')
    setReports(r.data.content || [])
  }
  return (
    <div>
      <h2>Reports</h2>
      <button onClick={() => generate('transaction')}>Generate Transaction Report</button>
      <button onClick={() => generate('account')}>Generate Account Summary</button>
      <ul>
        {reports.map(r => <li key={r.id}>{r.type} - <a href={`/api/reports/${r.id}/download`} target="_blank" rel="noopener noreferrer">download</a></li>)}
      </ul>
    </div>
  )
}


