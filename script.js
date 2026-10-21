// 산업통상부(MOT) 안내 웹 앱 스크립트

document.addEventListener('DOMContentLoaded', () => {
  // 1. 상단 현재 일자 자동 표기
  initCurrentDate();

  // 2. 모바일 내비게이션 토글
  initMobileNav();

  // 3. 주요 업무 탭 필터링
  initRolesTabs();

  // 4. 2026 정책 동향 탭 인터랙션
  initTrendTabs();

  // 5. 국민 설문 & 맞춤형 혜택 체크리스트 위자드 (핵심 기능)
  initSurveyWizard();

  // 6. 최신 뉴스 카테고리 필터링
  initNewsFilter();

  // 7. 내비게이션 스크롤 스파이 (현재 섹션 하이라이트)
  initScrollSpy();
});

/* 1. 상단 일자 표기 */
function initCurrentDate() {
  const display = document.getElementById('currentDateDisplay');
  if (!display) return;
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
  display.textContent = `오늘: ${now.toLocaleDateString('ko-KR', options)}`;
}

/* 2. 모바일 내비게이션 토글 */
function initMobileNav() {
  const toggle = document.getElementById('mobileToggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    const icon = toggle.querySelector('i');
    if (nav.classList.contains('open')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    } else {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });
  });
}

/* 3. 주요 업무 카드 필터링 */
function initRolesTabs() {
  const buttons = document.querySelectorAll('.tabs-nav .tab-btn');
  const cards = document.querySelectorAll('.cards-grid .work-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetCategory = btn.getAttribute('data-tab');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (targetCategory === 'all' || category === targetCategory) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 4. 정책 동향 탭 인터랙션 */
function initTrendTabs() {
  const tabs = document.querySelectorAll('.trend-tab-item');
  const panels = document.querySelectorAll('.trend-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   5. 산업통상부 소관 맞춤형 혜택 체크리스트 시스템
   (2025년 기후에너지환경부 분리에 따른 산업·통상·제품안전 순수 소관 반영)
   ========================================================================== */

const surveyQuestions = {
  general: {
    roleName: '일반 국민 / 소비자',
    items: [
      { id: 'gen_safety', title: '사용 중인 가전·어린이용품의 위해성 및 불법·불량 제품 리콜 정보가 궁금하신가요?', desc: '국표원 제품안전정보센터(Safety Korea) 24시간 위해제품 신속 조회 및 리콜 신고 포상' },
      { id: 'gen_ks', title: '국가표준(KS) 및 국가공인 시험인증 검증을 거친 믿을 수 있는 제품을 찾고 계신가요?', desc: '국가기술표준원 KS 인증마크 품질 보증 및 규격 열람 서비스' },
      { id: 'gen_sale', title: '대한민국 쇼핑 페스타(코리아세일페스타) 등 소비 활성화 할인 행사에 관심 있으신가요?', desc: '산업부 주관 연례 최대 소비 축제를 통한 생필품·가전·자동차 파격 할인 혜택' },
      { id: 'gen_price', title: '주유소 및 핵심 공산품 유통 가격 비교 정보를 실시간으로 확인하고 싶으신가요?', desc: '산업부 오피넷(Opinet) 및 물가안정 유통정보망을 통한 최저가 주유소 정보 제공' }
    ]
  },
  youth: {
    roleName: '청년 / 구직자 / 대학생',
    items: [
      { id: 'yth_chip', title: '반도체·AI로봇·미래차 등 첨단산업 분야 집중 직무 교육을 희망하시나요?', desc: '국가첨단전략산업 특성화대학 및 부트캠프 무료 교육 과정 (월 최대 100만 원 장려금)' },
      { id: 'yth_trade', title: '무역 전문가 실무 교육 및 해외 전시회 바이어 상담 파견을 원하시나요?', desc: '지역특화청년무역전문가(GTEP) 및 KOTRA 해외 무역관 청년 인턴십 전액 국비 지원' },
      { id: 'yth_ai', title: '산업 AI·자율제조 엔지니어링 실무 자격증 및 산학 프로젝트 참여를 원하시나요?', desc: '제조 AI 융합인재 양성 프로그램 및 기업 실무 멘토링 1:1 매칭' },
      { id: 'yth_cert', title: '산업통상부 공인 기술자격 및 글로벌 시험인증(CE, UL) 실무를 배우고 싶으신가요?', desc: '국표원 기술규제 대응 및 글로벌 시험인증 전문인력 양성과정 국비 지원' }
    ]
  },
  business: {
    roleName: '중소·중견기업 / 소상공인',
    items: [
      { id: 'biz_export', title: '해외 시장 진출을 위한 수출 마케팅, 물류비, 해외 인증 지원이 필요한가요?', desc: '기업당 최대 1억 원 상당의 수출바우처 및 무역보험료 50% 할인' },
      { id: 'biz_smart', title: '생산 공장에 AI 비전 검사·로봇 자동화 등 스마트공장을 도입하고 싶으신가요?', desc: 'M.AX AI 팩토리 선도프로젝트 및 스마트제조 설비 구축비 최대 5억~10억 지원' },
      { id: 'biz_remodel', title: '전통산업에서 미래 친환경·신산업으로 사업을 선제 전환하고 싶으신가요?', desc: '사업재편 전용 저리 융자, 조세 감면 및 민간 VC 투자유치설명회(IR) 연계' },
      { id: 'biz_local', title: '비수도권 지방으로 공장이나 연구소를 신증설·이전할 계획이 있으신가요?', desc: '기회발전특구 파격적 세제 감면(소득·법인세 5년 면제) 및 부지 국비 무상/할인 임대' }
    ]
  },
  research: {
    roleName: '연구자 / 스타트업 / 개발자',
    items: [
      { id: 'rnd_grant', title: '첨단 미래기술에 대한 대규모 국가 R&D 연구개발 출연금 과제를 찾고 계신가요?', desc: '산업통상부 주관 연간 수조 원 규모 산업기술혁신 R&D 공모과제 매칭' },
      { id: 'rnd_sandbox', title: '법적 규제나 기준 부재로 시장 출시가 막힌 신기술을 테스트하고 싶으신가요?', desc: '산업융합 규제샌드박스를 통한 실증특례 승인 및 1.2억 원 실증비 지원' },
      { id: 'rnd_infra', title: '고가의 시험인증 장비, 슈퍼컴퓨팅 AI 인프라를 무료로 대여받고 싶으신가요?', desc: '전국 테크노파크 및 시험연구원 공공 인프라 오픈랩 무상 바우처' },
      { id: 'rnd_patent', title: '해외 특허 출원 비용 및 국제 표준(ISO/IEC) 제정 작업을 주도하고 싶으신가요?', desc: '국가표준원 표준화 활동비 및 국제표준화기구 기술위원회 파견 경비 지원' }
    ]
  }
};

const benefitDatabase = {
  gen_safety: {
    title: '제품안전정보센터(Safety Korea) 위해제품 신속차단',
    dept: '국가기술표준원 제품안전정책국',
    supportType: '위해제품 무료 감시 & 포상금 제도',
    desc: '시중에 유통되는 유모차, 완구류, 보조배터리 등 생활 밀착형 공산품의 KC 인증 여부와 안전성 시험 결과를 투명하게 공개하며, 불법 위해제품 신고 시 포상금을 지급합니다.',
    points: [
      '국가 KC인증 마크 진위 여부 모바일 1초 바코드 조회',
      '국내외 리콜 명령 제품 실시간 알림 서비스 제공',
      '불법·불량 제품 신고 포상금 최대 100만 원 지급'
    ],
    target: '대한민국 국민 소비자 누구나',
    link: 'https://www.safetykorea.kr',
    linkText: '제품안전정보센터 바로가기'
  },
  gen_ks: {
    title: '국가표준(KS) 인증 및 우수 품질 보증 제도',
    dept: '표준정책국',
    supportType: '국가 품질 표준 무료 열람',
    desc: '가정용 건축자재, 전기용품, 산업 기자재의 안전성과 내구성을 국가가 직접 공인하는 KS 표준 원문을 무료로 열람하고 품질 검증 업체를 확인할 수 있습니다.',
    points: [
      'KS 표준 열람 포털(e-나라표준인증) 전 국민 무료 개방',
      '소비자 안심 우수재활용(GR), 한국서비스품질(KS-SQI) 연계',
      '공공 조달 및 아파트 시공 시 KS 의무 채택으로 소비자 보호'
    ],
    target: '안전한 규격 제품을 찾는 일반 소비자 및 시공자',
    link: 'https://standard.go.kr',
    linkText: 'e-나라표준인증 포털'
  },
  gen_sale: {
    title: '코리아세일페스타(Korea Sale Festa) 대국민 할인',
    dept: '유통물류과',
    supportType: '전국 온·오프라인 파격 할인',
    desc: '국내 최대 쇼핑 축제를 통해 백화점, 대형마트, 전통시장 및 온라인 쇼핑몰과 협력하여 가전, 모빌리티, 생필품을 연중 최대 할인율로 구매할 수 있습니다.',
    points: [
      '가전제품 및 완성차 특별 프로모션 지원',
      '전국 전통시장 온누리상품권 환급 행사 동시 개최',
      '중소기업 우수제품 특별 할인 기획전 운영'
    ],
    target: '대한민국 국민 누구나',
    link: 'https://www.koreasalefesta.kr',
    linkText: '코세페 공식 홈페이지'
  },
  gen_price: {
    title: '유통정보망 오피넷(Opinet) 실시간 최저가 안내',
    dept: '자원산업과',
    supportType: '무료 실시간 가격 정보 앱',
    desc: '전국 주유소의 실시간 유가 정보와 불법 유통 주유소 적발 현황을 공개하여 국민 가계의 유류비 절감을 지원합니다.',
    points: [
      '내 주변 가장 저렴한 착한 주유소 1초 경로 안내',
      '가짜 석유 판매 적발 주유소 사전 경고 알림',
      '스마트폰 앱 및 웹을 통한 완전 무료 서비스'
    ],
    target: '자가용 운전자 및 알뜰 소비 국민',
    link: 'https://www.opinet.co.kr',
    linkText: '오피넷 실시간 유가 확인'
  },
  yth_chip: {
    title: '첨단산업 특성화대학원 & 집중 부트캠프 장학생',
    dept: '산업인력과',
    supportType: '전액 국비 무료 교육 + 학업 장려금',
    desc: '반도체, 바이오, AI로봇 등 국가전략기술 학과에서 실무 집중 프로젝트를 수행하며, 학업 장려금(월 최대 100만 원)과 대기업 멘토링을 받습니다.',
    points: [
      '삼성전자, SK하이닉스 등 국내 대표 기업 연구원 1:1 멘토링',
      '국가공인 첨단기술 마이크로디그리 인증서 취득',
      '수료자 대상 채용 연계형 인턴십 및 취업 박람회 독점 지원'
    ],
    target: '이공계 대학생, 대학원생 및 취업준비생',
    link: 'https://www.keit.re.kr',
    linkText: '산업인력양성 공고 확인'
  },
  yth_trade: {
    title: '지역특화청년무역전문가(GTEP) 양성 프로그램',
    dept: '무역진흥과',
    supportType: '해외 전시회 참가 전액 지원 + KOTRA 인턴십',
    desc: '실제 중소기업의 제품을 들고 미국 CES, 독일 하노버 등 글로벌 전시회에 직접 바이어 상담자로 파견되어 수출 계약을 체결해보는 실무 중심 과정입니다.',
    points: [
      '해외 왕복 항공료, 숙박비, 비즈니스 활동비 전액 국비 지원',
      'KOTRA 및 한국무역협회 해외무역관 청년 인턴 우선 선발',
      '수료 후 무역상사, 글로벌 이커머스 기업 취업 가산점'
    ],
    target: '전국 대학생 (전공 무관 3~4학년)',
    link: 'https://www.kotra.or.kr',
    linkText: 'KOTRA 청년 지원관'
  },
  yth_ai: {
    title: '제조 AI 융합인재(M.AX) 및 로봇 엔지니어 육성',
    dept: '제조AX혁신과',
    supportType: '실무 프로젝트 펀딩 + 산학 실습',
    desc: '제조업 현장에 인공지능과 자율주행 로봇을 접목할 수 있는 실무 엔지니어를 양성하기 위해 최고급 GPU 실습 인프라와 산학 프로젝트 펀딩을 제공합니다.',
    points: [
      '피지컬 AI(Physical AI) 및 온디바이스 NPU 실습',
      '스마트 제조 산단 현장 투입 실습 및 취업 매칭',
      '프로젝트 우수팀 산업통상부 장관상 및 상금 수여'
    ],
    target: 'AI·소프트웨어·기계·전자 전공 청년',
    link: 'https://www.kiat.or.kr',
    linkText: 'KIAT 인재양성 공고'
  },
  yth_cert: {
    title: '글로벌 표준·시험인증 전문인력 무료 아카데미',
    dept: '국가기술표준원',
    supportType: '국가 공인 교육 + 인증기관 취업 연계',
    desc: 'KTR, KTL, KCL 등 대한민국 대표 공공 시험인증기관에서 국제규격(ISO, CE, UL) 시험 분석 및 기술규제 컨설팅 전문가로 성장할 수 있는 국비 무료 과정입니다.',
    points: [
      '첨단 시험 분석 장비 직접 조작 실무 교육',
      '시험인증 전문기관 정규직 및 채용연계 인턴십 추천',
      '교육비 및 교재비 100% 국비 지원'
    ],
    target: '이공계 대졸 구직자 및 졸업예정자',
    link: 'https://www.kats.go.kr',
    linkText: '국가기술표준원 교육안내'
  },
  biz_export: {
    title: '수출바우처 & 글로벌 통상안보 방어 패키지',
    dept: '수출입과',
    supportType: '최대 1억 원 바우처 포인트 + 무역보험 50% 감면',
    desc: '해외 박람회 참가, 글로벌 인증(CE, FDA), 현지 법인 설립, 해외 홍보 마케팅, 물류비 등 수출에 필요한 모든 비용을 현금처럼 사용하는 바우처를 드립니다.',
    points: [
      '기업별 최대 1억 원의 수출 바우처 포인트 직접 부여',
      '미국·EU 통상 규제(CBAM, 반덤핑) 원스톱 기술 컨설팅 무료',
      '한국무역보험공사 수출보증료 50% 할인 및 즉시 보증'
    ],
    target: '수출 희망 중소·중견기업',
    link: 'https://www.exportvoucher.com',
    linkText: '수출바우처 전용 포털'
  },
  biz_smart: {
    title: 'M.AX AI 팩토리 선도 프로젝트 & 스마트공장 구축',
    dept: '제조AX혁신과',
    supportType: '국비 매칭 최대 5억~10억 원 무상 지원',
    desc: '공정 불량률을 낮추고 생산성을 혁신하기 위해 AI 비전 검사, 협동 로봇, IoT 센서 및 자율제조 시스템을 공장에 도입하는 설비 비용을 지원합니다.',
    points: [
      '총 사업비의 50% 이상 최대 10억 원 국비 무상 보조',
      '공정 데이터 수집을 위한 산업단지 클라우드 서버 무상 제공',
      '로봇공학 전문가 현장 파견 맞춤형 공정 설계 무료'
    ],
    target: '전국 제조업 중소·중견기업',
    link: 'https://www.kiat.or.kr',
    linkText: '스마트공장 사업 공고'
  },
  biz_remodel: {
    title: '기업활력법 기반 사업재편 승인 종합 패키지',
    dept: '산업공급망과',
    supportType: '세제 감면 + R&D 자금 + 민간 VC 투자유치(IR) 연계',
    desc: '전통 내연기관, 석유화학 등 과잉 공급 업종에서 미래 친환경·신산업으로 구조를 바꾸는 기업에게 상법·공정거래법 규제 특례 및 자금을 몰아줍니다.',
    points: [
      '사업재편 전용 저금리 융자 및 국비 R&D 우선 매칭',
      '법인세 이월결손금 공제 및 양도차익 과세 이연 세제 혜택',
      '벤처캐피털(VC) 및 정책금융 대상 투자유치 설명회(IR-Day) 개최'
    ],
    target: '신산업 전환을 추진하는 국내 기업',
    link: 'https://www.motie.go.kr',
    linkText: '사업재편 승인 신청'
  },
  biz_local: {
    title: '기회발전특구 이전 파격 인센티브 (5극 3특)',
    dept: '지역경제진흥과',
    supportType: '소득·법인세 5년간 100% 면제 + 부지 무상 지원',
    desc: '수도권에서 지방 기회발전특구로 사업장을 이전하거나 지방에 공장을 신증설하는 기업에게 법인세, 취득세, 상속세 파격 감면과 인프라를 제공합니다.',
    points: [
      '소득세·법인세 5년간 100% 면제 + 이후 2년간 50% 감면',
      '산업용지 무상 임대 및 전력·용수 국가 직접 연결',
      '지역 내 산학협력 연구원 인재 우선 공급 체계 가동'
    ],
    target: '지방 투자 및 공장 신증설 기업',
    link: 'https://www.motie.go.kr',
    linkText: '기회발전특구 안내'
  },
  rnd_grant: {
    title: '산업기술 R&D 혁신펀드 & 전략기술 챌린지',
    dept: '산업기술개발과',
    supportType: '과제당 수억~수십억 원 대형 무상 출연금',
    desc: '반도체, 모빌리티, 인공지능 로봇 등 초격차 국가 핵심기술을 개발하는 산·학·연 컨소시엄에 대규모 무상 연구비를 지원합니다.',
    points: [
      '기술료 감면 및 실패 부담을 낮춘 도전형 R&D 평가 방식',
      '정부 매칭 펀드를 통한 민간 벤처투자금 동시 유치',
      'KEIT(한국산업기술기획평가원) 통합 공모를 통해 상시 접수'
    ],
    target: '스타트업, 중소·벤처 R&D 연구소 및 대학 연구팀',
    link: 'https://www.keit.re.kr',
    linkText: '산업기술 R&D 포털(KEIT)'
  },
  rnd_sandbox: {
    title: '산업융합 규제샌드박스 (실증특례 & 임시허가)',
    dept: '산업기술정책과',
    supportType: '규제 면제 + 실증비 최대 1.2억 원 보조',
    desc: '기존 법령이 모호하거나 가로막혀 출시하지 못한 혁신 제품과 신서비스에 대해 법을 유예해주고 시장에서 실제 고객을 대상으로 검증할 수 있게 합니다.',
    points: [
      '신속확인(30일 내 회신) 및 실증특례·임시허가 법적 승인',
      '책임보험료 전액 지원 및 실증 사업비 최대 1억 2천만 원 보조',
      '국가 표준 제정 및 법령 조기 개정 원스톱 추진'
    ],
    target: '신기술·신융합 비즈니스 보유 창업기업/개발자',
    link: 'https://sandbox.kiat.or.kr',
    linkText: '규제샌드박스 즉시 신청'
  },
  rnd_infra: {
    title: '연구장비 공동활용 & 오픈랩 실증 바우처',
    dept: '산업기술혁신과',
    supportType: '고가 공공 연구장비 사용료 최대 70% 지원',
    desc: '반도체 클린룸, 3D 프린터, 전자기파(EMC) 챔버 등 수억 원대 고가 시험장비를 전국 테크노파크에서 저렴하게 이용할 수 있는 바우처를 지급합니다.',
    points: [
      '전국 19개 테크노파크 및 정부출연연구원 보유 첨단 장비 공유',
      '전문 시험인증 연구원 기술 지도 1:1 지원',
      '시제품 제작 시간 60% 단축 및 개발 비용 절감'
    ],
    target: '하드웨어/신소재 개발 스타트업 및 연구자',
    link: 'https://www.kiat.or.kr',
    linkText: '연구장비 공동활용 포털'
  },
  rnd_patent: {
    title: '국가표준원 국제표준화(ISO/IEC) 선점 지원 사업',
    dept: '표준정책국',
    supportType: '해외 표준화 출장비 전액 + 표준 R&D 펀딩',
    desc: '개발한 신기술을 글로벌 국제표준으로 제정하여 세계 시장을 선점할 수 있도록 특허-표준 연계 컨설팅과 국제기구 활동 경비를 지원합니다.',
    points: [
      '국제 표준 문서 기고 및 총회 참석 경비 전액 국비 보조',
      '표준 전문가 매칭을 통한 표준특허 획득 종합 전략 수립',
      '수출 시 경쟁국 기술장벽(TBT) 무력화 효과'
    ],
    target: '핵심 특허를 보유한 R&D 연구자 및 첨단 테크 기업',
    link: 'https://www.kats.go.kr',
    linkText: '국가기술표준원 사업 공고'
  }
};

function initSurveyWizard() {
  const wizard = document.getElementById('surveyWizard');
  if (!wizard) return;

  const step1 = document.getElementById('wizardStep1');
  const step2 = document.getElementById('wizardStep2');
  const step3 = document.getElementById('wizardStep3');

  const progressFill = document.getElementById('progressFill');
  const dot1 = document.getElementById('dot1');
  const dot2 = document.getElementById('dot2');
  const dot3 = document.getElementById('dot3');

  const btnGoStep2 = document.getElementById('btnGoStep2');
  const btnBackStep1 = document.getElementById('btnBackStep1');
  const btnGoStep3 = document.getElementById('btnGoStep3');
  const btnRestart = document.getElementById('btnRestartSurvey');

  const checklistArea = document.getElementById('checklistItemsArea');
  const matchedListArea = document.getElementById('matchedBenefitsList');
  const matchCountSpan = document.getElementById('matchCount');
  const greetingH3 = document.getElementById('resultUserGreeting');

  let currentSelectedRole = 'general';
  let checkedItemIds = [];

  // 1단계 -> 2단계
  btnGoStep2.addEventListener('click', () => {
    const selectedRadio = document.querySelector('input[name="userRole"]:checked');
    currentSelectedRole = selectedRadio ? selectedRadio.value : 'general';

    renderChecklist(currentSelectedRole);

    step1.classList.remove('active');
    step2.classList.add('active');

    progressFill.style.width = '66.6%';
    dot1.classList.add('done');
    dot2.classList.add('active');

    wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // 2단계 -> 1단계
  btnBackStep1.addEventListener('click', () => {
    step2.classList.remove('active');
    step1.classList.add('active');

    progressFill.style.width = '33.3%';
    dot1.classList.remove('done');
    dot2.classList.remove('active');

    wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // 2단계 -> 3단계 (결과)
  btnGoStep3.addEventListener('click', () => {
    const checkboxes = checklistArea.querySelectorAll('input[type="checkbox"]:checked');
    checkedItemIds = Array.from(checkboxes).map(cb => cb.value);

    if (checkedItemIds.length === 0) {
      const allCheckboxes = checklistArea.querySelectorAll('input[type="checkbox"]');
      checkedItemIds = Array.from(allCheckboxes).map(cb => cb.value);
    }

    renderResults(currentSelectedRole, checkedItemIds);

    step2.classList.remove('active');
    step3.classList.add('active');

    progressFill.style.width = '100%';
    dot2.classList.add('done');
    dot3.classList.add('active');

    wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // 다시 진단하기
  btnRestart.addEventListener('click', () => {
    step3.classList.remove('active');
    step1.classList.add('active');

    progressFill.style.width = '33.3%';
    dot1.className = 'step-dot active';
    dot2.className = 'step-dot';
    dot3.className = 'step-dot';

    wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  function renderChecklist(role) {
    const data = surveyQuestions[role] || surveyQuestions.general;
    checklistArea.innerHTML = '';

    data.items.forEach((item) => {
      const label = document.createElement('label');
      label.className = 'check-item-label';
      label.innerHTML = `
        <input type="checkbox" value="${item.id}" checked>
        <div class="check-text-wrap">
          <strong><i class="fa-solid fa-angle-right" style="color: var(--primary);"></i> ${item.title}</strong>
          <span>${item.desc}</span>
        </div>
      `;

      const cb = label.querySelector('input');
      cb.addEventListener('change', () => {
        if (cb.checked) {
          label.classList.add('checked');
        } else {
          label.classList.remove('checked');
        }
      });
      label.classList.add('checked');

      checklistArea.appendChild(label);
    });
  }

  function renderResults(role, itemIds) {
    const roleInfo = surveyQuestions[role] || surveyQuestions.general;
    greetingH3.innerHTML = `<strong>${roleInfo.roleName}</strong> 맞춤으로 총 <span class="highlight-count">${itemIds.length}개</span>의 지원 혜택이 매칭되었습니다!`;
    matchCountSpan.textContent = itemIds.length;

    matchedListArea.innerHTML = '';

    itemIds.forEach(id => {
      const benefit = benefitDatabase[id];
      if (!benefit) return;

      const card = document.createElement('div');
      card.className = 'benefit-card';
      const pointsHtml = benefit.points.map(p => `<li><i class="fa-solid fa-check"></i> <span>${p}</span></li>`).join('');

      card.innerHTML = `
        <div class="benefit-top">
          <span class="benefit-dept"><i class="fa-solid fa-building-flag"></i> 소관: 산업통상부 ${benefit.dept}</span>
          <span class="benefit-support-type"><i class="fa-solid fa-hand-holding-dollar"></i> ${benefit.supportType}</span>
        </div>
        <h4>${benefit.title}</h4>
        <p>${benefit.desc}</p>
        <div class="benefit-points">
          <ul style="list-style: none;">
            ${pointsHtml}
          </ul>
        </div>
        <div class="benefit-action-row">
          <span class="target-criteria"><i class="fa-solid fa-user-check"></i> 신청 대상: ${benefit.target}</span>
          <a href="${benefit.link}" target="_blank" rel="noopener noreferrer" class="apply-btn">
            ${benefit.linkText} <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      `;

      matchedListArea.appendChild(card);
    });
  }
}

/* 6. 최신 뉴스 카테고리 필터링 */
function initNewsFilter() {
  const filterBtns = document.querySelectorAll('.news-filter-btn');
  const newsCards = document.querySelectorAll('.news-grid .news-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      newsCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 7. 스크롤 스파이 (ScrollSpy) */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav .nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}
