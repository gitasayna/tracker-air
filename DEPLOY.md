# 🚀 Panduan Deploy Toren Tracker (tanpa install apa pun)

Tujuan: aplikasi bisa dibuka seluruh keluarga lewat **link website** di HP/laptop
masing-masing, dengan data toren yang **sama & realtime** di semua perangkat.

Semua langkah di bawah dikerjakan **lewat browser** — tidak perlu install Node,
tidak perlu terminal. Perkiraan waktu: **± 10 menit**.

Urutannya:

1. **Supabase** — bikin database (biar data nyambung antar HP) → ambil 2 kunci
2. **Vercel** — publish aplikasi → dapat link website
3. **Share** — kirim link ke grup keluarga

> 💡 Istilah singkat:
> - **Supabase** = tempat menyimpan data (siapa yang isi, jam, riwayat).
> - **Vercel** = tempat "menayangkan" website-nya biar punya link publik.
> - Keduanya **gratis** untuk pemakaian seperti ini.

---

## BAGIAN 1 — Setup Supabase (database)

### 1.1 Buat akun & project

1. Buka **https://supabase.com** → klik **Start your project** / **Sign in**.
2. Login paling gampang pakai **GitHub** (akun yang sama dengan repo).
3. Klik **New project**.
4. Isi:
   - **Name**: `tracker-air` (bebas)
   - **Database Password**: buat password apa saja → **simpan baik-baik**
     (jarang dipakai lagi, tapi jangan sampai hilang).
   - **Region**: pilih yang dekat, mis. **Southeast Asia (Singapore)**.
5. Klik **Create new project**. Tunggu ± 1–2 menit sampai project siap.

### 1.2 Jalankan skrip database

1. Di menu kiri, klik ikon **SQL Editor** (ikon `</>`).
2. Klik **New query**.
3. Buka file **`supabase/schema.sql`** di repo ini
   (https://github.com/gitasayna/tracker-air/blob/main/supabase/schema.sql),
   klik tombol **Copy raw file**, lalu **tempel** seluruhnya ke editor SQL.
4. Klik **Run** (atau tekan `Ctrl/Cmd + Enter`).
5. Kalau muncul **Success. No rows returned**, berarti berhasil. ✅
   Ini otomatis membuat tabel, mengisi anggota awal (Gita, Devi, Mima, Elsa),
   dan menyalakan fitur realtime.

### 1.3 Ambil 2 kunci (URL & anon key)

1. Di menu kiri, klik **Project Settings** (ikon gerigi) → **API**.
2. Catat 2 nilai ini (nanti dipakai di Vercel):
   - **Project URL** → contoh: `https://abcdefgh.supabase.co`
   - **Project API keys → `anon` `public`** → string panjang.

> ⚠️ Pakai key **`anon public`**, **BUKAN** `service_role`. Yang `service_role`
> itu rahasia dan tidak boleh dipasang di aplikasi web.

---

## BAGIAN 2 — Deploy ke Vercel (dapat link website)

### 2.1 Hubungkan repo

1. Buka **https://vercel.com** → **Sign Up / Log In** → pilih **Continue with GitHub**.
2. Di dashboard, klik **Add New…** → **Project**.
3. Cari repo **`tracker-air`** → klik **Import**.
   (Kalau belum muncul, klik **Adjust GitHub App Permissions** dan beri akses
   ke repo tersebut.)

### 2.2 Isi Environment Variables (hubungkan ke Supabase)

Di halaman konfigurasi sebelum deploy, buka bagian **Environment Variables**
lalu tambahkan **2 variabel** ini (ketik persis, huruf besar/kecil penting):

| Name (Key)                | Value                                  |
| ------------------------- | -------------------------------------- |
| `VITE_SUPABASE_URL`       | *(Project URL dari langkah 1.3)*       |
| `VITE_SUPABASE_ANON_KEY`  | *(anon public key dari langkah 1.3)*   |

> Framework akan terdeteksi otomatis sebagai **Vite** (Build Command `npm run build`,
> Output `dist`). Tidak perlu diubah.

### 2.3 Deploy

1. Klik **Deploy**. Tunggu ± 1–2 menit.
2. Setelah selesai, kamu dapat link seperti **`https://tracker-air.vercel.app`**.
3. Klik **Visit** untuk membukanya. 🎉

> Jika banner kuning "mode lokal" masih muncul, berarti 2 env variable di atas
> belum terbaca → cek ejaannya di **Settings → Environment Variables**, lalu
> **Redeploy** (menu **Deployments** → titik tiga → **Redeploy**).

---

## BAGIAN 3 — Share ke keluarga

1. Kirim link `https://tracker-air.vercel.app` ke grup keluarga.
2. Saran: **tambahkan ke Home Screen HP** biar seperti aplikasi:
   - **Android (Chrome)**: menu titik tiga → **Add to Home screen**.
   - **iPhone (Safari)**: tombol **Share** → **Add to Home Screen**.

Sekarang kalau Gita menyalakan pompa dan menekan tombolnya, Devi/Mima/Elsa
langsung melihat timer berjalan di HP masing-masing. ✅

---

## Update aplikasi nanti

Setiap kali ada perubahan kode yang di-push ke branch `main` di GitHub,
Vercel **otomatis deploy ulang** — link tetap sama, tinggal refresh.

---

## Bantuan cepat (troubleshooting)

| Gejala | Penyebab & solusi |
| --- | --- |
| Banner kuning "mode lokal" | Env variable belum terbaca → periksa nama `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`, lalu Redeploy. |
| Data tidak sinkron antar HP | Skrip `schema.sql` belum dijalankan, atau pakai env Supabase yang salah. |
| Deploy gagal (build error) | Buka tab **Deployments** → klik deploy yang gagal → baca log. Kirim pesannya ke saya. |
| Anggota kosong | Jalankan ulang `schema.sql` di SQL Editor (aman diulang). |

Ada yang bingung di langkah mana pun — kabari saya nomor langkahnya, nanti saya pandu.
