import { useState } from 'react'

// Kelola anggota: lihat daftar & tambah anggota baru.
// Tombol nonaktif/hapus sengaja dihilangkan agar tidak terpencit tak sengaja.
export default function MemberManager({ members, actions }) {
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setBusy(true)
    try {
      await actions.addMember(trimmed)
      setName('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-800">Kelola Anggota</h2>
      <p className="mt-1 text-sm text-slate-500">
        Daftar anggota rumah. Tambahkan nama baru bila perlu.
      </p>

      <form onSubmit={handleAdd} className="mt-4 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama anggota baru"
          className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          disabled={busy || !name.trim()}
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          Tambah
        </button>
      </form>

      <ul className="mt-4 space-y-2">
        {members.map((m) => (
          <li
            key={m.id}
            className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                m.active ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
              aria-hidden
            />
            <span
              className={`text-sm font-medium ${
                m.active ? 'text-slate-800' : 'text-slate-400 line-through'
              }`}
            >
              {m.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
