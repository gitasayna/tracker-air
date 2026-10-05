import { useCallback, useEffect, useMemo, useState } from 'react'
import * as api from '../lib/api'
import { SESSION_STATUS } from '../lib/constants'
import { todayKey } from '../lib/time'
import { unlockAudio, ensureNotificationPermission } from '../lib/alarm'

// Hook pusat: memuat members + sessions, berlangganan perubahan realtime,
// dan menyediakan aksi (start/stop/isi lagi/kelola anggota).
export function useTorenData() {
  const [members, setMembers] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    try {
      const [m, s] = await Promise.all([api.getMembers(), api.getSessions()])
      setMembers(m)
      setSessions(s)
      setError(null)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    const unsub = api.subscribeChanges(refresh)
    return unsub
  }, [refresh])

  // Sesi yang sedang berjalan (jika ada). Hanya satu toren → satu sesi aktif.
  const runningSession = useMemo(
    () => sessions.find((s) => s.status === SESSION_STATUS.running) || null,
    [sessions],
  )

  // Riwayat sesi yang sudah selesai (terbaru dulu).
  const history = useMemo(
    () => sessions.filter((s) => s.status === SESSION_STATUS.done),
    [sessions],
  )

  // Apakah toren sudah terisi hari ini (ada sesi selesai dengan tanggal hari ini)?
  const filledToday = useMemo(() => {
    const key = todayKey()
    return history.some((s) => todayKey(new Date(s.started_at)) === key)
  }, [history])

  // --- Actions ---
  const startFill = useCallback(
    async (member) => {
      if (runningSession) return
      // Interaksi klik ini dipakai untuk "unlock" audio & minta izin notifikasi,
      // supaya alarm bisa berbunyi otomatis saat tembus batas waktu nanti.
      unlockAudio()
      ensureNotificationPermission()
      await api.startSession(member.id, member.name)
      await refresh()
    },
    [runningSession, refresh],
  )

  const stopFill = useCallback(async () => {
    if (!runningSession) return
    await api.stopSession(runningSession.id)
    await refresh()
  }, [runningSession, refresh])

  const addMember = useCallback(
    async (name) => {
      await api.addMember(name)
      await refresh()
    },
    [refresh],
  )

  const updateMember = useCallback(
    async (id, patch) => {
      await api.updateMember(id, patch)
      await refresh()
    },
    [refresh],
  )

  const removeMember = useCallback(
    async (id) => {
      await api.removeMember(id)
      await refresh()
    },
    [refresh],
  )

  return {
    members,
    sessions,
    history,
    runningSession,
    filledToday,
    loading,
    error,
    usingLocal: api.usingLocal,
    actions: { startFill, stopFill, addMember, updateMember, removeMember, refresh },
  }
}
