const projects = [
  {
    name: "Austral Beacon",
    summary: "Umbrella intelligence and publishing layer for the southern ecosystem.",
    tags: ["AI Lab", "RAG", "Evidence"]
  },
  {
    name: "Antarctic Pulse",
    summary: "Signals, explainers, and monitoring around Antarctic science and policy.",
    tags: ["Science", "Policy", "Signals"]
  },
  {
    name: "End of the World Atlas",
    summary: "Cartographic storytelling and place-based reference for Tierra del Fuego and beyond.",
    tags: ["Maps", "Geography", "Archive"]
  },
  {
    name: "End of the World Travel",
    summary: "English-language travel intelligence with a sober gateway-to-Antarctica voice.",
    tags: ["Travel", "Editorial", "English"]
  },
  {
    name: "Fin del Mundo Travel",
    summary: "Spanish-language regional travel layer for routes, guides, and infrastructure.",
    tags: ["Travel", "Spanish", "Regional"]
  },
  {
    name: "Antarctica Begins",
    summary: "Public-facing narrative around southern departure points and Antarctic access.",
    tags: ["Gateway", "Brand", "Landing"]
  }
];

const monitors = [
  ["Puerto Williams", "Gateway city, port context, field logistics, cultural and tourism signals."],
  ["Cape Horn", "Maritime identity, weather exposure, conservation context, route narratives."],
  ["Diego Ramirez Islands", "Remote island geography, biodiversity, sovereignty, and ocean monitoring."],
  ["Strait of Magellan", "Navigation corridor, infrastructure, port systems, and historical geography."],
  ["Beagle Channel", "Shared waterway, cruise movement, local routes, and environmental context."],
  ["Ruta Vicuna-Yendegaia", "Road access, protected-area interpretation, and southern mobility updates."],
  ["Punta Arenas", "Regional capital, air and port hub, logistics, research, and tourism services."],
  ["Antarctic routes", "Cruise, air-cruise, research, and policy context for Antarctic access."]
];

const queueItems = [
  {
    type: "article",
    title: "Why Puerto Williams Matters to Antarctic Gateway Narratives",
    status: "Draft brief",
    owner: "Editorial"
  },
  {
    type: "social",
    title: "Cape Horn: Maritime Geography, Not Travel Mythology",
    status: "Storyboard",
    owner: "Social"
  },
  {
    type: "reel",
    title: "Beagle Channel Route Context in 30 Seconds",
    status: "Shot list",
    owner: "Video"
  },
  {
    type: "map",
    title: "Southern Gateway Transect: Punta Arenas to Antarctic Routes",
    status: "Source map",
    owner: "Cartography"
  },
  {
    type: "newsletter",
    title: "Future Dispatch: Southern Signals and Source Watch",
    status: "Placeholder",
    owner: "RAG"
  }
];

const sources = [
  ["INACH", "Chilean Antarctic Institute research programs, announcements, and public science context."],
  ["Armada de Chile", "Maritime notices, navigation context, hydrographic references, and official operations."],
  ["Sernatur", "Official tourism guidance, regional promotion, destination pages, and travel data."],
  ["NASA", "Earth observation, climate datasets, satellite imagery, and polar research material."],
  ["NOAA", "Oceanic, atmospheric, ice, climate, and monitoring datasets for southern waters."],
  ["Antarctic Treaty", "Governance, environmental protocol context, meetings, measures, and official documents."],
  ["Regional Government Sources", "Magallanes policy, infrastructure, development, and public announcements."],
  ["Official Tourism Sources", "Municipal, protected-area, port, airport, and route-level visitor information."],
  ["Infrastructure Sources", "Transport, port, road, and service updates relevant to field and travel planning."]
];

const evidence = [
  {
    name: "Live Properties",
    summary: "Current public proof points for the Austral Beacon Media ecosystem.",
    links: [
      ["Lovable concept landing", "https://austral-beacon.lovable.app/"],
      ["Intelligence Dashboard", "https://austral-beacon-media-dashboard.vercel.app"],
      ["GitHub repository", "https://github.com/Alestelu1/austral-beacon-ai-lab"]
    ]
  },
  {
    name: "Domain Placeholders",
    summary: "Candidate and ecosystem domains to track as brand evidence matures.",
    links: [
      ["endoftheworldatlas.com", "https://endoftheworldatlas.com"],
      ["endoftheworld.travel", "https://endoftheworld.travel"],
      ["findelmundo.travel", "https://findelmundo.travel"],
      ["antarcticpulse.com", "https://antarcticpulse.com"],
      ["antarcticabegins.com", "https://antarcticabegins.com"]
    ]
  },
  {
    name: "Social Accounts",
    summary: "Record handles, bios, launch status, visual identity, and platform ownership."
  },
  {
    name: "Landing Pages",
    summary: "Archive launch pages, copy direction, forms, analytics, and deployment history."
  },
  {
    name: "Screenshots",
    summary: "Store dated captures of dashboards, pages, maps, and social profiles."
  },
  {
    name: "Wayback Machine Captures",
    summary: "Preserve public proof of publication, brand evolution, and historical availability."
  }
];

const actions = [
  ["Publish static dashboard to Vercel", "Deploy the plain HTML/CSS/JS prototype as the first public dashboard."],
  ["Add project data", "Replace sample text with ownership, status, URLs, and publication notes."],
  ["Connect official source links", "Attach real source URLs and retrieval notes for each RAG placeholder."],
  ["Add content queue data", "Move article, social, reel, map, and newsletter items into a reusable JSON file."],
  ["Capture brand evidence", "Add screenshots, domains, social accounts, landing pages, repos, and Wayback captures."],
  ["Connect APIs later", "Plan weather, ocean, maps, tourism, repository, and publishing status integrations."],
  ["Integrate AI agents later", "Prepare agent workflows for source monitoring, drafting, QA, and retrieval."]
];

function renderCards(containerId, items, template) {
  const container = document.getElementById(containerId);
  container.innerHTML = items.map(template).join("");
}

function tagMarkup(tags) {
  return `<div class="tag-row">${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>`;
}

function evidenceLinksMarkup(links = []) {
  if (!links.length) {
    return "";
  }

  return `<div class="tag-row">${links
    .map(([label, url]) => `<a class="tag" href="${url}" target="_blank" rel="noopener">${label}</a>`)
    .join("")}</div>`;
}

function renderDashboard() {
  renderCards("project-grid", projects, (project) => `
    <article class="card">
      <h3>${project.name}</h3>
      <p>${project.summary}</p>
      ${tagMarkup(project.tags)}
    </article>
  `);

  renderCards("monitor-grid", monitors, ([name, summary]) => `
    <article class="monitor-card">
      <h3>${name}</h3>
      <p>${summary}</p>
    </article>
  `);

  renderCards("queue-grid", queueItems, (item) => `
    <article class="queue-card" data-type="${item.type}">
      <div>
        <span class="queue-type">${item.type}</span>
        <h3>${item.title}</h3>
        <p class="status">${item.status}</p>
      </div>
      <div class="queue-meta">
        <span>${item.owner}</span>
        <span>Sample</span>
      </div>
    </article>
  `);

  renderCards("source-grid", sources, ([name, summary]) => `
    <article class="source-card">
      <h3>${name}</h3>
      <p>${summary}</p>
    </article>
  `);

  renderCards("evidence-grid", evidence, (item) => `
    <article class="evidence-card">
      <h3>${item.name}</h3>
      <p>${item.summary}</p>
      ${evidenceLinksMarkup(item.links)}
    </article>
  `);

  renderCards("checklist", actions, ([label, summary], index) => `
    <label class="check-item">
      <input type="checkbox" data-action-index="${index}">
      <span><strong>${label}</strong><span>${summary}</span></span>
    </label>
  `);
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

function setupFilters() {
  const buttons = document.querySelectorAll(".filter-button");
  const cards = document.querySelectorAll(".queue-card");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      buttons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      cards.forEach((card) => {
        const isVisible = filter === "all" || card.dataset.type === filter;
        card.hidden = !isVisible;
      });
    });
  });
}

function setupChecklist() {
  const boxes = document.querySelectorAll(".check-item input");
  const progressValue = document.getElementById("progress-value");
  const progressBar = document.getElementById("progress-bar");
  const progressNote = document.getElementById("progress-note");

  function updateProgress() {
    const complete = [...boxes].filter((box) => box.checked).length;
    const percent = Math.round((complete / boxes.length) * 100);
    progressValue.textContent = `${percent}%`;
    progressBar.style.width = `${percent}%`;
    progressNote.textContent =
      complete === boxes.length
        ? "Prototype checklist complete. Ready for a stronger public iteration."
        : `${complete} of ${boxes.length} actions marked complete.`;
  }

  boxes.forEach((box) => box.addEventListener("change", updateProgress));
  updateProgress();
}

function setTimestamp() {
  const timestamp = document.getElementById("timestamp");
  const formatted = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(new Date());

  timestamp.textContent = `Opened ${formatted}`;
}

renderDashboard();
setupNavigation();
setupFilters();
setupChecklist();
setTimestamp();
