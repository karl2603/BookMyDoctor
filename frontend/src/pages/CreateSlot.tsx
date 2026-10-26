import type { FormEvent } from 'react'
import { CalendarPlus } from 'lucide-react'

// YOUR PART. The page and form markup are done — the logic is yours:
// TODO 1: define a `SlotRequest` interface and add `createSlot` to the `api` object in src/api.ts
//         (POST /slots, body { startTime, endTime } as "yyyy-MM-ddTHH:mm:ss").
// TODO 2: add state for `error`, `success` and `busy`, then uncomment the message blocks in the JSX.
// TODO 3: in handleSubmit read the two inputs (datetime-local gives "2026-10-24T18:00"),
//         call createSlot, reset the form, and show the backend message on 400 / 409.
export default function CreateSlot() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }

  return (
    <div className="page">
      <span className="eyebrow">Create slot</span>
      <h1 className="h1 mt-5 max-w-xl">Open up a <span className="text-brand">new time.</span></h1>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_440px]">
        <ul className="space-y-5 self-start">
          {[
            ['Start before end', 'The start time has to come before the end time.'],
            ['No overlaps', 'A new slot can\u2019t overlap one you already have.'],
            ['Think in blocks', 'Half-hour blocks keep the schedule easy for patients to read.'],
          ].map(([t, d], i) => (
            <li key={t} className="card flex gap-5 p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 font-display text-xl font-bold text-brand">{i + 1}</span>
              <div><p className="font-display text-xl font-semibold">{t}</p><p className="mt-1 text-mute">{d}</p></div>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} className="card space-y-6 p-8 shadow-lift">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white shadow-brand"><CalendarPlus size={22} /></span>
            <h2 className="font-display text-2xl font-semibold">New slot</h2>
          </div>
          <div><label className="label" htmlFor="startTime">Starts</label><input id="startTime" name="startTime" type="datetime-local" required className="input" /></div>
          <div><label className="label" htmlFor="endTime">Ends</label><input id="endTime" name="endTime" type="datetime-local" required className="input" /></div>

          {/* {error && <p className="msg">{error}</p>} */}
          {/* {success && <p className="flex items-center gap-2 rounded-xl bg-ok-50 px-4 py-3 text-sm font-medium text-ok"><Check size={16} />Slot created.</p>} */}

          <button className="btn btn-brand w-full !py-4">Create slot</button>
        </form>
      </div>
    </div>
  )
}
