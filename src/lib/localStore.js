// Fallback penyimpanan lokal ketika Supabase belum dikonfigurasi.
// Berguna untuk demo/development tanpa backend. Data tersimpan di localStorage.

import { DEFAULT_MEMBERS, SESSION_STATUS } from './constants'

const KEY = 'toren-tracker:v1'

function uid() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  )
}

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function write(state) {
  localStorage.setItem(KEY, JSON.stringify(state))
  // Beri tahu listener di tab yang sama (storage event hanya lintas-tab).
  window.dispatchEvent(new CustomEvent('toren-local-change'))
}

function ensureSeed() {
  let state = read()
  if (!state) {
    state = {
      members: DEFAULT_MEMBERS.map((name, i) => ({
        id: uid(),
        name,
        active: true,
        created_at: new Date(Date.now() + i).toISOString(),
      })),
      sessions: [],
    }
    write(state)
  }
  return state
}

export const localStore = {
  isLocal: true,

  subscribe(callback) {
    const handler = () => callback()
    window.addEventListener('toren-local-change', handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('toren-local-change', handler)
      window.removeEventListener('storage', handler)
    }
  },

  async getMembers() {
    const state = ensureSeed()
    return [...state.members].sort((a, b) =>
      a.created_at.localeCompare(b.created_at),
    )
  },

  async addMember(name) {
    const state = ensureSeed()
    const member = {
      id: uid(),
      name: name.trim(),
      active: true,
      created_at: new Date().toISOString(),
    }
    state.members.push(member)
    write(state)
    return member
  },

  async updateMember(id, patch) {
    const state = ensureSeed()
    const m = state.members.find((x) => x.id === id)
    if (m) Object.assign(m, patch)
    write(state)
    return m
  },

  async removeMember(id) {
    const state = ensureSeed()
    state.members = state.members.filter((x) => x.id !== id)
    write(state)
  },

  async getSessions() {
    const state = ensureSeed()
    return [...state.sessions].sort((a, b) =>
      b.started_at.localeCompare(a.started_at),
    )
  },

  async startSession(memberId, memberName) {
    const state = ensureSeed()
    const session = {
      id: uid(),
      member_id: memberId,
      member_name: memberName,
      status: SESSION_STATUS.running,
      started_at: new Date().toISOString(),
      stopped_at: null,
    }
    state.sessions.push(session)
    write(state)
    return session
  },

  async stopSession(id) {
    const state = ensureSeed()
    const s = state.sessions.find((x) => x.id === id)
    if (s) {
      s.status = SESSION_STATUS.done
      s.stopped_at = new Date().toISOString()
    }
    write(state)
    return s
  },
}
