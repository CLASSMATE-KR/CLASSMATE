'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabaseClient } from '@/lib/supabase-client'

interface Problem {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  subject: string
  createdAt: string
}

export default function ProblemsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession()
      setIsAuthenticated(!!session)
      
      if (session) {
        // TODO: Supabase에서 문제 목록 가져오기
        // 임시 데이터
        setProblems([
          {
            id: '1',
            title: '수학 문제 1',
            description: '기본적인 대수 문제입니다.',
            difficulty: 'easy',
            subject: '수학',
            createdAt: new Date().toISOString()
          }
        ])
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  if (loading || isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '쉬움'
      case 'medium':
        return '보통'
      case 'hard':
        return '어려움'
      default:
        return difficulty
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="container mx-auto px-6 py-6 border-b border-gray-200">
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
              className="px-4 py-2 text-black font-medium border-b-2 border-black"
            >
              문제 풀이
            </Link>
            <button
              onClick={async () => {
                await supabaseClient.auth.signOut()
                router.push('/')
              }}
              className="px-4 py-2 text-gray-600 hover:text-black font-medium transition-colors"
            >
              로그아웃
            </button>
          </div>
        </nav>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">문제 풀이</h1>
              <p className="text-gray-600">다양한 문제를 풀어보며 실력을 향상시키세요.</p>
            </div>
            <Link
              href="/problems/upload"
              className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 transition-all"
            >
              문제 추가
            </Link>
          </div>

          {/* 문제 목록 */}
          {problems.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg mb-2">아직 등록된 문제가 없습니다.</p>
              <p className="text-gray-500">문제 파일을 업로드하거나 직접 추가해보세요.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {problems.map((problem) => (
                <Link
                  key={problem.id}
                  href={`/problems/${problem.id}`}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-black transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-black">{problem.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {getDifficultyText(problem.difficulty)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{problem.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{problem.subject}</span>
                    <span>→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

