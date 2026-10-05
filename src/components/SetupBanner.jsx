import { configIssue } from '../lib/supabase'

// Banner yang muncul saat aplikasi berjalan dalam mode lokal.
// - Jika ada masalah konfigurasi (URL/key salah) → tampilkan merah + detailnya.
// - Jika memang belum dikonfigurasi → tampilkan kuning (info ramah).
export default function SetupBanner() {
  if (configIssue) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        <p className="font-semibold">Konfigurasi Supabase bermasalah</p>
        <p className="mt-1 text-red-700">{configIssue}</p>
        <p className="mt-2 text-xs text-red-600">
          Perbaiki di hosting (Environment Variables), lalu deploy ulang.
          Sementara ini aplikasi berjalan di mode lokal (data per perangkat).
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      <p className="font-semibold">Mode lokal (Supabase belum dikonfigurasi)</p>
      <p className="mt-1 text-amber-700">
        Data saat ini disimpan di perangkat ini saja. Untuk sinkronisasi
        realtime antar perangkat, isi <code>VITE_SUPABASE_URL</code> dan{' '}
        <code>VITE_SUPABASE_ANON_KEY</code>, lalu jalankan skrip di{' '}
        <code>supabase/schema.sql</code>.
      </p>
    </div>
  )
}
