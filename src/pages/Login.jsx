import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabase'
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react'

export default function Login({ onLogin, onBack }) {
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
    if (error) { setError(error.message); setLoading(false); return }

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
    if (profile) onLogin(profile)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#0a0a0f' }}>

      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 60%)' }}
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute -bottom-20 -right-32 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent 60%)' }}
          animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10">

        {/* Back button */}
        {onBack && (
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm mb-6 transition hover:opacity-70"
            style={{ color: 'rgba(255,255,255,0.4)' }}>
            <ArrowLeft className="w-4 h-4" /> Back to home
          </button>
        )}

        {/* Card */}
        <div className="rounded-3xl p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl grid place-items-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-white">VCE Tracker</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Vardhaman College of Engineering</div>
            </div>
          </div>

          <h2 className="font-display text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-sm mb-7" style={{ color: 'rgba(255,255,255,0.4)' }}>Sign in to your academic portal</p>

          {/* Role Toggle */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {['student', 'faculty'].map(r => (
              <button key={r} onClick={() => setRole(r)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200"
                style={{
                  background: role === r ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent',
                  color: role === r ? 'white' : 'rgba(255,255,255,0.4)',
                  boxShadow: role === r ? '0 0 20px rgba(99,102,241,0.3)' : 'none'
                }}>
                {r === 'student' ? '🎓 Student' : '👨‍🏫 Faculty'}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder={role === 'student' ? 'student@vardhaman.org' : 'faculty@vardhaman.org'}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-white outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-xs px-3 py-2 rounded-lg"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 mt-2"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 0 30px rgba(99,102,241,0.3)' }}>
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.2)' }}>
          © 2026 VCE Tracker · Vardhaman College of Engineering
        </p>
      </motion.div>
    </div>
  )
}