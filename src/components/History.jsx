import { MAX_DURATION_MS } from '../lib/constants'
import { formatClock, formatDateLong, formatDuration } from '../lib/time'

// Daftar riwayat pengisian yang sudah selesai, dikelompokkan per tanggal.
export default function History({ history }) {
  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-slate-500">Belum ada riwayat pengisian.</p>
      </div>
    )
  }

  // Kelompokkan per tanggal (berdasarkan started_at).
  const groups = []
  const index = new Map()
  for (const s of history) {
    const dateLabel = formatDateLong(s.started_at)
    if (!index.has(dateLabel)) {
      index.set(dateLabel, groups.length)
      groups.push({ dateLabel, items: [] })
    }
    groups[index.get(dateLabel)].items.push(s)
  }

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div key={group.dateLabel}>
          <h3 className="mb-2 text-sm font-semibold text-slate-500">
            {group.dateLabel}
          </h3>
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {group.items.map((s) => {
              const dur =
                new Date(s.stopped_at).getTime() -
                new Date(s.started_at).getTime()
              const over = dur >= MAX_DURATION_MS
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                      {s.member_name?.charAt(0).toUpperCase() || '?'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {s.member_name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatClock(s.started_at)} – {formatClock(s.stopped_at)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 font-mono text-xs font-semibold ${
                      over
                        ? 'bg-red-100 text-red-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {formatDuration(dur)}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
