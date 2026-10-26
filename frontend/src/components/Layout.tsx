import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUp, ArrowUpRight, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../auth'
import logo from '../assets/logo.png'
import icon from '../assets/icon.png'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const el = hash ? document.getElementById(hash.slice(1)) : null
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function Layout({ children }: { children: ReactNode }) {
  const { token, role, name, logout } = useAuth()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const links: string[][] = !token
    ? [['/', 'Home'], ['/doctors', 'Find a doctor']]
    : role === 'DOCTOR'
      ? [['/doctor', 'Home'], ['/doctor/slots', 'My slots'], ['/doctor/create', 'Create slot']]
      : [['/', 'Home'], ['/doctors', 'Find a doctor'], ['/bookings', 'My bookings']]
  const out = () => { logout(); setOpen(false); nav('/') }
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-brand-50 text-brand' : 'text-ink/70 hover:bg-black/5 hover:text-ink'}`

  const foot: [string, string[][]][] = !token
    ? [['Explore', [['/doctors', 'Find a doctor'], ['/#specialties', 'Specialties'], ['/#how', 'How it works'], ['/#faq', 'FAQ']]], ['Account', [['/login', 'Sign in'], ['/register', 'Create an account']]]]
    : role === 'DOCTOR'
      ? [['Doctors', [['/doctor', 'Dashboard'], ['/doctor/slots', 'My slots'], ['/doctor/create', 'Create slot']]]]
      : [['Patients', [['/doctors', 'Find a doctor'], ['/bookings', 'My bookings']]], ['Explore', [['/#specialties', 'Specialties'], ['/#how', 'How it works'], ['/#faq', 'FAQ']]]]

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollManager />
      <header className={`sticky top-0 z-40 transition ${scrolled ? 'border-b border-line bg-white/85 shadow-soft backdrop-blur-xl' : 'border-b border-transparent bg-white/60 backdrop-blur-md'}`}>
        <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-6 md:px-10">
          <Link to="/" onClick={() => setOpen(false)} aria-label="BookMyDoc home"><img src={logo} alt="BookMyDoc" className="h-9 w-auto md:h-10" /></Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} className={linkCls}>{label}</NavLink>)}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            {token ? (
              <>
                <div className="flex items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pl-1.5 pr-4">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-brand font-display text-sm font-bold text-white">{(name || '?').slice(0, 1).toUpperCase()}</span>
                  <span className="max-w-[9rem] truncate text-sm font-semibold">{name}</span>
                </div>
                <button onClick={out} className="btn-ghost !px-4 !py-2.5" aria-label="Sign out"><LogOut size={16} />Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-ink/70 hover:text-ink">Sign in</Link>
                <Link to="/register" className="btn btn-brand !py-2.5">Get started</Link>
              </>
            )}
          </div>
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-line bg-white md:hidden">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-line bg-white md:hidden">
              <div className="space-y-1 px-6 py-5">
                {links.map(([to, label]) => (
                  <Link key={to} to={to} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 font-display text-xl font-semibold hover:bg-brand-50">{label}</Link>
                ))}
                {token
                  ? <button onClick={out} className="btn-ghost mt-3 w-full"><LogOut size={16} />Sign out</button>
                  : <div className="flex gap-3 pt-3"><Link to="/login" onClick={() => setOpen(false)} className="btn-ghost flex-1">Sign in</Link><Link to="/register" onClick={() => setOpen(false)} className="btn btn-brand flex-1">Get started</Link></div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="px-3 pb-3 pt-24 md:px-4 md:pb-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink-900 text-white md:rounded-[2.75rem]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(to right, rgb(255 255 255 / .04) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / .04) 1px, transparent 1px)',
            backgroundSize: '72px 72px', maskImage: 'radial-gradient(ellipse at 20% 0%, black 10%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at 20% 0%, black 10%, transparent 70%)',
          }} />
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand/25 blur-[110px]" />
          <div className="relative mx-auto max-w-6xl px-6 pt-16 md:px-10 md:pt-20">
            <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr_1fr]">
              <div>
                <Link to="/" className="inline-flex items-center gap-3">
                  <img src={icon} alt="" className="h-12 w-12" />
                  <span className="font-display text-3xl font-bold tracking-tight">book<span className="text-brand">my</span>doc</span>
                </Link>
                <p className="mt-6 max-w-xs leading-relaxed text-white/55">Find a doctor, see when they are free and book your appointment in a few clicks.</p>
              </div>
              {foot.map(([title, items]) => (
                <div key={title as string}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">{title as string}</p>
                  <ul className="mt-6 space-y-3.5">
                    {(items as string[][]).map(([to, label]) => (
                      <li key={label}>
                        <Link to={to} className="group inline-flex items-center gap-2 text-[15px] text-white/70 transition hover:text-white">
                          {label}<ArrowUpRight size={15} className="-translate-x-1 text-brand opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-16 flex flex-col gap-5 border-t border-white/10 py-7 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
              <p>© 2026 BookMyDoc. All rights reserved.</p>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="group inline-flex cursor-pointer items-center gap-2 self-start text-white/60 transition hover:text-white md:self-auto">
                Back to top <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition group-hover:border-brand group-hover:bg-brand"><ArrowUp size={16} /></span>
              </button>
            </div>
          </div>
          <div aria-hidden className="pointer-events-none relative flex select-none justify-center overflow-hidden">
            <p className="-mb-[2.2vw] whitespace-nowrap font-display text-[14vw] font-extrabold leading-[0.8] tracking-normal text-transparent md:-mb-9 md:text-[12rem]"
              style={{ WebkitTextStroke: '1.5px rgba(255,255,255,.11)', maskImage: 'linear-gradient(to bottom, black 10%, transparent 92%)', WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 92%)' }}>bookmydoc</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
