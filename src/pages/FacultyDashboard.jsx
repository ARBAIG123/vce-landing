import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabase'
import { useTheme } from '../ThemeContext'
import { GraduationCap, LogOut, Sun, Moon, Users, ClipboardList, CalendarCheck, FileBarChart, ListChecks } from 'lucide-react'
import BrowseStudents from '../components/faculty/BrowseStudents'
import MarksEntry from '../components/faculty/MarksEntry'
import AttendanceEntry from '../components/faculty/AttendanceEntry'
import Reports from '../components/faculty/Reports'
import Assignments from '../components/faculty/Assignments'

export default function FacultyDashboard({ user, onLogout }) {
  const { theme, toggle } = useTheme()
  const [activeTab, setActiveTab] = useState('students')

  const tabs = [
    { id: 'students', label: 'Students', icon: Users },
    { id: 'marks', label: 'Marks', icon: ClipboardList },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'assignments', label: 'Assignments', icon: ListChecks },
  ]

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg)' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl" style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold font-display" style={{ color: 'var(--text)' }}>VCE Tracker</div>
            <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Faculty Portal</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="w-9 h-9 rounded-xl grid place-items-center transition hover:scale-105" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>
          <span className="text-sm hidden sm:block" style={{ color: 'var(--text-muted)' }}>👨‍🏫 {user.name}</span>
          <button onClick={async () => { await supabase.auth.signOut(); onLogout() }} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl transition hover:border-red-400/40 hover:text-red-400" style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit overflow-x-auto" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap" style={{ color: activeTab === tab.id ? 'white' : 'var(--text-muted)' }}>
              {activeTab === tab.id && <motion.div layoutId="facTab" className="absolute inset-0 rounded-lg" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }} transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }} />}
              <tab.icon className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            {activeTab === 'students' && <BrowseStudents />}
            {activeTab === 'marks' && <MarksEntry />}
            {activeTab === 'attendance' && <AttendanceEntry />}
            {activeTab === 'reports' && <Reports />}
            {activeTab === 'assignments' && <Assignments user={user} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}