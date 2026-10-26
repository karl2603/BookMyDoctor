import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import {
  ArrowRight, BadgeCheck, Baby, Bone, Brain, CalendarClock, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight,
  HeartPulse, MapPin, Plus, Search, Smile, Smartphone, Sparkles, Stethoscope, UserRound,
} from 'lucide-react'
import { useAuth } from '../auth'
import { Reveal } from '../components/Bits'

const specialties = [
  { label: 'General Physician', q: 'General', icon: Stethoscope },
  { label: 'Therapy & Mental Health', q: 'Therapy', icon: Brain },
  { label: 'Dermatology', q: 'Dermat', icon: Sparkles },
  { label: 'Pediatrics', q: 'Pediatric', icon: Baby },
  { label: 'Cardiology', q: 'Cardio', icon: HeartPulse },
  { label: 'Orthopedics', q: 'Ortho', icon: Bone },
  { label: 'Dental Care', q: 'Dent', icon: Smile },
  { label: "Women's Health", q: 'Gyn', icon: UserRound },
]

const steps = [
  { icon: Search, title: 'Find your doctor', text: 'Browse doctors by name or specialty and see their clinic and consultation fee before you decide.' },
  { icon: CalendarClock, title: 'Choose a time', text: 'Pick a date and see which slots are open and which are taken, laid out for the whole day.' },
  { icon: BadgeCheck, title: 'Get confirmed', text: 'Confirm in one click. Your appointment is saved to your account straight away.' },
]

const faqs: [string, string][] = [
  [
    'How do I book an appointment?',
    'Sign in to your patient account, open Find a doctor, select a doctor, and choose a time marked Available. Confirm your selection to book the appointment. You can then find it under My bookings.',
  ],
  [
    'What do the slot statuses mean?',
    'Available slots can be selected for booking. Booked slots have already been reserved, while cancelled or past slots are not available for a new appointment.',
  ],
  [
    'Where can I see my appointments?',
    'Open My bookings after signing in to review the appointments associated with your account, including the doctor and appointment date and time.',
  ],
  [
    'Can I check the consultation fee before booking?',
    'Yes. When the doctor profile includes a consultation fee, you can review it along with the available clinic details before choosing an appointment.',
  ],
  [
    'What if my preferred doctor has no available slots?',
    'Check the available dates and times again, or explore other doctors on BookMyDoc. Appointment availability depends on the slots listed for each doctor.',
  ],
  [
    'Can I reschedule or cancel an appointment?',
    'This depends on the options available in your account. If you cannot find a reschedule or cancellation option under My bookings, contact the clinic directly for assistance.',
  ],
  [
    'Do I need an account to book an appointment?',
    'Yes. Create a patient account or sign in to your existing account before booking. Your appointments will be associated with that account.',
  ],
  [
    'Can I use BookMyDoc for a medical emergency?',
    'No. BookMyDoc helps you find doctors and book appointments; it does not provide emergency care or medical diagnoses. For a medical emergency, contact your local emergency service or visit the nearest emergency department.',
  ],
]

const features = [
  { icon: CalendarDays, title: 'Live availability', text: 'Every open and booked slot, laid out by day.' },
  { icon: MapPin, title: 'Clinic details up front', text: 'Address and consultation fee on every profile.' },
  { icon: BadgeCheck, title: 'One booking list', text: 'All your appointments, together in one place.' },
]

function Label({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span className={`flex items-center gap-3 text-sm font-semibold ${light ? 'text-brand' : 'text-brand'}`}>
      <span className="h-px w-8 bg-brand" />{children}
    </span>
  )
}

function Line({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <span className={`block overflow-hidden whitespace-nowrap pb-[0.06em] ${className}`}>
      <motion.span className="block" initial={{ y: '115%' }} animate={{ y: 0 }} transition={{ duration: 0.85, delay, ease: 'easeOut' }}>{children}</motion.span>
    </span>
  )
}

function HeroCalendar() {
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate() < 12
  const first = new Date(now.getFullYear(), now.getMonth() + (nextMonth ? 1 : 0), 1)
  const y = first.getFullYear(), m = first.getMonth()
  const t = nextMonth ? 0 : now.getDate()
  const dim = new Date(y, m + 1, 0).getDate()
  const lead = (first.getDay() + 6) % 7
  const cells = [...Array<number>(lead).fill(0), ...Array.from({ length: dim }, (_, i) => i + 1)]
  const sel = nextMonth ? 8 : Math.min(t + 2, dim)
  const open = new Set((nextMonth ? [3, 4, 5, 6, 8, 9, 10, 11, 12, 13] : [0, 1, 2, 3, 5, 6, 8, 9, 10].map((n) => t + n)))
  const month = first.toLocaleDateString('en-IN', { month: 'long' })
  const picked = new Date(y, m, sel).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })

  const mx = useMotionValue(0), my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 70, damping: 16 }), sy = useSpring(my, { stiffness: 70, damping: 16 })
  const x1 = useTransform(sx, (v) => v * 16), y1 = useTransform(sy, (v) => v * 12)
  const x2 = useTransform(sx, (v) => v * -26), y2 = useTransform(sy, (v) => v * -18)

  return (
    <div className="relative mx-auto h-[610px] w-full max-w-[470px]"
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5) }}
      onMouseLeave={() => { mx.set(0); my.set(0) }}>
      <motion.div className="absolute left-1/2 top-6 -translate-x-1/2" initial={{ opacity: 0, y: 60, rotate: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}>
        <motion.div style={{ x: x1, y: y1, rotate: -4 }} className="relative w-[330px] rounded-[2rem] bg-white text-ink shadow-[0_40px_80px_-20px_rgba(0,0,0,.55)] sm:w-[350px]">
          <span className="absolute -top-5 left-[22%] z-10 h-11 w-4 rounded-full border-[3px] border-white bg-brand" />
          <span className="absolute -top-5 right-[22%] z-10 h-11 w-4 rounded-full border-[3px] border-white bg-brand" />
          <div className="flex items-center justify-between rounded-t-[2rem] bg-brand px-6 pb-5 pt-8 text-white">
            <div><p className="font-display text-3xl font-bold leading-none">{month}</p><p className="mt-1 text-sm text-white/75">{y}</p></div>
            <div className="flex gap-1.5"><span className="grid h-8 w-8 place-items-center rounded-full bg-white/20"><ChevronLeft size={16} /></span><span className="grid h-8 w-8 place-items-center rounded-full bg-white/20"><ChevronRight size={16} /></span></div>
          </div>
          <div className="px-5 pb-5 pt-4">
            <div className="grid grid-cols-7 place-items-center pb-1 text-[11px] font-semibold uppercase text-mute">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i}>{d}</span>)}</div>
            <div className="grid grid-cols-7 place-items-center gap-y-1">
              {cells.map((d, i) => d === 0 ? <span key={i} /> : (
                <span key={i} className={`relative grid h-9 w-9 place-items-center rounded-full text-sm font-semibold ${d === sel ? 'bg-brand text-white shadow-brand' : d < t ? 'text-ink/25' : 'text-ink'} ${d === t && d !== sel ? 'ring-1 ring-ink/25' : ''}`}>
                  {d}{open.has(d) && d !== sel && <i className="absolute bottom-0.5 h-1 w-1 rounded-full bg-brand" />}
                </span>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-dashed border-line pt-4">
              {[['09:30', 'open'], ['10:00', 'pick'], ['10:30', 'booked']].map(([tm, s]) => (
                <span key={tm} className={`rounded-xl border py-2 text-center text-sm font-semibold ${s === 'pick' ? 'border-brand bg-brand text-white' : s === 'booked' ? 'hatch border-line bg-[#f4f1f2] text-mute line-through' : 'border-line'}`}>{tm}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <Plus className="absolute right-0 top-2 text-brand" size={38} strokeWidth={3.5} />
      <Plus className="absolute -left-2 top-28 text-white/30" size={22} strokeWidth={3} />
      <Plus className="absolute bottom-24 right-2 text-white/25" size={26} strokeWidth={3} />
    </div>
  )
}

export default function Home() {
  const { token } = useAuth()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const start = token ? '/doctors' : '/register'
  const search = (e: FormEvent) => { e.preventDefault(); nav(`/doctors?q=${encodeURIComponent(q.trim())}`) }
  const ticker = [...specialties, ...specialties]

  return (
    <>
      {/* Hero */}
      <section className="px-3 pt-3 md:px-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink-900 text-white md:rounded-[2.75rem]">
          <div className="absolute inset-0 opacity-100" style={{
            backgroundImage: 'linear-gradient(to right, rgb(255 255 255 / .05) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / .05) 1px, transparent 1px)',
            backgroundSize: '72px 72px', maskImage: 'radial-gradient(ellipse at 72% 38%, black 15%, transparent 72%)', WebkitMaskImage: 'radial-gradient(ellipse at 72% 38%, black 15%, transparent 72%)',
          }} />
          <div className="absolute right-[6%] top-[12%] h-[30rem] w-[30rem] rounded-full bg-brand/35 blur-[120px]" />

          <div className="relative mx-auto max-w-6xl px-6 pb-12 pt-16 md:px-10 md:pt-20">
            <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-16 lg:grid-cols-[1.25fr_1fr]">
              <div className="min-w-0">
                <h1 className="mt-7 font-display text-[2.9rem] font-extrabold leading-[0.95] tracking-tight sm:text-[4.6rem] xl:text-[5.4rem]">
                  <Line delay={0.15}>Your doctor.</Line>
                  <Line delay={0.3}>Your time.</Line>
                  <Line delay={0.45} className="!pb-5">
                    <span className="relative inline-block text-brand">Booked.
                      <svg viewBox="0 0 300 18" fill="none" className="absolute -bottom-3 left-0 w-full"><motion.path d="M4 11 C 60 2, 120 17, 180 8 S 268 5, 296 10" stroke="currentColor" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.1, duration: 0.8, ease: 'easeOut' }} /></svg>
                    </span>
                  </Line>
                </h1>
                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }} className="mt-5 max-w-md text-lg leading-relaxed text-white/65">
                  Browse doctors, see every open slot and confirm your appointment in a few clicks.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.7 }}>
                  <form onSubmit={search} className="mt-9 flex max-w-xl items-center gap-2 rounded-full bg-white p-2 pl-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,.6)] focus-within:ring-4 focus-within:ring-brand/40">
                    <Search size={20} className="shrink-0 text-mute" />
                    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a doctor, specialty or clinic" className="w-0 min-w-0 flex-1 bg-transparent py-3 text-[15px] text-ink outline-none placeholder:text-mute/70" />
                    <button className="btn btn-brand shrink-0 !px-7">Search</button>
                  </form>
                  <p className="mt-5 flex flex-wrap items-center gap-2 text-sm text-white/50">
                    Popular:
                    {specialties.slice(0, 4).map((s) => (
                      <Link key={s.q} to={`/doctors?q=${s.q}`} className="rounded-full border border-white/15 px-3.5 py-1.5 text-white/80 transition hover:border-brand hover:bg-brand hover:text-white">{s.label.split(' &')[0]}</Link>
                    ))}
                  </p>
                </motion.div>
              </div>
              <HeroCalendar />
            </div>

            <div className="mt-16 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-3">
              {features.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-brand"><Icon size={20} /></span>
                  <div><p className="font-semibold">{title}</p><p className="mt-1 text-sm text-white/55">{text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="overflow-hidden py-10" aria-hidden>
        <div className="flex w-max animate-[marquee_45s_linear_infinite] items-center gap-12 pr-12">
          {ticker.map((s, i) => (
            <span key={i} className="flex items-center gap-12 font-display text-3xl font-bold tracking-tight text-ink/80">
              {s.label}<Plus size={22} strokeWidth={3.5} className="text-brand" />
            </span>
          ))}
        </div>
      </div>

      {/* Specialties */}
      <section id="specialties" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16 md:px-10">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div><Label>Specialties</Label><h2 className="h2 mt-5 max-w-xl">Find care by specialty</h2></div>
          <Link to="/doctors" className="group flex items-center gap-2 font-semibold text-brand">View all doctors <ArrowRight size={18} className="transition group-hover:translate-x-1" /></Link>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {specialties.map(({ label, q: sq, icon: Icon }, i) => (
            <Reveal key={label} delay={i * 0.05}>
              <Link to={`/doctors?q=${sq}`} className="group card flex h-full flex-col gap-5 p-6 transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lift">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand transition group-hover:bg-brand group-hover:text-white"><Icon size={26} /></span>
                <span className="font-display text-lg font-semibold leading-snug">{label}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-24 bg-white py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <Reveal className="flex flex-col items-center text-center"><Label>How it works</Label><h2 className="h2 mt-5">Booked in three simple steps</h2></Reveal>
          <div className="relative mt-16 grid gap-6 md:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-14 hidden border-t-2 border-dashed border-brand/30 md:block" />
            {steps.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.1}>
                <div className="relative text-center">
                  <div className="relative mx-auto grid h-28 w-28 place-items-center rounded-full bg-brand-50 text-brand ring-8 ring-white">
                    <Icon size={38} />
                    <span className="absolute -right-1 -top-1 grid h-9 w-9 place-items-center rounded-full bg-brand font-display font-bold text-white shadow-brand">{i + 1}</span>
                  </div>
                  <h3 className="mt-7 font-display text-2xl font-semibold">{title}</h3>
                  <p className="mx-auto mt-3 max-w-xs leading-relaxed text-mute">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why BookMyDoc */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:px-10">
        <Reveal className="max-w-2xl"><Label>Why BookMyDoc</Label><h2 className="h2 mt-5">Everything you need, nothing you don't.</h2></Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <Reveal className="md:col-span-2">
            <div className="card relative h-full overflow-hidden p-8 md:p-10">
              <h3 className="font-display text-2xl font-semibold">Every slot, at a glance</h3>
              <p className="mt-3 max-w-md leading-relaxed text-mute">See a doctor's whole day at once. Open times are clear and booked ones are crossed out, so you never pick a slot that is gone.</p>
              <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-5">
                {[['10:00', 'booked'], ['10:30', 'open'], ['11:00', 'open'], ['11:30', 'booked'], ['12:00', 'open'], ['14:00', 'open'], ['14:30', 'booked'], ['15:00', 'open'], ['15:30', 'open'], ['16:00', 'booked']].map(([t, s]) => (
                  <div key={t} className={`rounded-xl border px-2 py-3 text-center text-sm font-semibold ${s === 'booked' ? 'hatch border-line bg-[#f4f1f2] text-mute line-through' : 'border-ok/30 bg-white text-ink'}`}>{t}</div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card h-full p-8">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand"><MapPin size={22} /></span>
              <h3 className="mt-6 font-display text-2xl font-semibold">Know before you go</h3>
              <p className="mt-3 leading-relaxed text-mute">Clinic name, address and consultation fee are shown right on the doctor's profile.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="card h-full p-8">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand"><CalendarDays size={22} /></span>
              <h3 className="mt-6 font-display text-2xl font-semibold">Your appointments, together</h3>
              <p className="mt-3 leading-relaxed text-mute">Every booking lives in one list, with the date, time and clinic ready when you need it.</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card h-full p-8">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand"><Smartphone size={22} /></span>
              <h3 className="mt-6 font-display text-2xl font-semibold">Works on every screen</h3>
              <p className="mt-3 leading-relaxed text-mute">Book from your phone, tablet or laptop with the same simple flow.</p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="relative h-full overflow-hidden rounded-3xl bg-brand p-8 text-white shadow-brand">
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/15" />
              <h3 className="relative font-display text-2xl font-semibold">Ready when you are</h3>
              <p className="relative mt-3 leading-relaxed text-white/85">Create an account and book your first appointment today.</p>
              <Link to={start} className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand transition hover:shadow-lift">{token ? 'Find a doctor' : 'Get started'} <ArrowRight size={16} /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Patient CTA */}
<section className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
  <Reveal>
    <div className="relative isolate overflow-hidden rounded-[2rem] bg-ink-900 px-7 py-12 text-white md:px-14 md:py-16">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full bg-brand/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 right-1/4 -z-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl"
      />

      <div className="grid items-center gap-12 md:grid-cols-[1.15fr_0.85fr]">
        {/* Main message */}
        <div>
          <Label light>YOUR NEXT APPOINTMENT</Label>

          <h2 className="mt-5 max-w-xl font-display text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
            Finding the right doctor starts
            {' '}
            <span className="text-brand">right here.</span>
          </h2>

          <p className="mt-6 max-w-lg text-base leading-7 text-white/70 md:text-lg">
            Explore doctor profiles, check available appointment times, and
            keep your bookings together in one place.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to={token ? '/doctors' : '/register'}
              className="btn btn-brand group"
            >
              {token ? 'Find a doctor' : 'Get started'}
              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>

            {!token && (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full px-3 py-3 text-sm font-medium text-white/75 transition hover:text-white"
              >
                Already have an account?
                <span className="text-brand">Sign in</span>
              </Link>
            )}
          </div>
        </div>

        {/* Simple patient journey — no fake doctor schedule */}
        <div className="relative">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              A simpler way to book
            </p>

            <div className="mt-7 space-y-6">
              {[
                {
                  number: '01',
                  title: 'Find your doctor',
                  description:
                    'Explore the profiles available on BookMyDoc.',
                },
                {
                  number: '02',
                  title: 'Choose your time',
                  description:
                    'Check the schedule and select an available slot.',
                },
                {
                  number: '03',
                  title: 'Keep your booking handy',
                  description:
                    'Return to My Bookings whenever you need your appointment details.',
                },
              ].map((step, index) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex shrink-0 flex-col items-center">
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-brand/40 bg-brand/10 font-mono text-sm font-semibold text-brand">
                      {step.number}
                    </span>

                    {index < 2 && (
                      <span
                        aria-hidden="true"
                        className="mt-2 h-6 w-px bg-white/15"
                      />
                    )}
                  </div>

                  <div className="pb-1">
                    <h3 className="font-display text-lg font-semibold">
                      {step.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-white/60">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute -right-3 -top-3 h-8 w-8 rounded-full border border-brand/50 bg-brand md:-right-4 md:-top-4 md:h-10 md:w-10"
          />
        </div>
      </div>
    </div>
  </Reveal>
</section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-6 pb-24 md:px-10">
        <Reveal className="flex flex-col items-center text-center"><Label>FAQ</Label><h2 className="h2 mt-5">Questions, answered</h2></Reveal>
        <div className="mt-12 space-y-3">
          {faqs.map(([q1, a], i) => (
            <Reveal key={q1} delay={i * 0.04}>
              <div className={`card overflow-hidden transition ${openFaq === i ? 'border-brand/40' : ''}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left">
                  <span className="font-display text-lg font-semibold">{q1}</span>
                  <ChevronDown size={20} className={`shrink-0 text-brand transition ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="px-6 pb-6 leading-relaxed text-mute">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-brand p-10 text-center text-white md:p-20">
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-ink/15" />
            <Plus className="absolute right-[12%] top-[18%] text-white/30" size={44} strokeWidth={3} />
            <h2 className="h2 relative mx-auto max-w-2xl">Your next appointment is a few clicks away.</h2>
            <p className="relative mx-auto mt-5 max-w-md text-lg text-white/85">Find a doctor, pick a time and get on with your day.</p>
            <div className="relative mt-9 flex flex-wrap justify-center gap-4">
              <Link to={start} className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-brand transition hover:shadow-lift">{token ? 'Find a doctor' : 'Create an account'} <ArrowRight size={16} /></Link>
              {!token && <Link to="/login" className="inline-flex items-center rounded-full border border-white/60 px-8 py-4 text-sm font-semibold transition hover:bg-white/10">Sign in</Link>}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
