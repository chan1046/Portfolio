/* 페이지 렌더링과 기능(직무별 보기, 검색, 발표 모드 등). 내용은 data.js, data-extra.js에서 수정합니다. */
(function () {
  "use strict";
  var S = window.SITE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var nb = function () { return Array.prototype.slice.call(arguments).map(function (x) { return '<span class="nb">' + esc(x) + "</span>"; }).join(" "); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 저장 불가 환경 */ } }
  };
  var page = document.body.dataset.page;
  var app = $("#app");
  var P = S.projects;
  var byId = function (id) { return P.filter(function (p) { return p.id === id; })[0]; };
  var domLabel = function (id) { var d = S.domains.filter(function (x) { return x.id === id; })[0]; return d ? d.label : id; };
  var href = function (p) { return "project.html?id=" + p.id; };

  var NAV = [["index.html", "홈", "home"], ["projects.html", "프로젝트", "projects"], ["about.html", "소개", "about"], ["experience.html", "경력", "experience"], ["activities.html", "활동·수상", "activities"], ["credentials.html", "자격·교육", "credentials"]];
  var MORE = [["cases.html", "원인 재정의 사례 모음", "cases"], ["tools.html", "도구 · 프로젝트 매트릭스", "tools"], ["timeline.html", "타임라인", "timeline"], ["evidence.html", "증빙 모아보기", "evidence"], ["summary.html", "한 장 요약 (인쇄용)", "summary"]];

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
    return '<section class="contact"><div class="wrap"><div class="cbox"><div><div class="eyebrow">CONTACT</div><h2>함께 이야기해요</h2>' +
      '<div class="li">' + S.email + '<button class="copy" type="button" data-copy="' + S.email + '">복사</button></div>' +
      '<div class="li s">' + S.phone + '<button class="copy" type="button" data-copy="' + S.phone + '">복사</button></div></div>' +
      '<div class="btns"><a class="btn cream" href="mailto:' + S.email + '">메일 보내기</a>' + (extraBtn || '<a class="btn line" href="assets/resume.pdf" download="조예찬_이력서.pdf">이력서 PDF 다운로드</a>') + "</div></div></div></section>";
  }
  function nextBand(h, label) {
    return '<section class="contact"><div class="wrap"><div class="next"><b>다음 페이지: ' + label + '</b><a class="btn cream" href="' + h + '">보러 가기 →</a></div></div></section>';
  }
  function vb(p) {
    if (!p.verify) return "";
    return '<span class="vbs">' + p.verify.kinds.map(function (k) { var v = S.verifyKinds[k]; return '<span class="vb ' + v.tone + '">' + v.label + "</span>"; }).join("") + "</span>";
  }
  function dtags(p) { return '<div class="dtags">' + p.d.map(function (d) { return "<i>" + domLabel(d) + "</i>"; }).join("") + "</div>"; }
  function tagRow(tags) { return '<div class="tg">' + tags.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div>"; }
  function sec(inner, cls) { return '<section class="sec ' + (cls || "") + '"><div class="wrap">' + inner + "</div></section>"; }

  /* ---------- ① 직무별 보기 ---------- */
  var dom = store.get("pf-domain") || "all";
  if (dom !== "all" && !S.domains.some(function (d) { return d.id === dom; })) dom = "all";
  function domChips() {
    return '<div class="chips" role="group" aria-label="직무 선택"><button class="chip" type="button" data-dom="all">전체</button>' +
      S.domains.map(function (d) { return '<button class="chip" type="button" data-dom="' + d.id + '">' + d.label + "</button>"; }).join("") + "</div>";
  }
  function domSection() {
    return '<section class="dom"><div class="wrap"><div class="dom-box"><div class="eyebrow dark">FOR INTERVIEWER</div><h2>어떤 직무를 보고 계신가요?</h2>' + domChips() +
      '<div class="dom-out" id="domout" aria-live="polite"></div></div></div></section>';
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

  /* ---------- 페이지 ---------- */
  var DECO = '<svg class="deco" viewBox="0 0 120 1000" preserveAspectRatio="none" aria-hidden="true"><defs><filter id="rough" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.035 0.012" numOctaves="3" seed="4" result="w"/><feDisplacementMap in="SourceGraphic" in2="w" scale="70"/></filter></defs><rect x="10" y="0" width="100" height="1000" rx="50" fill="#F3EEDF" filter="url(#rough)"/></svg>';

  function statCard(s) {
    var bars = s.bars.map(function (b) {
      return '<div class="bar"><i class="' + (b.c === "pass" ? "" : b.c) + '" style="width:' + b.w + '%"></i>' + (b.mark ? '<b class="' + (b.mc === "over" ? "over" : "") + '" style="left:' + b.mark + '%"></b>' : "") + "</div>";
    }).join("");
    return '<div class="stat" data-d="' + s.d.join(" ") + '"><div class="n">' + s.n + '</div><div class="l">' + s.l + "</div>" + bars +
      '<div class="axis"><span>0</span>' + (s.note ? '<em class="' + (s.noteC === "over" ? "over" : "") + '">' + s.note + "</em>" : "") + "<span>" + s.max + "</span></div></div>";
  }

  function home() {
    document.title = "조예찬 | 포트폴리오";
    var hero = '<header class="band">' + DECO + '<div class="wrap">' + top("home") + '<div class="hero"><div class="who"><img class="avatar" src="assets/img/profile.jpg" alt="조예찬 프로필 사진" width="88" height="88" onerror="this.style.display=\'none\'"><div><b>' + S.name + '</b><span class="pill-o">전기정보공학 학사 · 서울과학기술대학교</span></div></div>' +
      "<h1 class=\"hv\">저의 기술과 역량으로 누군가를<br>돕고 살리는 사람이 되고 싶습니다</h1>" +
      '<div class="tags-w">' + S.heroTags.map(function (t) { return "<span>" + t + "</span>"; }).join("") + "</div>" +
      '<div class="btns"><a class="btn cream" href="assets/resume.pdf" download="조예찬_이력서.pdf">이력서 PDF 다운로드</a><a class="btn line" href="projects.html">프로젝트 보기 →</a></div></div></div></header>';
    var loop = sec('<div class="eyebrow dark">HOW I WORK</div><h2 class="t">작업 방식</h2><p class="lead2">설계 결과를 시뮬레이션과 실측으로 검증하고, 목표에 못 미치면 원인을 다시 정의해 설계로 돌아갑니다.</p>' +
      '<div class="loop"><div class="loop-g">' + S.loop.map(function (n, i) { return "<div" + (i === S.loop.length - 1 ? ' class="last"' : "") + ">" + n + "</div>"; }).join("") + '</div><div class="back"></div><div class="cap">목표 미달 → 원인 재정의 → 설계 복귀</div></div>');
    var stats = sec('<div class="eyebrow dark">KEY RESULTS</div><h2 class="t" style="margin-bottom:48px">숫자로 보는 검증 결과</h2><div class="stats">' + S.stats.map(statCard).join("") + "</div>", "tight");
    var list = sec('<div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-end;justify-content:space-between;margin-bottom:48px"><div><div class="eyebrow dark">PROJECTS</div><h2 class="t" style="margin-bottom:0">핵심 프로젝트 ' + P.length + '개</h2></div><a class="btn dark-line" href="projects.html">전체 보기 →</a></div><div class="plist">' +
      P.map(function (p) { return '<a class="prow" data-d="' + p.d.join(" ") + '" href="' + href(p) + '"><div class="no">' + p.no + '</div><div class="tt"><b>' + esc(p.title) + "</b><span>" + esc(p.role) + " · " + p.date + "</span> " + vb(p) + '</div><div class="rs">' + esc(p.result) + '</div><div class="ar">→</div></a>'; }).join("") + "</div>", "white");
    var more = sec('<div class="eyebrow dark">MORE</div><h2 class="t" style="margin-bottom:48px">더 알아보기</h2><div class="mgrid">' +
      [["about.html", "소개", "예찬적 사고"], ["cases.html", "원인 재정의 사례", "문제 → 원인 → 결과 한눈에"], ["timeline.html", "타임라인", "2020~2026 전체 이력"], ["tools.html", "도구 매트릭스", "어떤 도구를 어디에 썼는지"], ["evidence.html", "증빙 모아보기", "코드, 포스터, 수상"], ["summary.html", "한 장 요약", "인쇄해서 볼 수 있는 요약"]]
        .map(function (m) { return '<a class="mcard" href="' + m[0] + '"><div><b>' + m[1] + "</b><span>" + m[2] + "</span></div><em>보기 →</em></a>"; }).join("") + "</div>");
    app.innerHTML = hero + domSection() + loop + stats + list + more + contact();
  }

  function cover(p) { return { fsr: "fsr-meas.png", cooling: "cooling-real-priority.png" }[p.id] || p.gallery[0].src; }
  function projectsPage() {
    document.title = "프로젝트 | 조예찬";
    app.innerHTML = head("projects", "PROJECTS", "핵심 프로젝트", "각 프로젝트는 문제, 원인 판단, 해결, 결과 순서로 읽을 수 있습니다.") +
      sec(domMini() + '<div class="cards">' + P.map(function (p, i) {
        var dark = i % 3 === 0 || i === 3;
        return '<a class="card ' + (dark ? "dark" : "") + '" data-d="' + p.d.join(" ") + '" href="' + href(p) + '"><div class="ph"><img class="fit" src="assets/img/' + cover(p) + '" alt="' + esc(p.title) + ' 대표 이미지" width="1200" height="750" loading="lazy" onerror="this.remove()"></div><div class="bd">' +
          '<div class="meta"><span class="no">' + p.no + '</span><span class="role">' + esc(p.role) + '</span><span class="dt">' + p.date + "</span></div><h2>" + esc(p.title) + "</h2><p>" + esc(p.summary) + "</p>" + vb(p) +
          '<div class="res">' + esc(p.result) + "</div>" + tagRow(p.tags) + dtags(p) + '<div class="more">자세히 보기 →</div></div></a>';
      }).join("") + "</div>") + contact();
  }

  /* ---------- 프로젝트 상세 ---------- */
  function projectPage() {
    var id = new URLSearchParams(location.search).get("id");
    var p = byId(id) || P[0];
    var idx = P.indexOf(p), prev = P[(idx + P.length - 1) % P.length], next = P[(idx + 1) % P.length];
    document.title = p.title + " | 조예찬";
    var c = p.contrib;
    var headHtml = '<header class="band"><div class="wrap">' + top("projects") + '<div class="dhead"><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><span class="role">' + esc(p.role) + '</span><span class="sub">' + (p.subtitle || p.date) + "</span></div><h1>" + p.titleHtml + "</h1><p>" + esc(p.summary) + "</p>" + tagRow(p.tags) +
      '<div class="btns" style="margin-top:28px"><button class="btn cream" type="button" id="present" style="border:0;cursor:pointer;font-family:inherit">발표 모드 ▶</button><a class="btn line" href="projects.html">← 프로젝트 목록</a></div></div></div></header>';
    var kpis = '<div class="wrap"><div class="kpis">' + p.kpis.map(function (k) {
      var bar = k.bar ? '<div class="bar"><i style="width:' + k.bar.w + '%"></i><b style="left:' + k.bar.at + '%"></b></div><div class="axis"><span>0</span><em>' + k.bar.note + "</em><span>" + k.bar.max + "</span></div>" : "";
      return '<div class="kpi"><div class="n ' + k.c + '">' + k.n + '</div><div class="l">' + k.l + "</div>" + bar + "</div>";
    }).join("") + "</div></div>";
    var info = '<div class="wrap"><div class="info"><div class="ibox"><small>검증 수준</small><div style="margin:8px 0 10px">' + vb(p) + "</div><p>" + esc(p.verify.note) + '</p></div><div class="ibox"><small>내 역할</small><p class="who2"><b>' + esc(c.role) + "</b>" + (c.team ? " · " + esc(c.team) : "") + (c.share ? " · " + esc(c.share) : "") + "</p><ul>" +
      c.did.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ul>" + (c.other ? '<p class="oth">' + esc(c.other) + "</p>" : "") + "</div></div></div>";
    var steps = '<div class="wrap"><div class="steps">' + p.steps.map(function (s) {
      var cls = s.k === "problem" && s.over ? "over" : s.k;
      return '<div class="step ' + cls + '"><div class="rail"><div class="dot"></div><s></s></div><div class="bd"><h3>' + s.label + "</h3><p>" + esc(s.body) + "</p></div></div>";
    }).join("") + "</div></div>";
    var ex = "";
    if (p.extra) {
      var e = p.extra;
      ex += sec('<div class="dsec" style="padding:0"><div class="eyebrow dark">' + e.redefine.eyebrow + "</div><h2>" + e.redefine.title + '</h2><p class="lead3">' + esc(e.redefine.lead) + '</p><div class="ba"><div class="b"><span class="tag">BEFORE</span><h3>' + e.redefine.before.title + "</h3><p>" + e.redefine.before.lines.map(esc).join("<br>") + '</p></div><div class="a"><span class="tag">AFTER</span><h3>' + e.redefine.after.title + "</h3><p>" + e.redefine.after.lines.map(esc).join("<br>") + "</p></div></div></div>", "tight");
      ex += sec('<div class="dsec" style="padding:0"><div class="eyebrow dark">' + e.pipeline.eyebrow + "</div><h2>" + e.pipeline.title + '</h2><div class="pipe">' + e.pipeline.items.map(function (t, i) { return "<div><span>" + (i + 1) + "</span>" + t + "</div>"; }).join("") + "</div></div>", "tight");
      ex += sec('<div class="dsec" style="padding:0"><div class="eyebrow dark">' + e.issues.eyebrow + "</div><h2>" + e.issues.title + '</h2><div class="issues">' + e.issues.items.map(function (i) {
        return '<div class="issue"><h3>' + i.title + '</h3><div class="p"><small>문제</small><p>' + esc(i.problem) + '</p></div><div class="f"><small>해결</small><p>' + esc(i.fix) + '</p></div><div class="r">' + esc(i.result) + "</div></div>";
      }).join("") + "</div></div>", "tight");
    }
    var gal = sec('<div class="dsec" style="padding:0"><div class="eyebrow dark">' + p.galleryEyebrow + "</div><h2>" + p.galleryTitle + '</h2><div class="gal' + (p.galClass ? " " + p.galClass : "") + '">' + p.gallery.map(function (g) {
      return '<figure' + (g.cls ? ' class="' + g.cls + '"' : '') + '><div class="gph"><img src="assets/img/' + g.src + '" alt="' + esc(g.alt) + '" width="1200" height="800" loading="lazy" onerror="this.remove()"></div><figcaption>' + g.cap + "</figcaption></figure>";
    }).join("") + "</div>" + (p.galleryNote ? '<p class="gnote">' + esc(p.galleryNote) + "</p>" : "") + "</div>", "tight");
    var qa = sec('<div class="dsec" style="padding:0"><div class="eyebrow dark">Q &amp; A <span class="draft">초안 · 직접 다듬어 주세요</span></div><h2>예상 질문</h2><div class="qa">' + p.qa.map(function (x, i) {
      return "<details" + (i === 0 ? " open" : "") + "><summary>" + esc(x.q) + "</summary><p>" + esc(x.a) + "</p></details>";
    }).join("") + "</div></div>", "tight");
    var end = "";
    var link = p.extra && p.link ? '<a class="btn cream" href="' + p.link.href + '" target="_blank" rel="noopener">' + p.link.label + "</a>" : "";
    link = p.link ? '<a class="btn cream" href="' + p.link.href + '" target="_blank" rel="noopener">' + p.link.label + "</a>" : "";
    if (p.extra) {
      end = sec('<div class="endband"><div class="eyebrow">LIMITS &amp; NEXT</div><div class="two"><div><h3>한계</h3><ul>' + p.extra.limits.limits.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul></div><div><h3>다음 과제</h3><ul>" + p.extra.limits.nexts.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + '</ul></div></div><div class="btns">' + link + '<a class="btn line" href="projects.html">다른 프로젝트 보기 →</a></div></div>', "tight");
    } else {
      end = sec('<div class="endband">' + (p.moment ? '<div class="eyebrow">MOST PROUD MOMENT</div><p class="big">' + esc(p.moment) + "</p>" : '<p class="big">' + esc(p.closing) + "</p>") + '<div class="btns" style="margin-top:28px"><a class="btn cream" href="projects.html">다른 프로젝트 보기 →</a></div></div>', "tight");
    }
    var nav = sec('<div class="pn"><a href="' + href(prev) + '"><small>← 이전 프로젝트</small><b>' + esc(prev.title) + '</b></a><a href="' + href(next) + '" style="text-align:right"><small>다음 프로젝트 →</small><b>' + esc(next.title) + "</b></a></div>", "tight");
    app.innerHTML = headHtml + kpis + info + steps + ex + gal + qa + end + nav + contact();
    $("#present").addEventListener("click", function () { openPresent(p); });
  }

  /* ---------- 소개 · 경력 · 활동 · 자격 ---------- */
  function about() {
    document.title = "소개 | 조예찬";
    app.innerHTML = head("about", "ABOUT", "예찬적 사고") +
      sec('<p class="about-p">' + nb("이름 그대로", "‘예찬적 사고’를 한다는 말을", "주변에서 들어 왔습니다.") + "<br>" + nb("안 되는 상황에서도", "가능성을 먼저 찾고,", "그 가능성을 설계 변경으로 연결하는", "방식으로 일해 왔습니다.") + "</p>") +
      sec('<div class="oneline"><div class="eyebrow">ONE LINE</div><p>' + nb("FSR은 결합 후 성능이 떨어졌을 때,", "FPGA는 합성이 불가능했을 때", "포기하지 않고", "원인부터 다시 정의했습니다.") + '</p><div class="btns"><a class="btn line" href="project.html?id=fsr">FSR 보기 →</a><a class="btn line" href="project.html?id=fpga">FPGA 보기 →</a><a class="btn line" href="cases.html">사례 모아보기 →</a></div></div>', "tight") +
      sec('<div class="eyebrow dark">DIRECTION</div><h2 class="t">누군가를 돕는 사람</h2><p class="about-p" style="font-size:19px;font-weight:400;margin-bottom:48px">' + nb("앞으로는 누군가를 돕는 사람으로", "일하고 싶습니다.") + "<br>" + nb("전기기사 필기 멘토링,", "대학생 동아리 운영,", "‘따뜻한 말 램프’ 같은 활동도", "모두 그 방향에 있었습니다.") + '</p><div class="lcards">' +
        [["experience.html", "전기기사 필기 멘토링", "주식회사 맞추다 · 약 50명 대상"], ["activities.html", "대학생 동아리 리더", "구성원 120명에서 170명 이상으로"], ["project.html?id=lamp", "‘따뜻한 말 램프’", "AI 기반 부모 언어 개선 제품"]]
          .map(function (l) { return '<a class="lcard" href="' + l[0] + '"><div><b>' + l[1] + "</b><span>" + l[2] + "</span></div><em>자세히 →</em></a>"; }).join("") + "</div>") +
      contact('<a class="btn line" href="experience.html">다음: 경력 →</a>');
  }
  function experience() {
    document.title = "경력 | 조예찬";
    app.innerHTML = head("experience", "EXPERIENCE", "경력 및 인턴", "멘토링, 현장 운영, 대학원 연구실까지 세 곳의 경험입니다.") +
      sec('<div class="rows">' + S.career.map(function (c) { return '<div class="row"><div class="when"><b>' + c.when + '</b><span class="role">' + c.role + '</span></div><div class="bd"><h2>' + c.org + "</h2><p>" + esc(c.body) + "</p></div></div>"; }).join("") + "</div>") +
      nextBand("activities.html", "활동 · 수상");
  }
  function activities() {
    document.title = "활동·수상 | 조예찬";
    app.innerHTML = head("activities", "ACTIVITIES & AWARDS", "활동 · 수상", "수상 3건과 동아리 운영 경험입니다.") +
      sec('<div class="eyebrow dark">AWARDS</div><h2 class="t" style="margin-bottom:40px">수상</h2><div class="awards">' + S.awards.map(function (a) { return '<div class="award"><div class="w">' + a.when + "</div><b>" + a.title + "</b><span>" + a.sub + "</span></div>"; }).join("") + "</div>", "tight") +
      sec('<div class="eyebrow dark">LEADERSHIP</div><h2 class="t" style="margin-bottom:40px">대학생 동아리 리더</h2><div class="club"><div class="w">' + S.club.when + "</div><p>" + esc(S.club.body) + '</p><div class="ks">' + S.club.stats.map(function (k) { return "<div><b>" + k.n + "</b><span>" + k.l + "</span></div>"; }).join("") + "</div></div>", "tight") +
      sec('<div class="eyebrow dark">ETC</div><h2 class="t" style="margin-bottom:28px">그 외 활동</h2><div class="etc">' + S.etc.map(function (e) { return "<div>" + e + "</div>"; }).join("") + "</div>", "tight") +
      nextBand("credentials.html", "자격 · 교육");
  }
  function credentials() {
    document.title = "자격·교육 | 조예찬";
    app.innerHTML = head("credentials", "CREDENTIALS", "학력 · 자격 · 교육", "서울과학기술대학교 전기정보공학과 학사 · 학점 3.8/4.5") +
      sec('<div class="eyebrow dark">LICENSES</div><h2 class="t" style="margin-bottom:40px">자격 · 어학</h2><div class="certs">' + S.certs.map(function (c) { return '<div class="cert"><b>' + c.name + "</b><span>" + c.org + "</span><time>" + c.date + "</time></div>"; }).join("") + "</div>", "tight") +
      sec('<div class="eyebrow dark">TRAINING</div><h2 class="t" style="margin-bottom:40px">교육 이수</h2><div class="edus">' + S.edu.map(function (e) { return '<div class="edu"><div class="m"><b>' + e.when + "</b><i>" + e.hours + "</i></div><h3>" + e.title + "</h3><p>" + e.body + "</p></div>"; }).join("") + "</div>", "tight") + contact();
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
    S.awards.forEach(function (a) { ev.push({ k: "award", ym: ym(a.when), when: a.when, title: a.title, sub: a.sub, href: "activities.html" }); });
    ev.push({ k: "award", ym: ym(S.club.when), when: S.club.when, title: "대학생 동아리 리더", sub: "8명 운영진", href: "activities.html" });
    S.edu.forEach(function (e) { ev.push({ k: "edu", ym: ym(e.when), when: e.when, title: e.title, sub: e.hours, href: "credentials.html" }); });
    S.certs.filter(function (c) { return !/운전면허|한국사/.test(c.name); }).forEach(function (c) { ev.push({ k: "edu", ym: ym(c.date), when: c.date, title: c.name, sub: c.org, href: "credentials.html" }); });
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
    document.title = "증빙 | 조예찬";
    var items = S.evidence.filter(function (e) { return e.ready; });
    var urlAll = new URLSearchParams(location.search).get("all") === "1";
    if (urlAll) items = S.evidence;
    app.innerHTML = head("evidence", "EVIDENCE", "증빙 모아보기", "수치와 성과를 뒷받침하는 자료입니다.") +
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
    document.title = "한 장 요약 | 조예찬";
    app.innerHTML = '<div class="sheet-bar"><a href="index.html">← 홈으로</a><button type="button" id="prt">인쇄 / PDF 저장</button></div><main class="sheet"><header><h1>' + S.name + '</h1><p>' + S.email + " · " + S.phone + '</p><p class="one">설계하고, 실측으로 검증하고, 안 되면 원인을 다시 정의합니다. RF·전자파, FPGA, 반도체 소자 TCAD, 데이터 · AI 시제품을 직접 수행했습니다.</p></header>' +
      '<h2>핵심 프로젝트</h2>' + P.map(function (p) { return '<div class="si"><b>' + esc(p.title) + "</b> <span>" + esc(p.role) + " · " + p.date + "</span><p>" + esc(p.result) + " <em>(" + p.verify.kinds.map(function (k) { return S.verifyKinds[k].label; }).join(", ") + ")</em></p></div>"; }).join("") +
      '<div class="sc2"><div><h2>경력</h2>' + S.career.map(function (c) { return '<div class="si"><b>' + c.org + "</b> <span>" + c.role + " · " + c.when + "</span></div>"; }).join("") + "<h2>수상</h2>" + S.awards.map(function (a) { return '<div class="si"><b>' + a.title + "</b> <span>" + a.when + "</span></div>"; }).join("") + "</div><div><h2>자격 · 어학</h2>" + S.certs.map(function (c) { return '<div class="si"><b>' + c.name + "</b> <span>" + c.date + "</span></div>"; }).join("") + "<h2>교육 이수</h2>" + S.edu.map(function (e) { return '<div class="si"><b>' + e.title + "</b> <span>" + e.hours + "</span></div>"; }).join("") + "</div></div><p class=\"fine\">학력: 서울과학기술대학교 전기정보공학과 학사 · 학점 3.8/4.5</p></main>";
    $("#prt").addEventListener("click", function () { window.print(); });
  }

  /* ---------- 라이트박스 ---------- */
  var lb = document.createElement("dialog"); lb.id = "lb"; lb.setAttribute("aria-label", "이미지 크게 보기"); document.body.appendChild(lb);
  lb.addEventListener("click", function () { lb.close(); });
  document.addEventListener("click", function (e) {
    var im = e.target.closest(".gph img");
    if (im) { lb.innerHTML = '<img src="' + im.src + '" alt="' + esc(im.alt) + '"><p>' + esc(im.alt) + "</p>"; lb.showModal(); }
  });

  /* ---------- ⑦ 발표 모드 ---------- */
  var presEl = null, presI = 0, presSlides = [], presP = null;
  function openPresent(p) {
    presP = p; presI = 0;
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
  function closePresent() { if (presEl) { presEl.remove(); presEl = null; document.body.style.overflow = ""; } }

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
    S.awards.forEach(function (c) { a.push({ kind: "수상", t: c.title, s: c.when, h: "activities.html", k: c.title + " " + c.sub }); });
    a.push({ kind: "활동", t: "대학생 동아리 리더", s: S.club.when, h: "activities.html", k: "동아리 리더 운영진 리더십 " + S.club.body });
    S.certs.forEach(function (c) { a.push({ kind: "자격", t: c.name, s: c.org + " · " + c.date, h: "credentials.html", k: c.name + " " + c.org }); });
    S.edu.forEach(function (c) { a.push({ kind: "교육", t: c.title, s: c.when, h: "credentials.html", k: c.title + " " + c.body }); });
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
  $("#sx", sdlg).addEventListener("click", function () { sdlg.close(); });
  sdlg.addEventListener("click", function (e) { if (e.target === sdlg) sdlg.close(); });
  sdlg.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); sSel = Math.min(sList.length - 1, sSel + 1); drawSearch(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sSel = Math.max(0, sSel - 1); drawSearch(); }
    else if (e.key === "Enter" && sList[sSel]) { e.preventDefault(); location.href = sList[sSel].h; }
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

  /* ---------- 시작 ---------- */
  var R = { home: home, projects: projectsPage, project: projectPage, about: about, experience: experience, activities: activities, credentials: credentials, cases: cases, tools: tools, timeline: timeline, evidence: evidence, summary: summary };
  (R[page] || home)();
  applyDomain();
})();
