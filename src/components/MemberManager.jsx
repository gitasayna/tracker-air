import { useState } from 'react'

// Kelola anggota: tambah, aktif/nonaktif, hapus.
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
        Tambah, aktifkan, atau hapus anggota rumah.
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
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
          >
            <div className="flex items-center gap-2">
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
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => actions.updateMember(m.id, { active: !m.active })}
                className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
              >
                {m.active ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Hapus anggota "${m.name}"?`)) {
                    actions.removeMember(m.id)
                  }
                }}
                className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50"
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
