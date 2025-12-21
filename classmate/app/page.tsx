'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabaseClient } from '@/lib/supabase-client'

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession()
      setIsAuthenticated(!!session)
    }

    checkAuth()
  }, [])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="container mx-auto px-6 py-6 border-b border-gray-200">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-black">
            CLASSMATE
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-600 hover:text-black font-medium transition-colors"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 transition-all"
            >
              시작하기
            </Link>
          </div>
        </nav>
      </header>

      {/* 메인 섹션 */}
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black">
            함께 성장하는
            <br />
            학습의 경험
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            CLASSMATE와 함께 더 나은 학습 경험을 만들어보세요.
            <br />
            언제 어디서나 쉽게 접근하고 함께 성장하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-black text-white rounded-xl font-semibold text-lg hover:bg-neutral-800 transition-all transform hover:-translate-y-1 shadow-lg"
            >
              무료로 시작하기
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg border-2 border-gray-300 hover:border-black transition-all"
            >
              로그인
            </Link>
          </div>
        </div>

        {/* 특징 섹션 */}
        <div className="mt-32 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-black rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">쉬운 접근</h3>
            <p className="text-gray-600">언제 어디서나 간편하게 접근할 수 있습니다.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-black rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">함께 성장</h3>
            <p className="text-gray-600">다른 사람들과 함께 학습하고 성장하세요.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-black rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">안전한 플랫폼</h3>
            <p className="text-gray-600">안전하고 신뢰할 수 있는 환경을 제공합니다.</p>
          </div>
        </div>
      </main>

      {/* 소개 섹션 */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-black mb-8 text-center">
            학습 관리 프로그램 Classmate와 디스코드 연동 기능 소개
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Classmate는 학생들이 학습과 학교생활을 체계적으로 관리할 수 있도록 설계된 학습 관리 프로그램이다. 과제, 시험 일정, 수업 계획과 같은 학습 정보를 한곳에 정리할 수 있어 개인 학습 관리에 도움을 준다. 디지털 환경에 익숙한 학생들을 고려해 직관적인 인터페이스를 제공하며, 복잡한 설정 없이도 기본적인 기능을 사용할 수 있도록 구성되어 있다.
            </p>

            <p>
              Classmate의 특징 중 하나는 디스코드(Discord)와의 연동 기능이다. 디스코드는 많은 학생들이 학습 커뮤니티나 팀 활동에서 사용하는 메신저 플랫폼으로, Classmate는 이를 학습 관리 도구로 보완하는 역할을 한다. 디스코드 연동을 통해 사용자는 학습 일정이나 과제 정보를 보다 편리하게 확인할 수 있다.
            </p>

            <p>
              디스코드 연동 기능은 알림 전달에 주로 활용된다. 예를 들어 과제 마감일이 다가오거나 시험 일정이 등록되었을 때, 해당 정보가 디스코드 서버나 개인 메시지를 통해 전달될 수 있다. 이를 통해 사용자는 별도의 프로그램을 실행하지 않아도 중요한 학습 정보를 확인할 수 있으며, 일정 누락을 줄이는 데 도움이 된다.
            </p>

            <p>
              또한 Classmate는 학습 정보를 과목별로 정리할 수 있도록 구성되어 있다. 과제 완료 여부를 체크하거나 시험 대비 계획을 기록하는 기능은 학습 흐름을 파악하는 데 유용하다. 이러한 정보가 디스코드와 연동될 경우, 학습 관련 알림이 하나의 커뮤니케이션 채널로 통합되어 관리 효율성이 높아진다.
            </p>

            <p>
              Classmate는 학습 습관 형성을 목적으로 설계된 프로그램이다. 사용자가 직접 학습 계획을 입력하고 이를 확인하는 과정을 반복함으로써, 스스로 학습을 점검하는 환경을 제공한다. 디스코드 연동은 이러한 과정을 보조하는 수단으로, 학습 관리 자체를 대신하기보다는 사용자의 인식을 돕는 역할에 가깝다.
            </p>

            <p>
              정리하면, Classmate는 학습 정보를 정리하고 관리하는 기본 기능에 더해, 디스코드 연동을 통해 알림과 소통의 편의성을 높인 학습 관리 프로그램이다. 학습 일정 관리가 필요한 학생이라면, 자신의 학습 환경에 맞게 활용할 수 있는 하나의 선택지로 고려해볼 수 있다.
            </p>
          </div>
        </div>
      </section>

      {/* 푸터 제거 (요청에 따라 카피라이트 문구 삭제) */}
    </div>
  )
}

