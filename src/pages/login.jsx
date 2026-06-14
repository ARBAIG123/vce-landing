import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabase'
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [role, setRole] = useState('student')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profile) onLogin(profile)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0f' }}>

      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center p-12"
        style={{ background: 'linear-gradient(135deg, #0d0d1a, #111128)' }}>
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-md"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl grid place-items-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">VCE Tracker</span>
          </div>

          <h1 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
            Smart Academic<br />
            <span className="text-gradient">Management System</span>
          </h1>

          <p className="text-gray-400 mb-10 leading-relaxed text-sm">
            Track attendance, monitor performance, generate reports and manage academic data for Vardhaman College of Engineering.
          </p>

          <div className="space-y-3">
            {[
              { icon: '📊', title: 'Performance Analytics', text: 'Visual graphs for every student' },
              { icon: '📋', title: 'Marks Management', text: 'Enter and track marks across all exams' },
              { icon: '🚨', title: 'Smart Alerts', text: 'Red flag notifications for low attendance' },
              { icon: '📄', title: 'Report Generation', text: 'Instant reports for any section' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-white">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.text}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl grid place-items-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">VCE Tracker</span>
          </div>

          <h2 className="font-display text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-gray-400 mb-8 text-sm">Sign in to your account to continue</p>

          {/* Role Toggle */}
          <div className="flex gap-2 mb-8 p-1 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {['student', 'faculty'].map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200"
                style={{
                  background: role === r ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent',
                  color: role === r ? 'white' : '#6b7280'
                }}
              >
                {r === 'student' ? '🎓 Student' : '👨‍🏫 Faculty'}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm px-3 py-2 rounded-lg"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 mt-2"
              style={{
                background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #a855f7)',
                boxShadow: '0 0 30px rgba(99,102,241,0.3)'
              }}
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <>Sign In <ArrowRight className="w-4 h-4" /></>
              }
            </motion.button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-8">
            © 2026 VCE Tracker · Vardhaman College of Engineering
          </p>
        </motion.div>
      </div>
    </div>
  )
}