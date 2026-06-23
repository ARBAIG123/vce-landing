import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import SignOutConfirm from '../SignOutConfirm'
import { motion } from 'framer-motion'
import { LayoutDashboard, CalendarDays, Calculator, Bot, GraduationCap, LogOut, Sun, Moon } from 'lucide-react'
import NotificationPopup from './NotificationPopup'

const [showSignOut, setShowSignOut] = useState(false)

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Good night'
}

export default function Sidebar({ active, setActive, theme, toggleTheme, user, onLogout }) {
  const items = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'cgpa', label: 'CGPA Calculator', icon: Calculator },
    { id: 'chat', label: 'AI Assistant', icon: Bot },
  ]

  return (
    <div className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r p-4"
      style={{ height: '100vh', position: 'sticky', top: 0, borderColor: 'var(--border)', background: 'var(--bg-soft)' }}>

      {/* Logo + greeting */}
      <div className="px-2 mb-8">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg grid place-items-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>VCE Tracker</span>
        </div>
        <div className="rounded-xl p-3 flex items-center gap-2.5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
  <img src="/vce-logo.png" alt="VCE" className="w-9 h-9 rounded-lg object-contain flex-shrink-0"
    style={{ background: 'white', padding: '2px' }}
    onError={e => { e.target.style.display='none' }} />
  <div className="min-w-0">
    <div className="text-xs font-bold truncate" style={{ color: 'var(--text)' }}>Vardhaman College</div>
    <div className="text-xs truncate" style={{ color: 'var(--text-faint)' }}>{user.department} · {user.roll_number}</div>
  </div>
</div>
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-1 flex-1">
        {items.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)}
            className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left"
            style={{ color: active === item.id ? 'white' : 'var(--text-muted)' }}>
            {active === item.id && (
              <motion.div layoutId="studentSidebar" className="absolute inset-0 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }} />
            )}
            <item.icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Bottom controls */}
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
  )
}