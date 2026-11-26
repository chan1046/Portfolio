(() => {
  "use strict";

  const projects = window.PORTFOLIO_DEPLOYMENTS;
  const masthead = document.querySelector(".portfolio-masthead");
  const contact = masthead.querySelector('a[href="#contact"]');
  const navigation = document.createElement("nav");
  navigation.setAttribute("aria-label", "상단 메뉴");
  const demos = document.createElement("a");
  demos.className = "masthead-demos";
  demos.href = "/demos/";
  demos.textContent = "배포 프로젝트";
  masthead.append(navigation);
  navigation.append(demos, contact);

  for (const project of projects) {
    const liveLink = document.querySelector("#project-" + project.id + " .project-chapter .project-proof a");
    if (!liveLink) continue;
    liveLink.href = project.path;
    liveLink.textContent = "포트폴리오에서 앱 보기";
    liveLink.classList.add("portfolio-demo-button");
    liveLink.removeAttribute("target");
    liveLink.removeAttribute("rel");
  }
})();
