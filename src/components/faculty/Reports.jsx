import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'
import { Download, TrendingUp, TrendingDown, Printer } from 'lucide-react'

const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML']
const YEARS = [1, 2, 3, 4]

export default function Reports() {
  const [department, setDepartment] = useState('CSE')
  const [year, setYear] = useState(1)
  const [section, setSection] = useState('')
  const [sections, setSections] = useState([])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const inputStyle = { background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text)' }

  useEffect(() => { fetchSections() }, [department, year])

  async function fetchSections() {
    const { data } = await supabase.from('profiles').select('section').eq('department', department).eq('year', year).eq('role', 'student')
    const set = Array.from(new Set((data || []).map(s => s.section).filter(Boolean))).sort()
    setSections(set); setSection(set[0] || '')
  }

  async function generate() {
    setLoading(true)
    const { data: students } = await supabase.from('profiles').select('*').eq('department', department).eq('year', year).eq('section', section).eq('role', 'student')
    if (!students || students.length === 0) { setResults({ rows: [], avg: 0 }); setLoading(false); return }

    const ids = students.map(s => s.id)
    const { data: marks } = await supabase.from('marks').select('*').in('student_id', ids)

    const rows = students.map(s => {
      const studentMarks = (marks || []).filter(m => m.student_id === s.id)
      const totalPct = studentMarks.reduce((sum, m) => sum + (m.score / m.max_score) * 100, 0)
      const avgPct = studentMarks.length > 0 ? totalPct / studentMarks.length : 0
      return { ...s, avgScore: Math.round(avgPct * 10) / 10, examCount: studentMarks.length }
    })

    const classAvg = rows.length > 0 ? rows.reduce((sum, r) => sum + r.avgScore, 0) / rows.length : 0
    setResults({ rows, avg: Math.round(classAvg * 10) / 10 })
    setLoading(false)
  }

  function exportCSV() {
    if (!results) return
    const headers = 'Name,Roll Number,Average Score %,Status\n'
    const csvRows = results.rows.map(r => `${r.name},${r.roll_number},${r.avgScore},${r.avgScore >= results.avg ? 'Peak' : 'Runner'}`).join('\n')
    const blob = new Blob([headers + csvRows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${department}_Year${year}_${section}_report.csv`; a.click()
  }

  const peak = results?.rows.filter(r => r.examCount > 0 && r.avgScore >= results.avg).sort((a, b) => b.avgScore - a.avgScore) || []
  const runners = results?.rows.filter(r => r.examCount > 0 && r.avgScore < results.avg).sort((a, b) => a.avgScore - b.avgScore) || []

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>Performance Reports</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-faint)' }}>Generate Runners (below average) and Peak (above average) performer lists</p>

      <div className="rounded-2xl p-5 mb-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
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
        <button onClick={generate} disabled={!section || loading} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {results && (
        <>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Class Average: <span className="font-bold" style={{ color: 'var(--text)' }}>{results.avg}%</span> · {results.rows.length} students
            </div>
            <div className="flex gap-2">
              <button onClick={exportCSV} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg" style={{ color: '#6366f1', background: 'rgba(99,102,241,0.1)' }}>
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg" style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-4 h-4 text-emerald-500" /><h3 className="font-display font-bold" style={{ color: 'var(--text)' }}>Peak Performers ({peak.length})</h3></div>
              <div className="space-y-2">
                {peak.length === 0 ? <div className="text-sm" style={{ color: 'var(--text-faint)' }}>No data</div> : peak.map((r, i) => (
                  <div key={r.id} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: 'var(--bg-soft)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold w-5" style={{ color: 'var(--text-faint)' }}>#{i + 1}</span>
                      <div><div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{r.name}</div><div className="text-xs" style={{ color: 'var(--text-faint)' }}>{r.roll_number}</div></div>
                    </div>
                    <span className="text-sm font-bold text-emerald-500">{r.avgScore}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-4"><TrendingDown className="w-4 h-4 text-red-500" /><h3 className="font-display font-bold" style={{ color: 'var(--text)' }}>Runners — Need Attention ({runners.length})</h3></div>
              <div className="space-y-2">
                {runners.length === 0 ? <div className="text-sm" style={{ color: 'var(--text-faint)' }}>No data</div> : runners.map((r, i) => (
                  <div key={r.id} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: 'var(--bg-soft)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold w-5" style={{ color: 'var(--text-faint)' }}>#{i + 1}</span>
                      <div><div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{r.name}</div><div className="text-xs" style={{ color: 'var(--text-faint)' }}>{r.roll_number}</div></div>
                    </div>
                    <span className="text-sm font-bold text-red-500">{r.avgScore}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}