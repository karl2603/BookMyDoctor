import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, MapPin, Search, SearchX } from 'lucide-react'
import { api, errMsg, fmtFee, type Doctor } from '../api'
import { Avatar } from '../components/Bits'

export default function Doctors() {
  const [params] = useSearchParams()
  const [list, setList] = useState<Doctor[] | null>(null)
  const [err, setErr] = useState('')
  const [q, setQ] = useState(params.get('q') ?? '')
  const [spec, setSpec] = useState('All')

  useEffect(() => { api.doctors().then(setList).catch((x) => { setErr(errMsg(x)); setList([]) }) }, [])

  const specs = ['All', ...new Set((list ?? []).map((d) => d.specialization))]
  const shown = (list ?? []).filter((d) =>
    (spec === 'All' || d.specialization === spec) &&
    `${d.name} ${d.specialization} ${d.clinicName}`.toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      <section className="border-b border-line bg-gradient-to-b from-brand-50/70 to-bg">
        <div className="mx-auto max-w-6xl px-6 py-14 md:px-10 md:py-16">
          <span className="eyebrow">Find a doctor</span>
          <h1 className="h1 mt-5 max-w-2xl">Who would you like to <span className="text-brand">see?</span></h1>
          <div className="relative mt-9 max-w-xl">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-mute" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, specialty or clinic" className="input !rounded-full !py-4 !pl-13 shadow-soft" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {specs.map((s) => (
              <button key={s} onClick={() => setSpec(s)}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition ${spec === s ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:border-ink'}`}>{s}</button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        {err && <p className="msg mb-8">{err}</p>}
        {list && !err && <p className="mb-6 text-sm text-mute">{shown.length} {shown.length === 1 ? 'doctor' : 'doctors'} available</p>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list === null && Array.from({ length: 6 }, (_, i) => <div key={i} className="card h-64 animate-pulse" />)}
          {shown.map((d, i) => (
            <Link key={d.doctorId} to={`/doctors/${d.doctorId}`} style={{ animationDelay: `${i * 60}ms` }}
              className="rise group card flex flex-col p-6 transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lift">
              <div className="flex items-center gap-4">
                <Avatar name={d.name} size="h-16 w-16 text-2xl" />
                <div className="min-w-0">
                  <h3 className="truncate font-display text-xl font-semibold leading-tight">{d.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm font-medium text-brand">{d.specialization}</p>
                </div>
              </div>
              <div className="mt-6 flex-1 space-y-1 rounded-2xl bg-bg p-4 text-sm">
                <p className="font-semibold">{d.clinicName}</p>
                <p className="flex items-start gap-1.5 text-mute"><MapPin size={14} className="mt-0.5 shrink-0" />{d.clinicAddress}</p>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div><p className="text-xs text-mute">Consultation</p><p className="font-display text-xl font-bold">{fmtFee(d.consultationFee)}</p></div>
                <span className="flex items-center gap-1.5 rounded-full bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand transition group-hover:bg-brand group-hover:text-white">
                  View slots <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        {list && !err && shown.length === 0 && (
          <div className="card mx-auto mt-4 max-w-md p-12 text-center">
            <SearchX size={36} className="mx-auto text-mute" />
            <p className="mt-4 font-display text-2xl font-semibold">No doctors found</p>
            <p className="mt-2 text-mute">Try a different name or specialty.</p>
          </div>
        )}
      </div>
    </div>
  )
}
