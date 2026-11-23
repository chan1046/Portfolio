/* 페이지 렌더링과 기능(직무별 보기, 검색, 발표 모드 등). 내용은 data.js, data-extra.js에서 수정합니다. */
(function () {
  "use strict";
  var S = window.SITE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 저장 불가 환경 */ } }
  };
  var page = document.body.dataset.page;
  var app = $("#app");
  var P = S.projects;
  var byId = function (id) { return P.filter(function (p) { return p.id === id; })[0]; };
  var domLabel = function (id) { var d = S.domains.filter(function (x) { return x.id === id; })[0]; return d ? d.label : id; };
  var href = function (p) { return (page === "home" ? "" : "index.html") + "#project-" + p.id; };

  var NAV = [["index.html", "홈", "home"], ["index.html#projects", "프로젝트", "projects"], ["experience.html", "경력", "experience"], ["index.html#activities", "활동 및 수상", "activities"], ["index.html#credentials", "자격 및 교육", "credentials"]];
  var MORE = [["cases.html", "원인 재정의 사례 모음", "cases"], ["tools.html", "도구 · 프로젝트 매트릭스", "tools"], ["timeline.html", "타임라인", "timeline"], ["evidence.html", "증빙자료", "evidence"], ["summary.html", "이력서", "summary"]];

  /* ---------- 공통 조각 ---------- */
  function top(active) {
    return '<div class="top"><a class="brand" href="index.html">' + S.name + "<span> · Portfolio 2026</span></a>" +
      '<nav class="nav" aria-label="주 메뉴">' +
      NAV.map(function (n) { return '<a href="' + n[0] + '"' + (n[2] === active ? ' class="on" aria-current="page"' : "") + ">" + n[1] + "</a>"; }).join("") +
      '<details class="more"><summary' + (MORE.some(function (m) { return m[2] === active; }) ? ' class="on"' : "") + '>더보기</summary><div class="menu">' +
      MORE.map(function (m) { return '<a href="' + m[0] + '">' + m[1] + "</a>"; }).join("") + "</div></details>" +
      '<button class="sbtn" id="sbtn" type="button" aria-label="검색 열기">검색 <kbd>Ctrl K</kbd></button></nav></div>';
  }
  function head(active, eyebrow, title, desc) {
    return '<header class="band"><div class="wrap">' + top(active) + '<div class="pagehead"><div class="eyebrow">' + eyebrow + "</div><h1>" + title + "</h1>" + (desc ? "<p>" + desc + "</p>" : "") + "</div></div></header>";
  }
  function contact(extraBtn) {
    return '<section class="contact"><div class="wrap"><div class="cbox"><div><h2>연락처</h2>' +
      '<div class="li">' + S.email + '<button class="copy" type="button" data-copy="' + S.email + '">복사</button></div>' +
      '<div class="li s">' + S.phone + '<button class="copy" type="button" data-copy="' + S.phone + '">복사</button></div></div>' +
      '<div class="btns"><a class="btn cream" href="mailto:' + S.email + '">메일 보내기</a>' + (extraBtn || '<a class="btn line" href="assets/resume.pdf?v=portfolio-3" download="조예찬_이력서.pdf">이력서 PDF 다운로드</a>') + "</div></div></div></section>";
  }
  function nextBand(h, label) {
    return '<section class="contact"><div class="wrap"><div class="next"><b>다음 페이지: ' + label + '</b><a class="btn cream" href="' + h + '">보러 가기 →</a></div></div></section>';
  }
  function vb(p) {
    if (!p.verify) return "";
    return '<span class="vbs">' + p.verify.kinds.map(function (k) { var v = S.verifyKinds[k]; return '<span class="vb ' + v.tone + '">' + v.label + "</span>"; }).join("") + "</span>";
  }
  function tagRow(tags) { return '<div class="tg">' + tags.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div>"; }
  function sec(inner, cls) { return '<section class="sec ' + (cls || "") + '"><div class="wrap">' + inner + "</div></section>"; }

  /* ---------- ① 직무별 보기 ---------- */
  var dom = store.get("pf-domain") || "all";
  if (dom !== "all" && !S.domains.some(function (d) { return d.id === dom; })) dom = "all";
  function domChips() {
    return '<div class="chips" role="group" aria-label="직무 선택"><button class="chip" type="button" data-dom="all">전체</button>' +
      S.domains.map(function (d) { return '<button class="chip" type="button" data-dom="' + d.id + '">' + d.label + "</button>"; }).join("") + "</div>";
  }
  function domMini() { return '<div class="dom-mini">' + domChips() + '<div class="dom-out" id="domout" aria-live="polite" style="margin-top:16px"></div></div>'; }
  function applyDomain() {
    $$("[data-d]").forEach(function (el) {
      var match = dom === "all" || el.dataset.d.split(" ").indexOf(dom) > -1;
      el.classList.toggle("dim", !match);
      el.classList.toggle("hit", dom !== "all" && match);
    });
    $$(".chip[data-dom]").forEach(function (c) { c.setAttribute("aria-pressed", c.dataset.dom === dom ? "true" : "false"); });
    var out = $("#domout");
    if (!out) return;
    if (dom === "all") { out.innerHTML = "<b>전체 보기</b><p>직무를 고르면 관련 프로젝트와 수치가 강조되고, 나머지는 흐려집니다.</p>"; return; }
    var d = S.domains.filter(function (x) { return x.id === dom; })[0];
    var rel = P.filter(function (p) { return p.d.indexOf(dom) > -1; });
    out.innerHTML = "<b>" + d.label + " 관련 프로젝트 " + rel.length + "개</b><p>" + esc(d.blurb) + "</p><p style=\"margin-top:8px\">" +
      rel.map(function (p) { return '<a href="' + href(p) + '">' + esc(p.title) + " →</a>"; }).join(" &nbsp; ") + "</p>";
  }
  document.addEventListener("click", function (e) {
    var c = e.target.closest(".chip[data-dom]");
    if (c) { dom = c.dataset.dom; store.set("pf-domain", dom); applyDomain(); }
    var cp = e.target.closest(".copy");
    if (cp) {
      var t = cp.dataset.copy, done = function () { var o = cp.textContent; cp.textContent = "복사됨"; setTimeout(function () { cp.textContent = o; }, 1500); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, function () { fallbackCopy(t); done(); });
      else { fallbackCopy(t); done(); }
    }
    var mo = $("details.more");
    if (mo && mo.open && !e.target.closest("details.more")) mo.open = false;
  });
  function fallbackCopy(t) { var a = document.createElement("textarea"); a.value = t; document.body.appendChild(a); a.select(); try { document.execCommand("copy"); } catch (e) { /* 복사 불가 */ } a.remove(); }

  /* ---------- 홈과 프로젝트 ---------- */
  var HOME_PROJECTS = [
    { id: "fsr", cover: "fsr-pcb.jpg", photo: true, proof: "fsr-compare.png", proofLabel: "FSR 실측 및 시뮬레이션 비교" },
    { id: "fpga", cover: "fpga-util.png", proof: "fpga-util.png", proofLabel: "Vivado 자원 사용률 리포트" },
    { id: "cooling", cover: "cooling-real-overview.png", proof: "cooling-real-priority.png", proofLabel: "설비 점검 우선순위 화면" },
    { id: "tcad", cover: "tcad-idvg.png" },
    { id: "todak", cover: "todak-poster-1.jpg" },
    { id: "lamp", cover: "lamp-booth.jpg", photo: true },
    { id: "solar", cover: "solar-app-dashboard.png" }
  ];

  var PROJECT_EMPHASIS = {
    fsr: {
      do: ["HFSS로 결합 구조를 최적화", "VNA 자유공간 측정에 참여"],
      problem: ["흡수와 투과 성능이 모두 떨어졌습니다"],
      fix: ["길이, 간격, 저항값을 조정"],
      result: ["9~10 GHz에서 흡수율 약 95%", "14~15 GHz에서 투과손실 0.7 dB 이하"]
    },
    fpga: {
      do: ["고정소수점 행렬 곱셈기를 구현"],
      problem: ["LUT 사용률은 117.97%"],
      fix: ["처리 유닛(PU)의 출력단으로 옮겨"],
      result: ["LUT 사용률 42.27%", "MNIST 이미지 10개를 8,210클럭"]
    },
    cooling: {
      do: ["센서 데이터 전처리", "Dash 화면 구현"],
      problem: ["고장까지 남은 시간을 회귀로 예측", "모두에서 음수"],
      fix: ["24시간 내 고장 여부를 분류", "약 10만 행씩 읽어"],
      result: ["장비 20대의 센서 데이터 약 8,219만 행", "오프라인 평가에서 재현율 약 78%"]
    },
    tcad: {
      do: ["MOSFET과 1-Fin, 2-Fin FinFET을 설계"],
      problem: ["문턱전압(Vth)이 예상한 범위를 벗어났습니다"],
      fix: ["도핑 농도를 지정한 영역 안에서 일정하게"],
      result: ["시뮬레이션에서 약 1,167 μA"]
    },
    todak: {
      do: ["부모 대상 세미나를 기획", "사전 설문과 실습 워크북"],
      problem: ["배운 대화법을 실제 대화 중에 떠올리기 어렵다"],
      fix: ["음성 분석 결과를 앱과 램프로 알려주는 기능"],
      result: ["유료 세미나 2회에 총 19명"]
    },
    lamp: {
      do: ["음성 분석 결과를 LED와 앱에 전달"],
      problem: ["음성 입력이 간헐적으로 누락", "20~30초"],
      fix: ["고감도 마이크로 교체", "코드와 음성 인식 처리 흐름을 단순화"],
      result: ["피드백 지연을 20초 이내", "약 35명", "학생 창업 마라톤에서 우수상"]
    },
    solar: {
      do: ["품질 검증(QA), 시험 데이터와 테스트 작성"],
      problem: ["발전량이 서서히 하락하거나 단위가 잘못 들어오면"],
      fix: ["15일간 서서히 하락하는 발전량", "kWh와 Wh를 혼동한 값"],
      result: ["네 가지 시연 시나리오", "대시보드 단계의 자동 테스트 143개"]
    }
  };

  function home() {
    document.title = "조예찬 | 포트폴리오";
    var hero = '<header class="band home-band"><div class="wrap"><div class="hero home-hero">' +
      '<div class="home-profile"><img class="avatar" src="assets/img/profile.jpg?v=20261123" alt="" width="64" height="64">' +
      '<div><h1>조예찬</h1><p>서울과학기술대학교 전기정보공학과</p></div></div>' +
      '<nav class="home-links" aria-label="주 메뉴"><a class="btn cream" href="#projects">프로젝트 보기</a>' +
      '<a class="btn line" href="#career">경력</a><a class="btn line" href="#activities">활동 및 수상</a>' +
      '<a class="btn line" href="#credentials">자격 및 교육</a><a class="btn line" href="assets/resume.pdf?v=portfolio-3" download="조예찬_이력서.pdf">이력서 PDF</a></nav></div></div></header>';
    var projects = '<section class="sec white home-projects" id="projects" aria-labelledby="projects-title"><div class="wrap">' +
      '<h2 class="t" id="projects-title">프로젝트</h2><div class="project-list">' +
      HOME_PROJECTS.map(function (item) { return projectItem(byId(item.id), item); }).join("") + '</div></div></section>';
    var career = '<section class="sec home-career" id="career" aria-labelledby="career-title"><div class="wrap">' +
      '<h2 class="t" id="career-title">경력</h2>' + careerRows("h3") + '</div></section>';
    var resources = '<nav class="wrap home-resources" aria-label="추가 자료">' +
      '<a href="evidence.html">증빙자료</a><a href="summary.html">이력서</a></nav>';
    app.innerHTML = hero + '<main>' + projects + career + homeRecords() + '</main><footer>' + resources + contact() + '</footer>';
  }

  function homeRecord(title, period) {
    return '<li class="home-record"><strong>' + esc(title) + '</strong>' +
      (period ? '<span class="home-record-date">' + esc(period) + '</span>' : '') + '</li>';
  }

  function homeRecords() {
    var activities = homeRecord("대학생 동아리 리더", S.club.when) +
      S.etc.map(function (item) {
        var entry = /^(.*?) \(([^()]*)\)$/.exec(item);
        return entry ? homeRecord(entry[1], entry[2]) : homeRecord(item);
      }).join("");
    var awards = S.awards.map(function (item) { return homeRecord(item.title, item.when); }).join("");
    var certs = S.certs.map(function (item) { return homeRecord(item.name, item.date); }).join("");
    var education = S.edu.map(function (item) { return homeRecord(item.title, item.when); }).join("");
    return '<div class="sec white home-records"><div class="wrap"><div class="home-records-frame">' +
      '<section id="activities" aria-labelledby="activities-title"><h2 class="t" id="activities-title">활동 및 수상</h2>' +
      '<h3>활동</h3><ul>' + activities + '</ul><h3>수상</h3><ul>' + awards + '</ul></section>' +
      '<section id="credentials" aria-labelledby="credentials-title"><h2 class="t" id="credentials-title">자격 및 교육</h2>' +
      '<div class="home-records-categories"><div><h3>자격 및 어학</h3><ul>' + certs + '</ul></div>' +
      '<div><h3>교육</h3><ul>' + education + '</ul></div></div></section></div></div></div>';
  }

  function projectItem(p, item) {
    var cover = p.gallery.find(function (image) { return image.src === item.cover; });
    return '<details class="project-item" id="project-' + p.id + '">' +
      '<summary class="project-preview-card">' +
      '<span class="project-preview-media' + (item.photo ? ' is-photo' : '') + '"><img src="assets/img/' + esc(cover.src) +
      '" alt="' + esc(cover.alt) + '" width="640" height="360" loading="lazy"></span>' +
      '<span class="project-preview-body"><strong class="project-preview-title">' + esc(p.title) + '</strong>' +
      '<span class="project-preview-date">' + esc(p.date) + '</span>' +
      '<span class="project-preview-action"><span class="project-show">상세보기</span><span class="project-hide">상세 닫기</span></span>' +
      '</span></summary>' + projectDetail(p, item) + '</details>';
  }

  function emphasize(text, phrases) {
    var html = "";
    var end = 0;
    phrases.forEach(function (phrase) {
      var start = text.indexOf(phrase, end);
      if (start === -1) return;
      html += esc(text.slice(end, start)) + '<strong class="project-key">' + esc(phrase) + '</strong>';
      end = start + phrase.length;
    });
    return html + esc(text.slice(end));
  }

  function projectDetail(p, item) {
    var emphasis = PROJECT_EMPHASIS[p.id] || {};
    var story = ["problem", "fix", "result"].map(function (key) {
      var entry = step(p, key);
      return '<div class="project-stage"><dt>' + entry.label + '</dt><dd>' + emphasize(entry.body, emphasis[key] || []) + '</dd></div>';
    }).join("");
    var proof = item.proof ? p.gallery.find(function (g) { return g.src === item.proof; }) : null;
    var featured = proof
      ? '<div class="project-proof">' + galleryButton(proof, '<span>' + esc(item.proofLabel) + '<small>크게 보기</small></span>') + '</div>'
      : "";
    return '<div class="project-chapter"><p class="project-meta">' + esc(p.role) + '</p>' +
      '<p class="project-role"><strong>내 역할</strong><span>' + emphasize(step(p, "do").body, emphasis.do || []) + '</span></p>' +
      '<dl class="project-story">' + story + '</dl>' +
      '<p class="project-verify"><strong>검증 범위</strong> ' + esc(p.verify.note) + '</p>' + featured +
      '<details class="project-evidence"><summary>' + (proof ? "추가 제작 및 검증 자료" : "제작 및 검증 자료") + '</summary>' +
      projectEvidence(p, proof) + '</details></div>';
  }

  function galleryButton(g, caption) {
    return '<button class="gph-button ' + (caption ? "proof-button" : "gph") + '" type="button" aria-label="' + esc(g.alt + " 크게 보기") +
      '"><img src="assets/img/' + g.src + '" alt="' + esc(g.alt) + '" width="1200" height="800" loading="lazy">' + (caption || "") + '</button>';
  }

  function projectEvidence(p, featured) {
    var gallery = '<div class="gal' + (p.galClass ? " " + p.galClass : "") + '">' + p.gallery.filter(function (g) {
      return g !== featured && g.src !== "cooling-metrics.svg";
    }).map(function (g) {
      return '<figure' + (g.cls ? ' class="' + g.cls + '"' : '') + '>' + galleryButton(g) +
        '<figcaption>' + esc(g.cap) + '</figcaption></figure>';
    }).join("") + '</div>';
    var link = p.link ? '<a class="btn dark-line" href="' + p.link.href + '" target="_blank" rel="noopener">' + esc(p.link.label.replace(/\s*→$/, "")) + '</a>' : "";
    var qa = '<div class="qa"><h4>예상 질문</h4>' + p.qa.map(function (item) {
      return '<details><summary>' + esc(item.q) + '</summary><p>' + esc(item.a) + '</p></details>';
    }).join("") + '</div>';
    var limits = p.extra ? '<div class="project-limits"><h4>검증의 한계</h4><ul>' + p.extra.limits.limits.map(function (item) {
      return '<li>' + esc(item) + '</li>';
    }).join("") + '</ul></div>' : "";
    return '<div class="project-evidence-body"><h4>' + esc(p.galleryTitle) + '</h4>' + gallery +
      (p.galleryNote ? '<p class="gnote">' + esc(p.galleryNote) + '</p>' : "") + projectTechnicalNotes(p) + limits + qa +
      '<div class="btns">' + link + '<button class="btn dark-line" type="button" data-present="' + p.id + '">발표 모드</button></div></div>';
  }

  function projectTechnicalNotes(p) {
    if (!p.extra) return "";
    var e = p.extra;
    var redefine = '<h4>' + esc(e.redefine.title) + '</h4><p class="lead3">' + esc(e.redefine.lead) + '</p>' +
      '<div class="ba"><div class="b"><span class="tag">기존 접근</span><h3>' + esc(e.redefine.before.title) +
      '</h3><p>' + e.redefine.before.lines.map(esc).join("<br>") + '</p></div><div class="a">' +
      '<span class="tag">변경 후</span><h3>' + esc(e.redefine.after.title) + '</h3><p>' +
      e.redefine.after.lines.map(esc).join("<br>") + '</p></div></div>';
    var pipeline = '<h4>' + esc(e.pipeline.title) + '</h4><div class="pipe">' + e.pipeline.items.map(function (item, i) {
      return '<div><span>' + (i + 1) + '</span>' + esc(item) + '</div>';
    }).join("") + '</div>';
    var issues = '<h4>' + esc(e.issues.title) + '</h4><div class="issues">' + e.issues.items.map(function (item) {
      return '<div class="issue"><h3>' + esc(item.title) + '</h3><div class="p"><small>문제</small><p>' + esc(item.problem) +
        '</p></div><div class="f"><small>해결</small><p>' + esc(item.fix) + '</p></div><div class="r">' + esc(item.result) + '</div></div>';
    }).join("") + '</div>';
    return [redefine, pipeline, issues].map(function (content) { return sec(content, "tight"); }).join("");
  }

  function jumpToHomeAnchor() {
    var target = document.getElementById(location.hash.slice(1));
    if (!target) return;
    if (target.classList.contains("project-item")) target.open = true;
    target.scrollIntoView({ block: "start" });
  }

  function legacyProject() {
    var p = byId(new URLSearchParams(location.search).get("id"));
    location.replace(p ? href(p) : "index.html#projects");
  }

  /* ---------- 경력 ---------- */
  function careerRows(heading) {
    return '<div class="rows">' + S.career.map(function (c) {
      return '<div class="row"><div class="when"><b>' + esc(c.when) + '</b><span class="role">' + esc(c.role) + '</span></div>' +
        '<div class="bd"><' + heading + '>' + esc(c.org) + '</' + heading + '><p>' + esc(c.body) + '</p></div></div>';
    }).join("") + '</div>';
  }
  function experience() {
    document.title = "경력 | 조예찬";
    app.innerHTML = head("experience", "EXPERIENCE", "경력") +
      sec(careerRows("h2")) + nextBand("index.html#activities", "활동 및 수상");
  }
  /* ---------- ④ 원인 재정의 사례 모음 ---------- */
  function step(p, k) { return p.steps.filter(function (s) { return s.k === k; })[0]; }
  function cases() {
    document.title = "원인 재정의 사례 | 조예찬";
    app.innerHTML = head("cases", "CASES", "원인 재정의 사례 모음", "목표에 못 미쳤을 때 원인을 어떻게 다시 정의했는지, 프로젝트별로 한 장에 모았습니다.") +
      sec(domMini() + '<div class="cases">' + P.map(function (p) {
        return '<a class="case" data-d="' + p.d.join(" ") + '" href="' + href(p) + '"><div class="ch"><span class="no">' + p.no + "</span><b>" + esc(p.title) + "</b>" + vb(p) + '</div><div class="cg"><div class="cp"><small>문제</small><p>' + esc(step(p, "problem").body) + '</p></div><div class="ca">→</div><div class="cp cc"><small>원인 재정의</small><p>' + esc(step(p, "cause").body) + '</p></div><div class="ca">→</div><div class="cp cr"><small>결과</small><p>' + esc(p.result) + "</p></div></div></a>";
      }).join("") + "</div>") + contact();
  }

  /* ---------- ⑤ 도구 · 프로젝트 매트릭스 ---------- */
  function tools() {
    document.title = "도구 매트릭스 | 조예찬";
    var map = {};
    P.forEach(function (p) { p.tags.forEach(function (t) { (map[t] = map[t] || []).push(p); }); });
    var names = Object.keys(map).sort(function (a, b) { return map[b].length - map[a].length || a.localeCompare(b); });
    var sel = new URLSearchParams(location.search).get("tool");
    app.innerHTML = head("tools", "TOOLS", "도구 · 프로젝트 매트릭스", "어떤 도구를 어느 프로젝트에 썼는지 한눈에 봅니다. 도구 이름을 누르면 해당 프로젝트로 이동합니다.") +
      sec('<div class="mx-wrap"><table class="mx"><thead><tr><th scope="col">도구</th>' + P.map(function (p) { return '<th scope="col" data-d="' + p.d.join(" ") + '"><a href="' + href(p) + '">' + p.no + "<span>" + esc(p.title) + "</span></a></th>"; }).join("") + "</tr></thead><tbody>" +
        names.map(function (n) {
          return '<tr id="t-' + encodeURIComponent(n) + '"' + (sel === n ? ' class="sel"' : "") + '><th scope="row">' + esc(n) + "</th>" + P.map(function (p) {
            var has = map[n].indexOf(p) > -1;
            return '<td data-d="' + p.d.join(" ") + '">' + (has ? '<a class="dot" href="' + href(p) + '" aria-label="' + esc(n) + " — " + esc(p.title) + '">●</a>' : '<span aria-hidden="true">·</span>') + "</td>";
          }).join("") + "</tr>";
        }).join("") + "</tbody></table></div>" + '<div style="margin-top:32px">' + domMini() + "</div>") + contact();
    if (sel) { var r = $("#t-" + encodeURIComponent(sel)); if (r) r.scrollIntoView({ block: "center" }); }
  }

  /* ---------- ⑥ 타임라인 ---------- */
  function timeline() {
    document.title = "타임라인 | 조예찬";
    var ev = [];
    var ym = function (s) { var m = /(\d{4})\.(\d{2})/.exec(s); return m ? +m[1] * 100 + +m[2] : 0; };
    P.forEach(function (p) { ev.push({ k: "project", ym: ym(p.date), when: p.date, title: p.title, sub: p.role, href: href(p) }); });
    S.career.forEach(function (c) { ev.push({ k: "career", ym: ym(c.when), when: c.when, title: c.org, sub: c.role, href: "experience.html" }); });
    S.awards.forEach(function (a) { ev.push({ k: "award", ym: ym(a.when), when: a.when, title: a.title, sub: a.sub, href: "index.html#activities" }); });
    ev.push({ k: "award", ym: ym(S.club.when), when: S.club.when, title: "대학생 동아리 리더", sub: "8명 운영진", href: "index.html#activities" });
    S.edu.forEach(function (e) { ev.push({ k: "edu", ym: ym(e.when), when: e.when, title: e.title, sub: e.hours, href: "index.html#credentials" }); });
    S.certs.filter(function (c) { return !/운전면허|한국사/.test(c.name); }).forEach(function (c) { ev.push({ k: "edu", ym: ym(c.date), when: c.date, title: c.name, sub: c.org, href: "index.html#credentials" }); });
    ev.sort(function (a, b) { return b.ym - a.ym; });
    var kinds = [["all", "전체"], ["project", "프로젝트"], ["career", "경력"], ["award", "수상 · 활동"], ["edu", "교육 · 자격"]];
    var years = {};
    ev.forEach(function (e) { var y = Math.floor(e.ym / 100); (years[y] = years[y] || []).push(e); });
    app.innerHTML = head("timeline", "TIMELINE", "타임라인", "프로젝트, 경력, 수상, 교육을 시간순으로 모았습니다. 운전면허와 한국사능력검정은 제외했습니다.") +
      sec('<div class="chips" id="tlf" role="group" aria-label="유형 선택" style="margin-bottom:40px">' + kinds.map(function (k) { return '<button class="chip" type="button" data-k="' + k[0] + '" aria-pressed="' + (k[0] === "all") + '">' + k[1] + "</button>"; }).join("") + "</div>" +
        Object.keys(years).sort(function (a, b) { return b - a; }).map(function (y) {
          return '<div class="yr"><h2>' + y + '</h2><div class="yl">' + years[y].map(function (e) {
            return '<a class="ev k-' + e.k + '" data-k="' + e.k + '" href="' + e.href + '"><span class="w">' + e.when + "</span><b>" + esc(e.title) + "</b><span class=\"s\">" + esc(e.sub) + '</span><i>' + kinds.filter(function (k) { return k[0] === e.k; })[0][1] + "</i></a>";
          }).join("") + "</div></div>";
        }).join("")) + contact();
    $("#tlf").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-k]"); if (!b) return;
      $$("#tlf .chip").forEach(function (c) { c.setAttribute("aria-pressed", c === b ? "true" : "false"); });
      $$(".ev").forEach(function (el) { el.style.display = b.dataset.k === "all" || el.dataset.k === b.dataset.k ? "" : "none"; });
      $$(".yr").forEach(function (y) { y.style.display = $$(".ev", y).some(function (el) { return el.style.display !== "none"; }) ? "" : "none"; });
    });
  }

  /* ---------- ⑪ 증빙 ---------- */
  function evidence() {
    document.title = "증빙자료 | 조예찬";
    var items = S.evidence.filter(function (e) { return e.ready; });
    var urlAll = new URLSearchParams(location.search).get("all") === "1";
    if (urlAll) items = S.evidence;
    app.innerHTML = head("evidence", "EVIDENCE", "증빙자료", "수치와 성과를 뒷받침하는 자료입니다.") +
      sec('<div class="evs">' + items.map(function (e) {
        var pr = e.project ? byId(e.project) : null;
        return '<a class="evc' + (e.ready ? "" : " pending") + '" href="' + e.href + '"' + (/^http/.test(e.href) ? ' target="_blank" rel="noopener"' : "") + "><b>" + esc(e.title) + "</b><span>" + esc(e.sub) + "</span>" + (pr ? "<i>" + esc(pr.title) + "</i>" : "") + "<em>" + (e.ready ? "열기 →" : "준비 중") + "</em></a>";
      }).join("") + '</div><h2 class="t" style="margin:72px 0 28px">핵심 결과 사진</h2><div class="gal two" id="evimgs"></div><p class="gnote" id="evnone" hidden>등록된 이미지가 아직 없습니다. <code>assets/img</code> 폴더에 파일을 넣으면 자동으로 나타납니다.</p>') + contact();
    var box = $("#evimgs"), shown = 0, total = 0;
    S.evidenceImages.forEach(function (src) {
      var cap = src, alt = src;
      P.forEach(function (p) { p.gallery.forEach(function (g) { if (g.src === src) { cap = p.title + " · " + g.cap; alt = g.alt; } }); });
      total++;
      var im = new Image();
      im.onload = function () { shown++; var f = document.createElement("figure"); f.innerHTML = '<div class="gph"></div><figcaption>' + esc(cap) + "</figcaption>"; im.alt = alt; $(".gph", f).appendChild(im); box.appendChild(f); $("#evnone").hidden = true; };
      im.onerror = function () { total--; if (total === 0 || (shown === 0 && total <= 0)) $("#evnone").hidden = false; };
      im.src = "assets/img/" + src;
    });
    setTimeout(function () { if (!box.children.length) $("#evnone").hidden = false; }, 800);
  }

  /* ---------- ⑩ 한 장 요약 (인쇄용) ---------- */
  function summary() {
    document.title = "이력서 | 조예찬";
    app.innerHTML = '<div class="sheet-bar"><a href="index.html">← 홈으로</a><button type="button" id="prt">인쇄 / PDF 저장</button></div><main class="sheet"><header><h1>' + S.name + '</h1><p>' + S.email + " · " + S.phone + '</p></header>' +
      '<h2>핵심 프로젝트</h2>' + P.map(function (p) { return '<div class="si"><b>' + esc(p.title) + "</b> <span>" + esc(p.role) + " · " + p.date + "</span><p>" + esc(p.result) + " <em>(" + p.verify.kinds.map(function (k) { return S.verifyKinds[k].label; }).join(", ") + ")</em></p></div>"; }).join("") +
      '<div class="sc2"><div><h2>경력</h2>' + S.career.map(function (c) { return '<div class="si"><b>' + c.org + "</b> <span>" + c.role + " · " + c.when + "</span></div>"; }).join("") + "<h2>수상</h2>" + S.awards.map(function (a) { return '<div class="si"><b>' + a.title + "</b> <span>" + a.when + "</span></div>"; }).join("") + "</div><div><h2>자격 · 어학</h2>" + S.certs.map(function (c) { return '<div class="si"><b>' + c.name + "</b> <span>" + c.date + "</span></div>"; }).join("") + "<h2>교육 이수</h2>" + S.edu.map(function (e) { return '<div class="si"><b>' + e.title + "</b> <span>" + e.hours + "</span></div>"; }).join("") + "</div></div><p class=\"fine\">학력: 서울과학기술대학교 전기정보공학과 학사 · 학점 3.8/4.5</p></main>";
    $("#prt").addEventListener("click", function () { window.print(); });
  }

  /* ---------- 라이트박스 ---------- */
  var lb = document.createElement("dialog"); lb.id = "lb"; lb.setAttribute("aria-label", "이미지 크게 보기"); document.body.appendChild(lb);
  lb.addEventListener("click", function () { lb.close(); });
  document.addEventListener("click", function (e) {
    var presentation = e.target.closest("[data-present]");
    if (presentation) { openPresent(byId(presentation.dataset.present)); return; }
    var galleryButton = e.target.closest(".gph-button");
    var im = galleryButton ? $("img", galleryButton) : e.target.closest(".gph img");
    if (im) { lb.innerHTML = '<img src="' + im.src + '" alt="' + esc(im.alt) + '"><p>' + esc(im.alt) + "</p>"; lb.showModal(); }
  });

  /* ---------- ⑦ 발표 모드 ---------- */
  var presEl = null, presI = 0, presSlides = [], presTrigger = null;
  function openPresent(p) {
    presTrigger = document.activeElement;
    presI = 0;
    presSlides = [
      '<div class="ps-t"><span class="role">' + esc(p.role) + "</span><h2>" + p.titleHtml + "</h2><p>" + esc(p.summary) + "</p>" + tagRow(p.tags) + "</div>",
      '<div class="ps-k">' + p.kpis.map(function (k) { return '<div><b class="' + k.c + '">' + k.n + "</b><span>" + k.l + "</span></div>"; }).join("") + "</div>"
    ].concat(p.steps.map(function (s) {
      return '<div class="ps-s ' + (s.k === "problem" && s.over ? "over" : s.k) + '"><small>' + s.label + "</small><p>" + esc(s.body) + "</p></div>";
    })).concat([
      '<div class="ps-s"><small>검증 수준</small><p>' + p.verify.kinds.map(function (k) { return S.verifyKinds[k].label; }).join(" · ") + "<br><span>" + esc(p.verify.note) + "</span></p></div>"
    ]);
    presEl = document.createElement("div");
    presEl.className = "pres"; presEl.setAttribute("role", "dialog"); presEl.setAttribute("aria-modal", "true"); presEl.setAttribute("aria-label", p.title + " 발표 모드"); presEl.tabIndex = -1;
    presEl.innerHTML = '<div class="pres-top"><b>' + esc(p.title) + '</b><span id="pc"></span><button type="button" id="px" aria-label="발표 모드 닫기">닫기 Esc</button></div><div class="pres-body" id="pb" aria-live="polite"></div><div class="pres-bot"><button type="button" id="pp">← 이전</button><div class="pres-prog"><i id="pg"></i></div><button type="button" id="pn">다음 →</button></div>';
    document.body.appendChild(presEl); document.body.style.overflow = "hidden";
    $("#pp").onclick = function () { go(-1); }; $("#pn").onclick = function () { go(1); }; $("#px").onclick = closePresent;
    drawPres(); presEl.focus();
  }
  function drawPres() {
    $("#pb").innerHTML = presSlides[presI];
    $("#pc").textContent = (presI + 1) + " / " + presSlides.length;
    $("#pg").style.width = ((presI + 1) / presSlides.length * 100) + "%";
    $("#pp").disabled = presI === 0; $("#pn").disabled = presI === presSlides.length - 1;
  }
  function go(d) { presI = Math.max(0, Math.min(presSlides.length - 1, presI + d)); drawPres(); }
  function closePresent() {
    if (!presEl) return;
    presEl.remove();
    presEl = null;
    document.body.style.overflow = "";
    if (presTrigger) presTrigger.focus();
    presTrigger = null;
  }

  /* ---------- ⑨ 검색 (Ctrl+K) ---------- */
  var sdlg = document.createElement("dialog"); sdlg.id = "sdlg"; sdlg.setAttribute("aria-label", "검색");
  sdlg.innerHTML = '<div class="s-in"><input id="sq" type="search" placeholder="검색: FPGA, HFSS, 멘토링, 전기기사 …" autocomplete="off" aria-label="검색어"><button type="button" id="sx" aria-label="닫기">Esc</button></div><ul id="sr" role="listbox"></ul><p class="s-h">↑↓ 이동 · Enter 열기 · Esc 닫기</p>';
  document.body.appendChild(sdlg);
  var sidx = null, sSel = 0, sList = [];
  function buildIndex() {
    var a = [];
    NAV.concat(MORE).forEach(function (n) { a.push({ kind: "페이지", t: n[1], s: "", h: n[0], k: n[1] }); });
    P.forEach(function (p) { a.push({ kind: "프로젝트", t: p.title, s: p.result, h: href(p), k: [p.title, p.summary, p.result, p.role, p.tags.join(" "), p.d.map(domLabel).join(" ")].join(" ") }); });
    var tl = {}; P.forEach(function (p) { p.tags.forEach(function (t) { tl[t] = 1; }); });
    Object.keys(tl).forEach(function (t) { a.push({ kind: "도구", t: t, s: "사용 프로젝트 보기", h: "tools.html?tool=" + encodeURIComponent(t), k: t }); });
    S.career.forEach(function (c) { a.push({ kind: "경력", t: c.org, s: c.role + " · " + c.when, h: "experience.html", k: [c.org, c.role, c.body].join(" ") }); });
    S.awards.forEach(function (c) { a.push({ kind: "수상", t: c.title, s: c.when, h: "index.html#activities", k: c.title + " " + c.sub }); });
    a.push({ kind: "활동", t: "대학생 동아리 리더", s: S.club.when, h: "index.html#activities", k: "동아리 리더 운영진 리더십 " + S.club.body });
    S.certs.forEach(function (c) { a.push({ kind: "자격", t: c.name, s: c.org + " · " + c.date, h: "index.html#credentials", k: c.name + " " + c.org }); });
    S.edu.forEach(function (c) { a.push({ kind: "교육", t: c.title, s: c.when, h: "index.html#credentials", k: c.title + " " + c.body }); });
    S.evidence.filter(function (e) { return e.ready; }).forEach(function (e) { a.push({ kind: "증빙", t: e.title, s: e.sub, h: "evidence.html", k: e.title + " " + e.sub }); });
    return a;
  }
  function runSearch() {
    var q = $("#sq").value.trim().toLowerCase(), toks = q.split(/\s+/).filter(Boolean);
    sList = !toks.length ? sidx.slice(0, 8) : sidx.filter(function (it) { var hay = (it.t + " " + it.k).toLowerCase(); return toks.every(function (t) { return hay.indexOf(t) > -1; }); }).slice(0, 12);
    sSel = 0; drawSearch();
  }
  function drawSearch() {
    $("#sr").innerHTML = sList.length ? sList.map(function (it, i) { return '<li role="option" aria-selected="' + (i === sSel) + '"><a href="' + it.h + '"><i>' + it.kind + "</i><b>" + esc(it.t) + "</b><span>" + esc(it.s) + "</span></a></li>"; }).join("") : '<li class="none">검색 결과가 없습니다.</li>';
  }
  function openSearch() { if (!sidx) sidx = buildIndex(); if (!sdlg.open) sdlg.showModal(); $("#sq").value = ""; runSearch(); $("#sq").focus(); }
  $("#sq", sdlg).addEventListener("input", runSearch);
  $("#sr", sdlg).addEventListener("click", function (e) {
    var target = e.target.closest("a");
    if (!target) return;
    sdlg.close();
    if (page === "home" && target.getAttribute("href") === location.hash) jumpToHomeAnchor();
  });
  $("#sx", sdlg).addEventListener("click", function () { sdlg.close(); });
  sdlg.addEventListener("click", function (e) { if (e.target === sdlg) sdlg.close(); });
  sdlg.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); sSel = Math.min(sList.length - 1, sSel + 1); drawSearch(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sSel = Math.max(0, sSel - 1); drawSearch(); }
    else if (e.key === "Enter" && sList[sSel]) {
      e.preventDefault();
      sdlg.close();
      if (page === "home" && sList[sSel].h === location.hash) jumpToHomeAnchor();
      else location.href = sList[sSel].h;
    }
  });
  document.addEventListener("keydown", function (e) {
    if (presEl) {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(-1); }
      else if (e.key === "Home") { presI = 0; drawPres(); }
      else if (e.key === "End") { presI = presSlides.length - 1; drawPres(); }
      else if (e.key === "Escape") closePresent();
      return;
    }
    var tag = (e.target.tagName || "").toLowerCase();
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); }
    else if (e.key === "/" && tag !== "input" && tag !== "textarea") { e.preventDefault(); openSearch(); }
  });
  document.addEventListener("click", function (e) { if (e.target.closest("#sbtn")) openSearch(); });

  function initBot() {
    var wrap = document.createElement("div");
    wrap.id = "bot";
    wrap.innerHTML = '<button type="button" id="bot-fab" aria-label="안내 도우미 열기" aria-expanded="false"><span aria-hidden="true">?</span><b>무엇을 찾으세요?</b></button>' +
      '<section id="bot-panel" role="dialog" aria-label="안내 도우미" hidden>' +
      '<header><div><b>안내 도우미</b><small>묻는 내용에 맞는 페이지로 안내해 드려요</small></div><button type="button" id="bot-x" aria-label="닫기">×</button></header>' +
      '<div id="bot-log" aria-live="polite"></div>' +
      '<div id="bot-chips"></div>' +
      '<form id="bot-form"><input id="bot-q" type="text" placeholder="예: FPGA 경험, 이력서, 자격증" autocomplete="off" aria-label="질문 입력"><button type="submit">보내기</button></form>' +
      "</section>";
    document.body.appendChild(wrap);
    var fab = $("#bot-fab"), panel = $("#bot-panel"), log = $("#bot-log"), q = $("#bot-q"), chips = $("#bot-chips");
    var idx = null, started = false;

    var INTENTS = [
      { re: /이력서|resume|cv|pdf/i, say: "이력서 PDF는 아래 버튼으로 받을 수 있어요.", links: [{ t: "이력서 PDF 다운로드", h: "assets/resume.pdf", dl: true }, { t: "이력서 보기", h: "summary.html" }] },
      { re: /연락|이메일|메일|전화|번호|contact/i, say: "연락처는 " + S.email + " 이고, 전화는 " + S.phone + " 입니다.", links: [{ t: "메일 보내기", h: "mailto:" + S.email }] },
      { re: /자격|면허|기사|토익|한국사|어학|교육|이수|수강/, say: "자격, 어학, 교육 이수는 이 페이지에 모아 두었어요.", links: [{ t: "자격 · 교육 보기", h: "index.html#credentials" }] },
      { re: /수상|상장|우수상|장관상|동아리|활동|봉사/, say: "수상과 대외활동은 이 페이지에서 볼 수 있어요.", links: [{ t: "활동 · 수상 보기", h: "index.html#activities" }] },
      { re: /경력|인턴|멘토|근무|일해/, say: "경력은 이 페이지에 정리되어 있어요.", links: [{ t: "경력 보기", h: "experience.html" }] },
      { re: /도구|툴|스택|사용 기술|tool/i, say: "도구와 기술은 프로젝트별 표로 정리해 두었어요.", links: [{ t: "도구 매트릭스 보기", h: "tools.html" }] },
      { re: /타임라인|연표|시간순|언제/, say: "시간 순서로 보고 싶다면 이쪽이에요.", links: [{ t: "타임라인 보기", h: "timeline.html" }] },
      { re: /증빙|근거 자료|증명/, say: "증빙 자료는 이 페이지에 모아 두었어요.", links: [{ t: "증빙 보기", h: "evidence.html" }] },
      { re: /원인 재정의|사례|문제 해결/, say: "원인을 다시 정의해 풀어 낸 사례를 모아 둔 페이지예요.", links: [{ t: "사례 보기", h: "cases.html" }] },
      { re: /전체 프로젝트|프로젝트 목록|프로젝트 전체|대표 프로젝트|핵심 프로젝트|프로젝트 보여/, say: "핵심 프로젝트 " + P.length + "개가 목록에 있어요.", links: [{ t: "프로젝트 목록 보기", h: "index.html#projects" }] }
    ];
    var SYN = {
      "안테나": ["fsr", "rasorber", "hfss"], "전파": ["rf", "전자파"], "rf": ["전자파", "fsr"], "흡수": ["fsr", "rasorber"], "pcb": ["fsr"],
      "fpga": ["verilog", "vivado"], "디지털": ["fpga"], "가속기": ["fpga"],
      "반도체": ["tcad", "finfet"], "소자": ["tcad", "finfet"], "트랜지스터": ["tcad"],
      "램프": ["램프", "raspberry"], "음성": ["램프", "deepgram"], "시제품": ["램프"],
      "세미나": ["토닥"], "부모": ["토닥"], "기획": ["토닥", "태양광"], "운영": ["토닥"],
      "냉각": ["냉각"], "고장": ["냉각", "예측"], "예지": ["냉각", "예측"], "대시보드": ["dash", "냉각", "태양광"], "dash": ["냉각"],
      "태양광": ["태양광"], "발전": ["태양광"], "qa": ["태양광"], "테스트": ["태양광"], "supabase": ["태양광"], "next": ["태양광"],
      "데이터": ["냉각", "태양광", "python"], "ai": ["램프", "냉각"], "파이썬": ["python"]
    };
    var STOP = /(해줘|알려줘|보여줘|있어요|있나요|인가요|하나요|주세요|싶어요|에서|으로|에게|은|는|이|가|을|를|에|의|도|로|과|와|요)$/;

    function add(who, html) {
      var d = document.createElement("div");
      d.className = "bm " + who;
      d.innerHTML = html;
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
      return d;
    }
    function linkHtml(l) {
      return '<a class="bl" href="' + l.h + '"' + (l.dl ? ' download="조예찬_이력서.pdf"' : "") + ">" + esc(l.t) + (l.s ? "<small>" + esc(l.s) + "</small>" : "") + "</a>";
    }
    function tokens(text) {
      var raw = text.toLowerCase().split(/[\s,.?!·/]+/).filter(Boolean);
      var out = [];
      raw.forEach(function (t) {
        var base = t.length > 2 ? t.replace(STOP, "") : t;
        if (base.length < 2 && !/^[a-z]+$/.test(base)) return;
        out.push(base);
        (SYN[base] || []).forEach(function (s) { out.push(s); });
      });
      return out;
    }
    function find(text) {
      if (!idx) idx = buildIndex();
      var toks = tokens(text);
      if (!toks.length) return [];
      var seen = {};
      return idx.map(function (it) {
        var hay = (it.t + " " + it.k).toLowerCase(), sc = 0;
        toks.forEach(function (t) { if (hay.indexOf(t) > -1) sc += t.length > 2 ? 2 : 1; });
        if (it.kind === "프로젝트") sc += sc ? 1 : 0;
        return { it: it, sc: sc };
      }).filter(function (r) { return r.sc > 0; }).sort(function (a, b) { return b.sc - a.sc; }).filter(function (r) {
        var key = r.it.h; if (seen[key]) return false; seen[key] = 1; return true;
      }).slice(0, 3).map(function (r) { return r.it; });
    }
    function answer(text) {
      var intent = INTENTS.filter(function (n) { return n.re.test(text); })[0];
      if (intent) { add("bot", "<p>" + esc(intent.say) + "</p>" + intent.links.map(linkHtml).join("")); return; }
      var hits = find(text);
      if (hits.length) {
        add("bot", "<p>관련 있어 보이는 곳을 찾았어요.</p>" + hits.map(function (it) { return linkHtml({ t: it.t, h: it.h, s: it.kind + (it.s ? " · " + it.s : "") }); }).join(""));
      } else {
        add("bot", "<p>정확히 맞는 곳을 찾지 못했어요. 아래 예시처럼 물어보거나 검색(Ctrl+K)을 써 보세요.</p>" + linkHtml({ t: "프로젝트 목록 보기", h: "projects.html" }));
      }
    }
    function ask(text) {
      text = text.trim();
      if (!text) return;
      add("me", esc(text));
      answer(text);
    }
    function start() {
      if (started) return;
      started = true;
      add("bot", "<p>안녕하세요. 찾고 싶은 내용을 알려 주시면 해당 페이지로 안내해 드려요.</p><p class=\"bn\">정해진 규칙으로 안내하는 도우미라 자유로운 대화는 어려워요.</p>");
      ["이력서", "대표 프로젝트", "FPGA 경험", "태양광 앱", "자격증", "연락처"].forEach(function (c) {
        var b = document.createElement("button");
        b.type = "button"; b.textContent = c;
        b.addEventListener("click", function () { ask(c); });
        chips.appendChild(b);
      });
    }
    function setOpen(on) {
      panel.hidden = !on;
      fab.setAttribute("aria-expanded", on ? "true" : "false");
      wrap.classList.toggle("open", on);
      if (on) { start(); q.focus(); }
    }
    fab.addEventListener("click", function () { setOpen(panel.hidden); });
    $("#bot-x").addEventListener("click", function () { setOpen(false); fab.focus(); });
    panel.addEventListener("keydown", function (e) { if (e.key === "Escape") { setOpen(false); fab.focus(); } });
    $("#bot-form").addEventListener("submit", function (e) { e.preventDefault(); ask(q.value); q.value = ""; });
  }

  /* ---------- 시작 ---------- */
  var R = { home: home, projects: function () { location.replace("index.html#projects"); }, project: legacyProject, about: function () { location.replace("index.html"); }, experience: experience, activities: function () { location.replace("index.html#activities"); }, credentials: function () { location.replace("index.html#credentials"); }, cases: cases, tools: tools, timeline: timeline, evidence: evidence, summary: summary };
  (R[page] || home)();
  if (page === "home") {
    jumpToHomeAnchor();
    window.addEventListener("hashchange", jumpToHomeAnchor);
  } else if (["project", "projects", "about", "activities", "credentials"].indexOf(page) === -1) {
    applyDomain();
    initBot();
  }
})();
