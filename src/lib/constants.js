// Durasi maksimum pengisian sebelum muncul peringatan (2 jam).
// Timer tetap berjalan setelah lewat batas ini — hanya memunculkan peringatan.
//
// MODE TES: buka URL dengan ?test=1 untuk memperpendek batas jadi 20 detik,
// supaya alarm & notifikasi bisa diuji tanpa menunggu 2 jam.
const TWO_HOURS = 2 * 60 * 60 * 1000
const TEST_LIMIT = 20 * 1000 // 20 detik

const isTestMode =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('test') === '1'

export const MAX_DURATION_MS = isTestMode ? TEST_LIMIT : TWO_HOURS
export const IS_TEST_MODE = isTestMode

// Anggota default (seed) kalau tabel members masih kosong.
export const DEFAULT_MEMBERS = ['Gita', 'Devi', 'Mima', 'Elsa']

// Nama tabel di Supabase.
export const TABLES = {
  members: 'members',
  sessions: 'fill_sessions',
}

// Status sesi pengisian.
export const SESSION_STATUS = {
  running: 'running',
  done: 'done',
}
