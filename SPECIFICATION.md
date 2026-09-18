# StockDuo (스톡듀오) - 상세 개발 및 시스템 명세서 (LLM 구현용)

> **버전**: v1.0.0 (AX 경진대회 출품작)  
> **핵심 키워드**: 익명(Anonymous) · 랜덤(Random) · 공동작업(Collaboration) · 증권사(Securities) · AI(Agentic AX)  
> **목적**: 다른 LLM 또는 개발자가 본 문서를 읽고 100% 동일한 기능과 UI/UX, 비즈니스 로직을 완벽하게 재현할 수 있도록 세부 설계 명세 제공.

---

## 1. 시스템 개요 & 아키텍처

### 1.1 서비스 목적
위계적이고 보수적인 증권사/금융 환경의 '집단사고(Groupthink)'와 개인투자자의 '외로운 뇌동매매'를 해결하기 위해,
1) **완전 익명**으로 성향이 다른 투자자를 **랜덤 매칭**하고,
2) 제한시간(3분) 내에 미션에 맞는 3종목 포트폴리오를 **상호 승인 기반으로 공동 작성**하며,
3) 증권사 **AI 수석 심판관(AlphaDog)**이 포트폴리오 케미스트리 및 팩폭 심사를 수행하고,
4) 최종적으로 **한국투자증권 MTS**로 3종목 바스켓을 원클릭 주문 연계하는 캐주얼 핀테크 웹서비스.

### 1.2 시스템 아키텍처 다이어그램
```
[Client: Vite + React 18 + TailwindCSS]
       │
       ├── State Machine (Lobby -> Matching -> Collaboration -> Evaluating -> Report)
       ├── Stock & Mission DB (src/data/stocks.js)
       ├── AI Evaluation Engine (src/utils/aiJudge.js)
       │       ├── Mode 1: Gemini 1.5/2.0 Flash REST API (Custom API Key)
       │       └── Mode 2: In-browser Deterministic AX Simulation Engine (Zero API Key)
       ├── Graphic Engine (canvas-confetti, html2canvas)
       └── Partner Bot AI Engine (AtoZ Single-player Simulation)
               └── Auto-reaction, Reverse Proposal, Mutual Agreement
```

---

## 2. 파일 구조 (Project Structure)
```
stockduo/
├── index.html                    # SEO 및 모바일 뷰포트, 한국어 폰트
├── package.json                  # React 18, Vite 5, Tailwind 3, lucide-react, canvas-confetti, html2canvas
├── tailwind.config.js            # 핀테크 테크 다크 테마 커스텀 색상
├── postcss.config.js
├── server.js                     # 경량 정적 웹 서버 (배포/테스트용)
└── src/
    ├── main.jsx                  # React DOM 진입점
    ├── App.jsx                   # 전체 상태 머신 및 스텝 라우팅
    ├── index.css                 # Tailwind 기본 스타일 및 커스텀 스크롤바
    ├── data/
    │   └── stocks.js             # 상위 12개 주식 메타데이터, 3대 미션, 봇 파트너 데이터
    ├── utils/
    │   └── aiJudge.js            # Gemini API 연동 및 내장 AX 심판 엔진
    └── components/
        ├── Header.jsx            # 상단 네비게이션, 대기열 수, API 키 모달
        ├── StepLobby.jsx         # 익명 프로필/아바타 생성, AtoZ 시뮬레이션 모드 토글
        ├── StepMatching.jsx      # 레이더 핑 애니메이션, 미션 룰렛 추첨
        ├── StepCollaboration.jsx # 3분 타이머, 3개 슬롯 바스켓, 종목 검색, 티키타카 챗/이모지
        ├── StepReport.jsx        # AI 심판 결과, 케미 점수, 인스타 카드 캡처, 한국투자증권 MTS 연동
        └── ApiKeyModal.jsx       # Google Gemini API 키 설정 모달
```

---

## 3. 데이터 모델 명세 (Data Schema)

### 3.1 주식 데이터 (`MOCK_STOCKS`)
```typescript
interface Stock {
  code: string;        // 6자리 단축코드 (예: "005930")
  name: string;        // 종목명 (예: "삼성전자")
  market: "KOSPI" | "KOSDAQ";
  sector: string;      // 대표 섹터 (예: "반도체 / IT")
  price: number;       // 현재가 (KRW)
  change: number;      // 전일비 등락률 (%)
  marketCap: string;   // 시가총액 (예: "383조원")
  tags: string[];      // 핵심 투자 포인트 해시태그 4개
  description: string; // 1~2문장의 핵심 모멘텀/리스크 설명
}
```

### 3.2 미션 데이터 (`MISSIONS`)
```typescript
interface Mission {
  id: string;
  title: string;       // 미션 헤드라인 (예: "🚨 2026 블랙스완 방어전")
  subtitle: string;    // 미션 부제 (예: "고유가 · 지정학 위기 돌파 포트폴리오")
  description: string; // 미션 상세 가이드
  targetSectors: string[]; // 권장 섹터 3개
  difficulty: "쉬움" | "보통" | "도전";
}
```

### 3.3 AI 심판 리포트 데이터 (`aiReport`)
```typescript
interface AIReport {
  chemistryScore: number; // 0 ~ 100
  teamTitle: string;      // 듀오 별칭 (예: "🔥 야수와 방패의 황금 헷지단")
  verdictSummary: string; // 수석 심판관 팩폭 종합 심사평
  roles: Array<{
    name: string;
    role: "메인 딜러 (포트폴리오 견인)" | "안전 방패 (하방 리스크 방어)" | "전략 조커 (이벤트 드리븐)";
    comment: string;
  }>;
  metrics: {
    expectedReturn: string; // 예: "+24.6%"
    volatility: string;     // 예: "낮음 (9.8%)"
    mdd: string;            // 예: "-8.5%"
    sharpeRatio: string;    // 예: "1.65"
  };
  synergyPoints: string[];
  riskWarnings: string[];
}
```

---

## 4. 핵심 기능 동작 알고리즘

### 4.1 심사위원 시연용 AtoZ 시뮬레이션 엔진 (Virtual Partner)
1. **역할 분담**:
   - 사용자 = Player 1 (진짜 사람)
   - 파트너 = Player 2 (스마트 가상 개미봇: `여의도_차트도사` 또는 `한강물체크_버핏`)
2. **시뮬레이션 타임라인**:
   - **Step 1 (슬롯 1 채우기)**: 사용자가 종목 검색창에서 종목을 선택하여 `[제안하기]`를 클릭하면, 파트너 봇이 0.9초 후 채팅으로 반응(`"오 삼전 좋네요! 외인 수급 돌아오고 있습니다."`)하며 슬롯 1 자동 승인.
   - **Step 2 (슬롯 2 역제안)**: 슬롯 1 완료 1.5초 후, 파트너 봇이 먼저 `현대차` 또는 `KT&G`를 역제안하며 화면에 **"파트너의 역제안 도착!"** 모달을 띄움. 사용자가 `[승인하기]`를 누르면 슬롯 2가 채워짐.
   - **Step 3 (슬롯 3 자유 합의)**: 사용자가 남은 1종목을 제안하면 파트너 봇이 `"완벽한 조합입니다! AI 점수 바로 돌려보죠 🚀"`라며 최종 승인.
   - **Step 4 (AI 심판관 호출)**: 3개 슬롯이 채워지면 `[AI 심판관 알파독 호출하기]` 버튼이 애니메이션과 함께 활성화됨.

### 4.2 AI 알파독 채점 수식 (내장 엔진)
```javascript
// 기본 점수
let baseScore = 80;

// 1. 섹터 분산도 가산점 (고유 섹터 수)
if (uniqueSectors >= 3) baseScore += 10;
else if (uniqueSectors === 2) baseScore += 5;

// 2. 미션 테마 정합성 보너스
if (isMissionMatched(stocks, mission)) baseScore += 8;

// 3. 점수 클램핑
const finalScore = Math.min(98, Math.max(72, baseScore));

// 4. 지표 계산
expectedReturn = (finalScore * 0.28).toFixed(1) + "%";
mdd = "-" + (22 - finalScore * 0.15).toFixed(1) + "%";
sharpeRatio = (finalScore / 55).toFixed(2);
```

### 4.3 한국투자증권 MTS 연계 플로우
- 결과 페이지 하단에 **"한국투자증권 MTS 가서 완성된 3종목 매수하기"** 메인 배너 배치.
- 클릭 시 모달이 오픈되며:
  - 3개 종목별 `[한투 주문]` 딥링크 버튼 (`https://m.truefriend.com`)
  - `[3종목 바스켓 일괄 매수 주문 실행]` 시뮬레이션 버튼 클릭 시 모의투자 주문 전송 완료 피드백.
  - `[한국투자증권 공식 웹사이트 열기]` (`https://www.truefriend.com`) 링크 제공.

---

## 5. 배포 및 호스팅 매뉴얼 (무료 정적 호스팅)

### 5.1 Netlify Drop 배포 (가장 빠름, 5초 완성)
1. `stockduo-web-build.zip` 파일 또는 `stockduo/dist` 폴더를 준비합니다.
2. 웹 브라우저에서 `https://app.netlify.com/drop` 접속.
3. 압축 파일이나 `dist` 폴더를 화면에 드래그 앤 드롭.
4. 즉시 생성되는 영구 무료 라이브 URL (`https://<site-name>.netlify.app`)을 복사하여 경진대회 제출!

### 5.2 Vercel 배포
1. `npm i -g vercel`
2. `cd stockduo && vercel --prod`
