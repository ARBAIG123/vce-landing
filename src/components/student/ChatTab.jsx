import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, Sparkles } from 'lucide-react'

const SYSTEM_PROMPT = `You are the AI assistant for VCE Tracker, a college management system for Vardhaman College of Engineering. You help students with:
1. Attendance calculations (minimum 80% required)
2. CGPA/GPA calculations (O=10, A+=9, A=8, B+=7, B=6, C=5, F=0)
3. How to use the dashboard features
4. General academic advice

Formulas:
- Attendance % = (Present / Total) × 100
- Recovery = (0.8 × Total - Present) / 0.2
- SGPA = Sum(Grade Points × Credits) / Sum(Credits)

Keep responses concise and friendly. Decline unrelated questions politely.`

const SUGGESTIONS = [
  "How many classes do I need to reach 80%?",
  "Calculate my SGPA for this semester",
  "What is the difference between SGPA and CGPA?",
  "How does attendance affect my exam eligibility?",
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Good night'
}

function formatMsg(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(99,102,241,0.2);padding:1px 5px;border-radius:4px;font-size:0.85em">$1</code>')
    .replace(/\n/g, '<br/>')
}

export default function ChatTab() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function send(text) {
    const t = (text || input).trim()
    if (!t || loading) return
    setShowSuggestions(false)
    const newMessages = [...messages, { role: 'user', content: t }]
    setMessages([...newMessages, { role: 'assistant', content: '' }])
    setInput('')
    setLoading(true)

    let assistantText = ''
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, systemPrompt: SYSTEM_PROMPT })
      })
      if (!response.ok) throw new Error(`API error ${response.status}`)
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const lines = decoder.decode(value).split('\n')
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') continue
          try {
            const t = JSON.parse(data).candidates?.[0]?.content?.parts?.[0]?.text || ''
            if (t) {
              assistantText += t
              setMessages(prev => {
                const copy = [...prev]
                copy[copy.length - 1] = { role: 'assistant', content: assistantText }
                return copy
              })
            }
          } catch {}
        }
      }
    } catch (err) {
      setMessages(prev => {
        const copy = [...prev]
        copy[copy.length - 1] = { role: 'assistant', content: `Sorry, something went wrong. Please try again.` }
        return copy
      })
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 100px)', maxHeight: 700 }}>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl grid place-items-center"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>VCE AI Assistant</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs" style={{ color: 'var(--text-faint)' }}>Online — asks about attendance & CGPA</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
            <div className="inline-flex items-center gap-2 mb-2 text-sm font-semibold" style={{ color: 'var(--text)' }}>
              <Sparkles className="w-4 h-4 text-indigo-400" />
              {getGreeting()}! How can I help?
            </div>
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
              Ask me about attendance, CGPA calculations, or dashboard features
            </p>
          </motion.div>
        )}

        {messages.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-xl grid place-items-center flex-shrink-0 mt-0.5"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
              style={{
                background: m.role === 'user' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--card)',
                border: m.role === 'user' ? 'none' : '1px solid var(--border)',
                color: m.role === 'user' ? 'white' : 'var(--text)',
                borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
              }}
              dangerouslySetInnerHTML={{ __html: m.content ? formatMsg(m.content) : loading && i === messages.length - 1 ? '<span style="opacity:0.5">Thinking...</span>' : '' }}
            />
          </motion.div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="flex flex-wrap gap-2 mb-3">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => send(s)}
                className="text-xs px-3 py-1.5 rounded-full transition hover:scale-105"
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8' }}>
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="flex gap-2 items-end rounded-2xl p-2"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px' }}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Ask about attendance, CGPA..."
          rows={1}
          className="flex-1 text-sm outline-none resize-none px-2 py-1.5"
          style={{ background: 'transparent', color: 'var(--text)', maxHeight: 100 }}
        />
        <motion.button onClick={() => send()} disabled={!input.trim() || loading}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="w-9 h-9 rounded-xl grid place-items-center flex-shrink-0"
          style={{
            background: input.trim() && !loading ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--input-bg)',
            color: input.trim() && !loading ? 'white' : 'var(--text-faint)'
          }}>
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}