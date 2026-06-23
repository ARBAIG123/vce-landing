import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, ClipboardList, CalendarCheck, FileBarChart, ListChecks, GraduationCap, LogOut, Sun, Moon } from 'lucide-react'
import SignOutConfirm from '../SignOutConfirm'

export default function FacultySidebar({ active, setActive, theme, toggleTheme, user, onLogout }) {
    const [showSignOut, setShowSignOut] = useState(false)
  const items = [
    { id: 'students', label: 'Students', icon: Users },
    { id: 'marks', label: 'Enter Marks', icon: ClipboardList },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'assignments', label: 'Assignments', icon: ListChecks },
  ]

  return (
    <div className="hidden lg:flex flex-col w-60 flex-shrink-0 border-r p-4"
      style={{ height: '100vh', position: 'sticky', top: 0, borderColor: 'var(--border)', background: 'var(--bg-soft)' }}>

      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg grid place-items-center"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
          <GraduationCap className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>VCE Tracker</div>
          <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Faculty Portal</div>
        </div>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        {items.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)}
            className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left"
            style={{ color: active === item.id ? 'white' : 'var(--text-muted)' }}>
            {active === item.id && (
              <motion.div layoutId="facultySidebar" className="absolute inset-0 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }} />
            )}
            <item.icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="border-t pt-3 mt-3 space-y-1" style={{ borderColor: 'var(--border)' }}>
        <button onClick={() => setShowSignOut(true)}
  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition hover:bg-red-500/10 hover:text-red-400"
  style={{ color: 'var(--text-muted)' }}>
  <LogOut className="w-4 h-4" /> Sign Out
</button>
        <AnimatePresence>
  {showSignOut && (
    <SignOutConfirm onConfirm={onLogout} onCancel={() => setShowSignOut(false)} />
  )}
</AnimatePresence>
      </div>
    </div>
  )
}