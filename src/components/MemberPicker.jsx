// Pilih siapa yang menyalakan pompa / mengisi toren.
export default function MemberPicker({ members, onPick, disabled }) {
  const active = members.filter((m) => m.active)

  if (active.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Belum ada anggota aktif. Tambahkan anggota di bagian "Kelola Anggota".
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {active.map((m) => (
        <button
          key={m.id}
          type="button"
          disabled={disabled}
          onClick={() => onPick(m)}
          className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-400 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700 group-hover:bg-brand-500 group-hover:text-white">
            {m.name.charAt(0).toUpperCase()}
          </span>
          <span className="text-sm font-medium text-slate-700">{m.name}</span>
        </button>
      ))}
    </div>
  )
}
