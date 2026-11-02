import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, CalendarCheck, CalendarDays, CalendarPlus, Clock } from 'lucide-react'
import { api, byStart, fmtTime, today, type Slot } from '../api'
import { useAuth } from '../auth'
import { StatusPill } from '../components/Bits'

export default function DoctorHome() {
  const { name } = useAuth()
  const [slots, setSlots] = useState<Slot[] | null>(null)
  useEffect(() => { api.mySlots().then(setSlots).catch(() => setSlots([])) }, [])

  const h = new Date().getHours()
  const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  const todays = (slots ?? []).filter((s) => s.startTime.slice(0, 10) === today()).sort(byStart)
  const booked = todays.filter((s) => s.status !== 'AVAILABLE').length
  const stats = [
    { label: 'Slots today', value: todays.length, icon: CalendarDays },
    { label: 'Booked', value: booked, icon: CalendarCheck },
    { label: 'Still open', value: todays.length - booked, icon: Clock },
  ]

  return (
    <div className="page">
      <span className="eyebrow">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
      <h1 className="h1 mt-5">{greet}, <span className="text-brand">{name}.</span></h1>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card flex items-center justify-between p-7">
            <div><p className="text-sm font-medium text-mute">{label}</p><p className="mt-2 font-display text-6xl font-bold leading-none">{slots === null ? '–' : value}</p></div>
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand"><Icon size={26} /></span>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <section className="card p-7">
          <h2 className="font-display text-2xl font-semibold">Today's schedule</h2>
          <ul className="mt-4 divide-y divide-line">
            {todays.map((s) => (
              <li key={s.slotId} className="flex items-center justify-between py-4">
                <span className="flex items-center gap-3 text-lg font-semibold"><Clock size={18} className="text-brand" />{fmtTime(s.startTime)}<span className="font-normal text-mute">– {fmtTime(s.endTime)}</span></span>
                <StatusPill status={s.status} />
              </li>
            ))}
          </ul>
          {slots && todays.length === 0 && <p className="mt-5 rounded-2xl bg-bg p-6 text-center text-mute">No slots today.</p>}
        </section>
        <section className="space-y-5">
          <Link to="/doctor/create" className="group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-[#ff6a80] p-7 text-white shadow-brand transition hover:-translate-y-1">
            <div className="absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-white/15" />
            <CalendarPlus size={30} /><p className="mt-5 font-display text-2xl font-semibold">Create a slot</p>
            <p className="mt-1 text-white/85">Open up a new time for patients.</p>
            <ArrowUpRight className="absolute right-6 top-6 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
          <Link to="/doctor/slots" className="group card relative block p-7 transition hover:-translate-y-1 hover:shadow-lift">
            <CalendarDays size={30} className="text-brand" /><p className="mt-5 font-display text-2xl font-semibold">All my slots</p>
            <p className="mt-1 text-mute">See everything, open and booked.</p>
            <ArrowUpRight className="absolute right-6 top-6 text-mute transition group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </section>
      </div>
    </div>
  )
}
