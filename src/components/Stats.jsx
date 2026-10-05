import { useMemo } from 'react'
import { computeStats } from '../lib/stats'
import { formatDuration } from '../lib/time'

// Statistik ringkas dari riwayat pengisian.
export default function Stats({ history }) {
  const stats = useMemo(() => computeStats(history), [history])

  if (stats.total === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-slate-500">
          Belum ada data statistik. Mulai mengisi toren dulu ya.
        </p>
      </div>
    )
  }

  const maxCount = stats.perMember[0]?.count || 1

  return (
    <div className="space-y-4">
      {/* Kartu angka ringkas */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total pengisian" value={stats.total} />
        <StatCard label="Hari ini" value={stats.todayCount} />
        <StatCard
          label="Rata-rata durasi"
          value={formatDuration(stats.avgDuration)}
          mono
        />
        <StatCard
          label="Lewat batas"
          value={stats.overLimitCount}
          danger={stats.overLimitCount > 0}
        />
      </div>

      {/* Pengisi tersering */}
      {stats.topFiller && (
        <div className="flex items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-lg font-bold text-white">
            {stats.topFiller.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="text-xs text-slate-500">Paling sering mengisi</p>
            <p className="text-sm font-bold text-slate-800">
              {stats.topFiller.name}{' '}
              <span className="font-normal text-slate-500">
                · {stats.topFiller.count}×
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Rincian per anggota (bar sederhana) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-slate-600">
          Pengisian per anggota
        </p>
        <ul className="space-y-2.5">
          {stats.perMember.map((m) => (
            <li key={m.name}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">{m.name}</span>
                <span className="text-slate-500">{m.count}×</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${(m.count / maxCount) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function StatCard({ label, value, mono, danger }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
      <p
        className={`font-bold ${mono ? 'font-mono text-lg' : 'text-2xl'} ${
          danger ? 'text-red-600' : 'text-slate-800'
        }`}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[11px] leading-tight text-slate-400">{label}</p>
    </div>
  )
}
