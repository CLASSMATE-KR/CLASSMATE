'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabaseClient } from '@/lib/supabase-client'
import { handleLogout } from '@/lib/auth-utils'

export default function ProblemUploadPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    subject: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    options: ['', '', '', ''] as string[], // 객관식 선택지 (4개)
    correctAnswer: 0 as number, // 정답 번호 (0-3)
    solution: ''
  })
  const [fileContent, setFileContent] = useState('')
  const [uploadMethod, setUploadMethod] = useState<'form' | 'file'>('form')

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession()
      setIsAuthenticated(!!session)
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setFileContent(content)
      
      // 파일 내용을 파싱하여 폼에 자동 입력 (간단한 형식 가정)
      try {
        // JSON 형식인 경우
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content)
          setFormData({
            title: parsed.title || '',
            description: parsed.description || '',
            content: parsed.content || '',
            subject: parsed.subject || '',
            difficulty: parsed.difficulty || 'medium',
            options: parsed.options || ['', '', '', ''],
            correctAnswer: parsed.correctAnswer !== undefined ? parsed.correctAnswer : 0,
            solution: parsed.solution || ''
          })
        } else {
          // 텍스트 파일인 경우
          setFormData(prev => ({
            ...prev,
            content: content
          }))
        }
      } catch (error) {
        console.error('파일 파싱 오류:', error)
        alert('파일 형식이 올바르지 않습니다.')
      }
    }
    reader.readAsText(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 객관식 선택지 검증 (최소 2개 이상 입력되어야 함)
    const validOptions = formData.options.filter(opt => opt.trim() !== '')
    if (validOptions.length < 2) {
      alert('객관식 선택지를 최소 2개 이상 입력해주세요.')
      return
    }
    
    // 정답 번호 검증
    if (formData.correctAnswer < 0 || formData.correctAnswer >= formData.options.length || formData.options[formData.correctAnswer].trim() === '') {
      alert('올바른 정답 번호를 선택해주세요.')
      return
    }
    
    // TODO: Supabase에 문제 저장
    console.log('문제 저장:', formData)
    
    alert('문제가 저장되었습니다!')
    router.push('/problems')
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
                try {
                  await handleLogout()
                  router.push('/')
                } catch (error) {
                  console.error('로그아웃 실패:', error)
                  router.push('/')
                }
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
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link href="/problems" className="text-gray-600 hover:text-black mb-4 inline-block">
              ← 문제 목록으로
            </Link>
            <h1 className="text-4xl font-bold text-black mb-2">문제 추가</h1>
            <p className="text-gray-600">새로운 문제를 추가하거나 파일을 업로드하세요.</p>
          </div>

          {/* 업로드 방법 선택 */}
          <div className="mb-8 flex gap-4">
            <button
              onClick={() => setUploadMethod('form')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                uploadMethod === 'form'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              직접 입력
            </button>
            <button
              onClick={() => setUploadMethod('file')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                uploadMethod === 'file'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              파일 업로드
            </button>
          </div>

          {uploadMethod === 'file' ? (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-black mb-4">파일 업로드</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".txt,.json,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600 mb-2">클릭하여 파일 선택</p>
                  <p className="text-sm text-gray-500">지원 형식: .txt, .json, .md</p>
                </label>
              </div>
              {fileContent && (
                <div className="mt-6">
                  <h3 className="font-semibold text-black mb-2">파일 내용 미리보기:</h3>
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-40">
                    {fileContent.substring(0, 500)}
                    {fileContent.length > 500 && '...'}
                  </pre>
                </div>
              )}
            </div>
          ) : null}

          {/* 문제 입력 폼 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-black mb-6">문제 정보</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    제목 *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                    placeholder="문제 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    설명
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                    placeholder="문제에 대한 간단한 설명"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      과목 *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                      placeholder="예: 수학, 영어"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      난이도 *
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                    >
                      <option value="easy">쉬움</option>
                      <option value="medium">보통</option>
                      <option value="hard">어려움</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    문제 내용 *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={8}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none resize-none font-mono"
                    placeholder="문제 내용을 입력하세요..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    객관식 선택지 * (최소 2개 이상 입력)
                  </label>
                  <div className="space-y-3">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-lg font-medium text-gray-700 w-8">
                          {String.fromCharCode(9312 + index)}
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...formData.options]
                            newOptions[index] = e.target.value
                            setFormData({ ...formData, options: newOptions })
                          }}
                          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                          placeholder={`선택지 ${index + 1}을 입력하세요`}
                        />
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={formData.correctAnswer === index}
                          onChange={() => setFormData({ ...formData, correctAnswer: index })}
                          className="w-5 h-5 text-black"
                          disabled={option.trim() === ''}
                        />
                        <span className="text-sm text-gray-600 w-12">정답</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    각 선택지를 입력하고 정답인 선택지의 라디오 버튼을 선택하세요.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    해설
                  </label>
                  <textarea
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none resize-none font-mono"
                    placeholder="해설을 입력하세요..."
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 transition-all"
              >
                문제 저장
              </button>
              <Link
                href="/problems"
                className="px-8 py-3 bg-gray-100 text-black rounded-lg font-medium hover:bg-gray-200 transition-all"
              >
                취소
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

