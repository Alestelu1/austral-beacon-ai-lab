const networkProjects = [
  {
    name: "End of the World Atlas",
    summary: "A serious cartographic and editorial atlas for Tierra del Fuego, Patagonia, maritime routes, and remote southern geography.",
    tags: ["Atlas", "Maps", "Archive"]
  },
  {
    name: "Antarctic Pulse",
    summary: "Signals, explainers, and source-led context around Antarctic science, policy, climate, logistics, and routes.",
    tags: ["Antarctica", "Signals", "Policy"]
  },
  {
    name: "End of the World Travel",
    summary: "English-language travel intelligence for Patagonia, Cape Horn approaches, expedition routes, and Antarctic gateway context.",
    tags: ["Travel", "English", "Routes"]
  },
  {
    name: "Fin del Mundo Travel",
    summary: "Spanish-language regional travel and interpretation layer for southern places, infrastructure, services, and route planning.",
    tags: ["Travel", "Spanish", "Regional"]
  },
  {
    name: "Antarctica Begins",
    summary: "A narrative gateway brand for Antarctic departure points, southern ports, and the geography of access.",
    tags: ["Gateway", "Landing", "Identity"]
  },
  {
    name: "Austral Beacon AI Lab",
    summary: "The technical prototype area for dashboards, evidence systems, official-source monitoring, and future AI/RAG workflows.",
    tags: ["AI Lab", "RAG", "Prototype"]
  }
];

const southernRoutes = [
  ["Strait of Magellan", "A historical and operational maritime corridor connecting Atlantic, Pacific, ports, weather, and regional infrastructure."],
  ["Beagle Channel", "A southern waterway for local navigation, expedition departures, border geography, and documentary route context."],
  ["Puerto Williams", "A subantarctic city and gateway node for culture, logistics, research, and Antarctic-facing narratives."],
  ["Cape Horn", "A symbolic and physical maritime threshold shaped by weather, navigation, memory, and conservation."],
  ["Diego Ramirez", "Remote islands anchoring biodiversity, ocean exposure, sovereignty, and the far southern map."],
  ["Antarctic gateways", "Ports, air links, cruise corridors, research routes, and evidence trails connecting Patagonia to Antarctica."]
];

function tagMarkup(tags) {
  return `<div class="tag-row">${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>`;
}

function renderNetwork() {
  const grid = document.getElementById("network-grid");
  grid.innerHTML = networkProjects
    .map((project) => `
      <article class="network-card">
        <h3>${project.name}</h3>
        <p>${project.summary}</p>
        ${tagMarkup(project.tags)}
      </article>
    `)
    .join("");
}

function renderRoutes() {
  const grid = document.getElementById("routes-grid");
  grid.innerHTML = southernRoutes
    .map(([name, summary]) => `
      <article class="route-card">
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
  year.textContent = `${new Date().getFullYear()} / Landing v2`;
}

renderNetwork();
renderRoutes();
setupNavigation();
setYear();
