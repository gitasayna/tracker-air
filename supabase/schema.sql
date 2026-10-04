-- =====================================================================
-- Toren Tracker — Skema database Supabase
-- Jalankan di: Supabase Dashboard > SQL Editor > New query > Run
-- =====================================================================

-- Ekstensi untuk gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Tabel anggota
-- ---------------------------------------------------------------------
create table if not exists public.members (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabel sesi pengisian toren
-- ---------------------------------------------------------------------
create table if not exists public.fill_sessions (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid references public.members (id) on delete set null,
  member_name text not null,
  status      text not null default 'running' check (status in ('running', 'done')),
  started_at  timestamptz not null default now(),
  stopped_at  timestamptz
);

create index if not exists fill_sessions_status_idx on public.fill_sessions (status);
create index if not exists fill_sessions_started_idx on public.fill_sessions (started_at desc);

-- ---------------------------------------------------------------------
-- Seed anggota awal (hanya jika tabel masih kosong)
-- ---------------------------------------------------------------------
insert into public.members (name)
select v.name
from (values ('Gita'), ('Devi'), ('Mima'), ('Elsa')) as v(name)
where not exists (select 1 from public.members);

-- ---------------------------------------------------------------------
-- Row Level Security
-- Catatan: aplikasi ini tidak memakai login (akses dengan anon key).
-- Kebijakan di bawah mengizinkan akses penuh via anon key — cocok untuk
-- pemakaian rumah/keluarga. Perketat sesuai kebutuhan bila diperlukan.
-- ---------------------------------------------------------------------
alter table public.members enable row level security;
alter table public.fill_sessions enable row level security;

drop policy if exists "members_all_access" on public.members;
create policy "members_all_access"
  on public.members for all
  using (true) with check (true);

drop policy if exists "fill_sessions_all_access" on public.fill_sessions;
create policy "fill_sessions_all_access"
  on public.fill_sessions for all
  using (true) with check (true);

-- ---------------------------------------------------------------------
-- Realtime: pastikan kedua tabel masuk ke publication supabase_realtime
-- ---------------------------------------------------------------------
alter publication supabase_realtime add table public.members;
alter publication supabase_realtime add table public.fill_sessions;
