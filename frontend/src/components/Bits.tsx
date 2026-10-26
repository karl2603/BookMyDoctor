import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { CalendarDays, Clock, MapPin } from 'lucide-react'
import { fmtTime, type Booking } from '../api'

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  )
}

const tints = [
  'from-[#f34259] to-[#ff7a8f]', 'from-[#372e37] to-[#6a5d6c]',
  'from-[#0f9b8e] to-[#3cc9b8]', 'from-[#f08a24] to-[#f7b955]',
]
export function Avatar({ name, size = 'h-14 w-14 text-xl' }: { name: string; size?: string }) {
  const i = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % tints.length
  return (
    <div className={`${size} ${tints[i]} grid shrink-0 place-items-center rounded-2xl bg-gradient-to-br font-display font-bold text-white shadow-soft`}>
      {name.slice(0, 1).toUpperCase()}
    </div>
  )
}

export function StatusPill({ status }: { status: string }) {
  const good = status === 'AVAILABLE' || status === 'CONFIRMED'
  const cls = good ? 'bg-ok-50 text-ok' : status === 'CANCELLED' ? 'bg-brand-50 text-brand' : 'bg-[#f1eef0] text-mute'
  const label = status.charAt(0) + status.slice(1).toLowerCase()
  return <span className={`pill ${cls}`}>{label}</span>
}

export function Ticket({ b }: { b: Booking }) {
  const d = new Date(b.startTime)
  return (
    <article className="group card flex overflow-hidden transition duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex w-24 shrink-0 flex-col items-center justify-center bg-brand-50 px-3 py-6 text-brand sm:w-28">
        <span className="text-xs font-semibold uppercase tracking-[0.18em]">{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
        <span className="font-display text-5xl font-bold leading-none">{d.getDate()}</span>
        <span className="mt-1 text-xs font-medium text-brand/70">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
      </div>
      <div className="relative flex min-w-0 flex-1 flex-col justify-between gap-4 border-l border-dashed border-line p-5 sm:flex-row sm:items-center sm:p-6">
        <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full border border-line bg-bg" />
        <span className="absolute -bottom-2.5 -left-2.5 h-5 w-5 rounded-full border border-line bg-bg" />
        <div className="min-w-0">
          <h3 className="truncate font-display text-xl font-semibold">{b.doctorName}</h3>
          <p className="mt-1.5 flex items-start gap-1.5 text-sm text-mute"><MapPin size={15} className="mt-0.5 shrink-0" />{b.clinicName} · {b.clinicAddress}</p>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold"><Clock size={15} className="text-brand" />{fmtTime(b.startTime)} – {fmtTime(b.endTime)}</p>
        </div>
        <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
          <StatusPill status={b.status} />
          <span className="flex items-center gap-1 text-xs text-mute"><CalendarDays size={13} />Ref #{b.id}</span>
        </div>
      </div>
    </article>
  )
}
