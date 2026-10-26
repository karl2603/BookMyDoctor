import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarX } from 'lucide-react'
import { api, isPast, type Booking } from '../api'
import { Ticket } from '../components/Bits'

export default function Bookings() {
  const [list, setList] = useState<Booking[] | null>(null)
  useEffect(() => { api.myBookings().then(setList).catch(() => setList([])) }, [])

  const upcoming = (list ?? []).filter((b) => !isPast(b.endTime))
  const past = (list ?? []).filter((b) => isPast(b.endTime))
  const group = (title: string, items: Booking[]) => items.length > 0 && (
    <section>
      <h2 className="mb-4 flex items-center gap-3 font-display text-xl font-semibold">{title}<span className="pill bg-white text-mute shadow-soft">{items.length}</span></h2>
      <div className="space-y-4">{items.map((b, i) => <div key={b.id} className="rise" style={{ animationDelay: `${i * 70}ms` }}><Ticket b={b} /></div>)}</div>
    </section>
  )

  return (
    <div className="page">
      <span className="eyebrow">My bookings</span>
      <h1 className="h1 mt-5">Your appointments</h1>
      <div className="mt-12 max-w-3xl space-y-12">
        {list === null && Array.from({ length: 3 }, (_, i) => <div key={i} className="card h-32 animate-pulse" />)}
        {group('Upcoming', upcoming)}
        {group('Past', past)}
        {list?.length === 0 && (
          <div className="card p-12 text-center">
            <CalendarX size={40} className="mx-auto text-mute" />
            <p className="mt-4 font-display text-3xl font-semibold">Nothing booked yet</p>
            <p className="mt-2 text-mute">When you book a slot, it will show up here.</p>
            <Link to="/doctors" className="btn btn-brand mt-7">Find a doctor →</Link>
          </div>
        )}
      </div>
    </div>
  )
}
