import { fmtTime, type Booking } from '../api'

export default function Ticket({ b }: { b: Booking }) {
  const d = new Date(b.startTime)
  const ok = b.status === 'CONFIRMED'
  return (
    <article className="grid grid-cols-[auto_1fr_auto] border border-ink bg-card">
      <div className="bg-ink px-6 py-5 text-center text-paper">
        <div className="font-display text-5xl leading-none">{d.getDate()}</div>
        <div className="mt-2 text-xs uppercase tracking-[0.2em]">{d.toLocaleDateString('en-IN', { month: 'short' })}</div>
      </div>
      <div className="border-r border-dashed border-ink/40 px-6 py-5">
        <h3 className="font-display text-2xl">{b.doctorName}</h3>
        <p className="mt-1 text-sm text-mute">{b.clinicName} · {b.clinicAddress}</p>
        <p className="mt-3 font-mono text-sm">{fmtTime(b.startTime)} – {fmtTime(b.endTime)}</p>
      </div>
      <div className="flex flex-col items-end justify-between px-6 py-5">
        <span className={`pill ${ok ? 'border-moss text-moss' : 'border-clay text-clay'}`}>{b.status}</span>
        <span className="font-mono text-xs text-mute">#{b.id}</span>
      </div>
    </article>
  )
}
