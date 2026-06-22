import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabase'
import { useTheme } from '../ThemeContext'
import { Users, ClipboardList, CalendarCheck, FileBarChart, ListChecks } from 'lucide-react'
import FacultySidebar from '../components/faculty/FacultySidebar'
import BrowseStudents from '../components/faculty/BrowseStudents'
import MarksEntry from '../components/faculty/MarksEntry'
import AttendanceEntry from '../components/faculty/AttendanceEntry'
import Reports from '../components/faculty/Reports'
import Assignments from '../components/faculty/Assignments'

export default function FacultyDashboard({ user, onLogout }) {
  const { theme, toggle } = useTheme()
  const [activeTab, setActiveTab] = useState('students')

  const mobileItems = [
    { id: 'students', icon: Users },
    { id: 'marks', icon: ClipboardList },
    { id: 'attendance', icon: CalendarCheck },
    { id: 'reports', icon: FileBarChart },
    { id: 'assignments', icon: ListChecks },
  ]

  return (
    <div className="flex min-h-screen transition-colors duration-300" style={{ background: 'var(--bg)' }}>
      <FacultySidebar
        active={activeTab} setActive={setActiveTab}
        theme={theme} toggleTheme={toggle} user={user}
        onLogout={async () => { await supabase.auth.signOut(); onLogout() }}
      />

      <div className="flex-1 px-5 sm:px-8 py-6 pb-24 lg:pb-6 max-w-6xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            {activeTab === 'students' && <BrowseStudents />}
            {activeTab === 'marks' && <MarksEntry />}
            {activeTab === 'attendance' && <AttendanceEntry />}
            {activeTab === 'reports' && <Reports />}
            {activeTab === 'assignments' && <Assignments user={user} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t flex z-40 backdrop-blur-xl"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}>
        {mobileItems.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)}
            className="flex-1 flex flex-col items-center justify-center py-3"
            style={{ color: activeTab === item.id ? '#6366f1' : 'var(--text-faint)' }}>
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  )
}