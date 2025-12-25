'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabaseClient } from '@/lib/supabase-client'
import { getProblemById, type Problem as ProblemData } from '@/lib/problems-data'
import { recordProblemAttempt, getUserProgress } from '@/lib/user-progress'
import type { User } from '@supabase/supabase-js'

interface Problem {
  id: string
  title: string
  description: string
  content: string
  difficulty: 'easy' | 'medium' | 'hard'
  subject: string
  answer?: string
  solution?: string
  options?: string[]
  correctAnswer?: number
}

export default function ProblemDetailPage() {
  const router = useRouter()
  const params = useParams()
  const problemId = params.id as string
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [userAnswer, setUserAnswer] = useState<number | null>(null)
  const [showSolution, setShowSolution] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession()
      setIsAuthenticated(!!session)
      
      if (session) {
        setUser(session.user)
        
        if (problemId) {
          // 파싱된 문제 데이터에서 찾기
          const problemData = getProblemById(parseInt(problemId))
          if (problemData) {
            setProblem({
              id: problemId,
              title: problemData.title,
              description: problemData.category,
              content: problemData.content,
              difficulty: problemData.difficulty,
              subject: problemData.subject,
              options: problemData.options,
              correctAnswer: problemData.correctAnswer,
              answer: problemData.options[problemData.correctAnswer],
              solution: `정답: ${problemData.options[problemData.correctAnswer]}`
            })
          } else {
            setProblem(null)
          }
        }
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
    if (userAnswer === null) {
      alert('답안을 선택해주세요.')
      return
    }
    
    if (problem.correctAnswer !== undefined && userAnswer === problem.correctAnswer) {
      setIsCorrect(true)
      
      // 사용자 진행도 기록
      if (user && problem) {
        const beforeProgress = getUserProgress(user.id)
        const beforePoints = beforeProgress.totalPoints
        recordProblemAttempt(
          user.id,
          parseInt(problemId),
          true,
          problem.difficulty
        )
        const afterProgress = getUserProgress(user.id)
        const pointsEarned = afterProgress.totalPoints - beforePoints
        if (pointsEarned > 0) {
          alert(`정답입니다! 🎉 (+${pointsEarned} 포인트)`)
        } else {
          alert('정답입니다! 🎉 (이미 풀었던 문제입니다)')
        }
      } else {
        alert('정답입니다! 🎉')
      }
    } else {
      setIsCorrect(false)
      
      // 틀린 경우에도 기록 (풀었다고 표시)
      if (user && problem) {
        recordProblemAttempt(
          user.id,
          parseInt(problemId),
          false,
          problem.difficulty
        )
      }
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

          {/* 답안 선택 */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">답안 선택</h2>
            {problem.options && problem.options.length > 0 ? (
              <div className="space-y-3 mb-6">
                {problem.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      userAnswer === index
                        ? 'border-black bg-gray-50'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${isCorrect === true && index === problem.correctAnswer ? 'bg-green-50 border-green-500' : ''} ${isCorrect === false && index === userAnswer ? 'bg-red-50 border-red-500' : ''}`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={index}
                      checked={userAnswer === index}
                      onChange={() => {
                        setUserAnswer(index)
                        setIsCorrect(null)
                      }}
                      className="mr-4 w-5 h-5 text-black"
                    />
                    <span className="text-lg">
                      {String.fromCharCode(9312 + index)} {option}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
                <p className="text-yellow-800 font-medium">
                  이 문제는 객관식 형식이 아닙니다. 문제 데이터에 선택지가 없습니다.
                </p>
              </div>
            )}
            <div className="flex gap-4">
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

