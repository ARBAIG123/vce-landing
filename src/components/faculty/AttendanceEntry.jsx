import { Save, CheckCircle2 } from 'lucide-react'
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

  const inputStyle = {
    background: 'var(--input-bg)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  }

  useEffect(() => { fetchSections() }, [department, year])
  useEffect(() => { fetchSubjects() }, [department, year])
  useEffect(() => { if (section) fetchStudents() }, [department, year, section])
  useEffect(() => { if (subjectId && date && students.length) fetchExisting() }, [subjectId, date, students])

  async function fetchSections() {
    const { data } = await supabase.from('profiles').select('section')
      .eq('department', department).eq('year', year).eq('role', 'student')
    const set = Array.from(new Set((data || []).map(s => s.section).filter(Boolean))).sort()
    setSections(set); setSection(set[0] || '')
  }

  async function fetchSubjects() {
    const { data } = await supabase.from('subjects').select('*')
      .eq('department', department).eq('year', year)
    setSubjects(data || []); setSubjectId(data?.[0]?.id || '')
  }

  async function fetchStudents() {
    const { data } = await supabase.from('profiles').select('*')
      .eq('department', department).eq('year', year)
      .eq('section', section).eq('role', 'student')
      .order('roll_number')
    setStudents(data || [])
  }

  async function fetchExisting() {
    const ids = students.map(s => s.id)
    const { data } = await supabase.from('attendance').select('*')
      .eq('subject_id', subjectId).eq('date', date).in('student_id', ids)
    const map = {}, idMap = {}
    ;(data || []).forEach(a => { map[a.student_id] = a.status; idMap[a.student_id] = a.id })
    const defaults = {}
    students.forEach(s => { defaults[s.id] = map[s.id] || null })
    setStatusMap(defaults); setExistingIds(idMap)
  }

  function cycle(studentId) {
    const current = statusMap[studentId]
    const next = current === null ? 'present' : current === 'present' ? 'absent' : null
    setStatusMap({ ...statusMap, [studentId]: next })
  }

  async function handleSave() {
    setSaving(true)
    for (const s of students) {
      const status = statusMap[s.id]
      const existingId = existingIds[s.id]
      if (status === null) {
        if (existingId) await supabase.from('attendance').delete().eq('id', existingId)
        continue
      }
      if (existingId) {
        await supabase.from('attendance').update({ status }).eq('id', existingId)
      } else {
        await supabase.from('attendance').insert({ student_id: s.id, subject_id: subjectId, date, status })
      }
    }
    setSaving(false); setSaved(true); fetchExisting()
    setTimeout(() => setSaved(false), 2500)
  }

  const statusStyle = {
    present: { bg: 'rgba(16,185,129,0.2)', border: '#10b981', color: '#10b981' },
    absent: { bg: 'rgba(244,63,94,0.2)', border: '#f43f5e', color: '#f43f5e' },
    null: { bg: 'var(--input-bg)', border: 'var(--border)', color: 'var(--text-muted)' },
  }

  const present = Object.values(statusMap).filter(v => v === 'present').length
  const absent = Object.values(statusMap).filter(v => v === 'absent').length
  const unmarked = students.length - present - absent

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>Take Attendance</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-faint)' }}>
        Click a roll number once — <span style={{ color: '#10b981' }}>green = Present</span>,
        twice — <span style={{ color: '#f43f5e' }}>red = Absent</span>, three times — deselected
      </p>

      <div className="rounded-2xl p-5 mb-5 grid sm:grid-cols-2 lg:grid-cols-5 gap-3"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Department</label>
          <select value={department} onChange={e => setDepartment(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Year</label>
          <select value={year} onChange={e => setYear(parseInt(e.target.value))}
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
            {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Section</label>
          <select value={section} onChange={e => setSection(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
            {sections.length === 0
              ? <option value="">No sections</option>
              : sections.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Subject</label>
          <select value={subjectId} onChange={e => setSubjectId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
            {subjects.length === 0
              ? <option value="">No subjects</option>
              : subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
        </div>
      </div>

      {students.length === 0 ? (
        <div className="rounded-2xl p-10 text-center text-sm"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text-faint)' }}>
          No students found for this selection
        </div>
      ) : (
        <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>

          {/* Summary */}
          <div className="flex items-center gap-4 mb-5 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
              ✓ Present: {present}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(244,63,94,0.15)', color: '#f43f5e' }}>
              ✗ Absent: {absent}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'var(--input-bg)', color: 'var(--text-faint)' }}>
              — Unmarked: {unmarked}
            </span>
          </div>

          {/* Roll number pills grid */}
          <div className="flex flex-wrap gap-2.5">
            {students.map(s => {
              const status = statusMap[s.id] || null
              const st = statusStyle[status] || statusStyle[null]
              return (
                <motion.button
                  key={s.id}
                  onClick={() => cycle(s.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3.5 py-2 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: st.bg,
                    border: `1.5px solid ${st.border}`,
                    color: st.color,
                  }}
                >
                  {s.roll_number || s.name?.split(' ')[0]}
                </motion.button>
              )
            })}
          </div>

          <div className="flex justify-end mt-5" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <motion.button onClick={handleSave} disabled={saving}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: saved ? '#10b981' : 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              {saving
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Attendance</>}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  )
}