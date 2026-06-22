import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const COLORS = ['#6366f1', '#22d3ee', '#a855f7', '#10b981', '#f59e0b', '#f43f5e']

export default function PerformanceChart({ marks }) {
  const subjects = useMemo(() => Array.from(new Set(marks.map(m => m.subjects?.name).filter(Boolean))), [marks])
  const examTypes = useMemo(() => Array.from(new Set(marks.map(m => m.exam_type).filter(Boolean))), [marks])

  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedExam, setSelectedExam] = useState('all')

  const filtered = useMemo(() => {
    return marks
      .filter(m => {
        if (selectedSubject !== 'all' && m.subjects?.name !== selectedSubject) return false
        if (selectedExam !== 'all' && m.exam_type !== selectedExam) return false
        return true
      })
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(m => ({
        name: m.exam_type,
        subject: m.subjects?.name || 'Subject',
        score: m.max_score > 0 ? Math.round((m.score / m.max_score) * 100) : 0,
        raw: `${m.score}/${m.max_score}`,
        label: `${m.subjects?.name || ''} · ${m.exam_type}`,
      }))
  }, [marks, selectedSubject, selectedExam])

  const tagStyle = (active) => ({
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.72rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: active ? 'none' : '1px solid var(--border)',
    background: active ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--input-bg)',
    color: active ? 'white' : 'var(--text-muted)',
  })

  if (marks.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm" style={{ color: 'var(--text-faint)' }}>
        No marks recorded yet
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex gap-1.5 flex-wrap">
          <button style={tagStyle(selectedSubject === 'all')} onClick={() => setSelectedSubject('all')}>All Subjects</button>
          {subjects.map(s => (
            <button key={s} style={tagStyle(selectedSubject === s)} onClick={() => setSelectedSubject(s)}>{s}</button>
          ))}
        </div>
        <div className="w-px" style={{ background: 'var(--border)' }} />
        <div className="flex gap-1.5 flex-wrap">
          <button style={tagStyle(selectedExam === 'all')} onClick={() => setSelectedExam('all')}>All Exams</button>
          {examTypes.map(e => (
            <button key={e} style={tagStyle(selectedExam === e)} onClick={() => setSelectedExam(e)}>{e}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex items-center justify-center h-36 text-sm" style={{ color: 'var(--text-faint)' }}>
          No marks for this filter
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={filtered} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--text-faint)' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-faint)' }} axisLine={false} tickLine={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0].payload
                return (
                  <div className="rounded-lg px-3 py-2 text-xs"
                    style={{ background: '#16161f', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                    <div className="font-semibold">{d.subject}</div>
                    <div style={{ color: '#a5b4fc' }}>{d.name}</div>
                    <div className="text-gray-400">{d.raw} ({d.score}%)</div>
                  </div>
                )
              }}
            />
            <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5}
              dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#a855f7' }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}