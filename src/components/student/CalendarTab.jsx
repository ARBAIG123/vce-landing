import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'

export default function CalendarTab({ user }) {
  const [subjects, setSubjects] = useState([])
  const [subjectId, setSubjectId] = useState('')
  const [records, setRecords] = useState({})
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchSubjects() }, [])
  useEffect(() => { if (subjectId) fetchAttendance() }, [subjectId])

  async function fetchSubjects() {
    const { data: attData } = await supabase.from('attendance').select('subject_id, subjects(id, name)').eq('student_id', user.id)
    const unique = {}
    ;(attData || []).forEach(a => { if (a.subjects) unique[a.subjects.id] = a.subjects.name })
    const list = Object.entries(unique).map(([id, name]) => ({ id, name }))
    setSubjects(list)
    setSubjectId(list[0]?.id || '')
    setLoading(false)
  }

  async function fetchAttendance() {
    const { data } = await supabase.from('attendance').select('*').eq('student_id', user.id).eq('subject_id', subjectId)
    const map = {}
    ;(data || []).forEach(a => { map[a.date] = a.status })
    setRecords(map)
  }

  const present = Object.values(records).filter(s => s === 'present').length
  const totalMarked = Object.values(records).filter(s => s !== 'holiday').length
  const pct = totalMarked > 0 ? Math.round((present / totalMarked) * 100) : 0

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const statusColor = { present: '#10b981', absent: '#f43f5e', holiday: '#f59e0b' }

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>Attendance Calendar</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-faint)' }}>Official attendance recorded by your faculty, subject-wise</p>

      {loading ? (
        <div className="text-sm" style={{ color: 'var(--text-faint)' }}>Loading...</div>
      ) : subjects.length === 0 ? (
        <div className="rounded-2xl p-8 text-center text-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text-faint)' }}>
          No attendance recorded yet
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            {subjects.map(s => (
              <button key={s.id} onClick={() => setSubjectId(s.id)}
                className="px-3.5 py-2 rounded-lg text-sm font-medium transition"
                style={{
                  background: subjectId === s.id ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--card)',
                  color: subjectId === s.id ? 'white' : 'var(--text-muted)',
                  border: '1px solid var(--border)'
                }}>
                {s.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="rounded-xl p-4 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="font-display text-xl font-bold" style={{ color: pct < 80 ? '#f43f5e' : '#10b981' }}>{pct}%</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>Attendance</div>
            </div>
            <div className="rounded-xl p-4 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="font-display text-xl font-bold text-emerald-500">{present}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>Present</div>
            </div>
            <div className="rounded-xl p-4 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="font-display text-xl font-bold text-red-500">{totalMarked - present}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>Absent</div>
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="font-display font-bold" style={{ color: 'var(--text)' }}>{monthNames[month]} {year}</div>
              <div className="flex gap-2">
                <button onClick={() => { if (month === 0) { setMonth(11); setYear(year - 1) } else setMonth(month - 1) }}
                  className="w-8 h-8 rounded-lg grid place-items-center text-sm" style={{ background: 'var(--input-bg)', color: 'var(--text-muted)' }}>←</button>
                <button onClick={() => { if (month === 11) { setMonth(0); setYear(year + 1) } else setMonth(month + 1) }}
                  className="w-8 h-8 rounded-lg grid place-items-center text-sm" style={{ background: 'var(--input-bg)', color: 'var(--text-muted)' }}>→</button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5 mb-1.5">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className="text-center text-xs font-semibold py-1" style={{ color: 'var(--text-faint)' }}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const status = records[dateStr]
                const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
                return (
                  <div key={day} className="rounded-lg flex flex-col items-center justify-center text-xs"
  style={{ height: '36px' }}
                    style={{
                      background: status ? `${statusColor[status]}1A` : 'var(--input-bg)',
                      border: isToday ? '1.5px solid #6366f1' : '1px solid var(--border)',
                      color: status ? statusColor[status] : 'var(--text-faint)'
                    }}>
                    <span className="font-medium" style={{ color: 'var(--text)' }}>{day}</span>
                    {status && <span style={{ fontSize: '0.6rem' }}>{status === 'present' ? '✓' : status === 'absent' ? '✗' : '—'}</span>}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}