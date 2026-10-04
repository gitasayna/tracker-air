import { useNow } from '../hooks/useNow'
import { MAX_DURATION_MS } from '../lib/constants'
import { formatClock, formatDuration } from '../lib/time'

// Panel sesi pengisian yang sedang berjalan: menampilkan siapa, jam mulai,
// timer berjalan, dan tombol stop manual. Lewat 2 jam → peringatan (tetap jalan).
export default function ActiveFill({ session, onStop }) {
  const now = useNow(1000, true)
  const started = new Date(session.started_at).getTime()
  const elapsed = Math.max(0, now - started)
  const overLimit = elapsed >= MAX_DURATION_MS

  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm transition ${
        overLimit
          ? 'border-red-300 bg-red-50'
          : 'border-brand-200 bg-brand-50'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Sedang mengisi</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">
            {session.member_name}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Mulai pukul {formatClock(session.started_at)}
          </p>
        </div>
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
            overLimit
              ? 'bg-red-100'
              : 'animate-fill-pulse bg-brand-100'
          }`}
          aria-hidden
        >
          💧
        </span>
      </div>

      <div className="mt-6 text-center">
        <p
          className={`font-mono text-5xl font-bold tabular-nums ${
            overLimit ? 'text-red-600' : 'text-brand-700'
          }`}
        >
          {formatDuration(elapsed)}
        </p>
        <p className="mt-2 text-xs text-slate-400">Batas aman 02:00:00</p>
      </div>

      {overLimit && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-100 p-3 text-sm text-red-700">
          <span aria-hidden>⚠️</span>
          <p>
            Sudah lebih dari 2 jam! Toren mungkin sudah penuh — segera cek dan
            matikan pompa. Timer tetap berjalan sampai dihentikan manual.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onStop}
        className="mt-6 w-full rounded-xl bg-slate-800 px-4 py-3 text-base font-semibold text-white transition hover:bg-slate-900 active:scale-[0.99]"
      >
        Stop &amp; Simpan ke Riwayat
      </button>
    </div>
  )
}
