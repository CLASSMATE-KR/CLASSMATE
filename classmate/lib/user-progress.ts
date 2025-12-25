// 사용자 학습 진행도 및 포인트 관리

export interface UserProgress {
  userId: string
  solvedProblems: number[] // 풀은 문제 ID 목록
  correctProblems: number[] // 정답을 맞춘 문제 ID 목록
  totalPoints: number // 총 포인트
  lastUpdated: string // 마지막 업데이트 시간
}

// 포인트 계산 함수
export function calculatePoints(difficulty: 'easy' | 'medium' | 'hard'): number {
  switch (difficulty) {
    case 'easy':
      return 10
    case 'medium':
      return 20
    case 'hard':
      return 30
    default:
      return 10
  }
}

// 로컬 스토리지에서 사용자 진행도 가져오기
export function getUserProgress(userId: string): UserProgress {
  if (typeof window === 'undefined') {
    return {
      userId,
      solvedProblems: [],
      correctProblems: [],
      totalPoints: 0,
      lastUpdated: new Date().toISOString()
    }
  }

  const stored = localStorage.getItem(`user_progress_${userId}`)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error('Failed to parse user progress:', e)
    }
  }

  return {
    userId,
    solvedProblems: [],
    correctProblems: [],
    totalPoints: 0,
    lastUpdated: new Date().toISOString()
  }
}

// 사용자 진행도 저장
export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return

  progress.lastUpdated = new Date().toISOString()
  localStorage.setItem(`user_progress_${progress.userId}`, JSON.stringify(progress))
}

// 문제 풀이 기록
export function recordProblemAttempt(
  userId: string,
  problemId: number,
  isCorrect: boolean,
  difficulty: 'easy' | 'medium' | 'hard'
): UserProgress {
  const progress = getUserProgress(userId)

  // 이미 풀었던 문제인지 확인
  const alreadySolved = progress.solvedProblems.includes(problemId)
  const alreadyCorrect = progress.correctProblems.includes(problemId)

  // 풀은 문제 목록에 추가 (중복 방지)
  if (!alreadySolved) {
    progress.solvedProblems.push(problemId)
  }

  // 정답인 경우
  if (isCorrect && !alreadyCorrect) {
    progress.correctProblems.push(problemId)
    // 포인트 추가 (처음 맞춘 경우에만)
    progress.totalPoints += calculatePoints(difficulty)
  } else if (!isCorrect && !alreadyCorrect) {
    // 틀린 경우 포인트 차감 (처음 틀린 경우에만)
    // 포인트가 0 미만으로 내려가지 않도록 보호
    progress.totalPoints = Math.max(0, progress.totalPoints - 5)
  }

  saveUserProgress(progress)
  return progress
}

// 통계 가져오기
export function getUserStats(userId: string) {
  const progress = getUserProgress(userId)
  
  return {
    totalSolved: progress.solvedProblems.length,
    totalCorrect: progress.correctProblems.length,
    totalPoints: progress.totalPoints,
    accuracy: progress.solvedProblems.length > 0
      ? Math.round((progress.correctProblems.length / progress.solvedProblems.length) * 100)
      : 0
  }
}

