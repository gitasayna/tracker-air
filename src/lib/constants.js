// Durasi maksimum pengisian sebelum muncul peringatan (2 jam).
// Timer tetap berjalan setelah lewat batas ini — hanya memunculkan peringatan.
export const MAX_DURATION_MS = 2 * 60 * 60 * 1000 // 2 jam

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
