'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabaseClient } from '@/lib/supabase-client'

interface Problem {
  id: string
  title: string
  description: string
  content: string
  difficulty: 'easy' | 'medium' | 'hard'
  subject: string
  answer?: string
  solution?: string
}

export default function ProblemDetailPage() {
  const router = useRouter()
  const params = useParams()
  const problemId = params.id as string
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [userAnswer, setUserAnswer] = useState('')
  const [showSolution, setShowSolution] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession()
      setIsAuthenticated(!!session)
      
      if (session && problemId) {
        // TODO: Supabase에서 문제 상세 정보 가져오기
        // 임시 데이터
        setProblem({
          id: problemId,
          title: '수학 문제 1',
          description: '기본적인 대수 문제입니다.',
          content: '다음 방정식을 풀어보세요:\n\n2x + 5 = 13',
          difficulty: 'easy',
          subject: '수학',
          answer: 'x = 4',
          solution: '2x + 5 = 13\n2x = 13 - 5\n2x = 8\nx = 4'
        })
      }
      setLoading(false)
    }

    checkAuth()
  }, [problemId])

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

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">문제를 찾을 수 없습니다.</p>
          <Link href="/problems" className="text-black font-medium hover:underline">
            문제 목록으로 돌아가기
          </Link>
        </div>
      </div>
    )
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

  const handleSubmit = () => {
    if (problem.answer && userAnswer.trim().toLowerCase() === problem.answer.toLowerCase()) {
      alert('정답입니다! 🎉')
    } else {
      alert('틀렸습니다. 다시 시도해보세요.')
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
        <div className="max-w-4xl mx-auto">
          {/* 문제 정보 */}
          <div className="mb-6">
            <Link href="/problems" className="text-gray-600 hover:text-black mb-4 inline-block">
              ← 문제 목록으로
            </Link>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-black">{problem.title}</h1>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {getDifficultyText(problem.difficulty)}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{problem.subject}</p>
            <p className="text-gray-500">{problem.description}</p>
          </div>

          {/* 문제 내용 */}
          <div className="bg-gray-50 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">문제</h2>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-gray-800 font-mono text-base leading-relaxed">
                {problem.content}
              </pre>
            </div>
          </div>

          {/* 답안 입력 */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">답안 작성</h2>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="답안을 입력하세요..."
              className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none resize-none font-mono"
            />
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 transition-all"
              >
                제출하기
              </button>
              {problem.solution && (
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="px-6 py-3 bg-gray-100 text-black rounded-lg font-medium hover:bg-gray-200 transition-all"
                >
                  {showSolution ? '해설 숨기기' : '해설 보기'}
                </button>
              )}
            </div>
          </div>

          {/* 해설 */}
          {showSolution && problem.solution && (
            <div className="bg-black text-white rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4">해설</h2>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-mono text-base leading-relaxed">
                  {problem.solution}
                </pre>
              </div>
              {problem.answer && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="font-semibold">정답: {problem.answer}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

