import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import {
  TrendingUp, Target, Trophy, Calculator, AlertTriangle, Zap,
  Globe, Bookmark, MousePointerClick, BarChart3,
  Mail, Bug, Lightbulb, ArrowRight, GraduationCap, Sparkles,
} from 'lucide-react'
import { supabase } from './supabase'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import FacultyDashboard from './pages/FacultyDashboard'
import AdminDashboard from './pages/AdminDashboard'

const BOOKMARKLET = `javascript:(function(){const s=document.createElement('script');s.src='https://vce-tracker.vercel.app/bookmarklet.js?t='+Date.now();document.body.appendChild(s);})();`

// ─── Stars ────────────────────────────────────────────────────
function Stars() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 0.5, delay: Math.random() * 4,
  }))
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map(s => (
        <span key={s.id} className="absolute rounded-full bg-white animate-twinkle"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }} />
      ))}
    </div>
  )
}

// ─── Orbs ─────────────────────────────────────────────────────
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent 60%)' }}
        animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute -top-20 -right-32 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #a855f7, transparent 60%)' }}
        animate={{ x: [0, -60, 0], y: [0, 80, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }} />
    </div>
  )
}

// ─── Scroll Progress ──────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return (
    <motion.div style={{ scaleX, background: 'linear-gradient(90deg, #6366f1, #a855f7, #22d3ee)' }}
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60]" />
  )
}

// ─── Nav ──────────────────────────────────────────────────────
function Nav({ onLoginClick }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', f)
    return () => window.removeEventListener('scroll', f)
  }, [])

  return (
    <motion.header initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
      <div className="mx-auto max-w-6xl px-4">
        <div className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 ${scrolled ? 'glass' : 'bg-transparent'}`}>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl blur-md opacity-60"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }} />
              <div className="relative w-9 h-9 rounded-xl grid place-items-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-white">VCE Tracker</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#how" className="hover:text-white transition">How it works</a>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </nav>
          <button onClick={onLoginClick}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            Sign In <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────
function Hero({ onLoginClick }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-20">
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />
      <Stars />
      <FloatingOrbs />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-gray-400 mb-8">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Built for Vardhaman Students
        </motion.div>

        <h1 className="font-display font-bold tracking-tighter text-5xl sm:text-7xl md:text-8xl leading-tight mb-6">
          <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="block text-white">Track Your</motion.span>
          <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
            className="block text-gradient">Attendance & CGPA</motion.span>
          <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
            className="block text-white">Instantly.</motion.span>
        </h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-gray-400 leading-relaxed mb-10">
          No manual entry. No guesswork. One click and see your real-time attendance,
          safe bunk count, and CGPA — pulled directly from the VCE portal.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-16">
          <motion.a href={BOOKMARKLET} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
            <Bookmark className="w-4 h-4" /> VCE Tracker — Drag to Bookmarks
          </motion.a>
          <button onClick={onLoginClick}
            className="inline-flex items-center gap-1.5 rounded-full glass px-6 py-3.5 text-sm font-medium text-white hover:bg-white/10 transition">
            Sign In to Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.85 }}
          className="mx-auto max-w-3xl glass rounded-3xl p-2"
          style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.6)' }}>
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {[
              { v: '75%', l: 'Minimum attendance' },
              { v: '1 click', l: 'To see all your data' },
              { v: '0 logins', l: 'No separate account' },
            ].map((s, i) => (
              <div key={i} className="px-4 py-6 text-center">
                <div className="font-display text-3xl sm:text-4xl font-bold text-gradient">{s.v}</div>
                <div className="mt-1 text-xs text-gray-500">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
          className="w-7 h-7 rounded-full border border-white/20 grid place-items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────
const steps = [
  { n: '01', icon: Globe, title: 'Visit VCE Portal', text: 'Go to student.vardhaman.org and log in with your college credentials as you normally would.' },
  { n: '02', icon: Bookmark, title: 'Save the Bookmark', text: 'Drag the VCE Tracker button from our homepage to your browser bookmarks bar. One-time setup.' },
  { n: '03', icon: MousePointerClick, title: 'Click While on Portal', text: 'While logged into the VCE portal, click the bookmark. It reads your data instantly using your session.' },
  { n: '04', icon: BarChart3, title: 'See Your Dashboard', text: 'Your attendance, safe bunk count, CGPA and subject-wise breakdown loads in a beautiful dashboard.' },
]

function HowItWorks() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 20%'] })
  const lineHeight = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '100%']), { stiffness: 60, damping: 20 })

  return (
    <section id="how" className="relative py-32 px-6">
      <SectionHeader eyebrow="How It Works"
        title={<>Your Smart <span className="text-gradient">Student Journey</span></>}
        subtitle="From portal to insights — your academic data in under a minute." />
      <div ref={ref} className="relative mt-20 max-w-4xl mx-auto">
        <div className="absolute left-7 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-px" />
        <motion.div className="absolute left-7 md:left-1/2 top-0 w-px md:-translate-x-px"
          style={{ height: lineHeight, background: 'linear-gradient(to bottom, #6366f1, #a855f7, transparent)', boxShadow: '0 0 20px rgba(99,102,241,0.5)' }} />
        <div className="space-y-16">
          {steps.map((s, i) => <StepRow key={s.n} step={s} index={i} />)}
        </div>
      </div>
    </section>
  )
}

function StepRow({ step, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-30% 0px -30% 0px' })
  const Icon = step.icon
  const left = index % 2 === 0

  return (
    <div ref={ref} className="relative md:grid md:grid-cols-2 md:gap-12 items-center">
      <div className="absolute left-7 md:left-1/2 top-6 -translate-x-1/2 z-10">
        <motion.div
          animate={inView ? { scale: 1.3, boxShadow: '0 0 30px #6366f1' } : { scale: 1, boxShadow: '0 0 0px #6366f1' }}
          transition={{ duration: 0.4 }}
          className="w-4 h-4 rounded-full ring-4 ring-gray-950"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }} />
      </div>
      <motion.div initial={{ opacity: 0, x: left ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-15% 0px' }} transition={{ duration: 0.6 }}
        className={`pl-16 md:pl-0 ${left ? '' : 'md:col-start-2'}`}>
        <div className="glass rounded-2xl p-6 hover:-translate-y-1 transition">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl grid place-items-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-3xl font-bold text-white/20">{step.n}</span>
          </div>
          <h3 className="mt-4 font-display text-xl font-semibold text-white">{step.title}</h3>
          <p className="mt-2 text-sm text-gray-400 leading-relaxed">{step.text}</p>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Features ─────────────────────────────────────────────────
const features = [
  { icon: TrendingUp, title: 'Live Attendance', text: 'Subject-wise attendance percentages pulled directly from your VCE portal in real time.', grad: 'from-indigo-500 to-cyan-400' },
  { icon: Target, title: 'Safe Bunk Count', text: 'Know exactly how many classes you can skip while staying safely above the 75% threshold.', grad: 'from-purple-500 to-indigo-500' },
  { icon: Trophy, title: 'CGPA Insights', text: 'Track your CPI semester by semester and log individual assessment marks per subject.', grad: 'from-cyan-400 to-purple-500' },
  { icon: Calculator, title: 'CGPA Calculator', text: 'Predict your next semester CGPA by entering subjects, credits and expected grades.', grad: 'from-indigo-500 to-purple-500' },
  { icon: AlertTriangle, title: 'At Risk Alerts', text: 'Color-coded indicators show which subjects need immediate attention before it is too late.', grad: 'from-purple-500 to-cyan-400' },
  { icon: Zap, title: 'One Click', text: 'No separate login, no manual input. One bookmark click and everything loads instantly.', grad: 'from-cyan-400 to-indigo-500' },
]

function Features() {
  return (
    <section id="features" className="relative py-32 px-6">
      <SectionHeader eyebrow="Features"
        title={<>Everything <span className="text-gradient">You Need</span></>}
        subtitle="Built with one goal — surfacing the academic signals that actually matter." />
      <div className="mt-16 max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => <FeatureCard key={f.title} f={f} i={i} />)}
      </div>
    </section>
  )
}

function FeatureCard({ f, i }) {
  const ref = useRef(null)
  const [mouse, setMouse] = useState({ x: '50%', y: '50%' })
  const Icon = f.icon
  const handleMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    setMouse({ x: `${e.clientX - r.left}px`, y: `${e.clientY - r.top}px` })
  }
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: 0.5, delay: i * 0.06 }}
      ref={ref} onMouseMove={handleMove} whileHover={{ y: -6 }}
      className="group relative glass rounded-3xl p-7 overflow-hidden transition-transform duration-300"
      style={{ background: `radial-gradient(400px circle at ${mouse.x} ${mouse.y}, rgba(99,102,241,0.15), transparent 60%), rgba(255,255,255,0.03)` }}>
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.grad} grid place-items-center`}
        style={{ boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold text-white">{f.title}</h3>
      <p className="mt-2 text-sm text-gray-400 leading-relaxed">{f.text}</p>
      <div className="absolute -bottom-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
    </motion.div>
  )
}

// ─── CGPA CTA ─────────────────────────────────────────────────
function CalcCTA() {
  return (
    <section className="relative py-24 px-6">
      <div className="relative max-w-5xl mx-auto glass rounded-[2rem] overflow-hidden"
        style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.6)' }}>
        <div className="absolute inset-0 opacity-50"
          style={{ background: 'radial-gradient(ellipse at top right, #a855f7, transparent 60%), radial-gradient(ellipse at bottom left, #6366f1, transparent 60%)' }} />
        <div className="relative grid md:grid-cols-2 gap-10 p-10 md:p-14 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-medium text-cyan-400 uppercase tracking-widest">
              <Calculator className="w-3.5 h-3.5" /> CGPA Calculator
            </span>
            <h3 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-white">
              Predict your next semester <span className="text-gradient">CGPA</span>.
            </h3>
            <p className="mt-4 text-gray-400 max-w-md">
              Enter subjects, credits and expected grades — see exactly where you will land before the marks are out.
            </p>
            <motion.a href="https://vce-tracker.vercel.app/cgpa.html" target="_blank" rel="noreferrer"
              whileHover={{ scale: 1.03 }}
              className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}>
              Try Calculator <ArrowRight className="w-4 h-4" />
            </motion.a>
          </div>
          <MiniCalcMock />
        </div>
      </div>
    </section>
  )
}

function MiniCalcMock() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span>Semester 2</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>
      <div className="font-display text-5xl font-bold text-gradient mb-1">8.75</div>
      <div className="text-xs text-gray-500 mb-5">Predicted CGPA</div>
      <div className="space-y-3">
        {[
          { s: 'Data Structures', g: 'A+', w: 90 },
          { s: 'Operating Systems', g: 'A', w: 80 },
          { s: 'DBMS', g: 'O', w: 98 },
          { s: 'Algorithms', g: 'B+', w: 70 },
        ].map((r, i) => (
          <motion.div key={r.s} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 text-xs">
            <span className="w-32 truncate text-gray-400">{r.s}</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div initial={{ width: 0 }} whileInView={{ width: `${r.w}%` }}
                viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
            </div>
            <span className="w-6 text-right font-semibold text-white">{r.g}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Contact ──────────────────────────────────────────────────
const contacts = [
  { icon: Mail, title: 'Email Us', text: 'Send feedback, bug reports, or suggestions', action: 'vcetracker@gmail.com', href: 'mailto:vcetracker@gmail.com' },
  { icon: Bug, title: 'Report a Bug', text: 'Something not working? Let us know ASAP', action: 'Report Issue', href: 'mailto:vcetracker@gmail.com?subject=Bug%20Report' },
  { icon: Lightbulb, title: 'Suggest a Feature', text: 'Have an idea to make VCE Tracker better?', action: 'Share Idea', href: 'mailto:vcetracker@gmail.com?subject=Feature%20Idea' },
]

function Contact() {
  return (
    <section id="contact" className="relative py-32 px-6">
      <SectionHeader eyebrow="Contact"
        title={<>Get In <span className="text-gradient">Touch</span></>}
        subtitle="Found a bug? Have a suggestion? We'd love to hear from you." />
      <div className="mt-16 max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
        {contacts.map((c, i) => {
          const Icon = c.icon
          return (
            <motion.a key={c.title} href={c.href}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }} className="group glass rounded-3xl p-7 block">
              <div className="w-12 h-12 rounded-2xl grid place-items-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-white">{c.title}</h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">{c.text}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-400 group-hover:gap-2.5 transition-all">
                {c.action} <ArrowRight className="w-4 h-4" />
              </div>
            </motion.a>
          )
        })}
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative border-t border-white/10 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg grid place-items-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-white">VCE Tracker</span>
        </div>
        <p className="text-xs text-gray-500">
          Made with <span className="text-purple-400">♥</span> for Vardhaman students · Not affiliated with VCE
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <a href="https://vce-tracker.vercel.app/privacy.html" className="hover:text-white transition">Privacy</a>
          <a href="https://vce-tracker.vercel.app/terms.html" className="hover:text-white transition">Terms</a>
          <a href="mailto:vcetracker@gmail.com" className="hover:text-white transition">Contact</a>
        </div>
      </div>
      <div className="text-center pb-6 text-xs text-gray-600">
        © 2026 VCE Tracker · Built for Vardhaman College of Engineering
      </div>
    </footer>
  )
}

// ─── Section Helper ───────────────────────────────────────────
function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">{eyebrow}</motion.span>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="mt-3 font-display text-4xl md:text-6xl font-bold tracking-tighter text-white">{title}</motion.h2>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-4 text-gray-400">{subtitle}</motion.p>
    </div>
  )
}

// ─── Landing Page ─────────────────────────────────────────────
function LandingPage({ onLoginClick }) {
  return (
    <div className="relative min-h-screen overflow-x-clip" style={{ background: '#0a0a0f' }}>
      <ScrollProgress />
      <Nav onLoginClick={onLoginClick} />
      <main>
        <Hero onLoginClick={onLoginClick} />
        <HowItWorks />
        <Features />
        <CalcCTA />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single()
          .then(({ data }) => { setUser(data); setLoading(false) })
      } else {
        setLoading(false)
      }
    })
  }, [])

  if (loading) return (
    <div className="min-h-screen grid place-items-center" style={{ background: '#0a0a0f' }}>
      <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  )

  if (showLogin || user) {
    if (!user) return <Login onLogin={setUser} />
    if (user.role === 'admin')
  return <AdminDashboard user={user} onLogout={() => setUser(null)} />
if (user.role === 'faculty')
  return <FacultyDashboard user={user} onLogout={() => setUser(null)} />
    return <StudentDashboard user={user} onLogout={() => setUser(null)} />
  }

  return <LandingPage onLoginClick={() => setShowLogin(true)} />
}