function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");

function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

// ==========================================================================
// 1. LAMP PULL-CHAIN SOUND EFFECT (WEB AUDIO API)
// ==========================================================================
let audioCtx = null;

function playLampSwitchSound(toLightMode = false) {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        if (!audioCtx) audioCtx = new AudioContextClass();
        if (audioCtx.state === "suspended") audioCtx.resume();

        const now = audioCtx.currentTime;

        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = "triangle";
        osc1.frequency.setValueAtTime(toLightMode ? 1450 : 1120, now);
        osc1.frequency.exponentialRampToValueAtTime(240, now + 0.032);
        gain1.gain.setValueAtTime(0.18, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + 0.04);

        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(toLightMode ? 680 : 480, now + 0.025);
        osc2.frequency.exponentialRampToValueAtTime(150, now + 0.075);
        gain2.gain.setValueAtTime(0.14, now + 0.025);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start(now + 0.025);
        osc2.stop(now + 0.085);
    } catch {
        // Ignore audio restrictions if blocked
    }
}

// ==========================================================================
// 2. LAZY RESUME, LAZY SECTION HYDRATION & ONE-WAY SECTION REVEAL
// ==========================================================================
function initLazyResume() {
    const resumeLink = document.getElementById("lazyResumeLink");
    if (!resumeLink) return;

    const resumePath = resumeLink.getAttribute("data-lazy-resume") || "assets/RESUME.pdf";
    let loaded = false;

    function prepareResume() {
        if (loaded) return;
        loaded = true;
        resumeLink.setAttribute("href", resumePath);
        resumeLink.dataset.resumeReady = "true";
    }

    resumeLink.addEventListener("pointerenter", prepareResume, { once: true });
    resumeLink.addEventListener("focus", prepareResume, { once: true });
    resumeLink.addEventListener("click", () => {
        prepareResume();
        showToast("Preparing Devaganga_Resume.pdf...");
    });

    if ("IntersectionObserver" in window) {
        const resumeObserver = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    prepareResume();
                    resumeObserver.disconnect();
                }
            },
            { rootMargin: "220px" }
        );
        resumeObserver.observe(resumeLink);
    } else {
        prepareResume();
    }
}

const lazyFadeObserver = new IntersectionObserver(
    (entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-clear");
                obs.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.05, rootMargin: "40px 0px 0px 0px" }
);

function registerLazyFadeElements() {
    document.querySelectorAll(".lazy-fade").forEach((el) => {
        if (!el.classList.contains("is-clear")) {
            lazyFadeObserver.observe(el);
        }
    });
}

// ==========================================================================
// 3. SWINGING PULL-CORD ("pull the cord!") DARK / LIGHT MODE TOGGLE + SOUND
// ==========================================================================
const cordWrap = document.getElementById("cordToggleWrap");
const cordBtn = document.getElementById("cordToggleBtn");
const cordLine = document.getElementById("cordLine");

function applyTheme(theme) {
    const isLight = theme === "light";
    document.documentElement.setAttribute("data-theme", isLight ? "light" : "dark");
    cordBtn?.setAttribute("aria-pressed", String(isLight));
    try {
        localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
    } catch {
        // Ignore storage restrictions
    }
}

function triggerCordSwing() {
    if (!cordWrap) return;
    cordWrap.classList.remove("is-swinging");
    void cordWrap.offsetWidth;
    cordWrap.classList.add("is-swinging");
}

function toggleThemeFromCord() {
    const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    triggerCordSwing();
    playLampSwitchSound(next === "light");
}

(function initSavedTheme() {
    let saved = "dark";
    try {
        saved = localStorage.getItem("portfolio-theme") || "dark";
    } catch {
        saved = "dark";
    }
    applyTheme(saved);
})();

cordBtn?.addEventListener("click", toggleThemeFromCord);

let cordPullStartY = null;
cordBtn?.addEventListener("pointerdown", (e) => {
    cordPullStartY = e.clientY;
});

window.addEventListener("pointermove", (e) => {
    if (cordPullStartY === null || !cordLine) return;
    const baseHeight = window.innerWidth <= 780 ? 62 : 88;
    const pullDelta = Math.max(0, Math.min(46, e.clientY - cordPullStartY));
    cordLine.style.height = `${baseHeight + pullDelta}px`;
});

window.addEventListener("pointerup", (e) => {
    if (cordPullStartY === null) return;
    const pulled = e.clientY - cordPullStartY;
    cordPullStartY = null;
    if (cordLine) cordLine.style.height = "";
    if (pulled > 16) {
        toggleThemeFromCord();
    }
});

// ==========================================================================
// 4. ABOUT — WORD-BY-WORD SCROLL HIGHLIGHT
// ==========================================================================
const aboutProseEl = document.querySelector("[data-about-prose]");
let aboutWordEls = [];

function setupAboutWordHighlight() {
    if (!aboutProseEl) return;
    const rawText = (aboutProseEl.textContent || "").trim().replace(/\s+/g, " ");
    const words = rawText.split(" ");
    aboutProseEl.innerHTML = words
        .map((w, i) => `<span class="about-word" data-w-idx="${i}">${escapeHtml(w)}</span>`)
        .join(" ");
    aboutWordEls = Array.from(aboutProseEl.querySelectorAll(".about-word"));
    updateAboutWordHighlight();
}

function updateAboutWordHighlight() {
    if (!aboutProseEl || aboutWordEls.length === 0) return;
    const rect = aboutProseEl.getBoundingClientRect();
    const vh = window.innerHeight || 800;

    const startLine = vh * 0.85;
    const endLine = vh * 0.28;
    const rawProgress = (startLine - rect.top) / Math.max(startLine - endLine, 1);
    const progress = Math.max(0, Math.min(1, rawProgress));
    const litCount = Math.round(progress * aboutWordEls.length);

    aboutWordEls.forEach((wordEl, idx) => {
        wordEl.classList.toggle("is-lit", idx < litCount);
        wordEl.classList.toggle("is-current", idx === litCount - 1 && litCount > 0);
    });
}

window.addEventListener("scroll", updateAboutWordHighlight, { passive: true });
window.addEventListener("resize", updateAboutWordHighlight);

// ==========================================================================
// 5. INTERACTIVE SKILL GLOBE (ICON ON TOP + LABEL BELOW, ACTUAL COLORS, REPULSION)
// ==========================================================================
const GLOBE_DOMAINS = ["All", "Data & ML", "Backend & DB", "Frontend & UI", "Tools & Cloud", "Design & AI"];

const GLOBE_SKILLS = [
    { name: "Python", domain: "Data & ML", iconClass: "fab fa-python", color: "#3776AB", note: "Core scripting, data workflows, Flask backends, and ML models." },
    { name: "Pandas", domain: "Data & ML", iconClass: "fas fa-table", color: "#150458", note: "Data cleaning, transformation, and tabular dataset analysis." },
    { name: "Scikit-learn", domain: "Data & ML", iconClass: "fas fa-brain", color: "#F7931E", note: "Classification and predictive modeling workflows." },
    { name: "Flask", domain: "Backend & DB", iconClass: "fas fa-flask", color: "#00B4D8", note: "Lightweight Python web apps, routing, and API endpoints." },
    { name: "MySQL", domain: "Backend & DB", iconClass: "fas fa-database", color: "#4479A1", note: "Relational database schemas, SQL queries, and application storage." },
    { name: "Postgres", domain: "Backend & DB", iconClass: "fas fa-server", color: "#4169E1", note: "Relational database management and structured SQL querying." },
    { name: "React", domain: "Frontend & UI", iconClass: "fab fa-react", color: "#61DAFB", note: "Component-based UI development and interactive interfaces." },
    { name: "JavaScript", domain: "Frontend & UI", iconClass: "fab fa-js", color: "#F7DF1E", note: "Client-side interactivity, DOM updates, and dynamic UI logic." },
    { name: "HTML5", domain: "Frontend & UI", iconClass: "fab fa-html5", color: "#E34F26", note: "Semantic page structure and accessible markup." },
    { name: "CSS3", domain: "Frontend & UI", iconClass: "fab fa-css3-alt", color: "#1572B6", note: "Responsive layouts, custom styling, and motion transitions." },
    { name: "Git", domain: "Tools & Cloud", iconClass: "fab fa-git-alt", color: "#F05032", note: "Version control, branching, and code history management." },
    { name: "GitHub", domain: "Tools & Cloud", iconClass: "fab fa-github", color: "#8B5CF6", note: "Repository hosting, collaboration, and deployment workflows." },
    { name: "VS Code", domain: "Tools & Cloud", iconClass: "fas fa-code", color: "#007ACC", note: "Primary editor for web builds, Python/Flask APIs, and debugging." },
    { name: "Vercel", domain: "Tools & Cloud", iconClass: "fas fa-cloud-arrow-up", color: "#14B8A6", note: "Cloud web deployment and live project previews." },
    { name: "PythonAnywhere", domain: "Tools & Cloud", iconClass: "fas fa-cloud", color: "#3B82F6", note: "Hosting Python and Flask web applications online." },
    {
        name: "ChatGPT",
        domain: "Design & AI",
        svgIcon: `<svg class="globe-node-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a4.2 4.2 0 0 1 3.64 2.1l1.5 2.6 3-.86a4.2 4.2 0 0 1 4.46 2.38 4.2 4.2 0 0 1-1.1 5.02l-2.2 1.9.78 3.02a4.2 4.2 0 0 1-3.05 5.13 4.2 4.2 0 0 1-4.88-2.05l-1.5-2.6-3 .86a4.2 4.2 0 0 1-4.46-2.38 4.2 4.2 0 0 1 1.1-5.02l2.2-1.9-.78-3.02A4.2 4.2 0 0 1 7.4 3.17a4.2 4.2 0 0 1 4.6-.17Z"/><circle cx="12" cy="12" r="2.3"/></svg>`,
        color: "#10A37F",
        note: "Rapid prototyping, debugging support, and workflow brainstorming."
    },
    { name: "Gemini", domain: "Design & AI", iconClass: "fas fa-wand-magic-sparkles", color: "#4796E3", note: "UI iteration, code review, technical synthesis, and design polish." },
    { name: "UML", domain: "Design & AI", iconClass: "fas fa-diagram-project", color: "#EC4899", note: "System structure, flow diagrams, and software design modeling." }
];

let globeInitialized = false;

function renderSkillGlobe() {
    if (globeInitialized) return;
    const domainBar = document.getElementById("globeDomainBar");
    const chamber = document.getElementById("skillGlobeChamber");
    const layer = document.getElementById("globeNodesLayer");
    if (!domainBar || !chamber || !layer) return;
    globeInitialized = true;

    const titleEl = document.getElementById("globeSelectedTitle");
    const domainEl = document.getElementById("globeSelectedDomain");
    const noteEl = document.getElementById("globeSelectedNote");

    let selectedSkill = GLOBE_SKILLS[0];

    const nodesState = GLOBE_SKILLS.map((skill, i) => {
        const angle = (i / GLOBE_SKILLS.length) * Math.PI * 2 + (i % 3) * 0.25;
        const radiusFactor = 0.2 + ((i * 23) % 55) / 100;
        return {
            skill,
            nx: 0.5 + Math.cos(angle) * radiusFactor * 0.72,
            ny: 0.5 + Math.sin(angle) * radiusFactor * 0.72,
            vx: Math.cos(angle + 1.2) * 0.00028,
            vy: Math.sin(angle - 0.8) * 0.00028
        };
    });

    function updateInspector(skill) {
        if (!skill) return;
        selectedSkill = skill;
        if (titleEl) titleEl.textContent = skill.name;
        if (domainEl) domainEl.textContent = skill.domain;
        if (noteEl) noteEl.textContent = skill.note;

        layer.querySelectorAll(".globe-node").forEach((btn) => {
            btn.classList.toggle("is-selected", btn.dataset.skill === skill.name);
        });
    }

    function applyDomainFilter(domain) {
        domainBar.querySelectorAll(".domain-chip-btn").forEach((b) => {
            b.classList.toggle("is-active", b.dataset.domain === domain);
        });

        layer.querySelectorAll(".globe-node").forEach((btn) => {
            const nodeDomain = btn.dataset.domain;
            const isMatch = domain === "All" || nodeDomain === domain;
            btn.classList.toggle("is-dimmed", !isMatch);
        });
    }

    domainBar.innerHTML = GLOBE_DOMAINS.map((d) => `
        <button type="button" class="domain-chip-btn ${d === "All" ? "is-active" : ""}" data-domain="${escapeHtml(d)}">
            ${escapeHtml(d)}
        </button>
    `).join("");

    domainBar.querySelectorAll(".domain-chip-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            applyDomainFilter(btn.dataset.domain || "All");
        });
    });

    layer.innerHTML = nodesState.map((item) => {
        const iconMarkup = item.skill.svgIcon
            ? item.skill.svgIcon
            : `<i class="${escapeHtml(item.skill.iconClass)} globe-node-icon" aria-hidden="true"></i>`;

        return `
            <button
                type="button"
                class="globe-node"
                data-skill="${escapeHtml(item.skill.name)}"
                data-domain="${escapeHtml(item.skill.domain)}"
                style="left:${(item.nx * 100).toFixed(1)}%;top:${(item.ny * 100).toFixed(1)}%;--icon-color:${escapeHtml(item.skill.color)};"
            >
                ${iconMarkup}
                <span class="globe-node-label">${escapeHtml(item.skill.name)}</span>
            </button>
        `;
    }).join("");

    const nodeButtons = Array.from(layer.querySelectorAll(".globe-node"));
    let draggingIndex = null;
    let movedDuringDrag = false;

    nodeButtons.forEach((btn, idx) => {
        btn.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            draggingIndex = idx;
            movedDuringDrag = false;
            updateInspector(nodesState[idx].skill);
            btn.setPointerCapture?.(e.pointerId);
        });

        btn.addEventListener("click", () => {
            if (!movedDuringDrag) {
                updateInspector(nodesState[idx].skill);
            }
        });
    });

    chamber.addEventListener("pointermove", (e) => {
        if (draggingIndex === null) return;
        movedDuringDrag = true;
        const rect = chamber.getBoundingClientRect();
        let px = (e.clientX - rect.left) / rect.width;
        let py = (e.clientY - rect.top) / rect.height;

        const dx = px - 0.5;
        const dy = py - 0.5;
        const dist = Math.hypot(dx, dy);
        const maxR = 0.39;
        if (dist > maxR) {
            px = 0.5 + (dx / dist) * maxR;
            py = 0.5 + (dy / dist) * maxR;
        }

        nodesState[draggingIndex].nx = px;
        nodesState[draggingIndex].ny = py;
        nodesState[draggingIndex].vx = 0;
        nodesState[draggingIndex].vy = 0;
    });

    const releaseDrag = () => {
        draggingIndex = null;
    };
    chamber.addEventListener("pointerup", releaseDrag);
    chamber.addEventListener("pointercancel", releaseDrag);

    function stepGlobe() {
        const minSpacing = 0.135;

        for (let i = 0; i < nodesState.length; i++) {
            for (let j = i + 1; j < nodesState.length; j++) {
                const a = nodesState[i];
                const b = nodesState[j];
                const dx = b.nx - a.nx;
                const dy = b.ny - a.ny;
                const dist = Math.hypot(dx, dy) || 0.0001;
                if (dist < minSpacing) {
                    const overlap = (minSpacing - dist) * 0.55;
                    const ux = dx / dist;
                    const uy = dy / dist;

                    if (draggingIndex !== i) {
                        a.nx -= ux * overlap;
                        a.ny -= uy * overlap;
                        a.vx -= ux * 0.0009;
                        a.vy -= uy * 0.0009;
                    }
                    if (draggingIndex !== j) {
                        b.nx += ux * overlap;
                        b.ny += uy * overlap;
                        b.vx += ux * 0.0009;
                        b.vy += uy * 0.0009;
                    }
                }
            }
        }

        nodesState.forEach((item, idx) => {
            if (idx !== draggingIndex) {
                item.nx += item.vx;
                item.ny += item.vy;
                item.vx *= 0.992;
                item.vy *= 0.992;

                const speed = Math.hypot(item.vx, item.vy);
                if (speed < 0.00016) {
                    const driftAngle = idx * 1.15 + performance.now() * 0.0002;
                    item.vx += Math.cos(driftAngle) * 0.000035;
                    item.vy += Math.sin(driftAngle) * 0.000035;
                }
            }

            const dx = item.nx - 0.5;
            const dy = item.ny - 0.5;
            const dist = Math.hypot(dx, dy);
            const maxR = 0.39;
            if (dist > maxR) {
                item.nx = 0.5 + (dx / dist) * maxR;
                item.ny = 0.5 + (dy / dist) * maxR;
                const nx = dx / (dist || 1);
                const ny = dy / (dist || 1);
                const dot = item.vx * nx + item.vy * ny;
                item.vx -= 2 * dot * nx;
                item.vy -= 2 * dot * ny;
            }

            const el = nodeButtons[idx];
            if (el) {
                el.style.left = `${(item.nx * 100).toFixed(2)}%`;
                el.style.top = `${(item.ny * 100).toFixed(2)}%`;
            }
        });

        requestAnimationFrame(stepGlobe);
    }

    updateInspector(selectedSkill);
    applyDomainFilter("All");
    requestAnimationFrame(stepGlobe);
}

// ==========================================================================
// 6. PROJECTS (LAZY HYDRATED + HOVER-ONLY RING + RIPPLE + BEAM FROM CARD)
// ==========================================================================
const TECH_ICON_MAP = {
    "Python": "fab fa-python",
    "Flask": "fas fa-flask",
    "SQLite": "fas fa-database",
    "TMDB API": "fas fa-film",
    "Pandas": "fas fa-table",
    "Scikit-learn": "fas fa-brain",
    "Leaflet.js": "fas fa-map-location-dot",
    "MySQL": "fas fa-database",
    "Chart.js": "fas fa-chart-line",
    "HTML5/CSS3": "fab fa-html5",
    "JavaScript": "fab fa-js"
};

const PROJECTS = [
    {
        slot: "01",
        title: "Movie Recommendation Engine",
        period: "Jun 2026 · Individual Project",
        description: "Full-stack movie recommendation app with user authentication, personalized watchlists, and TMDB API search, trailers, and recommendations.",
        image: "./assets/movie-rec.png",
        tech: ["Python", "Flask", "SQLite", "TMDB API", "Pandas", "Scikit-learn"],
        liveUrl: "https://devagangas.pythonanywhere.com/"
    },
    {
        slot: "02",
        title: "EV Explorer",
        period: "Oct 2025 · Academic Project",
        description: "Map-based analytics app built with Flask and Leaflet.js to explore EV registrations, predict range, and inspect charging stations.",
        image: "",
        tech: ["Python", "Flask", "Pandas", "Scikit-learn", "Leaflet.js"],
        liveUrl: ""
    },
    {
        slot: "03",
        title: "ChurnIQ – Customer Churn Intelligence & Risk Engine",
        period: "Aug 2026 – Sep 2026 · Individual Project",
        description: "Customer churn prediction platform using a Random Forest model on telecom records, MySQL storage, Chart.js analytics, and CSV export.",
        image: "./assets/churn-iq.png",
        tech: ["Python", "Flask", "Scikit-learn", "MySQL", "Chart.js", "HTML5/CSS3", "JavaScript"],
        liveUrl: "https://customer-churn-intelligence-hk5h.vercel.app/"
    }
];

let projectsInitialized = false;

function renderTechLogos(techList = []) {
    return techList.map((name) => {
        const iconClass = TECH_ICON_MAP[name] || "fas fa-code";
        return `<span class="tech-logo-badge" title="${escapeHtml(name)}"><i class="${iconClass}"></i></span>`;
    }).join("");
}

function renderProjects() {
    if (projectsInitialized) return;
    const container = document.getElementById("projectsShowcase");
    if (!container) return;
    projectsInitialized = true;

    container.innerHTML = PROJECTS.map((proj) => {
        const cleanUrl = (proj.liveUrl || "").trim();
        const isDeployed = Boolean(cleanUrl);

        return `
            <div class="project-3d-wrap lazy-fade">
                <div class="deploy-beacon">
                    ${isDeployed
                        ? `<a href="${escapeHtml(cleanUrl)}" target="_blank" rel="noopener noreferrer" class="deploy-url-pill">${escapeHtml(cleanUrl)}</a>`
                        : `<span class="deploy-url-pill">To Be Deployed</span>`
                    }
                    <div class="deploy-beam"></div>
                </div>

                <article class="project-card-3d">
                    <div>
                        <div class="project-preview-stage">
                            <div class="project-preview-box">
                                ${proj.image
                                    ? `<img src="${escapeHtml(proj.image)}" alt="${escapeHtml(proj.title)} preview" loading="lazy" decoding="async">`
                                    : `<div class="preview-empty"><i class="fas fa-layer-group"></i><span>PREVIEW ${escapeHtml(proj.slot)}</span></div>`
                                }
                            </div>
                            <div class="preview-emitter-ring" aria-hidden="true"></div>
                        </div>

                        <div class="project-info">
                            <div class="project-submeta">${escapeHtml(proj.period)}</div>
                            <h3>${escapeHtml(proj.title)}</h3>
                            <p>${escapeHtml(proj.description)}</p>
                        </div>
                    </div>

                    <div class="project-bottom">
                        <div class="tech-logos">${renderTechLogos(proj.tech)}</div>
                        ${isDeployed
                            ? `<a href="${escapeHtml(cleanUrl)}" target="_blank" rel="noopener noreferrer" class="preview-cta">
                                <span>Preview</span>
                                <i class="fas fa-arrow-up-right-from-square"></i>
                               </a>`
                            : `<span class="preview-cta is-pending">To Be Deployed</span>`
                        }
                    </div>
                </article>
            </div>
        `;
    }).join("");

    registerLazyFadeElements();
}

// ==========================================================================
// 7. SINGLE MILESTONES & CREDENTIALS SECTION (LAZY HYDRATED + GLOW BEAM)
// ==========================================================================
const MILESTONE_ITEMS = [
    {
        id: "supraja",
        tag: "INTERNSHIP • STAGE 01",
        title: "Cybersecurity Intern & Certificate",
        org: "Supraja Technologies",
        year: "2025",
        meta: "May – Jul 2025 · Remote",
        logoUrl: "./assets/supraja-tech.png",
        fallbackIcon: "fa-shield-halved",
        description: "Explored common cybersecurity threats, preventive measures, vulnerability assessments, information-gathering tools, and web security.",
        pdfUrl: "./assets/supraja.pdf",
        pdfLabel: "Internship Certificate"
    },
    {
        id: "just-rise",
        tag: "INTERNSHIP • STAGE 02",
        title: "Software Development Intern & Certificate",
        org: "Just Rise Technologies W.L.L.",
        year: "2026",
        meta: "Jan – Jul 2026 · Bahrain",
        logoUrl: "./assets/just-rise.png",
        fallbackIcon: "fa-code",
        description: "Six-month software development internship working on application features and collaborative engineering workflows.",
        pdfUrl: "./assets/just-rise.pdf",
        pdfLabel: "Internship Certificate"
    },
    {
        id: "scaler-dbms",
        tag: "VERIFIED CREDENTIAL",
        title: "DBMS – Master Fundamentals & Advanced Concepts",
        org: "Scaler",
        year: "May 2026",
        meta: "Relational Databases & SQL",
        logoUrl: "./assets/scaler.png",
        fallbackIcon: "fa-database",
        description: "Completed database management systems coursework covering relational modeling, normalization, indexing, and SQL queries.",
        pdfUrl: "",
        pdfLabel: "DBMS Certificate"
    }
];

let milestonesInitialized = false;

function renderCompanySlot(item) {
    if (item.logoUrl && item.logoUrl.trim()) {
        return `
            <span class="company-badge-slot" title="${escapeHtml(item.org)}">
                <img
                    src="${escapeHtml(item.logoUrl.trim())}"
                    alt="${escapeHtml(item.org)} icon"
                    loading="lazy"
                    decoding="async"
                    onerror="this.style.display='none';this.nextElementSibling.style.display='inline-flex';"
                >
                <i class="fas ${escapeHtml(item.fallbackIcon)}" style="display:none;" aria-hidden="true"></i>
            </span>
        `;
    }
    return `
        <span class="company-badge-slot" title="${escapeHtml(item.org)}">
            <i class="fas ${escapeHtml(item.fallbackIcon)}" aria-hidden="true"></i>
        </span>
    `;
}

function renderMilestonesTimeline() {
    if (milestonesInitialized) return;
    const rowsEl = document.getElementById("altGlowRows");
    if (!rowsEl) return;
    milestonesInitialized = true;

    rowsEl.innerHTML = MILESTONE_ITEMS.map((item, idx) => {
        const sideClass = idx % 2 === 0 ? "is-left" : "is-right";
        const actionHtml = item.pdfUrl && item.pdfUrl.trim()
            ? `<a href="${escapeHtml(item.pdfUrl.trim())}" target="_blank" rel="noopener noreferrer" class="cert-pdf-btn">
                <i class="far fa-file-lines"></i>
                <span>${escapeHtml(item.pdfLabel)}</span>
                <span class="pdf-chip">PDF</span>
               </a>`
            : `<button type="button" class="cert-pdf-btn" data-cert-slot="${escapeHtml(item.title)}">
                <i class="far fa-file-lines"></i>
                <span>${escapeHtml(item.pdfLabel)}</span>
                <span class="pdf-chip">PDF</span>
               </button>`;

        return `
            <article class="alt-glow-row ${sideClass} lazy-fade ${idx === 0 ? "is-lit" : ""}" data-ms-row="${idx}">
                <div class="alt-glow-card">
                    <div class="alt-glow-head">
                        ${renderCompanySlot(item)}
                        <div>
                            <span class="alt-glow-tag">${escapeHtml(item.tag)}</span>
                            <h3>${escapeHtml(item.title)}</h3>
                            <div class="alt-glow-org">${escapeHtml(item.org)}</div>
                        </div>
                    </div>
                    <p class="alt-glow-desc">${escapeHtml(item.description)}</p>
                    ${actionHtml}
                </div>

                <div class="alt-glow-year">
                    <div class="alt-year-num">${escapeHtml(item.year)}</div>
                    <div class="alt-year-meta">${escapeHtml(item.meta)}</div>
                </div>
            </article>
        `;
    }).join("");

    rowsEl.querySelectorAll("[data-cert-slot]").forEach((btn) => {
        btn.addEventListener("click", () => {
            showToast("Add pdfUrl in MILESTONE_ITEMS to link the DBMS certificate PDF");
        });
    });

    registerLazyFadeElements();
    updateScrollingBeams();
}

function updateScrollingBeams() {
    const anchor = window.innerHeight * 0.5;

    const eduShell = document.getElementById("educationTimeline");
    const eduFill = document.getElementById("timelineFill");
    const eduDot = document.getElementById("timelineGlowDot");
    const eduNodes = document.querySelectorAll(".edu-node");

    if (eduShell && eduFill && eduDot) {
        const rect = eduShell.getBoundingClientRect();
        const railH = Math.max(rect.height - 24, 1);
        const progress = Math.max(0, Math.min(1, (anchor - rect.top) / railH));
        const px = progress * railH;
        eduFill.style.height = `${px}px`;
        eduDot.style.top = `${12 + px}px`;

        let nearest = 0;
        let bestDist = Infinity;
        eduNodes.forEach((node, idx) => {
            const d = Math.abs(node.getBoundingClientRect().top + 36 - anchor);
            if (d < bestDist) {
                bestDist = d;
                nearest = idx;
            }
        });
        eduNodes.forEach((node, idx) => node.classList.toggle("active-node", idx === nearest));
    }

    const msShell = document.getElementById("altGlowTimeline");
    const msBeam = document.getElementById("altSpineBeam");
    const msOrb = document.getElementById("altSpineOrb");
    const msRows = document.querySelectorAll(".alt-glow-row");

    if (msShell && msBeam && msOrb) {
        const rect = msShell.getBoundingClientRect();
        const railH = Math.max(rect.height - 32, 1);
        const progress = Math.max(0, Math.min(1, (anchor - rect.top) / railH));
        const px = progress * railH;
        msBeam.style.height = `${px}px`;
        msOrb.style.top = `${px}px`;

        let nearestRow = 0;
        let bestRowDist = Infinity;
        msRows.forEach((row, idx) => {
            const d = Math.abs(row.getBoundingClientRect().top + 48 - anchor);
            if (d < bestRowDist) {
                bestRowDist = d;
                nearestRow = idx;
            }
        });
        msRows.forEach((row, idx) => row.classList.toggle("is-lit", idx === nearestRow));
    }
}

window.addEventListener("scroll", updateScrollingBeams, { passive: true });
window.addEventListener("resize", updateScrollingBeams);

// ==========================================================================
// 8. CURSOR, BACKGROUND CANVAS, LAZY SECTION OBSERVER & EMAIL
// ==========================================================================
const cursorEl = document.getElementById("customCursor");
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;

document.addEventListener("pointermove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}, { passive: true });

document.addEventListener("mouseover", (e) => {
    if (!cursorEl) return;
    const interactive = e.target.closest("a, button, input, textarea, .edu-node, .project-3d-wrap, .globe-node, .domain-chip-btn, .cert-pdf-btn, .cord-knob, .alt-glow-card");
    cursorEl.classList.toggle("is-hovering", Boolean(interactive));
});

function updateCursor() {
    if (cursorEl) {
        cursorX += (mouseX - cursorX) * 0.22;
        cursorY += (mouseY - cursorY) * 0.22;
        cursorEl.style.left = `${cursorX}px`;
        cursorEl.style.top = `${cursorY}px`;
    }
    requestAnimationFrame(updateCursor);
}
requestAnimationFrame(updateCursor);

const bgCanvas = document.getElementById("bg-stage");
const bgCtx = bgCanvas?.getContext("2d");
let bgW = 0;
let bgH = 0;
let waveNodes = [];

function resizeBg() {
    if (!bgCanvas) return;
    bgW = bgCanvas.width = window.innerWidth;
    bgH = bgCanvas.height = window.innerHeight;
    waveNodes = Array.from({ length: 16 }, (_, i) => ({
        x0: (bgW / 16) * i + bgW / 32,
        y0: bgH * (0.28 + ((i * 29) % 44) / 100),
        phase: i * 0.65
    }));
}

function renderBg(now) {
    if (!bgCtx) return;
    bgCtx.clearRect(0, 0, bgW, bgH);

    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    const strokeRgba = isLight ? "rgba(43, 89, 195, 0.14)" : "rgba(96, 165, 250, 0.12)";
    const dotRgba = isLight ? "rgba(43, 89, 195, 0.24)" : "rgba(96, 165, 250, 0.28)";

    const pts = waveNodes.map((n) => ({
        x: n.x0 + Math.cos(now * 0.0007 + n.phase) * 18,
        y: n.y0 + Math.sin(now * 0.0009 + n.phase) * 26
    }));

    bgCtx.strokeStyle = strokeRgba;
    bgCtx.lineWidth = 1;
    bgCtx.beginPath();
    pts.forEach((p, idx) => (idx === 0 ? bgCtx.moveTo(p.x, p.y) : bgCtx.lineTo(p.x, p.y)));
    bgCtx.stroke();

    bgCtx.fillStyle = dotRgba;
    pts.forEach((p) => {
        bgCtx.beginPath();
        bgCtx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        bgCtx.fill();
    });

    requestAnimationFrame(renderBg);
}

window.addEventListener("resize", resizeBg);
resizeBg();
requestAnimationFrame(renderBg);

const navLinks = document.querySelectorAll(".nav-link");
const stageSections = document.querySelectorAll(".stage-section");

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const scene = entry.target.getAttribute("data-scene") || "hero";
            const lazyKey = entry.target.getAttribute("data-lazy-section");

            if (lazyKey === "skills") renderSkillGlobe();
            if (lazyKey === "projects") renderProjects();
            if (lazyKey === "credentials") renderMilestonesTimeline();

            document.body.setAttribute("data-scene", scene);
            navLinks.forEach((a) => a.classList.toggle("active", a.dataset.nav === scene));
        });
    },
    { threshold: 0.08, rootMargin: "180px 0px 180px 0px" }
);

document.getElementById("contactForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const sender = String(new FormData(e.target).get("name") || "").trim();
    showToast(`Message received${sender ? `, ${sender}` : ""}.`);
    e.target.reset();
});

const mailBtn = document.getElementById("mailScrambleBtn");
const mailHint = document.getElementById("mailHint");
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#%&*";
let scrambleFrameId = null;

function runScramble(targetText, onComplete) {
    cancelAnimationFrame(scrambleFrameId);
    const startTime = performance.now();
    const duration = 520;

    function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const resolved = Math.floor(progress * targetText.length);
        let out = "";
        for (let i = 0; i < targetText.length; i++) {
            out += (i < resolved || targetText[i] === " ")
                ? targetText[i]
                : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        if (mailBtn) mailBtn.textContent = out;
        if (progress < 1) {
            scrambleFrameId = requestAnimationFrame(step);
        } else {
            if (mailBtn) mailBtn.textContent = targetText;
            onComplete?.();
        }
    }
    scrambleFrameId = requestAnimationFrame(step);
}

mailBtn?.addEventListener("pointerenter", () => {
    const email = mailBtn.dataset.email || "devagangasanil@gmail.com";
    runScramble(email, () => {
        if (mailHint) mailHint.textContent = "click to copy address";
    });
});

mailBtn?.addEventListener("click", async () => {
    const email = mailBtn.dataset.email || "devagangasanil@gmail.com";
    if (mailBtn) mailBtn.textContent = email;
    try {
        await navigator.clipboard.writeText(email);
        if (mailHint) mailHint.textContent = "copied to clipboard";
        showToast("Email copied.");
    } catch {
        window.location.href = `mailto:${email}`;
    }
});

// ==========================================================================
// 9. INITIALIZE
// ==========================================================================
initLazyResume();
setupAboutWordHighlight();
registerLazyFadeElements();
stageSections.forEach((sec) => sectionObserver.observe(sec));
updateScrollingBeams();