import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function PerformanceChart({ marks }) {
  const data = marks
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(m => ({
      name: m.exam_type,
      subject: m.subjects?.name || 'Subject',
      score: m.max_score > 0 ? Math.round((m.score / m.max_score) * 100) : 0,
      raw: `${m.score}/${m.max_score}`,
    }))

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-48 text-sm" style={{ color: 'var(--text-faint)' }}>No marks recorded yet</div>
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-faint)' }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-faint)' }} axisLine={false} tickLine={false} />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const d = payload[0].payload
            return (
              <div className="rounded-lg px-3 py-2 text-xs" style={{ background: '#16161f', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                <div className="font-semibold">{d.subject} · {d.name}</div>
                <div className="text-gray-400">{d.raw} ({d.score}%)</div>
              </div>
            )
          }}
        />
        <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5}
          dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#a855f7' }} />
      </LineChart>
    </ResponsiveContainer>
  )
}