import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../supabase'
import { ArrowUpDown, Save, CheckCircle2 } from 'lucide-react'

const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML']
const YEARS = [1, 2, 3, 4]
const EXAM_TYPES = ['Assignment', 'Lab Record', 'CAT-1', 'CAT-2', 'Semester']

export default function MarksEntry() {
  const [department, setDepartment] = useState('CSE')
  const [year, setYear] = useState(1)
  const [section, setSection] = useState('')
  const [sections, setSections] = useState([])
  const [subjects, setSubjects] = useState([])
  const [subjectId, setSubjectId] = useState('')
  const [examType, setExamType] = useState('Assignment')
  const [maxScore, setMaxScore] = useState(20)
  const [students, setStudents] = useState([])
  const [scores, setScores] = useState({})
  const [existingIds, setExistingIds] = useState({})
  const [sortDir, setSortDir] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showNewSubject, setShowNewSubject] = useState(false)
  const [newSubjectName, setNewSubjectName] = useState('')

  const inputStyle = { background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text)' }

  useEffect(() => { fetchSections() }, [department, year])
  useEffect(() => { fetchSubjects() }, [department, year])
  useEffect(() => { if (section) fetchStudents() }, [department, year, section])
  useEffect(() => { if (subjectId && examType && students.length) fetchExistingMarks() }, [subjectId, examType, students])

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
    setStudents(data || []); setScores({})
  }

  async function fetchExistingMarks() {
    const ids = students.map(s => s.id)
    const { data } = await supabase.from('marks').select('*').eq('subject_id', subjectId).eq('exam_type', examType).in('student_id', ids)
    const scoreMap = {}, idMap = {}
    ;(data || []).forEach(m => { scoreMap[m.student_id] = m.score; idMap[m.student_id] = m.id })
    setScores(scoreMap); setExistingIds(idMap)
  }

  async function createSubject() {
    if (!newSubjectName.trim()) return
    const { data, error } = await supabase.from('subjects').insert({ name: newSubjectName, department, year }).select().single()
    if (!error && data) { setSubjects([...subjects, data]); setSubjectId(data.id); setNewSubjectName(''); setShowNewSubject(false) }
  }

  async function handleSaveAll() {
    setSaving(true)
    for (const s of students) {
      const score = scores[s.id]
      if (score === undefined || score === '') continue
      const existingId = existingIds[s.id]
      if (existingId) {
        await supabase.from('marks').update({ score: parseFloat(score), max_score: parseFloat(maxScore) }).eq('id', existingId)
      } else {
        await supabase.from('marks').insert({ student_id: s.id, subject_id: subjectId, exam_type: examType, score: parseFloat(score), max_score: parseFloat(maxScore) })
      }
    }
    setSaving(false); setSaved(true); fetchExistingMarks()
    setTimeout(() => setSaved(false), 2500)
  }

  const sortedStudents = sortDir
    ? [...students].sort((a, b) => {
        const sa = parseFloat(scores[a.id]) || -1, sb = parseFloat(scores[b.id]) || -1
        return sortDir === 'desc' ? sb - sa : sa - sb
      })
    : students

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>Enter Marks</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-faint)' }}>Select class details and enter scores for every student at once</p>

      <div className="rounded-2xl p-5 mb-5 grid sm:grid-cols-2 lg:grid-cols-5 gap-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
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
          <button onClick={() => setShowNewSubject(!showNewSubject)} className="text-xs mt-1 font-medium" style={{ color: '#6366f1' }}>+ New subject</button>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Exam Type</label>
          <select value={examType} onChange={e => setExamType(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
            {EXAM_TYPES.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        {showNewSubject && (
          <div className="sm:col-span-2 lg:col-span-5 flex gap-2">
            <input value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} placeholder="Subject name (e.g. Data Structures)"
              className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
            <button onClick={createSubject} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>Add</button>
          </div>
        )}

        <div className="sm:col-span-2 lg:col-span-5 flex items-center gap-3">
          <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Max Score:</label>
          <input type="number" value={maxScore} onChange={e => setMaxScore(e.target.value)} className="w-24 px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
        </div>
      </div>

      {students.length === 0 ? (
        <div className="rounded-2xl p-10 text-center text-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text-faint)' }}>No students found for this selection</div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ background: 'var(--table-head)' }}>
            <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-faint)' }}>{students.length} students</span>
            <button onClick={() => setSortDir(sortDir === 'desc' ? 'asc' : 'desc')} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort by score
            </button>
          </div>
          <table className="w-full">
            <thead><tr style={{ background: 'var(--table-head)' }}>
              {['Roll No', 'Name', 'Score'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase" style={{ color: 'var(--text-faint)' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {sortedStudents.map(s => (
                <tr key={s.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-2.5 text-sm" style={{ color: 'var(--text-muted)' }}>{s.roll_number}</td>
                  <td className="px-4 py-2.5 text-sm font-medium" style={{ color: 'var(--text)' }}>{s.name}</td>
                  <td className="px-4 py-2.5">
                    <input type="number" value={scores[s.id] ?? ''} onChange={e => setScores({ ...scores, [s.id]: e.target.value })}
                      placeholder="-" className="w-20 px-2 py-1.5 rounded-lg text-sm outline-none" style={inputStyle} />
                    <span className="text-xs ml-1" style={{ color: 'var(--text-faint)' }}>/ {maxScore}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 flex justify-end" style={{ borderTop: '1px solid var(--border)' }}>
            <motion.button onClick={handleSaveAll} disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: saved ? '#10b981' : 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save All Marks</>}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  )
}