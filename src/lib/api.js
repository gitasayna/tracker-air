// Lapisan data: membungkus operasi Supabase, dengan fallback ke localStore
// saat Supabase belum dikonfigurasi (env kosong).

import { supabase } from './supabase'
import { localStore } from './localStore'
import { TABLES, SESSION_STATUS } from './constants'

// Pakai mode lokal jika client Supabase gagal/ tidak dibuat.
export const usingLocal = !supabase

// ---- Members ----

export async function getMembers() {
  if (usingLocal) return localStore.getMembers()
  const { data, error } = await supabase
    .from(TABLES.members)
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function addMember(name) {
  if (usingLocal) return localStore.addMember(name)
  const { data, error } = await supabase
    .from(TABLES.members)
    .insert({ name: name.trim(), active: true })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateMember(id, patch) {
  if (usingLocal) return localStore.updateMember(id, patch)
  const { data, error } = await supabase
    .from(TABLES.members)
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function removeMember(id) {
  if (usingLocal) return localStore.removeMember(id)
  const { error } = await supabase.from(TABLES.members).delete().eq('id', id)
  if (error) throw error
}

// ---- Sessions ----

export async function getSessions() {
  if (usingLocal) return localStore.getSessions()
  const { data, error } = await supabase
    .from(TABLES.sessions)
    .select('*')
    .order('started_at', { ascending: false })
  if (error) throw error
  return data
}

export async function startSession(memberId, memberName) {
  if (usingLocal) return localStore.startSession(memberId, memberName)
  const { data, error } = await supabase
    .from(TABLES.sessions)
    .insert({
      member_id: memberId,
      member_name: memberName,
      status: SESSION_STATUS.running,
      started_at: new Date().toISOString(),
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function stopSession(id) {
  if (usingLocal) return localStore.stopSession(id)
  const { data, error } = await supabase
    .from(TABLES.sessions)
    .update({
      status: SESSION_STATUS.done,
      stopped_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// ---- Realtime / change subscription ----
// Memanggil `onChange` setiap kali ada perubahan pada members / sessions.
export function subscribeChanges(onChange) {
  if (usingLocal) {
    return localStore.subscribe(onChange)
  }

  const channel = supabase
    .channel('toren-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABLES.members },
      onChange,
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABLES.sessions },
      onChange,
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
