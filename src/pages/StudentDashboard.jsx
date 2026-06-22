import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabase'
import { useTheme } from '../ThemeContext'
import Sidebar from '../components/student/Sidebar'
import OverviewTab from '../components/student/OverviewTab'
import CalendarTab from '../components/student/CalendarTab'
import CgpaTab from '../components/student/CgpaTab'
import ChatTab from '../components/student/ChatTab'
import NotificationPopup from '../components/student/NotificationPopup'
import { LayoutDashboard, CalendarDays, Calculator, Bot, GraduationCap, Sun, Moon } from 'lucide-react'

export default function StudentDashboard({ user, onLogout }) {
  const { theme, toggle } = useTheme()
  const [active, setActive] = useState('overview')

  const mobileItems = [
    { id: 'overview', icon: LayoutDashboard },
    { id: 'calendar', icon: CalendarDays },
    { id: 'cgpa', icon: Calculator },
    { id: 'chat', icon: Bot },
  ]

  return (
    <div className="flex min-h-screen transition-colors duration-300" style={{ background: 'var(--bg)' }}>
      <Sidebar active={active} setActive={setActive} theme={theme} toggleTheme={toggle} user={user}
        onLogout={async () => { await supabase.auth.signOut(); onLogout() }} />

      <div className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-40 backdrop-blur-xl"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg grid place-items-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              <GraduationCap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>VCE Tracker</span>
          </div>
          <div className="flex items-center gap-2">
            <NotificationPopup user={user} />
            <button onClick={toggle}
              className="w-8 h-8 rounded-xl grid place-items-center"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            </button>
          </div>
        </div>

        {/* Desktop top right controls */}
        <div className="hidden lg:flex items-center gap-2 absolute top-4 right-6 z-40">
          <NotificationPopup user={user} />
          <button onClick={toggle}
            className="w-9 h-9 rounded-xl grid place-items-center transition hover:scale-105"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>
        </div>

        <div className="px-5 sm:px-8 py-6 pb-24 lg:pb-6 max-w-5xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {active === 'overview' && <OverviewTab user={user} />}
              {active === 'calendar' && <CalendarTab user={user} />}
              {active === 'cgpa' && <CgpaTab />}
              {active === 'chat' && <ChatTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t flex z-40 backdrop-blur-xl"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}>
        {mobileItems.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)}
            className="flex-1 flex flex-col items-center justify-center py-3"
            style={{ color: active === item.id ? '#6366f1' : 'var(--text-faint)' }}>
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  )
}