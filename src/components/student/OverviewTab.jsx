import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../supabase'
import RingChart from '../RingChart'
import AssignmentCard from '../AssignmentCard'
import { BookOpen, TrendingUp, GraduationCap, Bell, AlertTriangle } from 'lucide-react'

export default function OverviewTab({ user }) {
  const [marks, setMarks] = useState([])
  const [attendance, setAttendance] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const { data: marksData } = await supabase.from('marks').select('*, subjects(id, name)').eq('student_id', user.id)
    const { data: attData } = await supabase.from('attendance').select('*, subjects(id, name)').eq('student_id', user.id)
    const { data: assignData } = await supabase.from('assignments').select('*').eq('department', user.department).eq('year', user.year).eq('section', user.section).order('deadline')
    setMarks(marksData || [])
    setAttendance(attData || [])
    setAssignments(assignData || [])
    setLoading(false)
  }

  const present = attendance.filter(a => a.status === 'present').length
  const totalMarked = attendance.filter(a => a.status !== 'holiday').length
  const overallPct = totalMarked > 0 ? Math.round((present / totalMarked) * 100) : null
  const belowThreshold = overallPct !== null && overallPct < 80

  const avgScore = marks.length > 0 ? Math.round(marks.reduce((sum, m) => sum + (m.score / m.max_score) * 100, 0) / marks.length) : null

  const pendingAssignments = assignments.filter(a => new Date(a.deadline) > new Date())
  const overdueAssignments = assignments.filter(a => new Date(a.deadline) <= new Date())

  const bySubject = {}
  attendance.forEach(a => {
    if (a.status === 'holiday') return
    const key = a.subjects?.id
    const name = a.subjects?.name || 'Unknown'
    if (!key) return
    if (!bySubject[key]) bySubject[key] = { name, present: 0, total: 0 }
    bySubject[key].total++
    if (a.status === 'present') bySubject[key].present++
  })
  const subjectStats = Object.values(bySubject).map(s => ({ ...s, pct: Math.round((s.present / s.total) * 100) }))

  function statusFor(pct) {
    if (pct >= 85) return { label: 'Safe', color: '#10b981' }
    if (pct >= 80) return { label: 'Borderline', color: '#f59e0b' }
    return { label: 'At Risk', color: '#f43f5e' }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>Good day, {user.name?.split(' ')[0]}! 👋</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-faint)' }}>{user.department} · Year {user.year} · Section {user.section} · {user.roll_number}</p>

      {belowThreshold && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-4 mb-4 flex items-center gap-3"
          style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)' }}>
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <div className="text-sm font-semibold" style={{ color: '#f43f5e' }}>Attendance Below Required Threshold</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Your overall attendance is {overallPct}%, below the required 80%.</div>
          </div>
        </motion.div>
      )}

      {overdueAssignments.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-4 mb-6 flex items-center gap-3"
          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
          <Bell className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div>
            <div className="text-sm font-semibold" style={{ color: '#f59e0b' }}>{overdueAssignments.length} Assignment(s) Past Due</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{overdueAssignments.map(a => a.title).join(', ')}</div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: BookOpen, label: 'Subjects', value: subjectStats.length, color: '#6366f1' },
          { icon: TrendingUp, label: 'Attendance', value: overallPct !== null ? `${overallPct}%` : '—', color: belowThreshold ? '#f43f5e' : '#22d3ee' },
          { icon: GraduationCap, label: 'Avg Score', value: avgScore !== null ? `${avgScore}%` : '—', color: '#a855f7' },
          { icon: Bell, label: 'Pending Tasks', value: pendingAssignments.length, color: '#f59e0b' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="w-9 h-9 rounded-xl grid place-items-center mb-3" style={{ background: `${stat.color}1A` }}>
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
            </div>
            <div className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>{stat.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <h3 className="font-display font-bold mb-3" style={{ color: 'var(--text)' }}>Subject-wise Attendance</h3>
      {loading ? (
        <div className="text-sm" style={{ color: 'var(--text-faint)' }}>Loading...</div>
      ) : subjectStats.length === 0 ? (
        <div className="rounded-2xl p-8 text-center text-sm mb-6" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text-faint)' }}>
          No attendance recorded yet
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {subjectStats.map(s => {
            const status = statusFor(s.pct)
            return (
              <div key={s.name} className="rounded-2xl p-5 flex items-center gap-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <RingChart pct={s.pct} size={70} stroke={5} color={status.color} />
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{s.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>{s.present}/{s.total} classes</div>
                  <span className="inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${status.color}1A`, color: status.color }}>
                    {status.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <h3 className="font-display font-bold mb-3" style={{ color: 'var(--text)' }}>Assignments</h3>
      {assignments.length === 0 ? (
        <div className="rounded-2xl p-8 text-center text-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text-faint)' }}>
          No assignments yet
        </div>
      ) : (
        <div className="space-y-2">
          {assignments.map(a => <AssignmentCard key={a.id} assignment={a} />)}
        </div>
      )}
    </div>
  )
}