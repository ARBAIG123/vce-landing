import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabase'
import { useTheme } from '../ThemeContext'
import Sidebar from '../components/student/Sidebar'
import OverviewTab from '../components/student/OverviewTab'
import CalendarTab from '../components/student/CalendarTab'
import CgpaTab from '../components/student/CgpaTab'
import ChatTab from '../components/student/ChatTab'
import { LayoutDashboard, CalendarDays, Calculator, Bot } from 'lucide-react'

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

      <div className="flex-1 px-5 sm:px-8 py-6 pb-24 lg:pb-6 max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            {active === 'overview' && <OverviewTab user={user} />}
            {active === 'calendar' && <CalendarTab user={user} />}
            {active === 'cgpa' && <CgpaTab />}
            {active === 'chat' && <ChatTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t flex z-40 backdrop-blur-xl" style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}>
        {mobileItems.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5"
            style={{ color: active === item.id ? '#6366f1' : 'var(--text-faint)' }}>
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  )
}