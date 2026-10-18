# 조예찬 포트폴리오 인계 메모

다른 노트북이나 새 Claude 세션에서 이어서 작업할 때 이 파일을 먼저 읽으세요.

## 실행 방법
- `index.html`을 더블클릭하면 됩니다. 서버와 DB는 필요 없습니다.
- 글꼴(Google Fonts)은 인터넷이 있으면 불러오고, 없으면 맑은 고딕으로 대체됩니다.

## 폴더 구조
| 파일 | 역할 |
|---|---|
| `index.html`, `projects.html`, `project.html`, `about.html`, `experience.html`, `activities.html`, `credentials.html` | 기본 페이지 (내용은 `app.js`가 그립니다) |
| `cases.html`, `tools.html`, `timeline.html`, `evidence.html`, `summary.html` | 더보기 메뉴 페이지 (원인 재정의 사례, 도구 매트릭스, 타임라인, 증빙, 한 장 요약) |
| `data.js` | 프로젝트·경력·수상·자격·교육 등 모든 본문 데이터. 내용 수정은 여기서 |
| `data-extra.js` | 검증 수준 배지, 내 역할, 예상 질문(초안), 증빙 목록 |
| `app.js` | 페이지 렌더링, 직무별 보기, 검색(Ctrl+K), 발표 모드 |
| `style.css`, `extra.css` | 공통 스타일, 기능별 스타일 |
| `assets/resume.pdf` | 이력서 PDF (범용 1쪽, 원본은 `resume-general.html`) |
| `assets/img/` | 사진과 결과 이미지 (아래 파일 이름 그대로) |
| `assets/img/todak-flow.svg` | 토닥(따뜻한 말 연구소) 프로젝트 흐름도 |
| `apply-toss/` | 토스플레이스 Direct Sales Associate 지원용 이력서(PDF)와 포트폴리오 페이지 |

## assets/img 에 넣을 파일 이름
`profile.jpg`(있음), `fsr-sim.png`, `fsr-meas.png`, `fsr-pcb.jpg`, `fpga-util.png`, `tcad-idvg.png`, `lamp-proto.jpg`, `cooling-dashboard.png`, `cooling-detail.png`

## 남은 할 일
- [x] `assets/resume.pdf`를 이메일 오타(nvare.com → naver.com) 고친 파일로 교체
- [ ] 결과 이미지 넣기 (위 목록)
- [ ] FSR, FPGA, TCAD, 램프 프로젝트의 팀 규모와 본인 역할을 `data-extra.js`의 `contrib.team`에 입력
- [ ] 예상 질문 답변을 본인 말로 수정 (`data-extra.js`의 `qa`)
- [ ] 증빙 파일(포스터, 시연 영상, 수상 증빙)을 `assets/evidence/`에 넣고 `data-extra.js`에서 `ready: true`로 변경
- [ ] 토스플레이스 지원: LS JUMP-UP(~11/27)과 10/26 입사 일정 조율 후 확정 (마감 10/12)

## 디자인 시안 (웹)
Claude Design 캔버스: https://claude.ai/artifact/WyNmzqhTnEK8Zmk9gaugqb (본인 계정으로 로그인해야 열립니다. 이전 단계 디자인이며, 로컬 사이트가 최신입니다.)

## 새 Claude 세션에서 이어갈 때
폴더를 열고 "README.md를 읽고 이어서 작업해 줘"라고 요청하세요. 이전 대화 내용은 전달되지 않으므로, 이 파일과 코드가 기준입니다.

## 2026.10.09 토닥 프로젝트 반영
- `data.js`에 프로젝트 06(따뜻한 말 연구소 토닥 부모 세미나)과 도메인 "기획 · 현장 운영" 추가, `data-extra.js`에 검증 수준, 역할, 예상 질문 추가
- 근거 자료: D드라이브 토닥 프로젝트 폴더의 재도전성공패키지 사업계획서, 따말 프로젝트 1기 자료, 메모, ST창업동아리 중간평가 보고서
- 설문 수치는 구글 설문 결과 캡처 기준(응답 7명, 4개 문항 전원 5점)으로 고쳤습니다. 사업계획서의 평균 97%와 93%는 이 캡처로 확인되지 않아 뺐습니다. 참가 19명은 사업계획서 기준
- 토스플레이스 이력서와 지원 페이지에 세미나 경험(5번째 경험) 추가, 이력서 PDF 재생성

## 2026.10.18
- 이력서 PDF 이메일 오타 수정, 홈 제목 변경
- 범용 이력서(1쪽)로 교체, 홈 소개 문단 삭제, 램프 사진 2장 제거, Rasorber 상장 사진 추가, 프로젝트 Q&A 답변 수정
