import { useEffect, useState } from 'react'

// Mengembalikan Date.now() yang di-update setiap `intervalMs` (default 1 detik).
// Dipakai untuk menghitung durasi timer berjalan tanpa menyimpan ke DB.
export function useNow(intervalMs = 1000, active = true) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!active) return
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs, active])

  return now
}
