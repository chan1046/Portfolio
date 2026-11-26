import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const repository = new URL("../", import.meta.url);
const site = new URL("./", import.meta.url);
const output = new URL("./dist/", site);
const originals = [
  "about.html", "activities.html", "app.js", "assets", "cases.html",
  "credentials.html", "data-extra.js", "data.js", "evidence.html",
  "experience.html", "extra.css", "project.html", "projects.html",
  "style.css", "summary.html", "timeline.html", "tools.html"
];

mkdirSync(output, { recursive: true });
for (const name of originals) {
  cpSync(new URL(name, repository), new URL(name, output), { recursive: name === "assets" });
}

const homepage = readFileSync(new URL("index.html", repository), "utf8")
  .replace(/(<meta name="theme-color" content=")[^"]+/, "$1#f7f8fb")
  .replace("</head>", '<link rel="stylesheet" href="/hub.css">\n</head>')
  .replace("</body>", '<script src="/deployments.js"></script>\n<script src="/hub.js"></script>\n</body>');
writeFileSync(new URL("index.html", output), homepage);

for (const name of ["deployments.js", "hub.js", "hub.css", "demos"]) {
  cpSync(new URL(name, site), new URL(name, output), { recursive: name === "demos" });
}
