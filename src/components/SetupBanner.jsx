// Banner yang muncul saat Supabase belum dikonfigurasi.
// App tetap jalan memakai localStorage, tapi data tidak realtime antar perangkat.
export default function SetupBanner() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      <p className="font-semibold">Mode lokal (Supabase belum dikonfigurasi)</p>
      <p className="mt-1 text-amber-700">
        Data saat ini disimpan di perangkat ini saja. Untuk sinkronisasi
        realtime antar perangkat, salin <code>.env.example</code> ke{' '}
        <code>.env</code> lalu isi <code>VITE_SUPABASE_URL</code> dan{' '}
        <code>VITE_SUPABASE_ANON_KEY</code>, kemudian jalankan skrip di{' '}
        <code>supabase/schema.sql</code>.
      </p>
    </div>
  )
}
