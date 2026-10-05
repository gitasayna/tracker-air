// Menghitung statistik ringkas dari riwayat pengisian (sesi yang sudah selesai).
import { MAX_DURATION_MS } from './constants'
import { todayKey } from './time'

export function computeStats(history) {
  const total = history.length

  // Durasi tiap sesi (ms).
  const durations = history
    .map((s) => {
      if (!s.stopped_at) return null
      return new Date(s.stopped_at).getTime() - new Date(s.started_at).getTime()
    })
    .filter((d) => d != null && d >= 0)

  const avgDuration =
    durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0

  // Pengisian hari ini.
  const key = todayKey()
  const todayCount = history.filter(
    (s) => todayKey(new Date(s.started_at)) === key,
  ).length

  // Jumlah "kebablasan" (lewat batas waktu).
  const overLimitCount = durations.filter((d) => d >= MAX_DURATION_MS).length

  // Hitung per anggota (berdasarkan member_name).
  const perMemberMap = new Map()
  for (const s of history) {
    const name = s.member_name || '—'
    perMemberMap.set(name, (perMemberMap.get(name) || 0) + 1)
  }
  const perMember = [...perMemberMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  const topFiller = perMember.length > 0 ? perMember[0] : null

  return {
    total,
    todayCount,
    avgDuration,
    overLimitCount,
    perMember,
    topFiller,
  }
}
