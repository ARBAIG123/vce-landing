import { useState } from 'react'
import { motion } from 'framer-motion'
import Papa from 'papaparse'
import { Upload, X, FileSpreadsheet, CheckCircle2, XCircle, Download } from 'lucide-react'

export default function CsvImportModal({ role, onClose, onSuccess }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState([])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const inputStyle = { background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text)' }

  function handleFile(e) {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setError('')
    setResults(null)

    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        setPreview(res.data.slice(0, 5))
      }
    })
  }

  async function handleImport() {
    setLoading(true)
    setError('')

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (res) => {
        const users = res.data.map(row => ({
          name: row.name,
          email: row.email,
          password: row.password || 'vce@2026',
          role,
          department: row.department,
          year: row.year,
          section: row.section,
          roll_number: row.roll_number,
          staff_id: row.staff_id
        }))

        try {
          const response = await fetch('/api/bulk-create-users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ users })
          })

          const data = await response.json()
          if (data.error) throw new Error(data.error)

          setResults(data.results)
          onSuccess()
        } catch (err) {
          setError(err.message)
        }
        setLoading(false)
      }
    })
  }

  function downloadTemplate() {
    const headers = role === 'student'
      ? 'name,email,password,department,year,section,roll_number'
      : 'name,email,password,department,staff_id'

    const sample = role === 'student'
      ? 'John Doe,john@vardhaman.org,vce@2026,CSE,1,A,25881A0001'
      : 'Jane Smith,jane@vardhaman.org,vce@2026,CSE,VCE001'

    const csv = `${headers}\n${sample}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${role}_template.csv`
    a.click()
  }

  const successCount = results?.filter(r => r.status === 'success').length || 0
  const failedCount = results?.filter(r => r.status === 'failed').length || 0

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-lg rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
        style={{ background: 'var(--bg-soft)', border: '1px solid var(--border)' }}>

        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text)' }}>
            Bulk Import {role === 'student' ? '🎓 Students' : '👨‍🏫 Faculty'}
          </h3>
          <button onClick={onClose} className="transition hover:rotate-90 duration-200" style={{ color: 'var(--text-faint)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs mb-4" style={{ color: 'var(--text-faint)' }}>
          Upload a CSV file to create multiple accounts at once
        </p>

        <button onClick={downloadTemplate}
          className="flex items-center gap-2 text-xs font-medium mb-4 px-3 py-2 rounded-lg transition"
          style={{ color: '#6366f1', background: 'rgba(99,102,241,0.1)' }}>
          <Download className="w-3.5 h-3.5" /> Download CSV Template
        </button>

        {/* File Upload */}
        <label className="block cursor-pointer">
          <div className="rounded-xl p-6 text-center transition hover:bg-[var(--card-hover)]"
            style={{ border: '2px dashed var(--border)' }}>
            <FileSpreadsheet className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-faint)' }} />
            <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>
              {file ? file.name : 'Click to upload CSV file'}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>
              {file ? `${preview.length}+ rows detected` : 'CSV with name, email, password, department, etc.'}
            </div>
          </div>
          <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
        </label>

        {/* Preview */}
        {preview.length > 0 && !results && (
          <div className="mt-4 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="px-3 py-2 text-xs font-semibold" style={{ background: 'var(--table-head)', color: 'var(--text-faint)' }}>
              Preview (first 5 rows)
            </div>
            <div className="max-h-40 overflow-y-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {Object.keys(preview[0]).map(k => (
                      <th key={k} className="text-left px-3 py-2 font-medium" style={{ color: 'var(--text-faint)' }}>{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      {Object.values(row).map((v, j) => (
                        <td key={j} className="px-3 py-2" style={{ color: 'var(--text-muted)' }}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="mt-4 space-y-2">
            <div className="flex gap-2">
              <div className="flex-1 rounded-xl p-3 flex items-center gap-2"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-500">{successCount} Created</span>
              </div>
              {failedCount > 0 && (
                <div className="flex-1 rounded-xl p-3 flex items-center gap-2"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-semibold text-red-500">{failedCount} Failed</span>
                </div>
              )}
            </div>
            {failedCount > 0 && (
              <div className="rounded-xl p-3 max-h-32 overflow-y-auto text-xs space-y-1"
                style={{ background: 'var(--input-bg)', border: '1px solid var(--border)' }}>
                {results.filter(r => r.status === 'failed').map((r, i) => (
                  <div key={i} style={{ color: 'var(--text-muted)' }}>
                    <span className="text-red-400">{r.email}</span>: {r.reason}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-400 text-xs px-3 py-2 rounded-lg"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            {results ? 'Close' : 'Cancel'}
          </button>
          {!results && (
            <motion.button onClick={handleImport} disabled={!file || loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
              style={{
                background: !file ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #a855f7)',
              }}>
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Upload className="w-4 h-4" /> Import Users</>}
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}