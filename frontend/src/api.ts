export type Role = 'PATIENT' | 'DOCTOR'
export type Slot = { slotId: number; startTime: string; endTime: string; status: string }
export type Booking = {
  id: number; doctorName: string; clinicName: string; clinicAddress: string
  startTime: string; endTime: string; status: string; bookedAt: string
}
export type Doctor = {
  doctorId: number; name: string; clinicName: string; clinicAddress: string
  specialization: string; consultationFee: number
}
export type LoginResult = string | { token: string; role?: string; username?: string }

const TOKEN_KEY = 'bmd_token'
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t: string | null) =>
  t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY)

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function request<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const token = getToken()
  const res = await fetch(`/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let data: unknown = text
  try { data = text ? JSON.parse(text) : null } catch { /* login may return a bare token string */ }
  if (!res.ok) {
    const msg = data && typeof data === 'object' && 'message' in data ? String((data as { message: unknown }).message)
      : typeof data === 'string' && data ? data : `Request failed (${res.status})`
    throw new ApiError(res.status, msg)
  }
  return data as T
}

export const api = {
  login: (email: string, password: string) => request<LoginResult>('/auth/login', 'POST', { email, password }),
  register: (username: string, email: string, password: string) =>
    request<string>('/auth/register', 'POST', { username, email, password }),
  // Fallback when login only returns a token: doctor-only route => 200 doctor, 403 patient.
  detectRole: async (): Promise<Role> => {
    try { await request('/doctors/mySlots'); return 'DOCTOR' }
    catch (e) { if (e instanceof ApiError && e.status === 403) return 'PATIENT'; throw e }
  },
  doctors: async (): Promise<Doctor[]> => {
  const list = await request<{
    id: number; doctorName: string; clinicName: string
    clinicAddress: string; specialization: string; consultationFee: number
  }[]>('/doctors/doctors')
  return list.map(({ id, doctorName, ...d }) => ({ ...d, doctorId: id, name: doctorName }))
},
  allSlots: (doctorId: string | number) => request<Slot[]>(`/doctors/${doctorId}/allslots`),
  book: (slotId: number) => request<Booking>('/bookings', 'POST', { slotId }),
  myBookings: () => request<Booking[]>('/bookings/mybookings'),
  mySlots: () => request<Slot[]>('/doctors/mySlots'),
  // TODO (you): createSlot goes here
}

export const errMsg = (x: unknown) => (x instanceof ApiError ? x.message : 'Could not reach the server')
export const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
export const fmtDay = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
export const fmtFee = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
export const today = () => new Date().toLocaleDateString('en-CA') // yyyy-mm-dd
export const isPast = (iso: string) => new Date(iso).getTime() < Date.now()
export const byStart = (a: Slot, b: Slot) => a.startTime.localeCompare(b.startTime)
