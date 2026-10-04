# 💧 Toren Tracker

Web app untuk mencatat pengisian toren (tangki) air rumah. Pilih siapa yang
menyalakan pompa, pantau timer, dan simpan riwayat pengisian. Data tersinkron
secara **realtime** antar perangkat lewat Supabase.

## Fitur

- **Pilih pengisi** — tombol anggota untuk menandai siapa yang menyalakan pompa.
- **Timer berjalan** — menghitung durasi pengisian secara live (HH:MM:SS).
- **Peringatan 2 jam** — lewat 2 jam muncul peringatan merah agar pompa dicek,
  tapi timer **tetap berjalan** sampai dihentikan manual.
- **Stop manual → riwayat** — menekan Stop menyimpan sesi ke riwayat beserta
  durasi dan jam mulai/selesai.
- **Kunci harian + "Isi lagi"** — jika toren sudah terisi hari ini, panel
  terkunci dengan status "sudah diisi"; tombol **Isi lagi** membuka pengisian
  tambahan untuk tamu/kebutuhan khusus.
- **Kelola anggota** — tambah / aktif-nonaktif / hapus anggota (default: Gita,
  Devi, Mima, Elsa).
- **Realtime Supabase** — perubahan langsung tampil di semua perangkat.

> Tanpa konfigurasi Supabase, aplikasi tetap jalan dalam **mode lokal**
> (localStorage) untuk demo — data hanya tersimpan di perangkat tersebut.

> 📱 **Mau dipakai keluarga lewat link website (tanpa install apa pun)?**
> Ikuti panduan deploy langkah-demi-langkah di **[DEPLOY.md](DEPLOY.md)**.

## Teknologi

- [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (Postgres + Realtime)

## Menjalankan secara lokal

```bash
# 1. Install dependensi
npm install

# 2. (Opsional) konfigurasi Supabase
cp .env.example .env
# lalu isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY

# 3. Jalankan dev server
npm run dev
```

Buka http://localhost:5173.

## Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com/).
2. Buka **SQL Editor**, tempel isi [`supabase/schema.sql`](supabase/schema.sql),
   lalu **Run**. Ini membuat tabel `members` & `fill_sessions`, seed anggota
   awal, mengaktifkan RLS, dan menambahkan tabel ke publication realtime.
3. Di **Project Settings → API**, salin **Project URL** dan **anon public key**
   ke file `.env`:

   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

4. Jalankan ulang `npm run dev`. Banner "mode lokal" akan hilang dan data
   menjadi realtime.

> Catatan keamanan: kebijakan RLS pada schema mengizinkan akses penuh melalui
> anon key (tanpa login), cocok untuk pemakaian keluarga. Perketat sesuai
> kebutuhan jika app diakses publik.

## Struktur

```
toren-tracker/
├── index.html
├── supabase/schema.sql        # skema + seed + RLS + realtime
├── src/
│   ├── App.jsx                # layout utama
│   ├── components/            # UI (StartPanel, ActiveFill, History, ...)
│   ├── hooks/                 # useTorenData, useNow
│   └── lib/                   # supabase, api, localStore, time, constants
└── ...
```

## Build

```bash
npm run build     # output ke dist/
npm run preview   # preview hasil build
```
