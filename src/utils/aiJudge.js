/**
 * AI 수석 심판관 (AlphaDog) 채점 및 평가 엔진
 * Mode 1: Google Gemini Flash REST API (API 키 제공 시)
 * Mode 2: Deterministic AI Simulation Engine (Zero API Key 내장 엔진)
 */

export async function evaluatePortfolio({ stocks, mission, userProfile, partnerBot, apiKey }) {
  // 1. 공통 수치 계산 (고유 섹터 수, 미션 정합성 등)
  const sectors = stocks.map(s => s.sector);
  const uniqueSectors = new Set(sectors).size;
  
  // 미션 타겟 섹터와 일치하는 종목 수
  const targetSectorMatches = stocks.filter(s => 
    mission.targetSectors.some(ts => s.sector.includes(ts.split('/')[0].trim()))
  );
  const isMissionMatched = targetSectorMatches.length >= 2;

  // 기본 채점 알고리즘
  let baseScore = 80;
  if (uniqueSectors >= 3) baseScore += 10;
  else if (uniqueSectors === 2) baseScore += 5;

  if (isMissionMatched) baseScore += 8;

  // 약간의 가중치 변동 (종목별 평균 상승률 및 시가총액 가중)
  const avgChange = stocks.reduce((acc, s) => acc + s.change, 0) / stocks.length;
  if (avgChange > 1.0) baseScore += 2;

  const finalScore = Math.min(98, Math.max(72, baseScore));
  const expectedReturn = "+" + (finalScore * 0.28).toFixed(1) + "%";
  const mdd = "-" + (22 - finalScore * 0.15).toFixed(1) + "%";
  const sharpeRatio = (finalScore / 55).toFixed(2);
  const volatility = finalScore >= 90 ? "낮음 (9.8%)" : finalScore >= 80 ? "보통 (14.2%)" : "다소 높음 (18.6%)";

  // Mode 1: Custom Gemini API Key 사용 시도
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const geminiResult = await callGeminiAPI({
        apiKey: apiKey.trim(),
        stocks,
        mission,
        userProfile,
        partnerBot,
        calculatedScore: finalScore,
        metrics: { expectedReturn, volatility, mdd, sharpeRatio }
      });
      if (geminiResult) {
        return geminiResult;
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to built-in AI engine:", err);
    }
  }

  // Mode 2: 브라우저 내장 고성능 AI 시뮬레이션 엔진
  return generateDeterministicReport({
    stocks,
    mission,
    finalScore,
    metrics: { expectedReturn, volatility, mdd, sharpeRatio },
    uniqueSectors,
    isMissionMatched
  });
}

// Gemini REST API 연동
async function callGeminiAPI({ apiKey, stocks, mission, userProfile, partnerBot, calculatedScore, metrics }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const stockSummary = stocks.map(s => `${s.name}(${s.code}, ${s.sector}, 현재가 ${s.price.toLocaleString()}원)`).join(", ");
  
  const prompt = `
당신은 대한민국 최고 증권사의 냉철하고 위트 넘치는 'AI 수석 심판관 알파독(AlphaDog)'입니다.
두 명의 익명 투자자(${userProfile.nickname} & ${partnerBot.name})가 제한시간 동안 공동으로 작성한 3종목 포트폴리오를 심사합니다.

[미션 정보]
- 미션명: ${mission.title}
- 부제: ${mission.subtitle}
- 가이드: ${mission.description}
- 권장 섹터: ${mission.targetSectors.join(", ")}

[선택된 3종목]
${stockSummary}

[사전 산출된 케미 점수 및 지표]
- 케미 점수: ${calculatedScore}점
- 예상 기대수익률: ${metrics.expectedReturn}
- 변동성: ${metrics.volatility}
- 최대 낙폭(MDD): ${metrics.mdd}
- 샤프지수: ${metrics.sharpeRatio}

다음 JSON 스키마 규격으로만 응답해주세요. 마크다운 따옴표나 기타 텍스트 없이 순수 JSON만 반환하세요:
{
  "chemistryScore": ${calculatedScore},
  "teamTitle": "포트폴리오의 특징을 위트있게 나타내는 듀오 별칭 (예: '🔥 불나방과 자린고비의 황금 헷지단')",
  "verdictSummary": "심판관 특유의 날카로운 팩트폭격과 칭찬이 담긴 2~3문장의 종합 심사평",
  "roles": [
    {
      "name": "${stocks[0].name}",
      "role": "메인 딜러 (포트폴리오 견인)",
      "comment": "이 종목의 역할과 선택 이유에 대한 1줄 코멘트"
    },
    {
      "name": "${stocks[1].name}",
      "role": "안전 방패 (하방 리스크 방어)",
      "comment": "이 종목의 역할과 선택 이유에 대한 1줄 코멘트"
    },
    {
      "name": "${stocks[2].name}",
      "role": "전략 조커 (이벤트 드리븐)",
      "comment": "이 종목의 역할과 선택 이유에 대한 1줄 코멘트"
    }
  ],
  "synergyPoints": [
    "시너지 포인트 1",
    "시너지 포인트 2",
    "시너지 포인트 3"
  ],
  "riskWarnings": [
    "주의할 점 / 리스크 요인 1",
    "주의할 점 / 리스크 요인 2"
  ]
}
`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No response text from Gemini");

  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  return {
    ...parsed,
    chemistryScore: calculatedScore,
    metrics
  };
}

// 브라우저 내장 심사 생성 엔진 (Zero API Key Fallback)
function generateDeterministicReport({ stocks, mission, finalScore, metrics, uniqueSectors, isMissionMatched }) {
  // 별칭 생성 풀
  const titles = [
    "🔥 야수와 방패의 황금 헷지 듀오",
    "💎 여의도 불사조 알파 사냥꾼들",
    "⚡ 번개 손가락과 냉철한 가치분석가",
    "🛡️ 폭풍우를 뚫는 절대 방어 바스켓",
    "🚀 텐배거를 꿈꾸는 하이퍼 그로스 듀오"
  ];
  const teamTitle = titles[Math.floor(Math.random() * titles.length)];

  // 종합 심사평 생성
  let verdictSummary = "";
  if (finalScore >= 90) {
    verdictSummary = `[수석 심판관 알파독 극찬] "${mission.title} 미션 의도를 200% 간파한 황금 포트폴리오입니다. ${stocks[0].name}의 폭발적인 추진력과 ${stocks[1].name}의 견고한 안전판이 결합되어 어떤 변동성 장세에서도 초과수익(Alpha)을 창출할 수 있는 압도적 밸런스입니다."`;
  } else if (finalScore >= 82) {
    verdictSummary = `[수석 심판관 알파독 판정] "티키타카 합의 과정에서 서로의 단점을 영리하게 보완했습니다. ${stocks[0].name}과 ${stocks[2].name}의 조합은 시장 트렌드에 기민하게 대응하며, 섹터 분산(${uniqueSectors}개)도 합격점입니다. 단, 대외 매크로 금리 변동성에 유의하세요."`;
  } else {
    verdictSummary = `[수석 심판관 알파독 경고] "열정은 인정하지만 포트폴리오 상관계수 관리가 아쉽습니다. ${stocks[0].name}에 실린 비중이 높아 하락장 충격 시 동반 흔들림이 발생할 수 있습니다. 한투 MTS에서 주문 시 분할 매수로 대응하십시오."`;
  }

  // 3개 종목별 역할 분담
  const roleNames = [
    "메인 딜러 (포트폴리오 견인)",
    "안전 방패 (하방 리스크 방어)",
    "전략 조커 (이벤트 드리븐)"
  ];

  const roles = stocks.map((s, idx) => ({
    name: s.name,
    code: s.code,
    role: roleNames[idx] || "서포터",
    comment: `${s.sector}의 독보적 지위와 ${s.tags.slice(0, 2).join(' ')} 모멘텀을 바탕으로 팀의 ${idx === 0 ? '수익률 폭발' : idx === 1 ? '원금 안전성' : '초과 알파'}를 책임집니다.`
  }));

  // 시너지 & 리스크 포인트
  const synergyPoints = [
    `총 ${uniqueSectors}개 고유 산업군 분산 투자로 단일 섹터 악재 방어력 확보`,
    `${stocks[0].name}의 성장 모멘텀과 ${stocks[1].name}의 밸류에이션 안정성이 교차 헷지 구현`,
    `현재 시장 핵심 테마(${mission.subtitle})와의 유의미한 정합성 확보`
  ];

  const riskWarnings = [
    `원달러 환율 급등 및 미 연준 기준금리 동결 시 일시적 외인 차익실현 경계`,
    `단기 과열 국면 진입 시 분할 매수 주문(MTS 주문 분산) 필수`
  ];

  return {
    chemistryScore: finalScore,
    teamTitle,
    verdictSummary,
    roles,
    metrics,
    synergyPoints,
    riskWarnings
  };
}
