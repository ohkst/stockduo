// 1. 국내 대표 주식 (12종)
// 2. 인기 대표 ETF (6종)
// 3. 연금저축/IRP/TDF 금융상품 (5종)
export const MOCK_STOCKS = [
  // ==========================================
  // [국내 대표 주식 (STOCK)]
  // ==========================================
  {
    code: "005930",
    name: "삼성전자",
    category: "STOCK",
    market: "KOSPI",
    sector: "반도체 / IT",
    price: 74200,
    change: 1.64,
    marketCap: "442조원",
    tags: ["#HBM공급확대", "#파운드리턴어라운드", "#외인순매수", "#배당수익"],
    description: "글로벌 1위 메모리 반도체 기업으로 HBM 및 차세대 AI 반도체 밸류체인 진입 본격화 기대감 유효."
  },
  {
    code: "000660",
    name: "SK하이닉스",
    category: "STOCK",
    market: "KOSPI",
    sector: "반도체 / IT",
    price: 188500,
    change: 3.29,
    marketCap: "137조원",
    tags: ["#HBM3E독점공급", "#AI수혜1순위", "#사상최대실적", "#엔비디아파트너"],
    description: "HBM3E 시장의 독보적 지배력을 바탕으로 엔비디아 AI 가속기 탑재 모멘텀을 주도하는 글로벌 대장주."
  },
  {
    code: "005380",
    name: "현대차",
    category: "STOCK",
    market: "KOSPI",
    sector: "자동차 / 모빌리티",
    price: 245000,
    change: 0.82,
    marketCap: "51조원",
    tags: ["#인도법인IPO", "#하이브리드호실적", "#밸류업수혜", "#주주환원"],
    description: "역대급 배당수익률과 북미 하이브리드 판매 호조, 기업 밸류업 프로그램의 대표 수혜주."
  },
  {
    code: "035420",
    name: "NAVER",
    category: "STOCK",
    market: "KOSPI",
    sector: "인터넷 / 플랫폼",
    price: 178000,
    change: -0.56,
    marketCap: "28조원",
    tags: ["#하이퍼클로바X", "#숏폼치지직", "#광고단가회복", "#AI검색"],
    description: "국내 최대 검색 포털 및 B2B AI 솔루션 플랫폼. 생성형 AI 에이전트 커머스 전환 가속화 중."
  },
  {
    code: "247540",
    name: "에코프로비엠",
    category: "STOCK",
    market: "KOSPI",
    sector: "2차전지 / 소재",
    price: 162000,
    change: -2.11,
    marketCap: "15조원",
    tags: ["#양극재글로벌1위", "#캐즘바닥론", "#LFP진출", "#코스피이전"],
    description: "하이니켈 양극재 선도 기업으로 전방 전기차 수요 둔화 우려 속에서도 중장기 수주 파이프라인 견고."
  },
  {
    code: "035720",
    name: "카카오",
    category: "STOCK",
    market: "KOSPI",
    sector: "인터넷 / 플랫폼",
    price: 37400,
    change: -1.06,
    marketCap: "16조원",
    tags: ["#카나나AI", "#비핵심자산정리", "#톡비즈회복", "#바닥권반등"],
    description: "국민 메신저 카카오톡 기반의 강력한 트래픽과 새로운 온디바이스/오픈채팅 AI 에이전트 서비스 출시 기대."
  },
  {
    code: "068270",
    name: "셀트리온",
    category: "STOCK",
    market: "KOSPI",
    sector: "바이오 / 헬스케어",
    price: 194500,
    change: 1.57,
    marketCap: "42조원",
    tags: ["#짐펜트라미국승인", "#통합셀트리온", "#PBM처방확대", "#신약전환"],
    description: "피하주사제형 짐펜트라의 미국 대형 처방약급여관리업체(PBM) 등재 성공으로 가파른 북미 매출 성장 기대."
  },
  {
    code: "005490",
    name: "POSCO홀딩스",
    category: "STOCK",
    market: "KOSPI",
    sector: "철강 / 친환경소재",
    price: 365000,
    change: 0.27,
    marketCap: "30조원",
    tags: ["#리튬상업생산", "#친환경인프라", "#철강업황반등", "#원자재헷지"],
    description: "전통 철강 산업의 탄탄한 현금흐름과 아르헨티나 염수 리튬 등 미래 2차전지 풀밸류체인 보유 지주사."
  },
  {
    code: "033780",
    name: "KT&G",
    category: "STOCK",
    market: "KOSPI",
    sector: "경기방어 / 소비재",
    price: 112000,
    change: 0.45,
    marketCap: "13조원",
    tags: ["#고배당귀족", "#글로벌전자담배", "#방어주피난처", "#자사주소각"],
    description: "지정학 리스크 및 경기 불황 국면에서 높은 배당(5%+)과 지속적인 자사주 매입 소각을 자랑하는 최강 방패."
  },
  {
    code: "207940",
    name: "삼성바이오로직스",
    category: "STOCK",
    market: "KOSPI",
    sector: "바이오 / 헬스케어",
    price: 982000,
    change: 2.19,
    marketCap: "69조원",
    tags: ["#CDMO세계최대", "#5공장조기가동", "#미국생물보안법", "#압도적수주"],
    description: "세계 최대 규모의 바이오 의약품 위탁생산(CDMO) 캐파와 미국 생물보안법 통과에 따른 최대 반사이익주."
  },
  {
    code: "055550",
    name: "신한지주",
    category: "STOCK",
    market: "KOSPI",
    sector: "금융 / 은행",
    price: 54300,
    change: 1.12,
    marketCap: "27조원",
    tags: ["#분기배당", "#주주환원율40%", "#PBR저평가", "#안정적이자이익"],
    description: "지속적인 분기배당과 자사주 소각을 실천하는 대표 금융지주사로 포트폴리오의 든든한 캐시카우 역할."
  },
  {
    code: "012450",
    name: "한화에어로스페이스",
    category: "STOCK",
    market: "KOSPI",
    sector: "방산 / 항공우주",
    price: 328000,
    change: 4.13,
    marketCap: "16조원",
    tags: ["#K-방산수주잭팟", "#K9자주포", "#지정학리스크수혜", "#글로벌수출"],
    description: "폴란드, 루마니아 등 유럽 및 중동 지역의 K-방산 수주 러시와 누리호 등 우주 발사체 총괄 기업."
  },

  // ==========================================
  // [인기 대표 ETF (ETF)]
  // ==========================================
  {
    code: "360750",
    name: "TIGER 미국S&P500",
    category: "ETF",
    market: "ETF",
    sector: "지수 / 글로벌대형",
    issuer: "미래에셋",
    expense: "0.07%",
    price: 18450,
    change: 0.85,
    marketCap: "5조 2,000억원",
    tags: ["#워런버핏추천", "#미국우량주500", "#연금계좌1순위", "#장기복리"],
    description: "미국을 대표하는 우량 500개 기업에 분산 투자하여 장기적인 자본 증대와 시장 평균 초과수익 추구."
  },
  {
    code: "133690",
    name: "TIGER 미국나스닥100",
    category: "ETF",
    market: "ETF",
    sector: "테마 / 빅테크혁신",
    issuer: "미래에셋",
    expense: "0.07%",
    price: 114800,
    change: 1.45,
    marketCap: "3조 8,000억원",
    tags: ["#AI빅테크", "#나스닥100", "#애플마이크로소프트", "#성장주엔진"],
    description: "글로벌 테크 패권을 쥐고 있는 나스닥 시총 상위 100대 혁신 기업에 집중 투자하는 초강력 성장 ETF."
  },
  {
    code: "402970",
    name: "ACE 미국배당다우존스",
    category: "ETF",
    market: "ETF",
    sector: "배당 / 월배당",
    issuer: "한국투자신탁운용",
    expense: "0.01%",
    price: 12150,
    change: 0.35,
    marketCap: "1조 4,000억원",
    tags: ["#한국판SCHD", "#연배당률3.5%+", "#월배당파이프라인", "#초저보수"],
    description: "10년 연속 배당을 늘려온 미국 배당성장 우량주에 투자하며 매월 안정적인 현금 흐름을 창출하는 월배당 대표주자."
  },
  {
    code: "069500",
    name: "KODEX 200",
    category: "ETF",
    market: "ETF",
    sector: "지수 / 국내대표",
    issuer: "삼성자산운용",
    expense: "0.15%",
    price: 36400,
    change: 0.92,
    marketCap: "6조 5,000억원",
    tags: ["#대한민국대표지수", "#코스피200", "#외인선물연계", "#풍부한유동성"],
    description: "대한민국 경제를 견인하는 코스피 200대 핵심 우량주를 가장 높은 유동성으로 추종하는 국민 ETF."
  },
  {
    code: "453850",
    name: "ACE 미국30년국채액티브(H)",
    category: "ETF",
    market: "ETF",
    sector: "채권 / 안전자산",
    issuer: "한국투자신탁운용",
    expense: "0.05%",
    price: 9420,
    change: -0.21,
    marketCap: "1조 8,000억원",
    tags: ["#미국장기채", "#금리인하수혜", "#월배당", "#포트폴리오방패"],
    description: "미국 30년 초장기 국채에 환헤지로 투자하여 경기 침체 및 금리 인하 국면에서 강력한 자본차익과 월배당을 제공."
  },
  {
    code: "489030",
    name: "KODEX AI반도체핵심공정",
    category: "ETF",
    market: "ETF",
    sector: "테마 / 섹터성장",
    issuer: "삼성자산운용",
    expense: "0.45%",
    price: 11800,
    change: 2.85,
    marketCap: "4,500억원",
    tags: ["#HBM장비소재", "#한미반도체", "#AI반도체소부장", "#수혜집약"],
    description: "AI 가속기 구동에 필수적인 HBM 및 첨단 패키징 공정 선도 소부장 기업들을 집중 편입한 특화 테마 ETF."
  },

  // ==========================================
  // [연금저축/IRP/TDF 금융상품 (PENSION)]
  // ==========================================
  {
    code: "PENS01",
    name: "한국투자 TDF 알아서2050",
    category: "PENSION",
    market: "연금펀드",
    sector: "TDF / 생애주기자산배분",
    issuer: "한국투자신탁운용",
    expense: "0.52%",
    price: 13850,
    change: 0.42,
    marketCap: "수탁고 8,200억원",
    tags: ["#2050은퇴타깃", "#자동글라이드패스", "#글로벌자산배분", "#연금저축/IRP필수"],
    description: "2050년 은퇴 시점에 맞춰 청년기에는 글로벌 주식 비중을 높이고 은퇴가 다가올수록 채권 비중을 자동으로 늘려주는 생애주기 펀드."
  },
  {
    code: "PENS02",
    name: "한국투자 미국배당귀족 연금",
    category: "PENSION",
    market: "연금펀드",
    sector: "배당 / 세액공제특화",
    issuer: "한국투자신탁운용",
    expense: "0.45%",
    price: 15200,
    change: 0.28,
    marketCap: "수탁고 4,500억원",
    tags: ["#25년연속배당증액", "#연금소득세5.5%", "#안정적은퇴자산", "#하방경직성"],
    description: "25년 이상 매년 배당금을 인상한 미국 초우량 기업에 투자하여 은퇴 후 든든한 연금 파이프라인과 세액공제 혜택을 동시에 누리는 상품."
  },
  {
    code: "PENS03",
    name: "한국투자 글로벌AI앤반도체 연금",
    category: "PENSION",
    market: "연금펀드",
    sector: "테마 / 장기복리",
    issuer: "한국투자신탁운용",
    expense: "0.55%",
    price: 16900,
    change: 1.82,
    marketCap: "수탁고 6,100억원",
    tags: ["#엔비디아TSMC", "#글로벌AI밸류체인", "#연금계좌장기적립", "#복리극대화"],
    description: "연금 계좌의 비과세 복리 효과를 극대화할 수 있도록 전 세계 AI 소프트웨어, 클라우드, 반도체 독점 기업들에 장기 적립식으로 투자."
  },
  {
    code: "PENS04",
    name: "한국투자 골드글로벌 자산배분",
    category: "PENSION",
    market: "연금펀드",
    sector: "올웨더 / 인플레헷지",
    issuer: "한국투자신탁운용",
    expense: "0.40%",
    price: 12400,
    change: 0.15,
    marketCap: "수탁고 3,800억원",
    tags: ["#금실물투자", "#인플레이션방패", "#위기대응자산", "#포트폴리오안정화"],
    description: "금(Gold)과 글로벌 국채, 원자재에 분산 투자하여 인플레이션 및 금융 시장 충격 시 연금 자산의 손실을 방어하는 올웨더형 안전 펀드."
  },
  {
    code: "PENS05",
    name: "한국투자 e단기국공채 연금",
    category: "PENSION",
    market: "연금펀드",
    sector: "채권 / 무위험파킹",
    issuer: "한국투자신탁운용",
    expense: "0.18%",
    price: 10850,
    change: 0.05,
    marketCap: "수탁고 9,500억원",
    tags: ["#원금손실극소화", "#연금계좌파킹통장", "#단기이자수취", "#시장관망용"],
    description: "신용도가 가장 높은 대한민국 국공채 및 통안채에 투자하여 연금 계좌 내에서 안전하게 이자를 수취하며 다음 투자 기회를 관망하는 파킹 펀드."
  }
];

// 3대 미션 데이터 (주식/ETF/연금 아우름)
export const MISSIONS = [
  {
    id: "mission_blackswan",
    title: "🚨 2026 블랙스완 방어전",
    subtitle: "고유가 · 지정학 위기 & 연금 자산배분 헷지",
    description: "글로벌 인플레이션 재점화 및 금융 충격에 대비해 강력한 방어주, 미국장기채 ETF, 골드 자산배분 연금 등 하방 헷지 3종목을 구성하세요.",
    targetSectors: ["방산 / 항공우주", "채권 / 안전자산", "올웨더 / 인플레헷지", "경기방어 / 소비재"],
    difficulty: "도전",
    icon: "ShieldAlert"
  },
  {
    id: "mission_ai_valuechain",
    title: "🚀 차세대 AI 밸류체인 올인",
    subtitle: "초거대 모델 주도주 & 나스닥100/AI반도체 ETF",
    description: "HBM 반도체 대장주부터 미국 나스닥100 ETF, 글로벌 AI 연금펀드까지 미래 혁신을 견인할 초강력 성장 자산을 압축하세요.",
    targetSectors: ["반도체 / IT", "테마 / 빅테크혁신", "테마 / 장기복리"],
    difficulty: "보통",
    icon: "Cpu"
  },
  {
    id: "mission_cashcow",
    title: "💰 고배당 캐시카우 황금알 & 은퇴설계",
    subtitle: "배당수익률 4%+ 개별주 & 미국배당다우존스 ETF / TDF",
    description: "월배당 ETF, 밸류업 고배당주, 은퇴 타깃 TDF 연금을 조합하여 평생 든든한 현금 파이프라인과 복리 배당을 달성하세요.",
    targetSectors: ["배당 / 월배당", "자동차 / 모빌리티", "TDF / 생애주기자산배분", "금융 / 은행"],
    difficulty: "쉬움",
    icon: "Coins"
  }
];

// 최상급 랭커 (Top 0.1% Challenger) 가상 파트너 데이터
export const BOT_PARTNERS = [
  {
    id: "bot_challenger_pro",
    name: "여의도_천상계_고수",
    avatar: "👑",
    tier: "CHALLENGER",
    tierName: "TOP 0.1% 챌린저",
    rankTitle: "실전투자대회 3관왕 랭커",
    returnRate: "+284.5%",
    winRate: "91.4%",
    persona: "주식 모멘텀과 글로벌 ETF 자산배분을 넘나드는 상위 0.1% 챌린저 랭커",
    styleTag: "👑 천상계 퀀트 모멘텀",
    suggestStock: "402970", // ACE 미국배당다우존스 ETF
    suggestReason: "천상계 랭커의 눈으로 볼 때, 개별주의 변동성을 잡아주면서도 연 3.5%+ 월배당과 초저보수(0.01%)를 자랑하는 ACE 미국배당다우존스 ETF 편입이 신의 한 수입니다. 제 누적 284% 승률을 걸고 추천합니다!",
    replies: {
      onFirstSelect: (stock) => `역시 안목이 남다르시네요! ${stock.name}은 현재 자금 유입 최상위권입니다. 바로 승인하고 제 필살 자산 하나 얹겠습니다 🤝`,
      onFinalAgree: "주식과 ETF, 연금의 시너지가 완벽히 조화된 포트폴리오입니다! AI 심판관 알파독도 무조건 90점 이상 극찬할 수밖에 없습니다 🚀"
    }
  },
  {
    id: "bot_grandmaster_hedge",
    name: "청담동_헤지펀드_마스터",
    avatar: "💎",
    tier: "CHALLENGER",
    tierName: "TOP 0.1% 챌린저",
    rankTitle: "글로벌 매크로 헤지 전문",
    returnRate: "+226.8%",
    winRate: "89.2%",
    persona: "TDF 연금과 미국채 ETF를 활용한 올웨더 자산배분의 절대 강자",
    styleTag: "💎 절대수익 헤지펀더",
    suggestStock: "PENS01", // 한국투자 TDF 알아서2050
    suggestReason: "매크로 지표 상 지금은 생애주기형 자산배분 편입이 필수입니다. 한국투자 TDF 알아서2050은 글로벌 분산과 자동 리밸런싱으로 시장 충격에도 계좌를 단단히 지켜줄 든든한 방패입니다.",
    replies: {
      onFirstSelect: (stock) => `호오, ${stock.name} 선택 아주 훌륭합니다. 자산 안정성을 감안한 전략적 초이스네요. 바로 승인합니다 👍`,
      onFinalAgree: "야수성과 연금의 안전성이 완벽히 조화된 황금 포트폴리오입니다. 알파독 심판관에게 점수 받아보시죠!"
    }
  }
];

// 실시간 시세 API 연동 헬퍼 (주식 및 ETF 실시간 시세 동기화)
export async function updateRealTimeStockPrices() {
  try {
    const res = await fetch('/api/stocks');
    if (!res.ok) return MOCK_STOCKS;
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      json.data.forEach(item => {
        const found = MOCK_STOCKS.find(s => s.code === item.code);
        if (found) {
          if (item.price) found.price = item.price;
          if (item.change !== undefined) found.change = item.change;
          if (item.marketCap) found.marketCap = item.marketCap;
        }
      });
    }
  } catch (err) {
    console.warn("Could not fetch real-time stocks, using default mock prices:", err);
  }
  return MOCK_STOCKS;
}
