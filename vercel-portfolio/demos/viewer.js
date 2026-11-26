(() => {
  "use strict";

  const projects = window.PORTFOLIO_DEPLOYMENTS;
  const pathname = location.pathname.replace(/\/$/, "");
  const project = projects.find(candidate => candidate.path === pathname) || projects[0];

  function get(id) { return document.getElementById(id); }
  function create(tag, text) {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    return element;
  }

  for (const item of projects) {
    const link = create("a");
    link.href = item.path;
    if (item === project) link.setAttribute("aria-current", "page");
    link.append(create("span", item.name), create("small", item.category));
    get("demo-menu").append(link);
  }

  document.title = project.name + " | 조예찬 포트폴리오";
  get("demo-title").textContent = project.title;
  get("demo-description").textContent = project.description;
  get("demo-note").textContent = project.note;

  const source = get("demo-source");
  source.href = project.original;
  source.textContent = project.originalLabel;

  const panel = get("demo-panel");
  const tabList = get("demo-tabs");
  const tabs = project.views.map((view, index) => {
    const tab = create("button", view.label);
    tab.id = "view-tab-" + index;
    tab.type = "button";
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", panel.id);
    tab.addEventListener("click", () => show(index));
    tabList.append(tab);
    return tab;
  });

  function show(index) {
    const view = project.views[index];
    for (const [position, tab] of tabs.entries()) {
      tab.tabIndex = position === index ? 0 : -1;
      tab.setAttribute("aria-selected", String(position === index));
    }
    panel.setAttribute("aria-labelledby", tabs[index].id);

    if (view.frame) {
      const frame = create("iframe");
      frame.title = view.title;
      frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms");
      frame.referrerPolicy = "no-referrer";
      frame.src = view.frame;
      panel.replaceChildren(frame);
      return;
    }

    const figure = create("figure");
    const image = create("img");
    image.alt = view.title;
    image.src = "/assets/img/" + view.image;
    image.decoding = "async";
    figure.append(image, create("figcaption", view.title));
    panel.replaceChildren(figure);
  }

  tabList.addEventListener("keydown", event => {
    const current = tabs.indexOf(event.target);
    let next = current;
    switch (event.key) {
      case "ArrowLeft": next = (current + tabs.length - 1) % tabs.length; break;
      case "ArrowRight": next = (current + 1) % tabs.length; break;
      case "Home": next = 0; break;
      case "End": next = tabs.length - 1; break;
      default: return;
    }
    event.preventDefault();
    show(next);
    tabs[next].focus();
  });

  show(0);
})();
