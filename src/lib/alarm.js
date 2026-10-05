// Modul alarm: bunyi + notifikasi HP saat pengisian melewati batas waktu.
//
// Suara:
// - Jika ada file public/alarm.mp3 → pakai itu (suara kustom dari user).
// - Jika tidak ada / gagal → fallback ke "beep" sintetis via Web Audio API.
// Tanpa getar (sesuai permintaan).

let audioEl = null
let audioElFailed = false

let audioCtx = null
let beepTimer = null
let usingBeep = false

// Siapkan elemen <audio> untuk file kustom. URL relatif ke root situs.
function getAudioEl() {
  if (audioEl || audioElFailed) return audioEl
  try {
    audioEl = new Audio('/alarm.mp3')
    audioEl.loop = true
    audioEl.preload = 'auto'
    // Jika file tidak ada (404) atau tak bisa diputar → tandai gagal → fallback beep.
    audioEl.addEventListener('error', () => {
      audioElFailed = true
      audioEl = null
    })
  } catch {
    audioElFailed = true
    audioEl = null
  }
  return audioEl
}

// "Unlock" audio saat interaksi user (klik), supaya browser mengizinkan
// pemutaran suara nanti (autoplay policy butuh gesture user lebih dulu).
// Dipanggil ketika user memilih anggota untuk memulai pengisian.
export function unlockAudio() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (Ctx) {
      if (!audioCtx) audioCtx = new Ctx()
      if (audioCtx.state === 'suspended') audioCtx.resume()
    }
  } catch {
    /* abaikan */
  }
  // Priming elemen audio file (play lalu pause) agar siap diputar otomatis.
  try {
    const el = getAudioEl()
    if (el) {
      const p = el.play()
      if (p && typeof p.then === 'function') {
        p.then(() => {
          el.pause()
          el.currentTime = 0
        }).catch(() => {
          /* file tidak ada / diblokir → nanti fallback beep */
        })
      }
    }
  } catch {
    /* abaikan */
  }
}

// --- Fallback beep sintetis (tidak perlu file apa pun) ---
function playBeepPattern() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    if (!audioCtx) audioCtx = new Ctx()
    if (audioCtx.state === 'suspended') audioCtx.resume()

    // Dua nada pendek "beng-beng".
    const now = audioCtx.currentTime
    const freqs = [880, 660]
    freqs.forEach((f, i) => {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      const t0 = now + i * 0.28
      osc.type = 'square'
      osc.frequency.value = f
      gain.gain.setValueAtTime(0.0001, t0)
      gain.gain.exponentialRampToValueAtTime(0.25, t0 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.24)
      osc.connect(gain).connect(audioCtx.destination)
      osc.start(t0)
      osc.stop(t0 + 0.26)
    })
  } catch {
    /* abaikan */
  }
}

// Mulai alarm (berulang sampai stopAlarm dipanggil).
export function startAlarm() {
  const el = getAudioEl()
  if (el && !audioElFailed) {
    usingBeep = false
    const p = el.play()
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        // Browser blokir autoplay / file bermasalah → fallback beep.
        usingBeep = true
        startBeepLoop()
      })
    }
    return
  }
  // Tidak ada file → beep.
  usingBeep = true
  startBeepLoop()
}

function startBeepLoop() {
  if (beepTimer) return
  playBeepPattern()
  beepTimer = setInterval(playBeepPattern, 1600)
}

// Hentikan alarm (suara).
export function stopAlarm() {
  if (audioEl) {
    try {
      audioEl.pause()
      audioEl.currentTime = 0
    } catch {
      /* abaikan */
    }
  }
  if (beepTimer) {
    clearInterval(beepTimer)
    beepTimer = null
  }
  usingBeep = false
}

// --- Notifikasi HP ---

// Minta izin notifikasi (sekali). Aman dipanggil berkali-kali.
export async function ensureNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  try {
    return await Notification.requestPermission()
  } catch {
    return Notification.permission
  }
}

// Tampilkan notifikasi HP. Tanpa getar (silent terkait getar).
export function showOverLimitNotification(memberName) {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return
  try {
    new Notification('💧 Toren sudah 1,5 jam!', {
      body: `${memberName || 'Seseorang'} mengisi toren lebih dari 1 jam 30 menit. Segera cek & matikan pompa.`,
      icon: '/droplet.svg',
      tag: 'toren-over-limit', // cegah numpuk
      renotify: true,
      silent: false,
    })
  } catch {
    /* abaikan */
  }
}
