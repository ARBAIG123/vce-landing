import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, Calculator } from 'lucide-react'

const gradePoints = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'F': 0 }

export default function CgpaTab() {
  const [prevCgpa, setPrevCgpa] = useState('')
  const [prevCredits, setPrevCredits] = useState('')
  const [subjects, setSubjects] = useState([{ name: '', credits: '', grade: 'B' }])
  const [result, setResult] = useState(null)

  const inputStyle = { background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text)' }

  function updateSubject(i, field, value) {
    const copy = [...subjects]
    copy[i][field] = value
    setSubjects(copy)
  }

  function addSubject() { setSubjects([...subjects, { name: '', credits: '', grade: 'B' }]) }
  function removeSubject(i) { setSubjects(subjects.filter((_, idx) => idx !== i)) }

  function calculate() {
    let totalPoints = 0, totalCredits = 0
    subjects.forEach(s => {
      const credits = parseFloat(s.credits) || 0
      totalPoints += credits * (gradePoints[s.grade] || 0)
      totalCredits += credits
    })
    const semGpa = totalCredits > 0 ? totalPoints / totalCredits : 0

    let cumCgpa = semGpa
    let allCredits = totalCredits
    const pCgpa = parseFloat(prevCgpa) || 0
    const pCredits = parseFloat(prevCredits) || 0
    if (pCgpa && pCredits) {
      allCredits = pCredits + totalCredits
      cumCgpa = (pCgpa * pCredits + totalPoints) / allCredits
    }

    setResult({ semGpa: semGpa.toFixed(2), cumCgpa: cumCgpa.toFixed(2), allCredits })
  }

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>CGPA Calculator</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-faint)' }}>Predict your semester GPA and cumulative CGPA</p>

      <div className="rounded-2xl p-5 mb-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Previous Record (optional)</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Current CGPA</label>
            <input type="number" value={prevCgpa} onChange={e => setPrevCgpa(e.target.value)} placeholder="e.g. 7.25"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Total Credits Completed</label>
            <input type="number" value={prevCredits} onChange={e => setPrevCredits(e.target.value)} placeholder="e.g. 24"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-5 mb-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Current Semester Subjects</h3>
        <div className="space-y-2">
          {subjects.map((s, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="flex-[2]">
                {i === 0 && <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Subject</label>}
                <input value={s.name} onChange={e => updateSubject(i, 'name', e.target.value)} placeholder="e.g. Data Structures"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
              </div>
              <div className="flex-1">
                {i === 0 && <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Credits</label>}
                <input type="number" value={s.credits} onChange={e => updateSubject(i, 'credits', e.target.value)} placeholder="3"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
              </div>
              <div className="flex-1">
                {i === 0 && <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Grade</label>}
                <select value={s.grade} onChange={e => updateSubject(i, 'grade', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
                  {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              {subjects.length > 1 && (
                <button onClick={() => removeSubject(i)} className="p-2.5 rounded-xl transition hover:bg-red-500/10" style={{ color: 'var(--text-faint)' }}>
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addSubject} className="flex items-center gap-1.5 text-sm font-medium mt-3" style={{ color: '#6366f1' }}>
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      <motion.button onClick={calculate} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white mb-4"
        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
        <Calculator className="w-4 h-4" /> Calculate
      </motion.button>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl p-5 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>{result.semGpa}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>Semester GPA</div>
          </div>
          <div className="rounded-2xl p-5 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="font-display text-2xl font-bold text-gradient">{result.cumCgpa}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>Cumulative CGPA</div>
          </div>
          <div className="rounded-2xl p-5 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>{result.allCredits}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>Total Credits</div>
          </div>
        </motion.div>
      )}
    </div>
  )
}