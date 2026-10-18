/* 사이트 전체 데이터. 내용을 고치려면 이 파일만 수정하면 됩니다. */
window.SITE = {
  name: "조예찬",
  email: "jyc1046@naver.com",
  phone: "010-8447-1046",
  github: "https://github.com/chan1046/dashboard_team6",

  /* 직무별 보기 (프로젝트의 d 값이 여기 id와 같으면 해당 직무에 연결됩니다) */
  domains: [
    { id: "rf", label: "RF · 전자파",
      blurb: "FSR 설계부터 PCB 제작, VNA 자유공간 측정과 Time Gating 보정까지 직접 수행했습니다. 흡수율 약 95%, 투과손실 0.7 dB 이하, RCS 약 10 dB 저감." },
    { id: "digital", label: "FPGA · 디지털",
      blurb: "Verilog와 Vivado로 MLP 가속기의 지연, 처리량, 자원 사용량을 비교하고 LUT 사용률을 117.97%에서 42.27%로 줄였습니다." },
    { id: "device", label: "반도체 소자",
      blurb: "TCAD로 MOSFET과 1-Fin, 2-Fin FinFET을 설계해 목표 1,000 μA 대비 약 1,167 μA를 달성했습니다(시뮬레이션 기반). 반도체 기초역량 강화 교육 26h를 이수했습니다." },
    { id: "service", label: "기획 · 현장 운영",
      blurb: "부모 말 습관 개선 세미나를 유료로 2회 운영했고(참가 19명). 세미나에서 나온 한계를 앱과 램프 시제품으로 이어 갔고, 카페 운영 아르바이트로 현장 절차를 개선했습니다." },
    { id: "data", label: "데이터 · AI",
      blurb: "센서 약 8,219만 행으로 24시간 내 고장 탐지(Recall 약 78%)와 유형 분류 대시보드를 만들었고, Raspberry Pi 5 기반 음성 분석 AI 시제품을 제작했습니다. LS JUMP-UP 수강 중." }
  ],

  heroTags: ["RF · 전자파", "FPGA", "반도체 소자 TCAD", "AI 시제품", "세미나 기획 · 운영", "데이터 분석 · 예지보전", "전기기사 · 전기공사기사", "LS JUMP-UP 1기 수강 중"],

  loop: ["설계", "시뮬레이션", "실측", "목표 검증"],

  /* 대표 수치. bars: w(%), c(색), mark(목표/한계선 위치 %) */
  stats: [
    { d: ["rf"], n: "약 95%", l: "FSR 흡수율 · 투과손실 0.7 dB 이하", bars: [{ w: 95, c: "pass" }], max: "100%" },
    { d: ["rf"], n: "약 10 dB", l: "안테나 결합 구조 RCS 저감", bars: [{ w: 66.7, c: "pass" }], max: "15 dB" },
    { d: ["digital"], n: "117.97% → 42.27%", l: "FPGA 가속기 LUT 사용률", bars: [{ w: 78.6, c: "over", mark: 66.7, mc: "over" }, { w: 28.2, c: "pass", mark: 66.7, mc: "over" }], max: "150%", note: "한계 100%", noteC: "over", at: 66.7 },
    { d: ["device"], n: "약 1,167 μA", l: "2-Fin FinFET Drain Current (목표 1,000 μA)", bars: [{ w: 83.4, c: "pass", mark: 71.4, mc: "ink" }], max: "1,400", note: "목표 1,000", noteC: "ink", at: 71.4 },
    { d: ["service"], n: "19명", l: "부모 언어 개선 세미나 유료 참가자 (유료 2회, 1차 7명, 2차 12명)", bars: [{ w: 35, c: "pass" }, { w: 60, c: "pass" }], max: "20명" },
    { d: ["data"], n: "약 78%", l: "냉각 설비 24시간 내 고장 사전 탐지 (Recall)", bars: [{ w: 78, c: "pass" }], max: "100%" }
  ],

  projects: [
    {
      id: "fsr", no: "01", d: ["rf"],
      title: "Frequency Selective Rasorber 설계", titleHtml: "Frequency Selective<br>Rasorber 설계",
      role: "전파연구실 학부연구생", date: "2025.01~12",
      summary: "흡수층·투과층·배열 안테나를 하나로 결합한 구조를 설계하고 실측으로 검증했습니다.",
      result: "흡수율 약 95% · 투과손실 0.7 dB 이하 · RCS 약 10 dB 저감",
      tags: ["HFSS", "PCB", "VNA", "Time Gating"],
      kpis: [{ n: "약 95%", l: "흡수율", c: "pass" }, { n: "0.7 dB 이하", l: "투과손실", c: "pass" }, { n: "약 10 dB", l: "안테나 결합 구조 RCS 저감", c: "pass" }],
      steps: [
        { k: "do", label: "한 일", body: "HFSS로 흡수층·투과층·배열 안테나를 설계하고, Gerber 작성과 PCB 제작, VNA 자유공간 측정에 참여했습니다." },
        { k: "problem", label: "문제", body: "개별 구조는 목표를 만족했지만, 결합하자 흡수와 투과 성능이 함께 떨어졌습니다." },
        { k: "cause", label: "원인 판단", body: "원인을 '결합 구조의 전자기적 상호작용'으로 다시 정의했습니다." },
        { k: "fix", label: "해결", body: "흡수층과 투과층을 먼저 결합해 최적화한 뒤, 그 위에 안테나를 통합하는 순서로 바꿨습니다. 실측에 주변 반사가 섞이는 문제는 Time Gating으로 신호를 분리해 시뮬레이션과의 상관성을 확인했습니다." },
        { k: "result", label: "결과", body: "흡수율 약 95%, 투과손실 0.7 dB 이하\n안테나 결합 구조에서 RCS 약 10 dB 저감\n각도 안정성과 편파 무감성까지 확인\n한국전자파학회 포스터 발표 (2025.08)" }
      ],
      galleryTitle: "시뮬레이션과 실측, 나란히 보기", galleryEyebrow: "SIMULATION VS MEASUREMENT",
      gallery: [
        { src: "fsr-compare.png", cap: "시뮬레이션과 실측 비교 (반사·투과계수, 흡수율)", alt: "FSR의 반사계수, 투과계수, 흡수율을 시뮬레이션과 VNA 실측으로 겹쳐 비교한 그래프" },
        { src: "fsr-meas.png", cap: "VNA 자유공간 측정 환경과 Time Gating 적용 전후", alt: "VNA 자유공간 측정 장비 구성과 Time Gating 적용 전후의 S-parameter 그래프" },
        { src: "fsr-pcb.jpg", cap: "제작한 Absorption/Transmission Layer 샘플", alt: "제작한 Absorption Layer와 Transmission Layer PCB 샘플 사진" },
        { src: "award-capstone.jpg", cap: "2025 캡스톤디자인 작품 전시회 우수상 상장 (2025.12.19)", alt: "2025년도 캡스톤디자인 작품 전시회 우수상 안내판과 평판형 Rasorber 설계 및 제작 상장 사진" }
      ],
      moment: "시뮬레이션에서 기획한 대로 실제 샘플이 측정되는 것을 눈으로 확인했을 때, 그리고 성능뿐 아니라 RCS 저감과 각도 안정성, 편파 무감성까지 확인했을 때가 가장 뿌듯했습니다."
    },
    {
      id: "fpga", no: "02", d: ["digital"],
      title: "ZYNQ FPGA MLP 가속기", titleHtml: "ZYNQ FPGA<br>MLP 가속기",
      role: "팀원", date: "2024.03~06",
      summary: "Recursive와 Streamline 구조를 지연·처리량·자원 사용량 기준으로 비교하고 최적화했습니다.",
      result: "LUT 117.97% → 42.27% · MNIST 10장 8,210 clock",
      tags: ["Verilog", "Vivado", "ZYNQ"],
      kpis: [{ n: "LUT 42.27%", l: "Implementation 성공 (117.97%에서 감소)", c: "pass" }, { n: "8,210 clock", l: "MNIST 10개 이미지 처리", c: "pass" }, { n: "DSP 93.64%", l: "대신 올라간 사용률 (trade-off)", c: "ink" }],
      steps: [
        { k: "do", label: "한 일", body: "Verilog와 Vivado로 Recursive, Streamline 구조의 지연, 처리량, 자원 사용량을 비교했습니다." },
        { k: "problem", label: "문제", over: true, body: "Streamline 구조는 LUT 117.97%로 합성이 불가능했고, DSP를 적용한 뒤에도 LUT 78.73%로 Implementation이 실패했습니다." },
        { k: "cause", label: "원인 판단", body: "PE마다 반복되는 Scaling 연산이 자원을 낭비한다고 판단했습니다." },
        { k: "fix", label: "해결", body: "Scaling 연산을 각 PE에서 빼내 PU 출력단에서 한 번에 처리하도록 통합했습니다." },
        { k: "result", label: "결과", body: "LUT 사용률 42.27%로 Implementation 성공\nMNIST 10개 이미지 처리 8,210 clock\n대신 DSP 사용률이 93.64%로 올라가는 trade-off 확인" }
      ],
      galleryTitle: "자원 사용률 화면", galleryEyebrow: "RESOURCE UTILIZATION",
      gallery: [{ cls: "chart wide", src: "fpga-util-chart.svg", cap: "자원 사용률 재구성: DSP 미사용(LUT 117.97%)과 최종 구조(LUT 42.27%, DSP 93.64%)", alt: "DSP 사용 전후의 LUT, FF, BRAM, DSP, IO 자원 사용률을 비교한 막대 차트" }, { cls: "nat", src: "fpga-util.png", cap: "Vivado 자원 사용률: DSP 미사용(LUT 117.97%)과 최종 구조(LUT 42.27%) 비교", alt: "Vivado에서 확인한 DSP 미사용 구조와 최종 구조의 LUT, DSP 등 FPGA 자원 사용률 표와 그래프" }],
      closing: "Streamline 구조의 LUT 117.97%를 42.27%로 줄였습니다. 대신 DSP 사용률이 93.64%로 올라가는 trade-off도 함께 확인했습니다."
    },
    {
      id: "tcad", no: "03", d: ["device"],
      title: "TCAD 반도체 소자 설계", titleHtml: "TCAD<br>반도체 소자 설계",
      role: "팀장", date: "2024.09~12",
      summary: "MOSFET과 1-Fin, 2-Fin FinFET을 설계하고 목표 전류를 달성했습니다.",
      result: "2-Fin 구조에서 Drain Current 약 1,167 μA (목표 1,000 μA)",
      tags: ["TCAD", "FinFET", "도핑 설계"],
      kpis: [{ n: "약 1,167 μA", l: "2-Fin 구조 Drain Current", c: "pass", bar: { w: 83.4, at: 71.4, max: "1,400", note: "목표 1,000" } }, { n: "1,000 μA", l: "목표 Drain Current", c: "ink" }, { n: "1-Fin · 2-Fin", l: "MOSFET과 함께 설계한 FinFET 구조", c: "ink" }],
      steps: [
        { k: "do", label: "한 일", body: "팀장으로서 MOSFET과 1-Fin, 2-Fin FinFET을 설계하고, Drain Current 1,000 μA를 목표로 도핑 조건과 Fin 구조를 조정했습니다." },
        { k: "problem", label: "문제", body: "Vth가 비정상적으로 나왔습니다." },
        { k: "cause", label: "원인 판단", body: "Gaussian 도핑이 Channel까지 확장된 것이 원인이라고 판단했습니다." },
        { k: "fix", label: "해결", body: "도핑을 Constant 방식으로 변경했습니다." },
        { k: "result", label: "결과", body: "2-Fin 구조에서 약 1,167 μA 달성" }
      ],
      galleryTitle: "Id–Vg 커브", galleryEyebrow: "SIMULATION RESULT",
      gallery: [{ cls: "chart wide", src: "tcad-chart.svg", cap: "구조별 Ion, Ioff, Vth 비교 (표 수치를 다시 그린 차트)", alt: "Planar MOSFET과 FinFET 1 Fin, 2 Fin의 Ion, Ioff, Vth 비교 차트" }, { cls: "nat", src: "tcad-idvg.png", cap: "2-Fin FinFET Id–Vg 커브와 구조별 Vth, Ion, Ioff 비교표", alt: "TCAD 시뮬레이션으로 얻은 FinFET의 게이트 전압 대비 드레인 전류(Id–Vg) 커브" }],
      closing: "시뮬레이션 기반 결과이며, 공정 변동은 검증하지 않았습니다."
    },
    {
      id: "lamp", no: "04", d: ["data"],
      title: "‘따뜻한 말 램프’ AI 제품", titleHtml: "‘따뜻한 말 램프’<br>AI 제품",
      role: "팀장", date: "2026.02~08",
      summary: "부모의 말투를 분석해 LED와 앱으로 피드백하는 시제품입니다. 약 35명 시연 후 우수상을 받았습니다.",
      result: "피드백 지연 20~30초 → 20초 미만 · 학생 창업 마라톤 우수상",
      tags: ["Raspberry Pi 5", "Python", "Deepgram", "OpenAI", "Firebase"],
      kpis: [{ n: "20초 미만", l: "피드백 지연 (20~30초에서 단축)", c: "pass" }, { n: "약 35명", l: "시연과 피드백 수집 대상", c: "ink" }, { n: "우수상", l: "학생 창업 마라톤 (2026.07)", c: "ink" }],
      steps: [
        { k: "do", label: "한 일", body: "팀장으로서 Raspberry Pi 5, Python, Deepgram, OpenAI, Firebase로 음성 분석 결과를 LED와 앱으로 전달하는 시제품을 만들었습니다." },
        { k: "problem", label: "문제", body: "마이크 입력 데이터가 누락됐습니다." },
        { k: "cause", label: "원인 판단", body: "보드, 설정, 입력장치 순으로 점검해 원인을 좁혔습니다." },
        { k: "fix", label: "해결", body: "고감도 마이크로 교체해 입력 누락을 해결했습니다." },
        { k: "result", label: "결과", body: "피드백 지연을 20~30초에서 20초 미만으로 단축\n약 35명 대상 시연과 피드백 수집\n학생 창업 마라톤 우수상 (2026.07)" }
      ],
      galleryTitle: "시제품과 전시", galleryEyebrow: "PROTOTYPE",
      gallery: [
        { src: "lamp-booth.jpg", cap: "RE:DESIGN THON 전시 부스", alt: "따뜻한말연구소 전시 부스에서 램프와 노트북으로 시연하는 모습" },
        { src: "award-startup.jpg", cap: "학생 창업 마라톤 우수상 상장 (2026.07)", alt: "2026 학생창업 마라톤 우수상 상장과 안내판 사진" }
      ],
      moment: "기획한 대로 램프가 실제로 작동해 눈에 보였을 때가 가장 뿌듯했습니다."
    },
    {
      id: "cooling", no: "05", d: ["data"],
      title: "반도체 냉각 설비 고장 예측 시스템", titleHtml: "반도체 냉각 설비<br>고장 예측 시스템",
      role: "2인 팀 · LS JUMP-UP 1기", date: "2026.09.21~09.30",
      summary: "20개 이온 밀링 설비의 센서 데이터로 24시간 내 고장 위험을 탐지하고, 예상 고장 유형까지 분류하는 대시보드를 구현했습니다.",
      result: "센서 약 8,219만 행 처리 · 24시간 내 고장 약 78% 사전 탐지",
      tags: ["Python", "Pandas", "XGBoost", "Dash", "Plotly", "GitHub"],
      subtitle: "LS JUMP-UP 부트캠프 1기 · 2026.09.21~09.30",
      kpis: [{ n: "약 8,219만 행", l: "20개 설비의 센서 데이터 처리", c: "ink" }, { n: "약 78%", l: "24시간 내 고장 사전 탐지 (Recall, 임계값 0.34)", c: "pass" }, { n: "20개 설비", l: "위험도와 예상 고장 유형을 한 화면에서 확인", c: "ink" }],
      steps: [
        { k: "do", label: "한 일", body: "2인 팀(떠둘남둘)에서 데이터 전처리, 모델-대시보드 연동, 대시보드 구현을 맡았습니다. 모델링과 대시보드 디자인은 팀원이 담당했고, 기여도는 각 50%입니다." },
        { k: "problem", label: "문제", over: true, body: "저압·고압·누출별 고장 잔여시간(TTF)을 회귀로 예측했지만 SMAPE가 높고 R²가 음수로 나타났습니다. 누출 고장은 전체 1,236건 중 139건뿐이었습니다." },
        { k: "cause", label: "원인 판단", body: "비슷한 센서 상태에서도 고장까지 남은 시간이 크게 달랐고, 장비와 공정 조건에 따라 고장 진행 속도가 달랐으며, 고장 임박 구간과 누출 표본이 부족했습니다. 센서에는 고장 징후가 있었지만 정확한 잔여시간까지 결정할 정보는 충분하지 않다고 판단했습니다." },
        { k: "fix", label: "해결", body: "TTF 회귀를 최종 대시보드에서 빼고, 24시간 내 고장 여부와 다음 고장 유형을 예측하는 분류 문제로 바꿨습니다. 고장 누락을 줄이는 것이 목적이어서 Recall 75% 이상을 목표로 임계값 0.34를 선택했고, 연속 경보 병합과 Cooldown으로 오경보를 줄였습니다." },
        { k: "result", label: "결과", body: "24시간 내 고장 이진 탐지에서 실제 고장의 약 78%를 사전에 탐지\n20개 장비의 위험과 예상 고장 유형을 보여 주는 Dash 대시보드 구현\n예측 결과와 위험 로그를 DB에 저장해 정비 결과와 비교할 기반 마련" }
      ],
      extra: {
        redefine: {
          eyebrow: "PROBLEM REDEFINED", title: "잔여수명 회귀에서 고장 탐지·분류로",
          lead: "정확한 고장 잔여시간(TTF) 회귀는 개선 후에도 운영에 필요한 성능을 얻지 못했습니다. 실패한 회귀 결과를 억지로 적용하지 않고, 센서 데이터가 더 안정적으로 설명할 수 있는 문제로 바꿨습니다.",
          before: { title: "고장 잔여시간(TTF) 회귀 예측", lines: ["초기 Test R²: 저압 −0.4271 · 고압 −0.1919 · 누출 −0.5906", "튜닝 후에도 SMAPE 73.89~94.50%, R²는 0 안팎에 머묾", "누출 고장은 전체 1,236건 중 139건으로 가장 적음"] },
          after: { title: "24시간 내 고장 탐지 + 고장 유형 분류", lines: ["현재 시점 이후 24시간 안에 저압·고압·누출 중 하나가 발생하면 고장으로 정의", "고장 위험으로 판정된 데이터에서 다음 고장 유형을 분류", "고장 탐지는 XGBoost에 임계값 0.34로 Recall을 우선했고, 유형 분류는 Random Forest를 선택(발표 자료 기준)"] }
        },
        pipeline: { eyebrow: "PIPELINE", title: "데이터 처리부터 경보까지", items: ["4초 → 1분 단위 집계", "시계열 파생변수 생성", "120초 초과 공백은 세션 분리", "시간순 분할 60/20/20 + 24시간 purge", "XGBoost, 임계값 0.34", "연속 경보 병합 + Cooldown"] },
        issues: {
          eyebrow: "TROUBLESHOOTING", title: "부딪힌 문제 5가지",
          items: [
            { title: "8,219만 행의 메모리·속도 문제", problem: "전체 데이터를 한 번에 불러오면 메모리가 급증하고 전처리가 길어졌습니다.", fix: "약 10만 행 단위로 순차 처리하고, 청크마다 센서와 TTF의 행 수와 time 값을 검증했습니다. 청크 경계의 미완성 1분 구간은 다음 청크로 넘기는 로직을 넣었습니다.", result: "20개 장비 82,189,440행을 순차 처리하고 시각 정합성까지 검증" },
            { title: "TTF 결측의 의미 해석", problem: "01_M01에서 연속된 TTF NaN이 7만 건 이상 발견됐습니다.", fix: "센서와 time 값을 비교해 병합 오류가 아님을 확인했습니다. TTF는 다음 고장 시각에서 현재 시각을 뺀 값이라, 이후 고장이 없는 구간은 계산할 수 없다는 점을 반영해 계산 가능 여부를 나타내는 정보를 유지했습니다.", result: "미래 데이터가 없는 구간을 임의로 보간하지 않음" },
            { title: "긴 수집 공백으로 인한 rolling 왜곡", problem: "일부 구간에 수십 초에서 수일까지 데이터 공백이 있어, 공백 전후가 이어진 시계열처럼 계산될 수 있었습니다.", fix: "120초를 넘는 공백은 새로운 운전 세션으로 분리해 이전 이력이 이어지지 않게 했습니다.", result: "연결되지 않은 운전 구간이 하나의 변화로 계산되는 문제를 줄임" },
            { title: "모델과 대시보드 feature 불일치 위험", problem: "모델 1은 85개, 모델 2는 72개 feature를 쓰는데, 입력 컬럼의 개수나 순서가 달라지면 잘못된 추론이 나올 수 있었습니다.", fix: "추론 로직을 별도 모듈로 분리하고 저장된 feature 정보로 개수, 이름, 순서를 검사했습니다. 모델을 고치지 않고 대시보드 입력을 학습 조건에 맞췄습니다.", result: "관련 테스트 10개 통과, 기존 모델 파일 hash 변경 없음" },
            { title: "모델 연동 중 대시보드 디자인 손상", problem: "모델 결과를 연결하자 기존 디자인이 사라지고 텍스트와 기본 배치만 나타났습니다.", fix: "동일 selector가 CSS에 중복 선언되어 뒤의 스타일이 앞을 덮어쓴 것이 원인이었습니다. 기존 class와 CSS를 기준으로 변경을 추적하고, 기능 구현과 디자인 수정을 영역별로 나눠 진행했습니다.", result: "기존 디자인을 유지한 채 실제 모델 데이터를 표시" }
          ]
        },
        limits: {
          limits: ["고장 데이터가 정상 데이터보다 매우 적어 클래스 불균형이 큽니다.", "누출 고장은 139건으로 가장 적어 유형 분류의 불확실성이 큽니다.", "임계값 0.34에서 Recall은 높아졌지만 Precision과 F1-score가 낮아 오경보 부담이 남습니다.", "현재 성능은 과거 데이터에 대한 오프라인 평가이며 실제 설비 운영 성능을 보장하지 않습니다."],
          nexts: ["누출을 포함한 고장 이력과 정비 결과를 추가 확보해 학습 표본을 확대합니다.", "장비별·고장 유형별 임계값을 분리하고, 실제 정비 비용을 반영해 최적화합니다.", "정비 이력, 부품 교체 시점, 장비 가동·정지 정보 같은 외부 데이터를 추가합니다.", "데이터가 충분히 쌓이면 TTF 회귀를 다시 비교하되, 운영 기준을 충족할 때만 대시보드에 적용합니다."]
        }
      },
      galleryTitle: "구현한 대시보드와 검증 결과", galleryEyebrow: "IMPLEMENTATION", galClass: "two",
      galleryNote: "화면은 완성된 Dash 대시보드를 로컬에서 실제로 구동해 캡처한 것입니다(검증 구간 마지막 관측 재생 기준). 차트는 팀 발표 자료의 성능 수치를 포트폴리오 형식에 맞게 다시 그린 것이고, 맨 아래의 손 스케치는 기획 단계의 설계안입니다. 소스코드는 팀 GitHub 저장소에 있습니다.",
      gallery: [
        { cls: "chart wide", src: "cooling-flow.svg", cap: "데이터 처리부터 대시보드까지의 흐름 (센서 8,219만 행 → 20개 설비 위험도 화면)", alt: "센서 원본에서 전처리, 파생변수, 시간순 분할, 모델, 경보 처리를 거쳐 대시보드로 이어지는 7단계 흐름도" },
        { cls: "nat", src: "cooling-real-start.png", cap: "1. 모니터링 설정: 대상 설비와 조회 기간을 고르고 상태 조회 (실제 구동 화면, 20대 검사 완료)", alt: "냉각 설비 관리 및 대응 시스템의 모니터링 설정 화면" },
        { cls: "nat", src: "cooling-real-overview.png", cap: "2. 전체 설비 현황: 20대 중 정상 14, 주의 4, 위험 2대로 분류", alt: "20개 설비의 정상, 주의, 위험 상태를 보여 주는 전체 설비 현황 화면" },
        { cls: "nat", src: "cooling-real-history.png", cap: "고장 이력 분석: 월별 고장 추이와 유형 비율(압력 저하 59%, 압력 과다 29%, 누수 12%, 총 796건)", alt: "시간대별 고장 발생 추이 선 그래프와 고장 유형 구성 도넛 차트" },
        { cls: "nat", src: "cooling-real-priority.png", cap: "3. 우선 점검 순서: 24시간 내 고장 위험도 순(03_M02 0.948, 03_M01 0.782 …), 정렬 기준 변경 가능", alt: "고장 위험도가 높은 설비 순으로 정렬된 우선 점검 순서 화면" },
        { cls: "nat", src: "cooling-real-detail.png", cap: "4. 상세진단(01_M01): 현재 상태 주의, 예상 고장 유형 냉각 압력 과다, 24시간 가동 현황", alt: "01_M01 설비의 위험 상태와 예상 고장 유형, 24시간 가동 현황을 보여 주는 상세진단 화면" },
        { cls: "nat", src: "cooling-real-recommend.png", cap: "상세진단 하단: 예상 고장 유형에 따른 추천 점검 항목과 확인 센서", alt: "냉각 압력 과다에 대한 추천 점검 항목과 확인할 센서 목록" },
        { cls: "nat", src: "cooling-real-action.png", cap: "5. 조치 기록과 인계: 대응 보고서를 작성해 운영 DB에 누적", alt: "관리자가 조치 내용을 작성하는 조치 기록 및 인계 화면" },
        { cls: "chart", src: "cooling-ttf-r2.svg", cap: "TTF 회귀를 버린 근거: Test R²가 모두 음수", alt: "저압, 고압, 누출 고장 TTF 회귀의 R² 값이 모두 음수인 막대 차트" },
        { cls: "chart wide", src: "cooling-metrics.svg", cap: "모델 성능: 고장 탐지 Recall 78.1%, Precision 29.5% (오경보 부담 포함)", alt: "고장 탐지와 고장 유형 분류 모델의 Accuracy, Precision, Recall, F1 비교 막대 차트" },
        { cls: "sk wide", src: "cooling-sketch.png", cap: "기획 단계 화면 설계 스케치 (5단계 구성의 원안)", alt: "냉각 설비 고장 예측 대시보드 화면을 손으로 그린 스케치" }
      ],
      link: { href: "https://github.com/chan1046/dashboard_team6", label: "GitHub 저장소 →" }
    }
    ,{
      id: "todak", no: "06", d: ["service"],
      title: "따뜻한 말 연구소(토닥) 부모 언어 개선 프로그램", titleHtml: "따뜻한 말 연구소(토닥)<br>부모 언어 개선 프로그램",
      role: "팀장", date: "2026.01~07",
      summary: "팀장으로서 부모 말 습관 개선 세미나를 기획해 유료로 2회 운영하고, 세미나에서 확인한 한계를 앱과 ‘따뜻한 말 램프’로 이어 갔습니다. (주)아이브러리와 협력해 진행했습니다.",
      result: "유료 세미나 2회, 참가 19명 · 세미나 한계를 앱과 램프 시제품으로 연결",
      tags: ["세미나 기획", "설문 설계", "기관 영업 전략", "Firebase 앱", "AI 음성 분석"],
      subtitle: "따뜻한 말 연구소 · (주)아이브러리와 협력 · 2026.01~07",
      kpis: [{ n: "19명", l: "유료 세미나 참가자 (사업계획서 기준, 1차 7명, 2차 12명, 참가비 4만원)", c: "ink" }, { n: "2회", l: "유료 세미나 운영 (4월 30일, 5월 7일)", c: "pass" }, { n: "우수상", l: "세미나에서 확인한 한계가 램프 시제품으로 이어져 학생 창업 마라톤 우수상 (2026.07)", c: "ink" }],
      steps: [
        { k: "do", label: "한 일", body: "디자인 담당, 개발 담당과 함께하는 팀에서 팀장이자 기획 담당으로 운영 기획과 프로그램 설계를 이끌었습니다. (주)아이브러리와 협력해 진행했습니다. 사전 설문, 1주차 워크북(문장 카드, 이미지 카드, 질문형으로 바꾸기 연습), 모집 안내를 갖춘 부모 말 습관 개선 세미나를 4월 30일과 5월 7일에 운영했습니다. 연사는 (주)아이브러리 대표와 서울과학기술대학교 문예창작과 교수님이었습니다." },
        { k: "problem", label: "문제", body: "참가 부모들이 “고치고 싶어도 정작 말하는 순간에는 생각나지 않는다”고 말했습니다. 세미나만으로는 일상 대화에서 습관이 바뀌기 어렵다는 뜻이었습니다." },
        { k: "cause", label: "원인 판단", body: "일회성 교육은 이해를 돕지만, 말이 나오는 그 순간에 개입하지 못한다고 판단했습니다. 그래서 가정에서 말하는 순간 바로 알려 주는 장치가 필요하다고 보았습니다." },
        { k: "fix", label: "해결", body: "세미나 이후 일상 대화를 분석하는 앱(Firebase 연동)과, 대화 분위기를 초록색과 빨간색 LED로 알려 주는 ‘따뜻한 말 램프’ 시제품으로 이어 갔습니다. 노원구 가족센터 미팅과 부모 인터뷰로 수요를 확인했고, 가족센터와 학교, 기업 복지, 돌봄 바우처 기관별로 영업 경로를 나눈 전략을 팀장으로서 설계했습니다." },
        { k: "result", label: "결과", body: "유료 세미나 2회에 19명이 참가했습니다(사업계획서 기준).\n세미나에서 나온 문제가 램프 시제품과 학생 창업 마라톤 우수상(2026.07)으로 이어졌습니다." }
      ],
      galleryTitle: "세미나 포스터 (앞면과 뒷면)", galleryEyebrow: "SEMINAR", galClass: "two",
      gallery: [
        { cls: "nat", src: "todak-poster-1.jpg", cap: "세미나 모집 포스터 앞면 (4월 30일, 5월 7일)", alt: "부모 말 습관 개선 세미나 1차와 2차 일정이 적힌 모집 포스터 앞면" },
        { cls: "nat", src: "todak-poster-2.jpg", cap: "세미나 커리큘럼 안내 포스터 뒷면", alt: "부모 말 습관 개선 세미나의 커리큘럼과 일정이 적힌 안내 포스터 뒷면" },
        { cls: "chart wide", src: "todak-flow.svg", cap: "세미나, 앱, 램프로 이어진 흐름", alt: "부모 말 습관 개선 세미나에서 한계를 확인하고 앱과 램프 시제품으로 이어진 흐름도" }
      ],
      closing: "참가자 수는 사업계획서 기준이며, 행동 변화를 장기 추적한 데이터는 없습니다. 기관과 기업 영업은 전략 설계와 협의 단계이며, 확정된 계약 실적으로는 적지 않았습니다."
    }

  ],

  career: [
    { when: "2026.02 ~ 09", role: "멘토", org: "주식회사 맞추다", body: "약 50명 대상 전기기사 필기 멘토링. 16개년 기출 약 1,100문항과 핵심개념 약 250개를 AI로 분석하고 직접 검토해 학습자료와 커리큘럼을 구성했습니다." },
    { when: "2025.07 ~ 2026.07", role: "아르바이트", org: "주식회사 아이브러리 (얼쓰빙)", body: "세미나 기획과 카페 운영. 주문 오류가 생긴 뒤 영수증과 주문번호 매칭, 제조와 제공 단계 이중 확인 절차를 적용했습니다." },
    { when: "2024.07 ~ 08", role: "인턴", org: "광주과학기술원 에너지융합대학원", body: "3상 PWM 정류기, DC-Link Voltage, PI Control 등 전력변환 시스템을 학습하고 논문을 정리해 발표했습니다." }
  ],

  awards: [
    { when: "2026.07.03", title: "학생 창업 마라톤 우수상", sub: "서울과학기술대학교 · 강원도립대학교 창업지원단" },
    { when: "2022.02.18", title: "지역 우수기업 탐방후기 경진대회 산업통상자원부 장관상", sub: "산업통상자원부" },
    { when: "2021.06.07", title: "대학창의발명대회 장려상", sub: "서울과학기술대학교" }
  ],
  club: { when: "2020.10 ~ 2026.08", body: "8명 운영진과 정기모임·행사를 운영하며 체크리스트와 사전 리허설로 운영 방식을 개선했습니다. 참여율 약 50%에서 80%대, 구성원 120명에서 170명 이상으로 성장하는 과정에 참여했습니다.",
    stats: [{ n: "8명", l: "운영진" }, { n: "약 50% → 80%대", l: "참여율" }, { n: "120명 → 170명 이상", l: "구성원" }] },
  etc: ["아름다운가게 봉사 (2024.10~11)", "발명개발연구회 (2020.09~2021.12)"],

  certs: [
    { name: "전기기사", org: "한국산업인력공단", date: "2025.12.24" },
    { name: "전기공사기사", org: "한국산업인력공단", date: "2025.12.24" },
    { name: "6 시그마 Green Belt", org: "한국커리어개발원", date: "2025.11.13" },
    { name: "TOEIC Speaking 120점", org: "ETS", date: "2025.11.22" },
    { name: "한국사능력검정 1급", org: "국사편찬위원회", date: "2024.08.22" },
    { name: "운전면허 1종 보통", org: "경찰청", date: "2020.02.10" }
  ],
  edu: [
    { when: "2026.08.18~11.27", hours: "수강 중", title: "LS JUMP-UP", body: "Python, Numpy, Pandas 데이터 전처리, Plotly와 Dash 시각화, 전력사용량 데이터 분석 (수료 예정)" },
    { when: "2026.07.27~08.03", hours: "26h", title: "반도체 기초역량 강화 교육", body: "Energy Band, P-N Junction, Wafer, 반도체 제조와 소자 기초" },
    { when: "2025.04.12", hours: "8h", title: "NVIDIA DLI Transformer 기반 NLP 워크숍", body: "트랜스포머 구조와 생성형 AI 응답 과정" },
    { when: "2022.01.14", hours: "4h", title: "Intel 반도체 공정/소자 직무특강", body: "제조공정과 소자 기초" },
    { when: "2021.09", hours: "15h", title: "아두이노 코딩 워크숍", body: "센서, 모터, 릴레이 제어와 신호등 시스템 실습" }
  ]
};
