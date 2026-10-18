/* 기능 2·3·8·11용 추가 데이터. 자료에서 확인되는 사실만 적었습니다.
   [확인 필요]로 표시한 항목은 직접 채우면 화면에 자동으로 나타납니다. */
(function () {
  var S = window.SITE;

  /* ② 검증 수준 */
  S.verifyKinds = {
    measured: { label: "실측", tone: "pass" },
    sim: { label: "시뮬레이션", tone: "ink" },
    synth: { label: "Vivado 합성·구현", tone: "ink" },
    demo: { label: "시연", tone: "ink" },
    offline: { label: "오프라인 평가", tone: "ink" },
    ops: { label: "운영 실적", tone: "ink" }
  };

  var extra = {
    fsr: {
      verify: { kinds: ["measured", "sim"], note: "HFSS 시뮬레이션과 VNA 자유공간 측정(Time Gating 보정)의 상관성을 확인했습니다." },
      contrib: { team: null, role: "전파연구실 학부연구생", did: ["HFSS로 흡수층·투과층·배열 안테나 설계", "Gerber 작성과 PCB 제작", "VNA 자유공간 측정에 참여", "결합 후 성능 저하의 원인을 재정의하고 최적화 순서를 변경"] },
      qa: [
        { q: "개별 구조는 목표를 만족했는데, 결합하면 왜 성능이 떨어졌나요?", a: "구조끼리 결합하면서 생기는 전자기적 상호작용이 원인이라고 생각하고, 흡수/투과 성능을 동시에 확인하며 시스템 단위로 다시 정의하여 최적화를 진행했습니다. 흡수층과 투과층을 먼저 결합해 최적화하고, 그 위에 안테나를 통합하는 순서로 바꿨습니다." },
        { q: "실측 결과는 어떻게 신뢰할 수 있나요?", a: "실측은 연세대 FSS 실험실에서 진행했으며, 실측 신호에 주변 반사가 섞여 있어 Time Gating으로 분리하는 작업을 진행했습니다. 추출하여 보정한 결과를 시뮬레이션과 비교해 상관성을 확인했습니다." }
      ]
    },
    fpga: {
      verify: { kinds: ["synth"], note: "Vivado에서 확인한 합성·Implementation 결과 기준입니다." },
      contrib: { team: null, role: "팀원", did: ["Verilog와 Vivado로 Recursive, Streamline 구조의 지연·처리량·자원 사용량 비교", "반복되는 Scaling 연산을 PU 출력단으로 통합해 자원 사용량 개선"] },
      qa: [
        { q: "왜 Scaling 연산이 문제라고 판단했나요?", a: "Streamline 구조는 LUT 117.97%로 합성이 안 됐고, DSP를 써도 78.73%에서 Implementation이 실패했습니다. 원인은 PE마다 같은 Scaling 연산이 반복되는 구조였고, 이를 PU 출력단에서 한 번에 처리하도록 통합했습니다." },
        { q: "그 선택의 대가(trade-off)는 무엇인가요?", a: "LUT은 42.27%로 줄었지만 DSP 사용률이 93.64%로 올랐습니다." }
      ]
    },
    tcad: {
      verify: { kinds: ["sim"], note: "시뮬레이션 기반이며, 공정 변동은 검증하지 않았습니다." },
      contrib: { team: null, role: "팀장", did: ["MOSFET과 1-Fin, 2-Fin FinFET 설계", "도핑 조건과 Fin 구조 조정", "비정상 Vth의 원인을 판단하고 도핑 방식을 변경"] },
      qa: [
        { q: "Vth가 비정상적으로 나온 원인을 어떻게 판단했나요?", a: "Gaussian 도핑 방식으로 인해 Channel까지 도핑이 퍼진 것이 원인이라고 판단하고, 도핑 방식을 Constant 방식으로 바꿔 진행했습니다. 2-Fin 구조에서 목표 1,000 μA를 넘는 약 1,167 μA를 얻었습니다." },
        { q: "이 결과의 한계는 무엇인가요?", a: "Drain 전류가 1,000 μA를 넘겼지만 누설전류와 문턱전압의 음수화라는 문제가 발생하여 보완이 필요합니다. 또한 소자 시뮬레이션 결과이고 공정 변동까지는 검증하지 않았습니다." }
      ]
    },
    lamp: {
      verify: { kinds: ["demo"], note: "시제품을 약 35명 앞에서 시연하고 피드백을 받았습니다." },
      contrib: { team: null, role: "팀장", did: ["Raspberry Pi 5 기반 음성 분석 시제품 제작", "마이크 입력 누락의 원인 점검과 고감도 마이크로 교체", "약 35명 대상 시연과 피드백 수집"] },
      qa: [
        { q: "마이크 입력 데이터가 누락된 원인은 어떻게 찾았나요?", a: "보드, 설정, 입력장치 순서로 하나씩 점검해 입력장치가 원인임을 확인했고, 고감도 마이크로 교체해 해결했습니다. 피드백 지연도 20~30초에서 20초 미만으로 줄였습니다." }
      ]
    },
    cooling: {
      verify: { kinds: ["offline"], note: "제공된 과거 데이터에 대한 오프라인 평가이며, 실제 설비 운영 성능을 보장하지 않습니다." },
      contrib: { team: "2인 팀", share: "기여도 50%", role: "LS JUMP-UP 1기", did: ["데이터 전처리", "모델-대시보드 연동", "대시보드 구현"], other: "모델링과 대시보드 디자인은 팀원이 담당했습니다." },
      qa: [
        { q: "왜 잔여수명(TTF) 회귀를 포기했나요?", a: "저압·고압·누출별로 예측했지만 SMAPE가 높고 R²가 음수였습니다. 비슷한 센서 상태에서도 고장까지 남은 시간이 크게 달랐고, 누출 표본은 139건뿐이었습니다. 그래서 문제를 24시간 내 고장 탐지와 유형 분류로 바꿨습니다." },
        { q: "Recall을 우선한 이유와 그 대가는 무엇인가요?", a: "고장을 놓치지 않는 것이 목적이라 Recall 75% 이상을 목표로 임계값 0.34를 골랐습니다. 대신 Precision과 F1이 낮아 오경보가 남았고, 연속 경보 병합과 Cooldown으로 줄이려 했습니다." },
        { q: "데이터 누수는 어떻게 막았나요?", a: "장비별 시간 순서로 Train 60%, Validation 20%, Test 20%로 나누고, 경계에 24시간 purge 구간을 뒀습니다. 고장 시각과 TTF처럼 운영 시점에는 알 수 없는 정보는 입력에서 뺐습니다." }
      ]
    }
    ,todak: {
      verify: { kinds: ["ops"], note: "참가자 수는 사업계획서 기준입니다. 행동 변화를 장기 추적한 결과는 아닙니다." },
      contrib: { team: null, role: "팀장", did: ["팀장으로서 세미나 운영 기획과 프로그램 구성을 주도", "사전 설문과 1주차 워크북 등 참가자 자료 준비", "세미나에서 나온 한계를 앱과 램프 시제품으로 연결", "가족센터, 학교, 기업, 바우처 기관별 영업 경로 설계", "(주)아이브러리와 협력해 진행"] },
      qa: [
        { q: "세미나 다음에 왜 앱과 램프를 만들었나요?", a: "참가 부모들이 고치고 싶어도 말하는 순간에는 생각이 안 난다고 했습니다. 일회성 교육으로는 그 순간에 개입할 수 없다고 보고, 대화 중에 바로 피드백할 수 있는 방법이 무엇이 있을까 고민하다가 무드등을 보았고 재해석하여 ‘따말 램프’를 기획했습니다. 앱과 램프로 인지할 수 있도록 했습니다." },
        { q: "기관이나 기업에 영업해 본 경험이 있나요?", a: "계약을 성사시킨 영업 실적은 없습니다. 가족센터 미팅과 부모 인터뷰로 수요를 확인하고, 기관별 영업 경로와 제안 방식을 설계했습니다." }
      ]
    }

  };
  S.projects.forEach(function (p) { var e = extra[p.id]; if (e) { p.verify = e.verify; p.contrib = e.contrib; p.qa = e.qa; } });

  /* ⑪ 증빙 모아보기. ready: true 로 바꾸면 증빙 페이지에 나타납니다. file 경로에 파일을 넣어 주세요. */
  S.evidence = [
    { title: "이력서 PDF", sub: "공통 범용", href: "assets/resume.pdf", ready: true, project: null },
    { title: "냉각 설비 고장 예측 GitHub 저장소", sub: "코드와 대시보드", href: S.github, ready: true, project: "cooling" },
    { title: "한국전자파학회 포스터 (2025.08)", sub: "FSR 연구 발표", href: "assets/evidence/fsr-poster.pdf", ready: false, project: "fsr" },
    { title: "‘따뜻한 말 램프’ 시연 영상", sub: "시제품 작동 장면", href: "assets/evidence/lamp-demo.mp4", ready: false, project: "lamp" },
    { title: "학생 창업 마라톤 우수상 증빙 (2026.07.03)", sub: "서울과학기술대학교 · 강원도립대학교 창업지원단", href: "assets/evidence/award-startup.pdf", ready: false, project: "lamp" },
    { title: "전기기사 · 전기공사기사 합격 증빙 (2025.12.24)", sub: "한국산업인력공단", href: "assets/evidence/cert-electric.pdf", ready: false, project: null }
  ];
  /* 증빙 페이지에 보일 결과 사진: 꼭 필요한 6장만 */
  S.evidenceImages = ["fsr-meas.png", "fpga-util.png", "tcad-idvg.png", "lamp-booth.jpg", "award-startup.jpg", "cooling-real-priority.png"];

  /* 따뜻한 말 램프와 따뜻한 말 연구소를 나란히 배치하고 번호를 다시 매긴다 */
  (function () {
    var pl = S.projects, ti = -1, li = -1;
    pl.forEach(function (p, i) { if (p.id === "todak") ti = i; if (p.id === "lamp") li = i; });
    if (ti > -1 && li > -1) { var t = pl.splice(ti, 1)[0]; li = pl.findIndex(function (p) { return p.id === "lamp"; }); pl.splice(li, 0, t); }
    pl.forEach(function (p, i) { p.no = ("0" + (i + 1)).slice(-2); });
  })();
})();
