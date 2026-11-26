window.PORTFOLIO_DEPLOYMENTS = [
  {
    id: "voicefishing",
    path: "/demos/voicefishing",
    name: "안물어(魚)",
    category: "피싱 대응 훈련",
    title: "안물어(魚) | VoiceFishing",
    description: "채용, 배송, 청약 관련 모의 연락을 받고 공식 경로로 확인하는 방법을 연습하는 서비스입니다.",
    original: "https://voicefishing.vercel.app/demo",
    originalLabel: "원본 체험 앱 열기",
    note: "공개 체험은 가상 데이터를 사용합니다.",
    views: [
      { label: "공개 서비스", frame: "https://voicefishing.vercel.app/demo", title: "안물어 피싱 대응 훈련 공개 소개 화면" },
      { label: "체험 대시보드", image: "voicefishing-dashboard.png", title: "가상 훈련 결과와 최근 연습 기록이 표시된 초기 체험 대시보드" }
    ]
  },
  {
    id: "solar",
    path: "/demos/solar",
    name: "태양광 설비 관리",
    category: "발전량 점검 및 정비",
    title: "태양광 설비 관리 요청 앱",
    description: "발전량 이상을 확인하고 정비 요청, 승인, 처리 결과를 기록하는 앱입니다.",
    original: "https://lssun.vercel.app",
    originalLabel: "원본 앱 열기",
    note: "화면은 시험용 데이터로 촬영했습니다. 원본 앱에서 실제 기능을 사용하려면 Google 로그인이 필요합니다.",
    views: [
      { label: "발전소 현황", image: "solar-app-dashboard.png", title: "발전소별 발전 상태와 점검 우선순위" },
      { label: "정비 요청", image: "solar-app-request.png", title: "정비 요청 상세와 접수부터 완료까지의 진행 상태" },
      { label: "관리자 승인", image: "solar-admin-approval.png", title: "승인을 기다리는 정비 요청과 판단 근거" },
      { label: "처리 기록", image: "solar-admin-log.png", title: "관리자 처리 기록과 요청별 상태 변경 이력" }
    ]
  }
];
