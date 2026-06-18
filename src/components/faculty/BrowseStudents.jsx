import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../supabase'
import PerformanceChart from '../PerformanceChart'
import { ChevronRight, ArrowLeft, Search, Mail, Hash, BookOpen } from 'lucide-react'

const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML']
const YEARS = [1, 2, 3, 4]

export default function BrowseStudents() {
  const [students, setStudents] = useState([])
  const [path, setPath] = useState({ department: null, year: null, section: null, student: null })

  useEffect(() => { fetchStudents() }, [])

  async function fetchStudents() {
    const { data } = await supabase.from('profiles').select('*').eq('role', 'student')
    setStudents(data || [])
  }

  const countFor = (dept, year, section) => students.filter(s =>
    (!dept || s.department === dept) && (!year || s.year === year) && (!section || s.section === section)
  ).length

  const sectionsFor = (dept, year) =>
    Array.from(new Set(students.filter(s => s.department === dept && s.year === year).map(s => s.section).filter(Boolean))).sort()

  const studentsFor = (dept, year, section) =>
    students.filter(s => s.department === dept && s.year === year && s.section === section)

  if (path.student) return <StudentProfileView student={path.student} onBack={() => setPath({ ...path, student: null })} />

  return (
    <div>
      <div className="flex items-center gap-2 text-sm mb-6 flex-wrap" style={{ color: 'var(--text-faint)' }}>
        <button onClick={() => setPath({ department: null, year: null, section: null, student: null })}
          className="hover:underline" style={{ color: path.department ? 'var(--text-muted)' : 'var(--text)' }}>All Departments</button>
        {path.department && (<><ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => setPath({ ...path, year: null, section: null })} className="hover:underline"
            style={{ color: path.year ? 'var(--text-muted)' : 'var(--text)' }}>{path.department}</button></>)}
        {path.year && (<><ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => setPath({ ...path, section: null })} className="hover:underline"
            style={{ color: path.section ? 'var(--text-muted)' : 'var(--text)' }}>Year {path.year}</button></>)}
        {path.section && (<><ChevronRight className="w-3.5 h-3.5" /><span style={{ color: 'var(--text)' }}>Section {path.section}</span></>)}
      </div>

      <AnimatePresence mode="wait">
        {!path.department && (
          <motion.div key="dept" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEPARTMENTS.map(d => (
              <motion.button key={d} whileHover={{ y: -3 }} onClick={() => setPath({ ...path, department: d })}
                className="rounded-2xl p-5 text-left transition" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="w-10 h-10 rounded-xl grid place-items-center mb-3" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                  <BookOpen className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="font-display font-bold" style={{ color: 'var(--text)' }}>{d}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>{countFor(d)} students</div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {path.department && !path.year && (
          <motion.div key="year" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {YEARS.map(y => (
              <motion.button key={y} whileHover={{ y: -3 }} onClick={() => setPath({ ...path, year: y })}
                className="rounded-2xl p-5 text-left transition" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>Year {y}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>{countFor(path.department, y)} students</div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {path.department && path.year && !path.section && (
          <motion.div key="section" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sectionsFor(path.department, path.year).length === 0 ? (
              <div className="col-span-full text-sm py-10 text-center" style={{ color: 'var(--text-faint)' }}>No sections found for this year yet</div>
            ) : sectionsFor(path.department, path.year).map(s => (
              <motion.button key={s} whileHover={{ y: -3 }} onClick={() => setPath({ ...path, section: s })}
                className="rounded-2xl p-5 text-left transition" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>Section {s}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>{countFor(path.department, path.year, s)} students</div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {path.department && path.year && path.section && (
          <motion.div key="students" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <StudentTable students={studentsFor(path.department, path.year, path.section)} onSelect={(student) => setPath({ ...path, student })} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StudentTable({ students, onSelect }) {
  const [search, setSearch] = useState('')
  const filtered = students.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()) || s.roll_number?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="relative mb-4 w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-faint)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..."
          className="pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none w-full" style={{ background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead><tr style={{ background: 'var(--table-head)' }}>
            {['Name', 'Roll Number', 'Email', ''].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-sm" style={{ color: 'var(--text-faint)' }}>No students found</td></tr>
            ) : filtered.map(s => (
              <tr key={s.id} onClick={() => onSelect(s)} className="border-t cursor-pointer transition hover:bg-[var(--card-hover)]" style={{ borderColor: 'var(--border)' }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full grid place-items-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>{s.name?.charAt(0)}</div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{s.roll_number}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{s.email}</td>
                <td className="px-4 py-3 text-right"><ChevronRight className="w-4 h-4 inline" style={{ color: 'var(--text-faint)' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StudentProfileView({ student, onBack }) {
  const [marks, setMarks] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [student.id])

  async function fetchData() {
    setLoading(true)
    const { data: marksData } = await supabase.from('marks').select('*, subjects(name)').eq('student_id', student.id).order('date')
    const { data: attData } = await supabase.from('attendance').select('*, subjects(name)').eq('student_id', student.id)
    setMarks(marksData || [])
    setAttendance(attData || [])
    setLoading(false)
  }

  const present = attendance.filter(a => a.status === 'present').length
  const totalMarked = attendance.filter(a => a.status !== 'holiday').length
  const attPct = totalMarked > 0 ? Math.round((present / totalMarked) * 100) : null

  const bySubject = {}
  attendance.forEach(a => {
    if (a.status === 'holiday') return
    const name = a.subjects?.name || 'Unknown'
    if (!bySubject[name]) bySubject[name] = { present: 0, total: 0 }
    bySubject[name].total++
    if (a.status === 'present') bySubject[name].present++
  })

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm mb-4 transition hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft className="w-4 h-4" /> Back to students
      </button>

      <div className="rounded-2xl p-6 mb-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl grid place-items-center text-xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>{student.name?.charAt(0)}</div>
          <div>
            <h2 className="font-display text-xl font-bold" style={{ color: 'var(--text)' }}>{student.name}</h2>
            <div className="flex items-center gap-4 text-xs mt-1 flex-wrap" style={{ color: 'var(--text-faint)' }}>
              <span className="flex items-center gap-1"><Hash className="w-3 h-3" />{student.roll_number}</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{student.email}</span>
              <span>{student.department} · Year {student.year} · Section {student.section}</span>
            </div>
          </div>
          {attPct !== null && (
            <div className="ml-auto text-right">
              <div className="font-display text-2xl font-bold" style={{ color: attPct < 80 ? '#f43f5e' : '#10b981' }}>{attPct}%</div>
              <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Attendance</div>
              {attPct < 80 && <div className="text-xs font-semibold mt-1" style={{ color: '#f43f5e' }}>🚨 Below 80%</div>}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h3 className="font-display font-bold mb-4" style={{ color: 'var(--text)' }}>Performance Trend</h3>
          {loading ? <div className="text-sm" style={{ color: 'var(--text-faint)' }}>Loading...</div> : <PerformanceChart marks={marks} />}
        </div>

        <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h3 className="font-display font-bold mb-4" style={{ color: 'var(--text)' }}>Attendance by Subject</h3>
          {Object.keys(bySubject).length === 0 ? (
            <div className="text-sm" style={{ color: 'var(--text-faint)' }}>No attendance recorded</div>
          ) : (
            <div className="space-y-3">
              {Object.entries(bySubject).map(([name, v]) => {
                const pct = Math.round((v.present / v.total) * 100)
                return (
                  <div key={name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: 'var(--text-muted)' }}>{name}</span>
                      <span style={{ color: pct < 80 ? '#f43f5e' : '#10b981', fontWeight: 600 }}>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--input-bg)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct < 80 ? '#f43f5e' : 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl p-6 mt-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <h3 className="font-display font-bold mb-4" style={{ color: 'var(--text)' }}>All Marks</h3>
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full">
            <thead><tr style={{ background: 'var(--table-head)' }}>
              {['Subject', 'Exam Type', 'Score', 'Date'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase" style={{ color: 'var(--text-faint)' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {marks.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-sm" style={{ color: 'var(--text-faint)' }}>No marks yet</td></tr>
              ) : marks.map(m => (
                <tr key={m.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-2.5 text-sm" style={{ color: 'var(--text)' }}>{m.subjects?.name}</td>
                  <td className="px-4 py-2.5 text-sm" style={{ color: 'var(--text-muted)' }}>{m.exam_type}</td>
                  <td className="px-4 py-2.5 text-sm font-medium" style={{ color: 'var(--text)' }}>{m.score}/{m.max_score}</td>
                  <td className="px-4 py-2.5 text-sm" style={{ color: 'var(--text-faint)' }}>{m.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}