/**
 * AI 수석 심판관 (AlphaDog) 채점 및 평가 엔진
 * - 주식, ETF, 연금·TDF 복합 자산군 평가 지원
 * Mode 1: Google Gemini Flash REST API (API 키 제공 시)
 * Mode 2: Deterministic AI Simulation Engine (Zero API Key 내장 엔진)
 */

export async function evaluatePortfolio({ stocks, mission, userProfile, partnerBot, apiKey }) {
  // 1. 공통 수치 계산 (고유 섹터 수, 자산군 다양성, 미션 정합성 등)
  const sectors = stocks.map(s => s.sector);
  const uniqueSectors = new Set(sectors).size;
  
  const categories = stocks.map(s => s.category || 'STOCK');
  const uniqueCategories = new Set(categories).size; // 주식, ETF, 연금 다양성
  
  // 미션 타겟 섹터와 일치하는 종목 수
  const targetSectorMatches = stocks.filter(s => 
    mission.targetSectors.some(ts => s.sector.includes(ts.split('/')[0].trim()))
  );
  const isMissionMatched = targetSectorMatches.length >= 2;

  // 기본 채점 알고리즘
  let baseScore = 78;
  if (uniqueSectors >= 3) baseScore += 8;
  else if (uniqueSectors === 2) baseScore += 4;

  // 주식 + ETF + 연금 복합 자산 배분 보너스
  if (uniqueCategories >= 3) baseScore += 8; // 3개 자산군 골고루 조합 시 최고 가산점
  else if (uniqueCategories === 2) baseScore += 5;

  if (isMissionMatched) baseScore += 6;

  // 변동성 및 등락률 가중치
  const avgChange = stocks.reduce((acc, s) => acc + s.change, 0) / stocks.length;
  if (avgChange > 1.0) baseScore += 2;

  const finalScore = Math.min(99, Math.max(74, baseScore));
  const expectedReturn = "+" + (finalScore * 0.27).toFixed(1) + "%";
  const mdd = "-" + (20 - finalScore * 0.14).toFixed(1) + "%";
  const sharpeRatio = (finalScore / 52).toFixed(2);
  const volatility = uniqueCategories >= 2 
    ? "매우 안정적 (7.5%)" 
    : finalScore >= 88 ? "낮음 (9.8%)" : "보통 (13.4%)";

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
    uniqueCategories,
    isMissionMatched
  });
}

// Gemini REST API 연동
async function callGeminiAPI({ apiKey, stocks, mission, userProfile, partnerBot, calculatedScore, metrics }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const stockSummary = stocks.map(s => {
    const cat = s.category === 'ETF' ? '[ETF]' : s.category === 'PENSION' ? '[연금상품]' : '[국내주식]';
    return `${cat} ${s.name}(${s.code}, ${s.sector}, 가격 ${s.price.toLocaleString()}원)`;
  }).join(", ");
  
  const prompt = `
당신은 대한민국 최고 금융투자사의 냉철하고 위트 넘치는 'AI 수석 심판관 알파독(AlphaDog)'입니다.
두 명의 익명 투자자(${userProfile.nickname} & ${partnerBot.name || partnerBot.nickname})가 제한시간 동안 공동으로 작성한 3개 자산(주식, ETF, 연금상품) 포트폴리오를 심사합니다.

[미션 정보]
- 미션명: ${mission.title}
- 부제: ${mission.subtitle}
- 가이드: ${mission.description}
- 권장 섹터: ${mission.targetSectors.join(", ")}

[선택된 3개 자산 (주식/ETF/연금)]
${stockSummary}

[사전 산출된 케미 점수 및 지표]
- 케미 점수: ${calculatedScore}점
- 예상 기대수익률: ${metrics.expectedReturn}
- 변동성: ${metrics.volatility}
- 최대 낙폭(MDD): ${metrics.mdd}
- 샤프지수: ${metrics.sharpeRatio}

주식의 개별 알파 모멘텀과 ETF의 시장 추종, 연금 상품의 절세 및 생애주기 하방 헷지 관점을 종합하여 다음 JSON 스키마 규격으로만 응답해주세요. 마크다운 따옴표나 기타 텍스트 없이 순수 JSON만 반환하세요:
{
  "chemistryScore": ${calculatedScore},
  "teamTitle": "포트폴리오의 특징을 위트있게 나타내는 듀오 별칭 (예: '🛡️ 주식야수와 연금현자의 올웨더 듀오')",
  "verdictSummary": "심판관 특유의 날카로운 팩트폭격과 칭찬이 담긴 2~3문장의 종합 심사평",
  "roles": [
    {
      "name": "${stocks[0].name}",
      "role": "${stocks[0].category === 'PENSION' ? '연금 절세 방패' : stocks[0].category === 'ETF' ? '글로벌 지수 엔진' : '메인 알파 딜러'}",
      "comment": "이 자산의 역할과 선택 이유에 대한 1줄 코멘트"
    },
    {
      "name": "${stocks[1].name}",
      "role": "${stocks[1].category === 'PENSION' ? '연금 생애주기 코어' : stocks[1].category === 'ETF' ? '테마 분산 기둥' : '모멘텀 파트너'}",
      "comment": "이 자산의 역할과 선택 이유에 대한 1줄 코멘트"
    },
    {
      "name": "${stocks[2].name}",
      "role": "${stocks[2].category === 'PENSION' ? '안전 자산 파킹' : stocks[2].category === 'ETF' ? '월배당 현금 파이프' : '수익 극대화 조커'}",
      "comment": "이 자산의 역할과 선택 이유에 대한 1줄 코멘트"
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
function generateDeterministicReport({ stocks, mission, finalScore, metrics, uniqueSectors, uniqueCategories, isMissionMatched }) {
  const titles = [
    "🛡️ 주식야수와 연금현자의 올웨더 듀오",
    "💎 개별주와 ETF를 아우르는 천상계 자산배분가",
    "🚀 고수익 모멘텀 & 연금 복리 파이프라인 듀오",
    "🌐 글로벌 헷지와 세액공제를 챙긴 스마트 바스켓",
    "⚡ 변동성을 잠재우는 황금 트라이앵글"
  ];
  const teamTitle = titles[Math.floor(Math.random() * titles.length)];

  // 역할 배정
  const roles = stocks.map((s, idx) => {
    let role = "메인 알파 딜러";
    let comment = `${s.name}은 포트폴리오의 중추적인 수익 드라이버 역할을 충실히 수행합니다.`;

    if (s.category === 'PENSION') {
      role = "🛡️ 연금 생애주기 방패";
      comment = `장기 복리와 세액공제 혜택을 챙기며 계좌의 최대 낙폭(MDD)을 방어합니다.`;
    } else if (s.category === 'ETF') {
      role = "📊 글로벌 시장 추종 코어";
      comment = `개별 종목 리스크를 헷지하고 지수/테마의 평균 초과수익을 안정적으로 추구합니다.`;
    } else {
      if (idx === 0) {
        role = "🔥 모멘텀 공격수";
        comment = `수급과 산업 모멘텀을 주도하며 포트폴리오의 탄력을 끌어올립니다.`;
      } else {
        role = "⚡ 전략적 알파 포지션";
        comment = `상승장에서 초과 수익을 발생시키는 핵심 카드로 작용합니다.`;
      }
    }

    return {
      name: s.name,
      role,
      comment
    };
  });

  // 자산군 조합 평가 멘트
  let assetBalanceComment = "";
  if (uniqueCategories >= 3) {
    assetBalanceComment = "개별 주식의 폭발력, ETF의 시장 분산, 연금 상품의 세제 혜택과 하방 지지력이 삼위일체를 이룬 교과서적인 포트폴리오입니다.";
  } else if (uniqueCategories === 2) {
    assetBalanceComment = "주식과 ETF/연금을 적절히 교차 배치하여 공격성과 안전성의 밸런스를 훌륭하게 잡아냈습니다.";
  } else {
    assetBalanceComment = "단일 자산군 중심의 집중 투자가 돋보이나, 향후 ETF나 연금 자산 추가 배분 시 더욱 강력한 헷지가 기대됩니다.";
  }

  const verdictSummary = `AI 심판관 알파독의 종합 평점 ${finalScore}점! [${mission.title}] 미션 의도를 ${isMissionMatched ? '정확히 간파한' : '창의적으로 재해석한'} 포트폴리오입니다. ${assetBalanceComment}`;

  const synergyPoints = [
    `자산 분산도 우수: ${stocks.map(s => s.name).join(' + ')} 간 상관계수 상쇄 효과`,
    uniqueCategories >= 2 
      ? `절세 & 월배당 시너지: ETF와 연금 자산 편입으로 변동성 ${metrics.volatility} 달성` 
      : `섹터 분산 시너지: 서로 다른 산업군 결합으로 하방 리스크 완화`,
    `기대 샤프지수 ${metrics.sharpeRatio}로 위험 대비 보상 비율(Risk-Reward) 최적화`
  ];

  const riskWarnings = [
    `단기 시장 금리 급변 및 환율 변동성 국면에서의 일시적 조정에 유의하세요.`,
    `연금저축 및 IRP 계좌 연계 시 중도 해지 대신 만기 수령 전략을 유지하는 것이 유리합니다.`
  ];

  return {
    chemistryScore: finalScore,
    teamTitle,
    verdictSummary,
    roles,
    synergyPoints,
    riskWarnings,
    metrics
  };
}
