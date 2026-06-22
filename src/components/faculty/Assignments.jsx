import AssignmentCard from '../AssignmentCard'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../supabase'
import { Plus, Calendar, Trash2 } from 'lucide-react'

const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML']
const YEARS = [1, 2, 3, 4]

export default function Assignments({ user }) {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', description: '', department: 'CSE', year: 1, section: '', deadline: '' })
  const [sections, setSections] = useState([])
  const [creating, setCreating] = useState(false)

  const inputStyle = { background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text)' }

  useEffect(() => { fetchAssignments() }, [])
  useEffect(() => { fetchSections() }, [form.department, form.year])

  async function fetchAssignments() {
    setLoading(true)
    const { data } = await supabase.from('assignments').select('*').order('created_at', { ascending: false })
    setAssignments(data || [])
    setLoading(false)
  }

  async function fetchSections() {
    const { data } = await supabase.from('profiles').select('section').eq('department', form.department).eq('year', form.year).eq('role', 'student')
    const set = Array.from(new Set((data || []).map(s => s.section).filter(Boolean))).sort()
    setSections(set)
    setForm(f => ({ ...f, section: set[0] || '' }))
  }

  async function handleCreate(e) {
    e.preventDefault()
    setCreating(true)
    const { data: assignment, error } = await supabase.from('assignments').insert({
      title: form.title, description: form.description, department: form.department, year: form.year, section: form.section, deadline: form.deadline, created_by: user.id
    }).select().single()

    if (!error && assignment) {
      const { data: students } = await supabase.from('profiles').select('id').eq('department', form.department).eq('year', form.year).eq('section', form.section).eq('role', 'student')
      if (students?.length) {
        const notifications = students.map(s => ({
          student_id: s.id, title: `New Assignment: ${form.title}`,
          message: `Due ${new Date(form.deadline).toLocaleDateString()}. ${form.description || ''}`, type: 'assignment'
        }))
        await supabase.from('notifications').insert(notifications)
      }
      setForm({ ...form, title: '', description: '', deadline: '' })
      fetchAssignments()
    }
    setCreating(false)
  }

  async function deleteAssignment(id) {
    await supabase.from('assignments').delete().eq('id', id)
    fetchAssignments()
  }

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>Assignments</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-faint)' }}>Create assignments for a section — students get notified automatically</p>

      <form onSubmit={handleCreate} className="rounded-2xl p-5 mb-6 grid sm:grid-cols-2 gap-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Title *</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Assignment 3 - Data Structures" className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional details..." rows={2} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none" style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Department</label>
          <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Year</label>
          <select value={form.year} onChange={e => setForm({ ...form, year: parseInt(e.target.value) })} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
            {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Section</label>
          <select value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
            {sections.length === 0 ? <option value="">No sections</option> : sections.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Deadline *</label>
          <input type="datetime-local" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} required className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
        </div>
        <div className="sm:col-span-2 flex justify-end">
          <motion.button type="submit" disabled={creating} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            {creating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus className="w-4 h-4" /> Create Assignment</>}
          </motion.button>
        </div>
      </form>

      <div className="space-y-2">
  {loading ? <div className="text-sm" style={{ color: 'var(--text-faint)' }}>Loading...</div> : assignments.length === 0 ? (
    <div className="rounded-2xl p-10 text-center text-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text-faint)' }}>No assignments created yet</div>
  ) : assignments.map(a => (
    <AssignmentCard key={a.id} assignment={a} onDelete={deleteAssignment} />
  ))}
</div>
    </div>
  )
}