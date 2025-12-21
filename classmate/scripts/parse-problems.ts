// 문제 파싱 스크립트
// 사용법: npx tsx scripts/parse-problems.ts

interface Problem {
  id: number
  title: string
  content: string
  options: string[]
  correctAnswer: number // 0-3 (①-④)
  subject: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
}

function parseProblems(text: string): Problem[] {
  const problems: Problem[] = []
  const lines = text.split('\n').filter(line => line.trim())
  
  let currentCategory = ''
  let problemNumber = 0
  
  for (const line of lines) {
    // 카테고리 감지
    if (line.includes('##')) {
      currentCategory = line.replace(/##\s*/, '').trim()
      continue
    }
    
    // 문제 번호 감지 (숫자. 로 시작)
    const problemMatch = line.match(/^(\d+)\.\s*(.+?)\s*=\s*\?\s*(.+)$/)
    if (problemMatch) {
      problemNumber = parseInt(problemMatch[1])
      const questionText = problemMatch[2].trim()
      const optionsText = problemMatch[3].trim()
      
      // 선택지 파싱 (①, ②, ③, ④)
      const options: string[] = []
      const optionRegex = /[①②③④]\s*([^①②③④]+)/g
      let match
      while ((match = optionRegex.exec(optionsText)) !== null) {
        options.push(match[1].trim())
      }
      
      // 난이도 결정 (카테고리 기반)
      let difficulty: 'easy' | 'medium' | 'hard' = 'medium'
      if (currentCategory.includes('기초') || problemNumber <= 50) {
        difficulty = 'easy'
      } else if (problemNumber <= 150) {
        difficulty = 'medium'
      } else {
        difficulty = 'hard'
      }
      
      // 과목 결정
      let subject = '수학'
      if (currentCategory.includes('수학')) {
        subject = '수학'
      }
      
      problems.push({
        id: problemNumber,
        title: `문제 ${problemNumber}`,
        content: `${questionText} = ?`,
        options: options,
        correctAnswer: 0, // 정답은 나중에 수동으로 설정하거나 별도로 제공 필요
        subject: subject,
        difficulty: difficulty,
        category: currentCategory
      })
    }
  }
  
  return problems
}

// 메인 실행
if (require.main === module) {
  const fs = require('fs')
  const path = require('path')
  
  // 문제 텍스트 읽기 (사용자가 제공한 텍스트를 파일로 저장했다고 가정)
  const problemsText = `
# 수학 문제 300개 - 초등학교 수준

## 1-50: 사칙연산 기초

1. 15 + 27 = ? ① 40 ② 42 ③ 44 ④ 46
2. 83 - 29 = ? ① 52 ② 54 ③ 56 ④ 58
  ` // 실제로는 전체 텍스트를 여기에 넣거나 파일에서 읽어야 함
  
  const problems = parseProblems(problemsText)
  console.log(`총 ${problems.length}개의 문제를 파싱했습니다.`)
  console.log(JSON.stringify(problems, null, 2))
}

export { parseProblems }

