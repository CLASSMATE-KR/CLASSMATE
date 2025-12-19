# CLASSMATE

CLASSMATE는 Next.js, Supabase, Tailwind CSS를 기반으로 한 학습 플랫폼입니다.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **인증/데이터베이스**: Supabase
- **스타일링**: Tailwind CSS
- **언어**: TypeScript

## 시작하기

### 필수 요구사항

- Node.js 18 이상
- npm, yarn, pnpm 또는 bun

### 설치 및 실행

1. 저장소 클론:
```bash
git clone https://github.com/CLASSMATE-KR/CLASSMATE.git
cd CLASSMATE/classmate
```

2. 의존성 설치:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. 환경 변수 설정:
`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. 개발 서버 실행:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
classmate/
├── app/              # Next.js App Router 페이지
│   ├── login/        # 로그인 페이지
│   ├── signup/       # 회원가입 페이지
│   ├── dashboard/    # 대시보드 페이지
│   └── page.tsx      # 메인 페이지
├── lib/              # 유틸리티 및 설정
│   ├── supabase.ts   # Supabase 서버 클라이언트
│   └── supabase-client.ts  # Supabase 클라이언트 컴포넌트
└── public/           # 정적 파일

```

## 기능

- ✅ 이메일/비밀번호 기반 인증
- ✅ 회원가입 및 로그인
- ✅ 사용자 대시보드
- ✅ 반응형 디자인

## 기여하기

이 프로젝트에 기여하고 싶으시다면:

1. 이 저장소를 포크하세요
2. 새로운 기능 브랜치를 생성하세요 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/AmazingFeature`)
5. Pull Request를 열어주세요

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 링크

- [GitHub 저장소](https://github.com/CLASSMATE-KR/CLASSMATE)
- [Next.js 문서](https://nextjs.org/docs)
- [Supabase 문서](https://supabase.com/docs)
