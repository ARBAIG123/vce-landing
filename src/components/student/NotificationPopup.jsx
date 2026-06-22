import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../supabase'
import { Bell, X, CheckCircle2 } from 'lucide-react'

export default function NotificationPopup({ user }) {
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState([])

  useEffect(() => { fetchNotifs() }, [])

  async function fetchNotifs() {
    const { data } = await supabase.from('notifications').select('*')
      .eq('student_id', user.id).eq('is_read', false)
      .order('created_at', { ascending: false })
    setNotifications(data || [])
    if (data?.length) {
      data.forEach((n, i) => {
        setTimeout(() => {
          setShown(prev => [...prev, n.id])
          setTimeout(() => {
            setShown(prev => prev.filter(id => id !== n.id))
          }, 5000)
        }, i * 500)
      })
    }
  }

  async function markRead(id) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications(prev => prev.filter(n => n.id !== id))
    setShown(prev => prev.filter(i => i !== id))
  }

  async function markAllRead() {
    const ids = notifications.map(n => n.id)
    await supabase.from('notifications').update({ is_read: true }).in('id', ids)
    setNotifications([]); setShown([]); setOpen(false)
  }

  const typeColor = { assignment: '#6366f1', attendance: '#f43f5e', marks: '#10b981', general: '#f59e0b' }
  const typeIcon = { assignment: '📋', attendance: '📅', marks: '📊', general: '🔔' }

  return (
    <>
      {/* Toast popups (auto dismiss in 5s) */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {shown.map(id => {
            const n = notifications.find(x => x.id === id)
            if (!n) return null
            return (
              <motion.div key={id}
                initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}
                className="pointer-events-auto flex items-start gap-3 rounded-2xl px-4 py-3 shadow-2xl cursor-pointer"
                style={{ background: 'var(--bg-soft)', border: '1px solid var(--border)', maxWidth: 320, minWidth: 260 }}
                onClick={() => markRead(n.id)}>
                <span style={{ fontSize: '1.2rem' }}>{typeIcon[n.type] || '🔔'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>{n.title}</div>
                  <div className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-faint)' }}>{n.message}</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setShown(prev => prev.filter(i => i !== id)) }}
                  className="mt-0.5" style={{ color: 'var(--text-faint)' }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Bell button */}
      <div className="relative">
        <button onClick={() => setOpen(!open)}
          className="relative w-9 h-9 rounded-xl grid place-items-center transition hover:scale-105"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <Bell className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white grid place-items-center"
              style={{ background: '#f43f5e', fontSize: '0.6rem', fontWeight: 700 }}>
              {notifications.length}
            </span>
          )}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, scale: 0.95, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }} transition={{ duration: 0.18 }}
              className="absolute right-0 top-11 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden"
              style={{ background: 'var(--bg-soft)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>Notifications</span>
                {notifications.length > 0 && (
                  <button onClick={markAllRead} className="text-xs font-medium flex items-center gap-1"
                    style={{ color: '#6366f1' }}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm" style={{ color: 'var(--text-faint)' }}>
                    All caught up! 🎉
                  </div>
                ) : notifications.map(n => (
                  <button key={n.id} onClick={() => markRead(n.id)}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left transition hover:bg-[var(--card-hover)]"
                    style={{ borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{typeIcon[n.type] || '🔔'}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{n.title}</div>
                      <div className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-faint)' }}>{n.message}</div>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ background: typeColor[n.type] || '#6366f1' }} />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}