import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Plus } from 'lucide-react'
import { api, byStart, fmtDay, fmtTime, isPast, type Slot } from '../api'
import { StatusPill } from '../components/Bits'

const tabs = ['All', 'Available', 'Booked']

export default function DoctorSlots() {
  const [slots, setSlots] = useState<Slot[] | null>(null)
  const [tab, setTab] = useState('All')
  useEffect(() => { api.mySlots().then(setSlots).catch(() => setSlots([])) }, [])

  const shown = [...(slots ?? [])].sort(byStart).filter((s) => tab === 'All' || (tab === 'Available') === (s.status === 'AVAILABLE'))
  const byDay = shown.reduce<Record<string, Slot[]>>((acc, s) => { (acc[s.startTime.slice(0, 10)] ||= []).push(s); return acc }, {})

  return (
    <div className="page">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div><span className="eyebrow">My slots</span><h1 className="h1 mt-5">Your schedule</h1></div>
        <Link to="/doctor/create" className="btn btn-brand"><Plus size={18} />Create slot</Link>
      </div>

      <div className="mt-10 inline-flex rounded-full border border-line bg-white p-1.5 shadow-soft">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`cursor-pointer rounded-full px-6 py-2.5 text-sm font-semibold transition ${tab === t ? 'bg-ink text-white' : 'text-mute hover:text-ink'}`}>{t}</button>
        ))}
      </div>

      <div className="mt-10 max-w-3xl space-y-8">
        {slots === null && <div className="card h-40 animate-pulse" />}
        {Object.entries(byDay).map(([day, list]) => (
          <div key={day}>
            <h2 className="mb-3 font-display text-xl font-semibold">{fmtDay(list[0].startTime)}</h2>
            <ul className="card divide-y divide-line overflow-hidden">
              {list.map((s) => (
                <li key={s.slotId} className={`flex items-center justify-between px-6 py-4 ${isPast(s.startTime) ? 'opacity-50' : ''}`}>
                  <span className="flex items-center gap-3 font-semibold"><Clock size={18} className="text-brand" />{fmtTime(s.startTime)} – {fmtTime(s.endTime)}</span>
                  <StatusPill status={s.status} />
                </li>
              ))}
            </ul>
          </div>
        ))}
        {slots && shown.length === 0 && <p className="card p-10 text-center text-mute">Nothing to show here yet.</p>}
      </div>
    </div>
  )
}
