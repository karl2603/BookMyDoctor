import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Check } from 'lucide-react'
import { api, errMsg } from '../api'
import { homeOf, useAuth } from '../auth'
import icon from '../assets/icon.png'

export default function Auth({ mode }: { mode: 'login' | 'register' }) {
  const isLogin = mode === 'login'
  const nav = useNavigate()
  const { login } = useAuth()
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [show, setShow] = useState(false)

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErr(''); setBusy(true)
    const f = new FormData(e.currentTarget)
    const email = String(f.get('email')), password = String(f.get('password'))
    try {
      if (isLogin) nav(homeOf(await login(email, password)))
      else { await api.register(String(f.get('username')), email, password); nav('/login') }
    } catch (x) { setErr(errMsg(x)) } finally { setBusy(false) }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-6xl gap-6 p-4 md:grid-cols-2 md:p-6">
      <section className="relative hidden overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand to-[#ff6a80] p-12 text-white md:flex md:flex-col md:justify-between">
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/15" />
        <div className="absolute -left-16 top-1/3 h-56 w-56 rounded-full bg-white/10" />
        <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-lift"><img src={icon} alt="" className="h-11 w-11" /></span>
        <div className="relative">
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight">
            {isLogin ? 'Welcome back.' : 'Your health, on your schedule.'}
          </h1>
          <ul className="mt-8 space-y-3 text-white/90">
            {['Browse doctors and clinics', 'See open slots for every day', 'Keep all your bookings in one place'].map((t) => (
              <li key={t} className="flex items-center gap-3"><span className="grid h-6 w-6 place-items-center rounded-full bg-white/20"><Check size={14} strokeWidth={3} /></span>{t}</li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-white/70">© 2026 BookMyDoc</p>
      </section>

      <section className="flex items-center justify-center px-4 py-12">
        <form onSubmit={submit} className="rise w-full max-w-sm space-y-5">
          <div className="pb-2">
            <h2 className="font-display text-4xl font-bold tracking-tight">{isLogin ? 'Sign in' : 'Create account'}</h2>
            <p className="mt-2 text-mute">{isLogin ? 'Enter your details to continue.' : 'It only takes a minute.'}</p>
          </div>
          {!isLogin && <div><label className="label" htmlFor="username">Username</label><input id="username" name="username" required className="input" /></div>}
          <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" required className="input" /></div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <div className="relative">
              <input id="password" name="password" type={show ? 'text' : 'password'} minLength={8} required className="input !pr-12" />
              <button type="button" onClick={() => setShow(!show)} aria-label="Show password" className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-mute hover:text-ink">
                {show ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {!isLogin && <p className="mt-2 text-xs text-mute">At least 8 characters.</p>}
          </div>
          {err && <p className="msg">{err}</p>}
          <button disabled={busy} className="btn btn-brand w-full !py-4">{busy ? 'One moment…' : isLogin ? 'Sign in' : 'Create account'}</button>
          <p className="text-center text-sm text-mute">
            {isLogin ? 'New here? ' : 'Already registered? '}
            <Link to={isLogin ? '/register' : '/login'} className="font-semibold text-brand hover:underline">{isLogin ? 'Create an account' : 'Sign in'}</Link>
          </p>
        </form>
      </section>
    </div>
  )
}
