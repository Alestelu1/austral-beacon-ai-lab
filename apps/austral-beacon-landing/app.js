const projects = [
  {
    name: "End of the World Atlas",
    summary: "Cartographic reference and documentary storytelling for Tierra del Fuego, southern routes, and remote geography.",
    tags: ["Maps", "Archive", "Geography"]
  },
  {
    name: "End of the World Travel",
    summary: "English-language travel intelligence for southern Patagonia, maritime routes, and Antarctic gateway context.",
    tags: ["Travel", "English", "Routes"]
  },
  {
    name: "Fin del Mundo Travel",
    summary: "Spanish-language travel and regional interpretation layer for southern places, services, and route planning.",
    tags: ["Travel", "Spanish", "Regional"]
  },
  {
    name: "Antarctic Pulse",
    summary: "Signals and explainers around Antarctic science, policy, climate, logistics, and official-source updates.",
    tags: ["Antarctica", "Science", "Signals"]
  },
  {
    name: "Antarctica Begins",
    summary: "Narrative layer for Antarctic departure points, gateway cities, and the geography of access.",
    tags: ["Gateway", "Identity", "Landing"]
  },
  {
    name: "Austral Beacon AI Lab",
    summary: "Technical prototype area for dashboards, evidence systems, source monitoring, and future AI/RAG workflows.",
    tags: ["AI Lab", "RAG", "Prototype"]
  }
];

const focusAreas = [
  ["Puerto Williams", "Southern city and Antarctic gateway context for logistics, culture, routes, and field interpretation."],
  ["Cape Horn", "Maritime symbol, route marker, weather frontier, and documentary geography anchor."],
  ["Patagonia", "Regional frame for maps, travel intelligence, infrastructure, conservation, and long-form storytelling."],
  ["Antarctic gateways", "Ports, air links, research routes, cruise corridors, and public-source operational evidence."],
  ["Maritime routes", "Channels, straits, crossings, expedition paths, and historical route intelligence."],
  ["Maps and archives", "Cartographic references, screenshots, source notes, Wayback captures, and public evidence trails."]
];

function tagMarkup(tags) {
  return `<div class="tag-row">${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>`;
}

function renderProjects() {
  const grid = document.getElementById("project-grid");
  grid.innerHTML = projects
    .map((project) => `
      <article class="card">
        <h3>${project.name}</h3>
        <p>${project.summary}</p>
        ${tagMarkup(project.tags)}
      </article>
    `)
    .join("");
}

function renderFocusAreas() {
  const grid = document.getElementById("focus-grid");
  grid.innerHTML = focusAreas
    .map(([name, summary]) => `
      <article class="focus-card">
        <h3>${name}</h3>
        <p>${summary}</p>
      </article>
    `)
    .join("");
}

function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function setYear() {
  const year = document.getElementById("year");
  year.textContent = `${new Date().getFullYear()} / Static prototype`;
}

renderProjects();
renderFocusAreas();
setupNavigation();
setYear();
