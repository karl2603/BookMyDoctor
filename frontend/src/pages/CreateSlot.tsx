import type { FormEvent } from 'react'
import { CalendarPlus, Check } from 'lucide-react'
import { useState } from 'react';
import { api, errMsg, today, type SlotRequest } from '../api';

export default function CreateSlot() {
  
  const [startTime, setStartTime] = useState<string>('');
  const [duration, setDuration] = useState<30 | 60>(30);
  const endTime = startTime
  ? new Date(new Date(startTime).getTime() + duration * 60_000)
  : null;

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const f = new FormData(e.currentTarget);
    
    const slot: SlotRequest = {
      'startTime' : String(f.get('startTime'))+":00",
      'endTime' : String(f.get('endTime'))+":00"
    };

    setStartTime('')
    setDuration(30);

    try{
      await api.createSlots(slot);
      setSuccess(true);
    }
    catch(e){
      setError(errMsg(e));
      setSuccess(false);
    }
  }

  return (
  <div className="page">
    <span className="eyebrow">Create slot</span>
    <h1 className="h1 mt-5 max-w-xl">
      Open up a <span className="text-brand">new time.</span>
    </h1>

    <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_440px]">
      <ul className="space-y-5 self-start">
        {[
          ['Start before end', 'The start time has to come before the end time.'],
          ['No overlaps', 'A new slot can’t overlap one you already have.'],
          ['Fixed durations', 'Choose either a 30-minute or 1-hour slot.'],
        ].map(([t, d], i) => (
          <li key={t} className="card flex gap-5 p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 font-display text-xl font-bold text-brand">
              {i + 1}
            </span>
            <div>
              <p className="font-display text-xl font-semibold">{t}</p>
              <p className="mt-1 text-mute">{d}</p>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="card space-y-6 p-8 shadow-lift">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white shadow-brand">
            <CalendarPlus size={22} />
          </span>
          <h2 className="font-display text-2xl font-semibold">New slot</h2>
        </div>

        <div>
          <label className="label" htmlFor="startTime">Starts</label>
          <input
            id="startTime"
            name="startTime"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            min={today() + 'T00:00'}
            required
            className="input"
          />
        </div>

        <div>
          <label className="label" htmlFor="duration">Duration</label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value) as 30 | 60)}
            className="input"
          >
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
          </select>
        </div>

        <div>
          <label className="label">Ends at</label>
          <div className="input">
            {endTime
              ? endTime.toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })
              : 'Select a start time'}
          </div>

          {/* Included in FormData for the existing submit handler */}
          <input
            type="hidden"
            name="endTime"
            value={
              endTime
                ? new Date(
                    endTime.getTime() - endTime.getTimezoneOffset() * 60_000
                  ).toISOString().slice(0, 16)
                : ''
            }
          />
        </div>

        {error && <p className="msg">{error}</p>}

        {success && (
          <p className="flex items-center gap-2 rounded-xl bg-ok-50 px-4 py-3 text-sm font-medium text-ok">
            <Check size={16} />
            Slot created.
          </p>
        )}

        <button className="btn btn-brand w-full !py-4">
          Create slot
        </button>
      </form>
    </div>
  </div>
)
}
