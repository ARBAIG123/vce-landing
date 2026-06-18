import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../supabase'
import { Save, CheckCircle2 } from 'lucide-react'

const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML']
const YEARS = [1, 2, 3, 4]

export default function AttendanceEntry() {
  const [department, setDepartment] = useState('CSE')
  const [year, setYear] = useState(1)
  const [section, setSection] = useState('')
  const [sections, setSections] = useState([])
  const [subjects, setSubjects] = useState([])
  const [subjectId, setSubjectId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState([])
  const [statusMap, setStatusMap] = useState({})
  const [existingIds, setExistingIds] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const inputStyle = { background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text)' }

  useEffect(() => { fetchSections() }, [department, year])
  useEffect(() => { fetchSubjects() }, [department, year])
  useEffect(() => { if (section) fetchStudents() }, [department, year, section])
  useEffect(() => { if (subjectId && date && students.length) fetchExisting() }, [subjectId, date, students])

  async function fetchSections() {
    const { data } = await supabase.from('profiles').select('section').eq('department', department).eq('year', year).eq('role', 'student')
    const set = Array.from(new Set((data || []).map(s => s.section).filter(Boolean))).sort()
    setSections(set); setSection(set[0] || '')
  }

  async function fetchSubjects() {
    const { data } = await supabase.from('subjects').select('*').eq('department', department).eq('year', year)
    setSubjects(data || []); setSubjectId(data?.[0]?.id || '')
  }

  async function fetchStudents() {
    const { data } = await supabase.from('profiles').select('*').eq('department', department).eq('year', year).eq('section', section).eq('role', 'student').order('roll_number')
    setStudents(data || [])
  }

  async function fetchExisting() {
    const ids = students.map(s => s.id)
    const { data } = await supabase.from('attendance').select('*').eq('subject_id', subjectId).eq('date', date).in('student_id', ids)
    const map = {}, idMap = {}
    ;(data || []).forEach(a => { map[a.student_id] = a.status; idMap[a.student_id] = a.id })
    const defaults = {}
    students.forEach(s => { defaults[s.id] = map[s.id] || 'present' })
    setStatusMap(defaults); setExistingIds(idMap)
  }

  function cycle(studentId) {
    const order = ['present', 'absent', 'holiday']
    const current = statusMap[studentId] || 'present'
    setStatusMap({ ...statusMap, [studentId]: order[(order.indexOf(current) + 1) % order.length] })
  }

  async function handleSave() {
    setSaving(true)
    for (const s of students) {
      const status = statusMap[s.id] || 'present'
      const existingId = existingIds[s.id]
      if (existingId) await supabase.from('attendance').update({ status }).eq('id', existingId)
      else await supabase.from('attendance').insert({ student_id: s.id, subject_id: subjectId, date, status })
    }
    setSaving(false); setSaved(true); fetchExisting()
    setTimeout(() => setSaved(false), 2500)
  }

  const statusColor = { present: '#10b981', absent: '#f43f5e', holiday: '#f59e0b' }
  const statusLabel = { present: '✓ Present', absent: '✗ Absent', holiday: '— Holiday' }

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>Take Attendance</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-faint)' }}>Mark daily attendance for a section · click a status to cycle through it</p>

      <div className="rounded-2xl p-5 mb-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Department</label>
          <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Year</label>
          <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
            {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Section</label>
          <select value={section} onChange={e => setSection(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
            {sections.length === 0 ? <option value="">No sections</option> : sections.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Subject</label>
          <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
            {subjects.length === 0 ? <option value="">No subjects</option> : subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-4">
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
        </div>
      </div>

      {students.length === 0 ? (
        <div className="rounded-2xl p-10 text-center text-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text-faint)' }}>No students found for this selection</div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full">
            <thead><tr style={{ background: 'var(--table-head)' }}>
              {['Roll No', 'Name', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase" style={{ color: 'var(--text-faint)' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {students.map(s => {
                const status = statusMap[s.id] || 'present'
                return (
                  <tr key={s.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-2.5 text-sm" style={{ color: 'var(--text-muted)' }}>{s.roll_number}</td>
                    <td className="px-4 py-2.5 text-sm font-medium" style={{ color: 'var(--text)' }}>{s.name}</td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => cycle(s.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition" style={{ background: `${statusColor[status]}1A`, color: statusColor[status] }}>
                        {statusLabel[status]}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="p-4 flex justify-end" style={{ borderTop: '1px solid var(--border)' }}>
            <motion.button onClick={handleSave} disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: saved ? '#10b981' : 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Attendance</>}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  )
}