# 🌿 Mindful Do (할 일 + 감정 일기 SPA)

> **"오늘의 할 일과 내 마음을 함께 기록하는 나만의 공간"**
> React + Supabase 기반의 Single Page Application(SPA) 프로젝트입니다.

🔗 **[배포된 웹사이트 보러가기](https://mindful-do.vercel.app)**

---

## 🚀 프로젝트 개요
- **개발 기간:** 2026년 8월 29일 
- **개발 목적:** React 기초(컴포넌트, 라우팅) 숙달 및 Backend as a Service(Supabase) 연동 경험, Vercel을 통한 배포 프로세스 이해

---

## 🛠️ 기술 스택 (Tech Stack)

**Frontend**
- React (Vite)
- React Router DOM (SPA 라우팅)
- CSS (순수 CSS를 활용한 반응형 UI)
- Lucide React (아이콘)

**Backend & Database**
- Supabase (PostgreSQL 기반 DB 및 API)

**Deployment & Environment**
- Vercel (자동 배포)
- Node.js (v20.20.2)
- GitHub

---

## ✨ 핵심 기능 (Key Features)

### 1. 할 일 관리 (Todo List)
- **CRUD 구현:** 할 일 추가, 조회, 수정, 삭제 기능
- **상태 관리:** 완료/미완료 체크박스 토글 기능
- **우선순위:** 할 일의 중요도를 시각적으로 표현

### 2. 감정 일기 (Emotion Diary)
- **날짜별 기록:** 오늘의 한 일 전체에 대한 일기 작성
- **감정 수치화:** 1~5단계의 감정 슬라이더를 통한 기분 기록
- **내용 작성:** 텍스트로 그날의 감정과 일상 기록

---

## 🗄️ 데이터베이스 구조 (Supabase Schema)

**1. `todos` 테이블**
| 컬럼명 | 타입 | 설명 |
| --- | --- | --- |
| `id` | int8 (PK) | 고유 식별자 |
| `title` | text | 할 일 내용 |
| `status` | boolean | 완료 여부 (true/false) |
| `priority` | text | 우선순위 (high, medium, low) |
| `created_at` | timestamptz | 생성 시간 |

**2. `diaries` 테이블**
| 컬럼명 | 타입 | 설명 |
| --- | --- | --- |
| `id` | int8 (PK) | 고유 식별자 |
| `date` | date | 일기 날짜 |
| `emotion` | int4 | 감정 점수 (1~5) |
| `content` | text | 일기 내용 |
| `created_at` | timestamptz | 생성 시간 |

---

## 💻 로컬 실행 방법 (Getting Started)

이 프로젝트를 로컬 환경에서 실행하려면 아래 단계를 따라주세요.

1. **레포지토리 클론**
   ```bash
   git clone https://github.com/본인아이디/mindful-do.git
   cd mindful-do

2. **패키지 설치**
   ```bash
   npm install
   ```
3. **환경 변수 설정**
   ```bash
   VITE_SUPABASE_URL=본인의_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY=본인의_SUPABASE_ANON_KEY
4. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   