import { motion } from 'framer-motion'
import { GraduationCap, LogOut, Users, BookOpen, BarChart3, Bell } from 'lucide-react'
import { supabase } from '../supabase'

export default function FacultyDashboard({ user, onLogout }) {
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
            <div className="text-xs text-gray-500">Faculty Portal</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">👨‍🏫 {user.name}</span>
          <button onClick={async () => { await supabase.auth.signOut(); onLogout() }}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Welcome, {user.name?.split(' ')[0]}! 👨‍🏫
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            {user.department} · Staff ID: {user.staff_id}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: 'Total Students', value: '0', color: '#6366f1' },
              { icon: BookOpen, label: 'Subjects', value: '0', color: '#22d3ee' },
              { icon: BarChart3, label: 'Avg Performance', value: '--', color: '#a855f7' },
              { icon: Bell, label: 'Pending Tasks', value: '0', color: '#f59e0b' },
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

          <div className="grid lg:grid-cols-3 gap-4">
            {[
              { title: '👥 View Students', desc: 'Browse by branch, year and section', soon: false },
              { title: '📝 Enter Marks', desc: 'Add exam scores for your students', soon: true },
              { title: '📄 Generate Reports', desc: 'Runners and peak performers list', soon: true },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="rounded-2xl p-6 cursor-pointer hover:-translate-y-1 transition-transform"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <h3 className="font-semibold text-white mb-1">{card.title}</h3>
                <p className="text-xs text-gray-500">{card.desc}</p>
                {card.soon && (
                  <span className="inline-block mt-3 text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8' }}>
                    Coming soon
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}