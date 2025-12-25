'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabaseClient } from '@/lib/supabase-client'
import { getUserStats } from '@/lib/user-progress'
import type { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSolved: 0,
    totalCorrect: 0,
    totalPoints: 0,
    accuracy: 0
  })

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      setUser(session.user)
      
      // 사용자 통계 가져오기
      const userStats = getUserStats(session.user.id)
      setStats(userStats)
      
      setLoading(false)
    }

    checkUser()

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        const userStats = getUserStats(session.user.id)
        setStats(userStats)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await supabaseClient.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/dashboard" className="text-2xl font-bold text-black">
              CLASSMATE
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/problems"
                className="px-4 py-2 text-gray-600 hover:text-black font-medium transition-colors"
              >
                문제 풀이
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 text-gray-600 hover:text-black font-medium transition-colors"
              >
                마이페이지
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-black hover:bg-neutral-800 text-white rounded-xl font-medium transition-colors"
              >
                로그아웃
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* 환영 메시지 */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-5xl font-bold text-black mb-3">
              환영합니다, {user?.email?.split('@')[0]}님! 👋
            </h1>
            <p className="text-xl text-gray-600">
              오늘도 열심히 학습해봐요!
            </p>
          </div>

          {/* 통계 카드 - 마이페이지로 이동 */}
          <Link href="/profile" className="block mb-8 group opacity-0 animate-slide-in-up">
            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-3xl shadow-2xl p-8 text-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl pulse-glow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">학습 통계</h2>
                  <p className="text-white/80">마이페이지에서 자세히 보기 →</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-white/80 text-sm mb-1">총 포인트</p>
                  <p className="text-3xl font-bold">{stats.totalPoints.toLocaleString()}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-white/80 text-sm mb-1">풀은 문제</p>
                  <p className="text-3xl font-bold">{stats.totalSolved}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-white/80 text-sm mb-1">정답 수</p>
                  <p className="text-3xl font-bold">{stats.totalCorrect}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-white/80 text-sm mb-1">정답률</p>
                  <p className="text-3xl font-bold">{stats.accuracy}%</p>
                </div>
              </div>
            </div>
          </Link>

          {/* 프로필 및 계정 정보 */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow opacity-0 animate-slide-in-up animate-delay-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">프로필 정보</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-sm text-gray-500 mb-1">이메일</p>
                  <p className="text-gray-900 font-medium">{user?.email}</p>
                </div>
                <Link
                  href="/profile"
                  className="block bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-3 text-center font-medium hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
                >
                  마이페이지 보기 →
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-shadow opacity-0 animate-slide-in-up animate-delay-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">계정 정보</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-sm text-gray-500 mb-1">가입일</p>
                  <p className="text-gray-900 font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : '알 수 없음'}
                  </p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-sm text-gray-500 mb-1">계정 상태</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md">
                    활성
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 빠른 시작 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 opacity-0 animate-slide-in-up animate-delay-300">
            <h2 className="text-2xl font-bold text-black mb-6">빠른 시작</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/problems"
                className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-200 hover:border-blue-500 transition-all hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-black mb-2">문제 풀이</h3>
                <p className="text-sm text-gray-600 mb-3">다양한 문제를 풀어보세요</p>
                <span className="text-blue-600 font-medium text-sm group-hover:translate-x-1 inline-block transition-transform">
                  시작하기 →
                </span>
              </Link>
              
              <Link
                href="/profile"
                className="group relative bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200 hover:border-purple-500 transition-all hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-black mb-2">마이페이지</h3>
                <p className="text-sm text-gray-600 mb-3">학습 통계와 포인트 확인</p>
                <span className="text-purple-600 font-medium text-sm group-hover:translate-x-1 inline-block transition-transform">
                  확인하기 →
                </span>
              </Link>
              
              <div className="group relative bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-2xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all cursor-pointer">
                <div className="w-14 h-14 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
                  <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-gray-700 mb-2">학습 일정</h3>
                <p className="text-sm text-gray-500">곧 출시 예정</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

