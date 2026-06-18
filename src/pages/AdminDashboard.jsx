import CsvImportModal from './CsvImportModal'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabase'
import { useTheme } from '../ThemeContext'
import {
  GraduationCap, LogOut, Users, UserPlus, BookOpen, Building2,
  ChevronRight, Search, X, Eye, EyeOff, Sun, Moon, LayoutGrid, Upload
} from 'lucide-react'

export default function AdminDashboard({ user, onLogout }) {
  const [showCsvModal, setShowCsvModal] = useState(false)
  const { theme, toggle } = useTheme()
  const [activeTab, setActiveTab] = useState('overview')
  const [students, setStudents] = useState([])
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createRole, setCreateRole] = useState('student')

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (data) {
      setStudents(data.filter(u => u.role === 'student'))
      setFaculty(data.filter(u => u.role === 'faculty'))
    }
    setLoading(false)
  }

  const departmentCount = new Set(students.map(s => s.department).filter(Boolean)).size

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg)' }}>

      {/* Navbar */}
      <nav className="border-b px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl grid place-items-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold font-display" style={{ color: 'var(--text)' }}>VCE Tracker</div>
            <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Admin Portal</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggle}
            className="w-9 h-9 rounded-xl grid place-items-center transition hover:scale-105"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              </motion.div>
            </AnimatePresence>
          </button>
          <span className="text-sm hidden sm:block" style={{ color: 'var(--text-muted)' }}>⚙️ {user.name}</span>
          <button onClick={async () => { await supabase.auth.signOut(); onLogout() }}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl transition hover:border-red-400/40 hover:text-red-400"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>
            Admin Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-faint)' }}>
            Manage students, faculty and academic data across departments
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Bulk Import Students', sub: 'Upload CSV to create many accounts', icon: Upload, color: '#10b981', action: () => { setCreateRole('student'); setShowCsvModal(true) } },
            { label: 'Bulk Import Faculty', sub: 'Upload CSV to create many accounts', icon: Upload, color: '#f59e0b', action: () => { setCreateRole('faculty'); setShowCsvModal(true) } },
            { label: 'Total Students', value: students.length, color: '#6366f1', icon: Users },
            { label: 'Total Faculty', value: faculty.length, color: '#22d3ee', icon: BookOpen },
            { label: 'Departments', value: departmentCount, color: '#a855f7', icon: Building2 },
            { label: 'Active Users', value: students.length + faculty.length, color: '#10b981', icon: LayoutGrid },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -3 }}
              className="rounded-2xl p-5 transition-shadow"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl grid place-items-center"
                  style={{ background: `${stat.color}1A` }}>
                  <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="font-display text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>
                {stat.value}
              </div>
              <div className="text-xs mt-1 font-medium" style={{ color: 'var(--text-faint)' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'students', label: 'Students' },
            { id: 'faculty', label: 'Faculty' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="relative px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ color: activeTab === tab.id ? 'white' : 'var(--text-muted)' }}>
              {activeTab === tab.id && (
                <motion.div layoutId="adminTab" className="absolute inset-0 rounded-lg"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                  transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }} />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
              className="grid lg:grid-cols-2 gap-4">

              <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <h3 className="font-display font-bold mb-4" style={{ color: 'var(--text)' }}>Quick Actions</h3>
                <div className="space-y-2.5">
                  {[
  { label: 'Add New Student', sub: 'Create a student account manually', icon: UserPlus, color: '#6366f1', action: () => { setCreateRole('student'); setShowCreateModal(true) } },
  { label: 'Add New Faculty', sub: 'Create a faculty account manually', icon: UserPlus, color: '#22d3ee', action: () => { setCreateRole('faculty'); setShowCreateModal(true) } },
  { label: 'Bulk Import Students', sub: 'Upload CSV to create many accounts', icon: Upload, color: '#10b981', action: () => { setCreateRole('student'); setShowCsvModal(true) } },
  { label: 'Bulk Import Faculty', sub: 'Upload CSV to create many accounts', icon: Upload, color: '#f59e0b', action: () => { setCreateRole('faculty'); setShowCsvModal(true) } },
].map((item, i) => (
  <motion.button key={i} onClick={item.action} whileHover={{ x: 3 }}
    className="w-full flex items-center justify-between p-3.5 rounded-xl transition group"
    style={{ border: '1px solid var(--border)', background: 'var(--bg-soft)' }}>
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg grid place-items-center" style={{ background: `${item.color}1A` }}>
        <item.icon className="w-4 h-4" style={{ color: item.color }} />
      </div>
      <div className="text-left">
        <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{item.label}</div>
        <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{item.sub}</div>
      </div>
    </div>
    <ChevronRight className="w-4 h-4 transition group-hover:translate-x-0.5" style={{ color: 'var(--text-faint)' }} />
  </motion.button>
))}
                </div>
              </div>

              <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <h3 className="font-display font-bold mb-4" style={{ color: 'var(--text)' }}>Recent Students</h3>
                {loading ? (
                  <div className="text-sm" style={{ color: 'var(--text-faint)' }}>Loading...</div>
                ) : students.length === 0 ? (
                  <div className="text-sm" style={{ color: 'var(--text-faint)' }}>No students yet. Add your first student!</div>
                ) : (
                  <div className="space-y-1">
                    {students.slice(0, 5).map((s, i) => (
                      <motion.div key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-2.5 rounded-lg transition hover:bg-[var(--card-hover)]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full grid place-items-center text-xs font-bold text-white"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                            {s.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{s.name}</div>
                            <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{s.roll_number} · Section {s.section}</div>
                          </div>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-md"
                          style={{ color: 'var(--text-muted)', background: 'var(--bg-soft)' }}>{s.department}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'students' && (
            <motion.div key="students" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <StudentsList students={students} onAdd={() => { setCreateRole('student'); setShowCreateModal(true) }} />
            </motion.div>
          )}

          {activeTab === 'faculty' && (
            <motion.div key="faculty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <FacultyList faculty={faculty} onAdd={() => { setCreateRole('faculty'); setShowCreateModal(true) }} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {showCreateModal && (
        <CreateUserModal role={createRole} onClose={() => setShowCreateModal(false)}
          onSuccess={() => { setShowCreateModal(false); fetchUsers() }} />
      )}

      {showCsvModal && (
        <CsvImportModal role={createRole} onClose={() => setShowCsvModal(false)}
          onSuccess={() => { setShowCsvModal(false); fetchUsers() }} />
      )}
    </div>
  )
}

// ─── Students List ────────────────────────────────────────────
function StudentsList({ students, onAdd }) {
  const [search, setSearch] = useState('')
  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_number?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-faint)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or roll number..."
            className="pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none w-72 transition"
            style={{ background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
        </div>
        <motion.button onClick={onAdd} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 0 20px rgba(99,102,241,0.25)' }}>
          <UserPlus className="w-4 h-4" /> Add Student
        </motion.button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--table-head)' }}>
              {['Name', 'Roll Number', 'Department', 'Year', 'Section', 'Email'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-faint)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm" style={{ color: 'var(--text-faint)' }}>No students found</td></tr>
            ) : filtered.map((s) => (
              <tr key={s.id} className="border-t transition hover:bg-[var(--card-hover)]" style={{ borderColor: 'var(--border)' }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full grid place-items-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                      {s.name?.charAt(0)}
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{s.roll_number || '—'}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{s.department || '—'}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{s.year ? `Year ${s.year}` : '—'}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{s.section || '—'}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{s.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Faculty List ─────────────────────────────────────────────
function FacultyList({ faculty, onAdd }) {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <motion.button onClick={onAdd} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 0 20px rgba(99,102,241,0.25)' }}>
          <UserPlus className="w-4 h-4" /> Add Faculty
        </motion.button>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--table-head)' }}>
              {['Name', 'Staff ID', 'Department', 'Email'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-faint)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {faculty.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-sm" style={{ color: 'var(--text-faint)' }}>No faculty added yet</td></tr>
            ) : faculty.map(f => (
              <tr key={f.id} className="border-t transition hover:bg-[var(--card-hover)]" style={{ borderColor: 'var(--border)' }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full grid place-items-center text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #22d3ee, #6366f1)' }}>
                      {f.name?.charAt(0)}
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{f.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{f.staff_id || '—'}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{f.department || '—'}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{f.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Create User Modal ────────────────────────────────────────
function CreateUserModal({ role, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    department: 'CSE', year: '1', section: 'A',
    roll_number: '', staff_id: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML']

  const inputStyle = { background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text)' }

  async function handleCreate(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: authError } = await supabase.auth.admin.createUser({
        email: form.email,
        password: form.password,
        email_confirm: true
      })
      if (authError) throw authError

      const profileData = {
        id: data.user.id,
        name: form.name,
        email: form.email,
        role,
        department: form.department,
      }

      if (role === 'student') {
        profileData.year = parseInt(form.year)
        profileData.section = form.section
        profileData.roll_number = form.roll_number
      } else {
        profileData.staff_id = form.staff_id
      }

      const { error: profileError } = await supabase.from('profiles').insert(profileData)
      if (profileError) throw profileError

      onSuccess()
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md rounded-2xl p-6"
        style={{ background: 'var(--bg-soft)', border: '1px solid var(--border)' }}>

        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text)' }}>
            Add New {role === 'student' ? '🎓 Student' : '👨‍🏫 Faculty'}
          </h3>
          <button onClick={onClose} className="transition hover:rotate-90 duration-200" style={{ color: 'var(--text-faint)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Full Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe" required
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none placeholder:text-gray-500"
                style={inputStyle} />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Email *</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="student@vardhaman.org" required
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none placeholder:text-gray-500"
                style={inputStyle} />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Password *</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters" required
                  className="w-full px-3 py-2.5 pr-9 rounded-xl text-sm outline-none placeholder:text-gray-500"
                  style={inputStyle} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-faint)' }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Department *</label>
              <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {role === 'student' ? (
              <>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Year *</label>
                  <select value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
                    {['1', '2', '3', '4'].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Section *</label>
                  <select value={form.section} onChange={e => setForm({ ...form, section: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
                    {['A', 'B', 'C', 'D', 'E'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Roll Number *</label>
                  <input value={form.roll_number} onChange={e => setForm({ ...form, roll_number: e.target.value })}
                    placeholder="25881A0001" required
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none placeholder:text-gray-500"
                    style={inputStyle} />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Staff ID *</label>
                <input value={form.staff_id} onChange={e => setForm({ ...form, staff_id: e.target.value })}
                  placeholder="VCE001" required
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none placeholder:text-gray-500"
                  style={inputStyle} />
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-400 text-xs px-3 py-2 rounded-lg"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition"
              style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              Cancel
            </button>
            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : `Create ${role === 'student' ? 'Student' : 'Faculty'}`}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}