import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Bersihkan nilai env dari spasi & tanda kutip yang kadang ikut ter-copy.
function clean(value) {
  if (typeof value !== 'string') return ''
  return value.trim().replace(/^["']|["']$/g, '')
}

const supabaseUrl = clean(rawUrl)
const supabaseKey = clean(rawKey)

// URL dianggap valid hanya jika berupa HTTP/HTTPS yang benar.
function isValidHttpUrl(value) {
  if (!value) return false
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

const urlValid = isValidHttpUrl(supabaseUrl)
const keyPresent = supabaseKey.length > 0

// Mendukung key format baru (sb_publishable_... / sb_secret_...) maupun
// key lama (anon JWT yang diawali "eyJ"). Peringatkan jika key rahasia dipakai.
const looksLikeSecret = /^sb_secret_/.test(supabaseKey)

// Pesan diagnostik supaya UI bisa memberi tahu persoalan konfigurasi.
export let configIssue = null
if (!urlValid && !keyPresent) {
  configIssue = null // belum dikonfigurasi sama sekali → mode lokal normal
} else if (!urlValid) {
  configIssue =
    'VITE_SUPABASE_URL tidak valid. Harus berupa URL lengkap, mis. https://xxxx.supabase.co'
} else if (!keyPresent) {
  configIssue = 'VITE_SUPABASE_ANON_KEY kosong. Isi dengan publishable/anon key.'
} else if (looksLikeSecret) {
  configIssue =
    'Terdeteksi SECRET key (sb_secret_...). Gunakan key publishable/anon, bukan secret.'
}

// Hanya buat client jika konfigurasi benar-benar lengkap & valid.
export const isSupabaseConfigured = urlValid && keyPresent && !looksLikeSecret

let client = null
if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseKey, {
      realtime: { params: { eventsPerSecond: 5 } },
    })
  } catch (err) {
    // Jangan sampai error inisialisasi membuat seluruh app blank.
    console.error('Gagal inisialisasi Supabase, fallback ke mode lokal:', err)
    client = null
    configIssue =
      'Gagal menghubungkan ke Supabase. Periksa URL & key, lalu deploy ulang.'
  }
}

export const supabase = client
