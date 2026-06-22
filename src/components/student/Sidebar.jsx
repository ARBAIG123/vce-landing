import { motion } from 'framer-motion'
import { LayoutDashboard, CalendarDays, Calculator, Bot, GraduationCap, LogOut, Sun, Moon } from 'lucide-react'

export default function Sidebar({ active, setActive, theme, toggleTheme, user, onLogout }) {
  const items = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'cgpa', label: 'CGPA Calculator', icon: Calculator },
    { id: 'chat', label: 'AI Assistant', icon: Bot },
  ]

  return (
    <div className="hidden lg:flex flex-col w-60 flex-shrink-0 border-r p-4" style={{ height: '100vh', position: 'sticky', top: 0, borderColor: 'var(--border)', background: 'var(--bg-soft)' }}>
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg grid place-items-center" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
          <GraduationCap className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>VCE Tracker</span>
      </div>

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

      <div className="border-t pt-3 mt-3 space-y-1" style={{ borderColor: 'var(--border)' }}>
        <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition hover:bg-[var(--card-hover)]" style={{ color: 'var(--text-muted)' }}>
          {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </button>
        <div className="px-3 py-2 text-xs truncate" style={{ color: 'var(--text-faint)' }}>👋 {user.name}</div>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition hover:bg-red-500/10 hover:text-red-400" style={{ color: 'var(--text-muted)' }}>
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  )
}