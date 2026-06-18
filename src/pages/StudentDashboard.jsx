import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, LogOut, BookOpen, TrendingUp, Bell, AlertTriangle, Sun, Moon } from 'lucide-react'
import { supabase } from '../supabase'
import { useTheme } from '../ThemeContext'
import PerformanceChart from '../components/PerformanceChart'

export default function StudentDashboard({ user, onLogout }) {
  const { theme, toggle } = useTheme()
  const [marks, setMarks] = useState([])
  const [attendance, setAttendance] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const { data: marksData } = await supabase.from('marks').select('*, subjects(name)').eq('student_id', user.id)
    const { data: attData } = await supabase.from('attendance').select('*').eq('student_id', user.id)
    const { data: assignData } = await supabase.from('assignments').select('*').eq('department', user.department).eq('year', user.year).eq('section', user.section)
    setMarks(marksData || []); setAttendance(attData || []); setAssignments(assignData || [])
    setLoading(false)
  }

  const present = attendance.filter(a => a.status === 'present').length
  const totalMarked = attendance.filter(a => a.status !== 'holiday').length
  const attPct = totalMarked > 0 ? Math.round((present / totalMarked) * 100) : null
  const belowThreshold = attPct !== null && attPct < 80

  const avgScore = marks.length > 0 ? Math.round(marks.reduce((sum, m) => sum + (m.score / m.max_score) * 100, 0) / marks.length) : null

  const pendingAssignments = assignments.filter(a => new Date(a.deadline) > new Date())
  const overdueAssignments = assignments.filter(a => new Date(a.deadline) <= new Date())

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg)' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl" style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold font-display" style={{ color: 'var(--text)' }}>VCE Tracker</div>
            <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Student Portal</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="w-9 h-9 rounded-xl grid place-items-center transition hover:scale-105" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>
          <span className="text-sm hidden sm:block" style={{ color: 'var(--text-muted)' }}>👋 {user.name}</span>
          <button onClick={async () => { await supabase.auth.signOut(); onLogout() }} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl transition hover:border-red-400/40 hover:text-red-400" style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>Good day, {user.name?.split(' ')[0]}! 👋</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-faint)' }}>{user.department} · Year {user.year} · Section {user.section} · {user.roll_number}</p>

          {belowThreshold && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-4 mb-6 flex items-center gap-3" style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)' }}>
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold" style={{ color: '#f43f5e' }}>Attendance Below Required Threshold</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Your attendance is {attPct}%, below the required 80%. Attend more classes to avoid academic issues.</div>
              </div>
            </motion.div>
          )}

          {overdueAssignments.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-4 mb-6 flex items-center gap-3" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
              <Bell className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold" style={{ color: '#f59e0b' }}>{overdueAssignments.length} Assignment(s) Past Due</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{overdueAssignments.map(a => a.title).join(', ')}</div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { icon: BookOpen, label: 'Subjects Tracked', value: new Set(marks.map(m => m.subjects?.name)).size || 0, color: '#6366f1' },
              { icon: TrendingUp, label: 'Attendance', value: attPct !== null ? `${attPct}%` : '—', color: belowThreshold ? '#f43f5e' : '#22d3ee' },
              { icon: GraduationCap, label: 'Avg Score', value: avgScore !== null ? `${avgScore}%` : '—', color: '#a855f7' },
              { icon: Bell, label: 'Pending Tasks', value: pendingAssignments.length, color: '#f59e0b' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="w-9 h-9 rounded-xl grid place-items-center mb-3" style={{ background: `${stat.color}1A` }}>
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <div className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>{stat.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="font-display font-bold mb-4" style={{ color: 'var(--text)' }}>My Performance</h3>
              {loading ? <div className="text-sm" style={{ color: 'var(--text-faint)' }}>Loading...</div> : <PerformanceChart marks={marks} />}
            </div>

            <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="font-display font-bold mb-4" style={{ color: 'var(--text)' }}>Assignments</h3>
              {assignments.length === 0 ? (
                <div className="text-sm" style={{ color: 'var(--text-faint)' }}>No assignments yet</div>
              ) : (
                <div className="space-y-2">
                  {assignments.map(a => {
                    const overdue = new Date(a.deadline) <= new Date()
                    return (
                      <div key={a.id} className="p-3 rounded-lg" style={{ background: 'var(--bg-soft)' }}>
                        <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{a.title}</div>
                        <div className="text-xs mt-1" style={{ color: overdue ? '#f43f5e' : 'var(--text-faint)' }}>
                          {overdue ? '🚨 Overdue' : 'Due'} · {new Date(a.deadline).toLocaleDateString()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}