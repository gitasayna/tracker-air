import { useEffect, useRef, useState } from 'react'
import { useNow } from '../hooks/useNow'
import { MAX_DURATION_MS } from '../lib/constants'
import { formatClock, formatDuration } from '../lib/time'
import {
  startAlarm,
  stopAlarm,
  ensureNotificationPermission,
  showOverLimitNotification,
} from '../lib/alarm'

// Panel sesi pengisian yang sedang berjalan: menampilkan siapa, jam mulai,
// timer berjalan, dan tombol stop manual. Lewat 2 jam → peringatan + alarm.
export default function ActiveFill({ session, onStop }) {
  const now = useNow(1000, true)
  const started = new Date(session.started_at).getTime()
  const elapsed = Math.max(0, now - started)
  const overLimit = elapsed >= MAX_DURATION_MS

  // Alarm hidup/mati. User bisa membisukan tanpa menghentikan pengisian.
  const [alarmActive, setAlarmActive] = useState(false)
  const [muted, setMuted] = useState(false)
  const firedRef = useRef(false) // agar notifikasi hanya sekali per sesi

  // Saat tembus 2 jam: nyalakan alarm + kirim notifikasi (sekali).
  useEffect(() => {
    if (overLimit && !muted) {
      setAlarmActive(true)
      startAlarm()
      if (!firedRef.current) {
        firedRef.current = true
        showOverLimitNotification(session.member_name)
      }
    }
    return () => stopAlarm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overLimit, muted])

  // Pastikan alarm berhenti saat komponen hilang (mis. sesi di-stop).
  useEffect(() => {
    return () => stopAlarm()
  }, [])

  const handleMute = () => {
    setMuted(true)
    setAlarmActive(false)
    stopAlarm()
  }

  const handleStop = () => {
    stopAlarm()
    onStop()
  }

  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm transition ${
        overLimit ? 'border-red-300 bg-red-50' : 'border-brand-200 bg-brand-50'
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
            overLimit ? 'bg-red-100' : 'animate-fill-pulse bg-brand-100'
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

      {/* Tombol matikan alarm — hanya muncul saat alarm sedang berbunyi */}
      {alarmActive && (
        <button
          type="button"
          onClick={handleMute}
          className="mt-3 w-full rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          🔕 Matikan alarm (pengisian tetap jalan)
        </button>
      )}

      <button
        type="button"
        onClick={handleStop}
        className="mt-3 w-full rounded-xl bg-slate-800 px-4 py-3 text-base font-semibold text-white transition hover:bg-slate-900 active:scale-[0.99]"
      >
        Stop &amp; Simpan ke Riwayat
      </button>

      {/* Ajak aktifkan notifikasi HP jika belum diizinkan */}
      <NotifyPrompt />
    </div>
  )
}

// Tombol kecil untuk meminta izin notifikasi HP (muncul jika belum granted).
function NotifyPrompt() {
  const supported =
    typeof window !== 'undefined' && 'Notification' in window
  const [perm, setPerm] = useState(
    supported ? Notification.permission : 'unsupported',
  )

  if (!supported || perm === 'granted' || perm === 'denied') return null

  const ask = async () => {
    const result = await ensureNotificationPermission()
    setPerm(result)
  }

  return (
    <button
      type="button"
      onClick={ask}
      className="mt-3 w-full rounded-xl bg-brand-50 px-4 py-2 text-xs font-medium text-brand-700 transition hover:bg-brand-100"
    >
      🔔 Aktifkan notifikasi HP (biar tetap diingatkan walau buka app lain)
    </button>
  )
}
