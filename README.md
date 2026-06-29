# 부산공공잡 내비

DIVE 2026 제출용 모바일 앱 프로젝트입니다. 부산시 산하 공사·공단 채용정보를 단순 통합 조회하는 수준을 넘어, 청년 구직자의 프로필을 기준으로 **지원 가능성 판단, 공고 요약, 위험요소 감지, 로드맵 생성, 자소서 경험 매칭, 변경 감지, 청년지원정책 연결**까지 제공하는 완성형 서비스 구조입니다.

## 1. 핵심 기능

- 공고 통합 대시보드: 기관, 직무, 고용형태, 접수마감, D-Day, 원문 링크 표시
- 개인화 지원 판단: 바로 지원 가능 / 준비 후 가능 / 지원 어려움 자동 분류
- 준비 적합도 점수: 필수 자격, 우대조건, 직무 관심도, 경험 키워드, 마감일까지 남은 시간을 기반으로 산정
- AI형 공고 요약: 지원자격, 우대조건, 일정, 제출서류, 주의사항을 구조화해서 표시
- 위험요소 하이라이트: 중복지원, 최종제출 후 수정 불가, 블라인드 위반, 증빙서류, 교대근무 등 감지
- 마감 알림 및 캘린더: Expo Notifications / Calendar 기반 알림·일정 저장
- 취업 로드맵: 공고별 D-Day와 개인 준비도에 맞춘 할 일 자동 생성
- 자소서 코치: 공공기관 자소서 문항을 역량별로 분석하고 사용자 경험과 매칭
- 공고 변경센터: 새 데이터셋을 가져오면 이전 공고와 비교해 신규/수정/삭제 이력 생성
- 청년지원정책 연결: 면접, NCS, 데이터 포트폴리오 등 상황별 정책 추천
- DIVE 2026 데이터셋 어댑터: 실제 제공 데이터셋의 컬럼명이 달라도 매핑 파일만 조정해 변환

## 2. 기술 스택

- Expo + React Native + TypeScript
- React Navigation
- AsyncStorage
- Expo DocumentPicker / FileSystem
- Expo Notifications / Calendar
- 로컬 우선 구조: 해커톤 현장 네트워크 상황에서도 샘플 데이터로 데모 가능

## 3. 실행 방법

```bash
cd busan-public-job-navigator
npm install
npm run start
```

Android 또는 iOS 실행:

```bash
npm run android
npm run ios
```

타입 검사:

```bash
npm run typecheck
```

## 4. DIVE 2026 데이터셋 적용 방법

실제 데이터셋을 받으면 다음 순서로 적용합니다.

1. 원본 파일을 `data/raw/`에 넣습니다.
2. JSON 또는 CSV 형식으로 저장합니다.
3. 컬럼명이 샘플과 다르면 `data/mappings/dive2026.mapping.json`에 원본 컬럼명을 추가합니다.
4. 앱의 **마이페이지 → 데이터셋 가져오기**에서 파일을 선택합니다.
5. 앱이 표준 `JobPosting` 스키마로 변환하고 변경센터에 변경 이력을 생성합니다.

CLI 변환도 가능합니다.

```bash
npm run dataset:convert -- data/raw/dive2026.csv data/generated/jobs.normalized.json
```

또는 샘플 변환:

```bash
npm run dataset:sample
```

## 5. 표준 채용공고 스키마

앱 내부는 다음 구조로 모든 공고를 표준화합니다.

- `id`, `sourceId`
- `title`, `institution`, `department`
- `employmentType`, `jobCategory`, `roles`
- `recruitCount`, `workRegion`, `workLocation`
- `applicationStartAt`, `applicationEndAt`
- `applicationUrl`, `originalUrl`, `attachmentUrls`
- `eligibility`: 학력, 전공, 경력, 필수 자격, 거주지, 기타 요건
- `preferences`: 우대 자격, 우대 대상, 키워드
- `process`: 전형 단계
- `documents`: 제출서류
- `cautions`: 유의사항
- `tags`: 검색·추천 태그
- `originalPayload`: 원본 데이터 보존

## 6. 프로젝트 구조

```text
busan-public-job-navigator/
  App.tsx
  app.json
  package.json
  data/
    sample/               # 데모용 샘플 공고·정책·변경 이력
    raw/                  # DIVE 2026 원본 데이터셋 투입 위치
    mappings/             # 데이터셋 컬럼 매핑 파일
    generated/            # 변환 결과 저장 위치
  scripts/
    convert-dive-dataset.ts
  src/
    components/           # 카드, 배지, 버튼, 화면 레이아웃
    context/              # 전역 데이터 상태 및 저장소 연동
    data/                 # 기본 프로필, 자소서 문항
    navigation/           # Stack/Tab 네비게이션
    screens/              # 홈, 검색, 상세, 로드맵, 자소서, 마이, 데이터셋, 변경센터
    services/             # 추천·판단·요약·로드맵·변경감지·데이터셋 어댑터
    theme/                # 색상, 간격, 타이포그래피
    types/                # 도메인 타입
    utils/                # 날짜, 텍스트 유틸
```

## 7. 심사 발표 포인트

- 기존 서비스와 차별점: 검색 앱이 아니라 **지원 판단 및 실행 앱**입니다.
- 공공데이터 활용성: 제공 데이터셋을 표준화하고, 개인 프로필·청년지원정책·일정 데이터를 결합합니다.
- 확장성: 데이터셋 컬럼명이 바뀌어도 매핑 파일만 수정하면 됩니다.
- 실효성: 청년이 놓치기 쉬운 마감, 자격요건, 중복지원, 블라인드 위반, 증빙서류를 자동 점검합니다.
- 완성도: 모바일 앱에서 데이터 가져오기, 추천, 요약, 로드맵, 알림, 변경센터까지 한 흐름으로 데모 가능합니다.

## 8. 다음 개발 단계

해커톤 본선에서 데이터셋의 상세 구조가 공개되면 다음 항목을 우선 보완하세요.

- PDF 첨부파일 본문 추출 및 LLM 요약 API 연결
- 기관별 원문 링크 크롤러 또는 OpenAPI 동기화 작업
- 개인정보 동의 및 로컬 암호화 저장
- 푸시 알림 서버화
- 관리자용 데이터 검수 웹 콘솔
- 실제 부산 청년지원정책 API 또는 링크 연동
