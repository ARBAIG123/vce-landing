import { motion, AnimatePresence } from 'framer-motion'
import { LogOut } from 'lucide-react'

export default function SignOutConfirm({ onConfirm, onCancel }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(16px)', background: 'rgba(0,0,0,0.5)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ duration: 0.25 }}
        className="w-full max-w-sm rounded-3xl p-8 text-center"
        style={{ background: 'var(--bg-soft)', border: '1px solid var(--border)' }}>
        <div className="w-14 h-14 rounded-2xl grid place-items-center mx-auto mb-5"
          style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}>
          <LogOut className="w-6 h-6" style={{ color: '#f43f5e' }} />
        </div>
        <h3 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Sign Out?</h3>
        <p className="text-sm mb-7" style={{ color: 'var(--text-faint)' }}>
          You'll be returned to the home page. Your data is saved and you can sign back in anytime.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl text-sm font-semibold transition hover:opacity-80"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)' }}>
            Sign Out
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}