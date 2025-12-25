// 인증 관련 유틸리티 함수

import { supabaseClient } from './supabase-client'

/**
 * 완전한 로그아웃 처리
 * - Supabase 세션 정리
 * - 로컬 스토리지의 사용자 진행도 데이터 정리
 * - 모든 인증 관련 데이터 제거
 */
export async function handleLogout(): Promise<void> {
  try {
    // 현재 사용자 ID 가져오기 (로그아웃 전)
    const { data: { session } } = await supabaseClient.auth.getSession()
    const userId = session?.user?.id

    // Supabase 세션 정리 (모든 세션에서 로그아웃)
    await supabaseClient.auth.signOut({ scope: 'global' })

    // 로컬 스토리지에서 사용자 진행도 데이터 정리
    if (userId && typeof window !== 'undefined') {
      localStorage.removeItem(`user_progress_${userId}`)
    }

    // 추가 보안: 모든 인증 관련 로컬 스토리지 항목 정리
    if (typeof window !== 'undefined') {
      // Supabase 관련 키들도 정리 (supabase는 자동으로 정리하지만 확실히 하기 위해)
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.includes('supabase') || key.includes('sb-'))) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
    }
  } catch (error) {
    console.error('로그아웃 중 오류 발생:', error)
    // 오류가 발생해도 로컬 스토리지는 정리
    if (typeof window !== 'undefined') {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.includes('user_progress_') || key.includes('supabase') || key.includes('sb-'))) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
    }
    throw error
  }
}

/**
 * 인증된 사용자 확인
 */
export async function getAuthenticatedUser() {
  const { data: { session }, error } = await supabaseClient.auth.getSession()
  
  if (error || !session) {
    return null
  }
  
  return session.user
}

/**
 * 인증 상태 확인 및 리다이렉트
 */
export async function requireAuth(): Promise<boolean> {
  const { data: { session }, error } = await supabaseClient.auth.getSession()
  
  if (error) {
    console.error('세션 확인 오류:', error)
    return false
  }
  
  return !!session
}

/**
 * 세션 유효성 검증 (만료 시간 확인)
 */
export async function validateSession(): Promise<boolean> {
  const { data: { session }, error } = await supabaseClient.auth.getSession()
  
  if (error || !session) {
    return false
  }
  
  // 세션 만료 시간 확인
  if (session.expires_at) {
    const expiresAt = new Date(session.expires_at * 1000)
    const now = new Date()
    
    if (expiresAt <= now) {
      // 만료된 세션 정리
      await supabaseClient.auth.signOut()
      return false
    }
  }
  
  return true
}
