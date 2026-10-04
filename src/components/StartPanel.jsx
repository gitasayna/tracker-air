import { useState } from 'react'
import MemberPicker from './MemberPicker'

// Panel saat tidak ada sesi berjalan.
// - Jika hari ini sudah terisi (filledToday) → terkunci; tamu bisa tekan
//   "Isi lagi" untuk membuka pilihan anggota meski sudah terisi hari ini.
// - Jika belum terisi → langsung tampilkan pemilih anggota.
export default function StartPanel({ members, filledToday, onPick }) {
  const [unlocked, setUnlocked] = useState(false)
  const locked = filledToday && !unlocked

  if (locked) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center shadow-sm">
        <span className="text-4xl" aria-hidden>
          ✅
        </span>
        <h2 className="mt-3 text-lg font-bold text-emerald-800">
          Toren sudah diisi hari ini
        </h2>
        <p className="mt-1 text-sm text-emerald-700">
          Pengisian harian sudah tercatat. Tidak perlu mengisi lagi kecuali
          memang diperlukan.
        </p>
        <button
          type="button"
          onClick={() => setUnlocked(true)}
          className="mt-5 rounded-xl border border-emerald-300 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
        >
          Isi lagi
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-800">
        Siapa yang menyalakan?
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Pilih anggota untuk mulai mencatat pengisian toren.
      </p>
      {filledToday && unlocked && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Catatan: toren sudah terisi hari ini — ini pengisian tambahan.
        </p>
      )}
      <div className="mt-5">
        <MemberPicker members={members} onPick={onPick} />
      </div>
    </div>
  )
}
