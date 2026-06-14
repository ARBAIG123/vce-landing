import { motion } from 'framer-motion'
import { GraduationCap, LogOut, BookOpen, TrendingUp, Bell, Calendar } from 'lucide-react'
import { supabase } from '../supabase'

export default function StudentDashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl grid place-items-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">VCE Tracker</div>
            <div className="text-xs text-gray-500">Student Portal</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">👋 {user.name}</span>
          <button onClick={async () => { await supabase.auth.signOut(); onLogout() }}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Good morning, {user.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            {user.department} · Year {user.year} · Section {user.section} · {user.roll_number}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: BookOpen, label: 'Subjects', value: '8', color: '#6366f1' },
              { icon: TrendingUp, label: 'Avg Attendance', value: '76%', color: '#22d3ee' },
              { icon: GraduationCap, label: 'Current CGPA', value: '7.25', color: '#a855f7' },
              { icon: Bell, label: 'Notifications', value: '3', color: '#f59e0b' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="w-9 h-9 rounded-xl grid place-items-center mb-3"
                  style={{ background: `${stat.color}20` }}>
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <div className="font-display text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="rounded-2xl p-8 text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Full dashboard coming soon</p>
            <p className="text-gray-600 text-xs mt-1">Marks, attendance, and performance graphs will appear here</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}