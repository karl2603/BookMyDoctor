import { createContext, useContext, useState, type ReactNode } from 'react'
import { api, getToken, setToken, type Role } from './api'

interface AuthState {
  token: string | null
  role: Role | null
  name: string
  login: (email: string, password: string) => Promise<Role>
  logout: () => void
}

const Ctx = createContext<AuthState>(null!)
export const useAuth = () => useContext(Ctx)
export const homeOf = (r: Role | null) => (r === 'DOCTOR' ? '/doctor' : '/doctors')

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTok] = useState(getToken())
  const [role, setRole] = useState(localStorage.getItem('bmd_role') as Role | null)
  const [name, setName] = useState(localStorage.getItem('bmd_name') ?? '')

  async function login(email: string, password: string) {
    const res = await api.login(email, password)
    const t = typeof res === 'string' ? res : res.token
    setToken(t); setTok(t)
    const r: Role = typeof res === 'object' && res.role
      ? (res.role.includes('DOCTOR') ? 'DOCTOR' : 'PATIENT')
      : await api.detectRole()
    const n = (typeof res === 'object' && res.username) || email.split('@')[0]
    localStorage.setItem('bmd_role', r); localStorage.setItem('bmd_name', n)
    setRole(r); setName(n)
    return r
  }
  function logout() {
    setToken(null); localStorage.removeItem('bmd_role'); localStorage.removeItem('bmd_name')
    setTok(null); setRole(null); setName('')
  }
  return <Ctx.Provider value={{ token, role, name, login, logout }}>{children}</Ctx.Provider>
}
