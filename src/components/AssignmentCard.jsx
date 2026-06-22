import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ChevronDown, Trash2 } from 'lucide-react'

function Linkify({ text }) {
  if (!text) return null
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)
  return (
    <>
      {parts.map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a key={i} href={part} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
            className="underline break-all" style={{ color: '#818cf8' }}>{part}</a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

export default function AssignmentCard({ assignment, onDelete }) {
  const [open, setOpen] = useState(false)
  const isPastDue = new Date(assignment.deadline) < new Date()

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left">
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{assignment.title}</div>
          <div className="text-xs mt-0.5 flex items-center gap-3 flex-wrap" style={{ color: 'var(--text-faint)' }}>
            {assignment.department && <span>{assignment.department} · Year {assignment.year} · Section {assignment.section}</span>}
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(assignment.deadline).toLocaleDateString()}</span>
            {isPastDue && <span className="font-semibold" style={{ color: '#f43f5e' }}>🚨 Past due</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          {onDelete && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(assignment.id) }}
              className="p-2 rounded-lg transition hover:bg-red-500/10" style={{ color: 'var(--text-faint)' }}>
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-faint)' }} />
          </motion.div>
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
            <div className="px-4 pb-4 text-sm leading-relaxed" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
              {assignment.description ? <Linkify text={assignment.description} /> : <span style={{ color: 'var(--text-faint)' }}>No description provided</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}