'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabaseClient } from '@/lib/supabase-client'
import { getUserStats, getUserProgress } from '@/lib/user-progress'
import { handleLogout } from '@/lib/auth-utils'
import type { User } from '@supabase/supabase-js'

export default function ProfilePage() {
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
    const checkAuth = async () => {
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

    checkAuth()

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

  const handleLogoutClick = async () => {
    try {
      await handleLogout()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('로그아웃 실패:', error)
      router.push('/login')
      router.refresh()
    }
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

  const progress = user ? getUserProgress(user.id) : null
  const solvedCount = stats.totalSolved
  const correctCount = stats.totalCorrect
  const totalProblems = 150 // 전체 문제 수

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
                href="/dashboard"
                className="px-4 py-2 text-gray-600 hover:text-black font-medium transition-colors"
              >
                대시보드
              </Link>
              <Link
                href="/problems"
                className="px-4 py-2 text-gray-600 hover:text-black font-medium transition-colors"
              >
                문제 풀이
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 text-black font-medium border-b-2 border-black"
              >
                마이페이지
              </Link>
              <button
                onClick={handleLogoutClick}
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
        <div className="max-w-4xl mx-auto">
          {/* 프로필 헤더 */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">마이페이지</h1>
            <p className="text-gray-600">학습 진행 상황과 통계를 확인하세요.</p>
          </div>

          {/* 프로필 정보 카드 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 mb-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-black mb-1">{user?.email}</h2>
                <p className="text-gray-600">
                  가입일: {user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : '알 수 없음'}
                </p>
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* 총 포인트 */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-white/80 text-sm mb-1">총 포인트</p>
              <p className="text-3xl font-bold">{stats.totalPoints.toLocaleString()}</p>
            </div>

            {/* 풀은 문제 수 */}
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-white/80 text-sm mb-1">풀은 문제</p>
              <p className="text-3xl font-bold">{solvedCount} / {totalProblems}</p>
            </div>

            {/* 정답 수 */}
            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-white/80 text-sm mb-1">정답 수</p>
              <p className="text-3xl font-bold">{correctCount}</p>
            </div>

            {/* 정답률 */}
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <p className="text-white/80 text-sm mb-1">정답률</p>
              <p className="text-3xl font-bold">{stats.accuracy}%</p>
            </div>
          </div>

          {/* 진행도 바 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 mb-8">
            <h3 className="text-xl font-bold text-black mb-4">학습 진행도</h3>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-gray-600">전체 문제 진행률</span>
              <span className="text-gray-900 font-semibold">
                {Math.round((solvedCount / totalProblems) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((solvedCount / totalProblems) * 100, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {solvedCount}개 문제를 풀었습니다. {totalProblems - solvedCount}개 문제가 남았습니다.
            </p>
          </div>

          {/* 빠른 액션 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-black mb-6">빠른 액션</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/problems"
                className="p-6 border-2 border-gray-300 rounded-xl hover:border-black transition-all hover:shadow-lg group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">문제 풀기</h4>
                    <p className="text-sm text-gray-600">더 많은 문제를 풀어보세요</p>
                  </div>
                </div>
              </Link>
              <Link
                href="/dashboard"
                className="p-6 border-2 border-gray-300 rounded-xl hover:border-black transition-all hover:shadow-lg group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">대시보드</h4>
                    <p className="text-sm text-gray-600">메인 화면으로 돌아가기</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

