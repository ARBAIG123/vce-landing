import { useState } from 'react'
import { Send } from 'lucide-react'

const SYSTEM_PROMPT = `You are the AI assistant for VCE Tracker, a college management system for Vardhaman College of Engineering. You help students with:
1. Attendance calculations, percentages, recovery strategies (minimum required attendance is 80%)
2. CGPA/GPA calculations and grade points (O=10, A+=9, A=8, B+=7, B=6, C=5, F=0)
3. How to use the dashboard — Dashboard tab shows stats and subject attendance, Calendar tab shows official daily attendance per subject, CGPA tab is a predictive calculator, this Chat tab is you
4. General academic advice and study tips

Formulas:
- Attendance % = (Present / Total) × 100
- Classes needed to recover = (0.8 × Total - Present) / 0.2
- SGPA = Sum(Grade Points × Credits) / Sum(Credits)

If asked something unrelated to academics or the platform, politely decline and redirect. Keep responses concise and friendly.`

export default function ChatTab() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your VCE Tracker AI. Ask me about attendance, CGPA, or how to use the dashboard." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    const newMessages = [...messages, { role: 'user', content: text }]
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
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              const t = parsed.candidates?.[0]?.content?.parts?.[0]?.text || ''
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
      }
    } catch (err) {
      setMessages(prev => {
        const copy = [...prev]
        copy[copy.length - 1] = { role: 'assistant', content: `Error: ${err.message}` }
        return copy
      })
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
      <h2 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>AI Assistant</h2>
      <p className="text-sm mb-4" style={{ color: 'var(--text-faint)' }}>Ask about attendance, CGPA, or the dashboard</p>

      <div className="flex-1 overflow-y-auto rounded-2xl p-4 mb-4 space-y-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
              style={{
                background: m.role === 'user' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--input-bg)',
                color: m.role === 'user' ? 'white' : 'var(--text)'
              }}>
              {m.content || (loading && i === messages.length - 1 ? '...' : '')}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask something..."
          className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
          style={{ background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
        <button onClick={send} disabled={loading}
          className="px-4 py-3 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}