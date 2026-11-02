import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarCheck, Clock, MapPin } from 'lucide-react'
import { api, byStart, errMsg, fmtDay, fmtFee, fmtTime, isPast, today, type Booking, type Doctor, type Slot } from '../api'
import { Avatar, Ticket } from '../components/Bits'

const days = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() + i)
  return d.toLocaleDateString('en-CA')
})

export default function DoctorDetail() {
  const { id } = useParams()
  const [doc, setDoc] = useState<Doctor | null | undefined>(undefined)
  const [slots, setSlots] = useState<Slot[] | null>(null)
  const [day, setDay] = useState(today())
  const [pick, setPick] = useState<Slot | null>(null)
  const [ticket, setTicket] = useState<Booking | null>(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api.doctors().then((l) => setDoc(l.find((d) => String(d.doctorId) === id) ?? null)).catch(() => setDoc(null))
    api.allSlots(id!).then(setSlots).catch((x) => { setErr(errMsg(x)); setSlots([]) })
  }, [id])

  async function confirm() {
    if (!pick) return
    setBusy(true); setErr('')
    try {
      const b = await api.book(pick.slotId)
      setTicket(b)
      setSlots((s) => s && s.map((x) => (x.slotId === pick.slotId ? { ...x, status: 'BOOKED' } : x)))
      setPick(null)
    } catch (x) {
      setErr(errMsg(x))
      api.allSlots(id!).then(setSlots).catch(() => {})
    } finally { setBusy(false) }
  }

  const ofDay = (k: string) => (slots ?? []).filter((s) => s.startTime.slice(0, 10) === k).sort(byStart)
  const list = ofDay(day)

  if (doc === null) return <div className="page"><p className="msg">Doctor not found.</p><Link to="/doctors" className="btn-ghost mt-6">← Back to doctors</Link></div>

  return (
    <div className="page">
      <Link to="/doctors" className="inline-flex items-center gap-2 text-sm font-semibold text-mute transition hover:text-ink"><ArrowLeft size={16} />All doctors</Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[340px_1fr]">
        <aside className="card h-fit overflow-hidden lg:sticky lg:top-28">
          <div className="h-24 bg-gradient-to-br from-brand to-[#ff7a8f]" />
          {doc ? (
            <div className="-mt-10 px-7 pb-7">
              <Avatar name={doc.name} size="h-20 w-20 text-3xl ring-4 ring-white" />
              <h1 className="mt-4 font-display text-3xl font-bold leading-tight">{doc.name}</h1>
              <p className="mt-1 font-medium text-brand">{doc.specialization}</p>
              <div className="mt-6 space-y-4 border-t border-line pt-6 text-sm">
                <div className="flex gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-brand" /><div><p className="font-semibold">{doc.clinicName}</p><p className="text-mute">{doc.clinicAddress}</p></div></div>
                <div className="flex items-center justify-between rounded-2xl bg-bg p-4"><span className="text-mute">Consultation fee</span><span className="font-display text-xl font-bold">{fmtFee(doc.consultationFee)}</span></div>
              </div>
            </div>
          ) : <div className="m-7 h-60 animate-pulse rounded-2xl bg-bg" />}
        </aside>

        <section>
          <h2 className="h2">Pick a time</h2>

          <div className="-mx-1 mt-8 flex gap-2.5 overflow-x-auto px-1 pb-4">
            {days.map((k) => {
              const d = new Date(k + 'T00:00'); const open = ofDay(k).filter((s) => s.status === 'AVAILABLE' && !isPast(s.startTime)).length
              return (
                <button key={k} onClick={() => setDay(k)}
                  className={`flex w-[74px] shrink-0 cursor-pointer flex-col items-center rounded-2xl border py-3.5 transition ${day === k ? 'border-ink bg-ink text-white shadow-lift' : 'border-line bg-white hover:border-ink'}`}>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                  <span className="font-display text-2xl font-bold">{d.getDate()}</span>
                  <span className={`mt-1 h-1.5 w-1.5 rounded-full ${open ? 'bg-brand' : 'bg-transparent'}`} />
                </button>
              )
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-5 text-xs font-medium text-mute">
            <span className="flex items-center gap-2"><i className="h-3.5 w-3.5 rounded border border-ok/40 bg-white" />Available</span>
            <span className="flex items-center gap-2"><i className="hatch h-3.5 w-3.5 rounded border border-line bg-[#f4f1f2]" />Booked</span>
            <span className="flex items-center gap-2"><i className="h-3.5 w-3.5 rounded border border-line bg-[#f4f1f2] opacity-50" />Passed</span>
          </div>

          {ticket && (
            <div className="rise mt-8 rounded-3xl bg-ok-50 p-5">
              <p className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-ok"><CalendarCheck size={20} />You're booked — see you there</p>
              <Ticket b={ticket} />
              <Link to="/bookings" className="mt-4 inline-block text-sm font-semibold text-ok underline underline-offset-4">View all my bookings →</Link>
            </div>
          )}
          {err && !pick && <p className="msg mt-6">{err}</p>}

          <h3 className="mt-10 font-display text-xl font-semibold">{fmtDay(day + 'T00:00')}</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {slots === null && Array.from({ length: 8 }, (_, i) => <div key={i} className="h-[78px] animate-pulse rounded-2xl bg-white" />)}
            {list.map((s) => {
              const booked = s.status !== 'AVAILABLE', past = isPast(s.startTime)
              const state = booked ? 'Booked' : past ? 'Passed' : 'Available'
              return (
                <button key={s.slotId} disabled={booked || past} onClick={() => { setPick(s); setErr('') }}
                  className={`flex cursor-pointer flex-col items-start gap-1 rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed ${
                    booked ? 'hatch border-line bg-[#f4f1f2] text-mute' : past ? 'border-line bg-[#f4f1f2] opacity-50'
                      : 'border-ok/30 bg-white hover:-translate-y-0.5 hover:border-brand hover:shadow-lift'}`}>
                  <span className={`font-display text-lg font-semibold ${booked ? 'line-through' : ''}`}>{fmtTime(s.startTime)}</span>
                  <span className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${state === 'Available' ? 'text-ok' : ''}`}>{state}</span>
                </button>
              )
            })}
          </div>
          {slots && list.length === 0 && <p className="mt-4 text-mute">No slots on this day. Try another date.</p>}
        </section>
      </div>

      {pick && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/60 p-4 backdrop-blur-sm" onClick={() => setPick(null)}>
          <div className="rise w-full max-w-md rounded-[2rem] bg-white p-8 shadow-lift" onClick={(e) => e.stopPropagation()}>
            <span className="eyebrow">Confirm appointment</span>
            <h3 className="mt-4 font-display text-3xl font-bold">{doc?.name}</h3>
            <div className="mt-6 space-y-3 rounded-2xl bg-bg p-5">
              <p className="flex items-center gap-2 text-mute"><CalendarCheck size={18} className="text-brand" />{fmtDay(pick.startTime)}</p>
              <p className="flex items-center gap-2 font-display text-2xl font-semibold"><Clock size={18} className="text-brand" />{fmtTime(pick.startTime)} – {fmtTime(pick.endTime)}</p>
              {doc && <p className="flex items-start gap-2 text-sm text-mute"><MapPin size={18} className="mt-0.5 shrink-0 text-brand" />{doc.clinicName}, {doc.clinicAddress}</p>}
            </div>
            {err && <p className="msg mt-5">{err}</p>}
            <div className="mt-7 flex gap-3">
              <button onClick={confirm} disabled={busy} className="btn btn-brand flex-1">{busy ? 'Booking…' : 'Confirm booking'}</button>
              <button onClick={() => setPick(null)} className="btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
