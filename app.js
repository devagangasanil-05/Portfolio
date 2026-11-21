function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// ==========================================================================
// SKILLS (LEFT-MOVING COLORED LOGO TRACK)
// ==========================================================================
const PORTFOLIO_SKILLS = [
    { name: "Python", devicon: "devicon-python-plain colored", note: "Core scripting, data workflows, Flask backends, and ML models." },
    { name: "MySQL", devicon: "devicon-mysql-plain colored", note: "Relational database schemas, SQL queries, and application storage." },
    { name: "Pandas", devicon: "devicon-pandas-plain colored", note: "Data cleaning, transformation, and tabular dataset analysis." },
    { name: "Flask", devicon: "devicon-flask-original", color: "#60A5FA", note: "Lightweight Python web apps, routing, and API endpoints." },
    { name: "Git", devicon: "devicon-git-plain colored", note: "Version control, branching, and code history management." },
    { name: "Github", devicon: "devicon-github-original", color: "#E2E8F0", note: "Repository hosting, project collaboration, and deployment workflows." },
    {name: "VS Code", tag: "IDE & Workflow", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg",devicon: "devicon-vscode-plain colored", note: "Primary code editor for web builds, Python/Flask APIs, debugging, and Git workflows."},
    { name: "Vercel", devicon: "devicon-vercel-original", color: "#FFFFFF", note: "Cloud web deployment and live project previews." },
    { name: "PythonAnywhere", tag: "Cloud Hosting", logo: "./assets/pythonanywhere.png", monogram: "PA", color: "#38BDF8", note: "Hosting Python and Flask web applications online with quick WSGI deployment." },
    { name: "ChatGPT", tag: "AI & Workflow", logo: "https://cdn.jsdelivr.net/gh/lobehub/lobe-icons@master/packages/static-png/light/openai.png", monogram: "GPT", color: "#10A37F", note: "Rapid prototyping, debugging support, and structured workflow brainstorming." },
    { name: "Gemini", tag: "AI & Research", logo: "https://cdn.jsdelivr.net/gh/lobehub/lobe-icons@master/packages/static-png/light/gemini-color.png", monogram: "GM", color: "#60A5FA", note: "UI iteration, code review, technical explanations, and analytical synthesis." },
    { name: "React", devicon: "devicon-react-original colored", note: "Component-based UI development and interactive interfaces." },
    { name: "JS", devicon: "devicon-javascript-plain colored", note: "Client-side interactivity, DOM updates, and dynamic UI logic." },
    { name: "HTML", devicon: "devicon-html5-plain colored", note: "Semantic page structure and accessible markup." },
    { name: "CSS", devicon: "devicon-css3-plain colored", note: "Responsive layouts, custom styling, and motion transitions." },
    { name: "UML Modelling", monogram: "UML", color: "#A78BFA", note: "System structure, flow diagrams, and software design modeling." },
    { name: "Java", devicon: "devicon-java-plain colored", note: "Object-oriented programming and application development." },
    { name: "Postgres", devicon: "devicon-postgresql-plain colored", note: "Relational database management and structured SQL querying." },
    { name: "API Integration", monogram: "API", color: "#34D399", note: "Connecting external services, REST endpoints, and live data feeds." },
    { name: "OOPS", monogram: "OOP", color: "#FBBF24", note: "Encapsulation, inheritance, polymorphism, and modular design." }
];

const SKILL_DOMAINS = {
    "Python": "Language & Backend",
    "MySQL": "Database",
    "Pandas": "Data Analytics",
    "Flask": "Web Framework",
    "Git": "Version Control",
    "Github": "Code & Workflows",
    "Vercel": "Cloud Deployment",
    "Pythonanywhere": "Cloud Hosting",
    "Chatgpt": "AI Workflow",
    "Gemini": "AI Workflow",
    "React": "Frontend UI",
    "JS": "Frontend & Web",
    "HTML": "Frontend & Web",
    "CSS": "UI & Styling",
    "UML Modelling": "System Design",
    "Java": "Language & OOP",
    "Postgres": "Database",
    "API Integration": "Data & Services",
    "OOPS": "Core Concepts"
};

function renderSkillTile(skill) {
    const logoContent = skill.logo && skill.logo.trim()
        ? `<img src="${escapeHtml(skill.logo.trim())}" alt="${escapeHtml(skill.name)} logo">`
        : skill.devicon
            ? `<i class="${escapeHtml(skill.devicon)}" ${skill.color ? `style="color:${escapeHtml(skill.color)}"` : ""}></i>`
            : `<span class="skill-monogram" style="color:${escapeHtml(skill.color || "#60A5FA")}">${escapeHtml(skill.monogram || "SK")}</span>`;

    return `
        <button type="button" class="skill-tile" data-skill-name="${escapeHtml(skill.name)}">
            <span class="skill-tile-logo">${logoContent}</span>
            <span class="skill-tile-name">${escapeHtml(skill.name)}</span>
        </button>
    `;
}

function renderSkillsMarquee() {
    const track = document.getElementById("skillsMarqueeTrack");
    const inspectBar = document.getElementById("skillInspectBar");
    if (!track) return;

    const doubledSkills = [...PORTFOLIO_SKILLS, ...PORTFOLIO_SKILLS];
    track.innerHTML = doubledSkills.map(renderSkillTile).join("");

    let currentIndex = -1;

    function selectSkillByIndex(idx) {
        const total = PORTFOLIO_SKILLS.length;
        currentIndex = ((idx % total) + total) % total;
        const match = PORTFOLIO_SKILLS[currentIndex];
        if (!match || !inspectBar) return;

        track.querySelectorAll(".skill-tile").forEach((el) => {
            el.classList.toggle("is-picked", el.getAttribute("data-skill-name") === match.name);
        });

        const domain = SKILL_DOMAINS[match.name] || "Technical Stack";
        inspectBar.classList.add("is-active");
        inspectBar.innerHTML = `
            <div class="skill-lens-copy">
                <div class="skill-lens-top">
                    <span class="skill-lens-name">${escapeHtml(match.name)}</span>
                    <span class="skill-lens-tag">${escapeHtml(domain)}</span>
                </div>
                <div class="skill-lens-note">${escapeHtml(match.note)}</div>
            </div>
            <div class="skill-lens-controls">
                <button type="button" class="skill-step-btn" id="skillPrevBtn" aria-label="Previous skill">← Prev</button>
                <button type="button" class="skill-step-btn" id="skillNextBtn" aria-label="Next skill">Next →</button>
            </div>
        `;

        document.getElementById("skillPrevBtn")?.addEventListener("click", () => {
            selectSkillByIndex(currentIndex - 1);
        });
        document.getElementById("skillNextBtn")?.addEventListener("click", () => {
            selectSkillByIndex(currentIndex + 1);
        });
    }

    if (inspectBar) {
        inspectBar.innerHTML = `
            <div class="skill-lens-copy">
                <div class="skill-lens-top">
                    <span class="skill-lens-name">Skill Inspector</span>
                    <span class="skill-lens-tag">${PORTFOLIO_SKILLS.length} Skills</span>
                </div>
                <div class="skill-lens-note">Hover the track to pause, click any skill card, or step through them here.</div>
            </div>
            <div class="skill-lens-controls">
                <button type="button" class="skill-step-btn" id="skillStartBtn">Explore →</button>
            </div>
        `;
        document.getElementById("skillStartBtn")?.addEventListener("click", () => selectSkillByIndex(0));
    }

    track.querySelectorAll(".skill-tile").forEach((tile) => {
        tile.addEventListener("click", () => {
            const chosenName = tile.getAttribute("data-skill-name");
            const idx = PORTFOLIO_SKILLS.findIndex((s) => s.name === chosenName);
            if (idx !== -1) {
                selectSkillByIndex(idx);
            }
        });
    });
}

// ==========================================================================
// EXPERIENCE (INTERACTIVE HORIZONTAL TIMELINE + ROLE STAGE)
// ==========================================================================
const EXPERIENCE_ROLES = [
    {
        id: "supraja",
        placeholderCode: "ST",
        logo: "./assets/supraja-tech.png",
        role: "Cybersecurity Intern",
        company: "Supraja Technologies",
        badge: "Internship",
        period: "May 2025 – July 2025 · 2 months",
        location: "Remote / Internship",
        description: "Explored common cybersecurity threats, preventive measures, and vulnerability assessment techniques. Gained hands-on exposure to information-gathering tools, basic web security, and ethical hacking through practical assignments and documented security exercises.",
        certificateLabel: "Internship Certificate",
        certificateUrl: "./assets/supraja.pdf"
    },
    {
        id: "just-rise",
        placeholderCode: "JR",
        logo: "./assets/just-rise.png",
        role: "Software Development Intern",
        company: "Just Rise Technologies W.L.L.",
        badge: "Internship",
        period: "January 2026 – July 2026 · 6 months",
        location: "Al Hidd, Kingdom of Bahrain",
        description: "Contributed to the development of various software applications and participated in related software development activities. Gained practical exposure to application development and software development workflows.",
        certificateLabel: "Internship Certificate",
        certificateUrl: "./assets/just-rise.pdf"
    }
];

function renderLogoMark(item, extraClass = "") {
    if (item.logo && item.logo.trim()) {
        return `<div class="${extraClass}"><img src="${escapeHtml(item.logo.trim())}" alt="${escapeHtml(item.company)} logo"></div>`;
    }
    return `<div class="${extraClass}" title="Logo placeholder"><span>${escapeHtml(item.placeholderCode)}</span></div>`;
}

function renderExperienceSection() {
    const trackEl = document.getElementById("expTrackBar");
    const stageEl = document.getElementById("expStageCard");
    if (!trackEl || !stageEl) return;

    let selectedIdx = EXPERIENCE_ROLES.length - 1; // Default to latest role

    function renderStage(idx) {
        const item = EXPERIENCE_ROLES[idx];
        if (!item) return;

        trackEl.querySelectorAll(".exp-milestone-btn").forEach((btn, i) => {
            const active = i === idx;
            btn.classList.toggle("is-active", active);
            btn.setAttribute("aria-selected", String(active));
        });

        stageEl.innerHTML = `
            <div class="exp-stage-head">
                <div class="exp-stage-brand">
                    ${renderLogoMark(item, "exp-stage-logo")}
                    <div>
                        <h3>${escapeHtml(item.role)}</h3>
                        <div class="exp-node-company">${escapeHtml(item.company)}</div>
                    </div>
                </div>
                <div class="exp-stage-badges">
                    <span class="exp-type-tag">${escapeHtml(item.badge)}</span>
                </div>
            </div>

            <div class="exp-meta-line">
                <span><i class="far fa-calendar"></i> ${escapeHtml(item.period)}</span>
                <span><i class="fas fa-location-dot"></i> ${escapeHtml(item.location)}</span>
            </div>

            <p class="exp-stage-desc">${escapeHtml(item.description)}</p>

            <div class="exp-stage-footer">
                ${item.certificateUrl && item.certificateUrl.trim()
                    ? `<a href="${escapeHtml(item.certificateUrl.trim())}" target="_blank" rel="noopener noreferrer" class="cert-pdf-btn">
                        <i class="far fa-file-lines"></i>
                        <span>${escapeHtml(item.certificateLabel)}</span>
                        <span class="pdf-chip">PDF</span>
                       </a>`
                    : `<button type="button" class="cert-pdf-btn" data-cert-toast="${escapeHtml(item.company)}">
                        <i class="far fa-file-lines"></i>
                        <span>${escapeHtml(item.certificateLabel)}</span>
                        <span class="pdf-chip">PDF</span>
                       </button>`
                }
            </div>
        `;

        stageEl.querySelector("[data-cert-toast]")?.addEventListener("click", (e) => {
            const companyName = e.currentTarget.getAttribute("data-cert-toast");
            if (typeof showToast === "function") {
                showToast(`${companyName} certificate PDF slot ready`);
            }
        });
    }

    trackEl.innerHTML = EXPERIENCE_ROLES.map((item, idx) => `
        <button
            type="button"
            class="exp-milestone-btn ${idx === selectedIdx ? "is-active" : ""}"
            role="tab"
            aria-selected="${idx === selectedIdx}"
            data-exp-idx="${idx}"
        >
            <div class="exp-node-top">
                ${renderLogoMark(item, "exp-logo-slot")}
                <div>
                    <div class="exp-node-period">${escapeHtml(item.period)}</div>
                    <div class="exp-node-role">${escapeHtml(item.role)}</div>
                    <div class="exp-node-company">${escapeHtml(item.company)}</div>
                </div>
            </div>
        </button>
    `).join("");

    trackEl.querySelectorAll(".exp-milestone-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            selectedIdx = Number(btn.dataset.expIdx);
            renderStage(selectedIdx);
        });
    });

    renderStage(selectedIdx);
}

// ==========================================================================
// CERTIFICATIONS (INTERACTIVE CREDENTIAL CARDS + SPOTLIGHT)
// ==========================================================================
const CERTIFICATIONS = [
    {
        id: "supraja-cert",
        title: "Cyber Security Internship Certificate",
        issuer: "Supraja Technologies",
        date: "August 2025",
        credentialId: "Credential ID: ST#IS#7875",
        summary: "Awarded for completing practical cybersecurity internship work covering information gathering, security audits, and web application vulnerability assessments.",
        image: "./assets/supraja-cert.png", // Optional certificate image, e.g. "./assets/supraja-cert.png"
        fileUrl: "./assets/supraja.pdf"
    },

    {
        id: "just-rise-cert",
        title: "Software Development Internship Certificate",
        issuer: "Just Rise Technologies W.L.L.",
        date: "July 2026",
        credentialId: "Software Development · Al Hidd, Bahrain",
        summary: "Awarded following a six-month software development internship covering application development and software development workflows.",
        image: "./assets/just-rise-cert.png", // Optional certificate image, e.g. "./assets/just-rise-cert.png"
        fileUrl: "./assets/just-rise.pdf"
    },

    {
        id: "scaler-dbms",
        title: "DBMS Course – Master Fundamentals & Advanced Concepts",
        issuer: "Scaler",
        date: "May 2026",
        credentialId: "Relational Databases & SQL",
        summary: "Completed structured coursework covering relational schema design, normalization, indexing, SQL queries, transactions, and database fundamentals.",
        image: "./assets/dbms-cert.png", // Optional certificate image, e.g. "./assets/scaler-dbms.png"
        fileUrl: "" // Optional certificate PDF/link, e.g. "./assets/scaler-dbms.pdf"
    }
];

function renderCertificationsSection() {
    const cardsCol = document.getElementById("certCardsCol");
    const spotlightEl = document.getElementById("certSpotlightPanel");
    if (!cardsCol || !spotlightEl) return;

    let activeCertIdx = 0;

    function updateSpotlight(idx) {
        const cert = CERTIFICATIONS[idx];
        if (!cert) return;

        cardsCol.querySelectorAll(".cert-pass-card").forEach((card, i) => {
            card.classList.toggle("is-selected", i === idx);
        });

        spotlightEl.innerHTML = `
            <div class="cert-spotlight-kicker">CREDENTIAL SPOTLIGHT</div>
            <h3>${escapeHtml(cert.title)}</h3>
            <div class="cert-spotlight-meta">${escapeHtml(cert.issuer)} · ${escapeHtml(cert.date)}</div>
            <p class="cert-spotlight-desc">${escapeHtml(cert.summary)}</p>

            <div class="cert-preview-thumb">
                ${cert.image && cert.image.trim()
                    ? `<img src="${escapeHtml(cert.image.trim())}" alt="${escapeHtml(cert.title)}">`
                    : `<span class="cert-thumb-empty">CERTIFICATE PREVIEW SLOT</span>`
                }
            </div>

            <div class="cert-spotlight-actions">
                <span class="cert-pass-code">${escapeHtml(cert.credentialId)}</span>
                ${cert.fileUrl && cert.fileUrl.trim()
                    ? `<a href="${escapeHtml(cert.fileUrl.trim())}" target="_blank" rel="noopener noreferrer" class="cert-pdf-btn">
                        <i class="far fa-file-lines"></i>
                        <span>View Certificate</span>
                        <span class="pdf-chip">OPEN</span>
                       </a>`
                    : `<button type="button" class="cert-pdf-btn" data-cert-proof="${escapeHtml(cert.title)}">
                        <i class="far fa-file-lines"></i>
                        <span>Certificate File</span>
                        <span class="pdf-chip">SLOT</span>
                       </button>`
                }
            </div>
        `;

        spotlightEl.querySelector("[data-cert-proof]")?.addEventListener("click", (e) => {
            const label = e.currentTarget.getAttribute("data-cert-proof");
            if (typeof showToast === "function") {
                showToast(`Add fileUrl for "${label}" in CERTIFICATIONS`);
            }
        });
    }

    cardsCol.innerHTML = CERTIFICATIONS.map((cert, idx) => `
        <button type="button" class="cert-pass-card ${idx === 0 ? "is-selected" : ""}" data-cert-index="${idx}">
            <div class="cert-pass-top">
                <span class="cert-pass-issuer">${escapeHtml(cert.issuer)}</span>
                <span class="cert-pass-date">${escapeHtml(cert.date)}</span>
            </div>
            <div class="cert-pass-title">${escapeHtml(cert.title)}</div>
            <span class="cert-pass-code">${escapeHtml(cert.credentialId)}</span>
        </button>
    `).join("");

    cardsCol.querySelectorAll(".cert-pass-card").forEach((card) => {
        card.addEventListener("click", () => {
            activeCertIdx = Number(card.dataset.certIndex);
            updateSpotlight(activeCertIdx);
        });
    });

    updateSpotlight(activeCertIdx);
}

// ==========================================================================
// 1. THREE PROJECTS (WITH TECH LOGOS & DEPLOYED / TO BE DEPLOYED STATE)
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
        description: "Full-stack movie recommendation app with user authentication, personalized watchlists, and TMDB API search, trailers, and recommendations in a responsive Bootstrap UI.",
        image: "./assets/movie-rec.png",
        tech: ["Python", "Flask", "SQLite", "TMDB API", "Pandas", "Scikit-learn"],
        liveUrl: "https://devagangas.pythonanywhere.com/"
    },
    {
        slot: "02",
        title: "EV Explorer",
        period: "Oct 2025 · Academic Project",
        description: "Map-based analytics app built with Flask and Leaflet.js to explore Washington State EV registrations, predict vehicle type and electric range, and recommend charging stations.",
        image: "",
        tech: ["Python", "Flask", "Pandas", "Scikit-learn", "Leaflet.js"],
        liveUrl: ""
    },
    {
        slot: "03",
        title: "ChurnIQ – Customer Churn Intelligence & Risk Engine",
        period: "Aug 2026 – Sep 2026 · Individual Project",
        description: "Customer churn prediction platform using a 77.2% accurate Random Forest model on 7,000+ telecom records, MySQL storage, Chart.js analytics, and CSV export pipelines.",
        image: "./assets/churn-iq.png",
        tech: ["Python", "Flask", "Scikit-learn", "MySQL", "Chart.js", "HTML5/CSS3", "JavaScript"],
        liveUrl: "https://customer-churn-intelligence-hk5h.vercel.app/"
    }
];

function renderTechLogos(techList = []) {
    return techList.map((name) => {
        const iconClass = TECH_ICON_MAP[name] || "fas fa-code";
        return `
            <span class="tech-logo-badge" title="${escapeHtml(name)}" aria-label="${escapeHtml(name)}">
                <i class="${iconClass}"></i>
            </span>
        `;
    }).join("");
}

function renderProjects() {
    const container = document.getElementById("projectsShowcase");
    if (!container) return;

    container.innerHTML = PROJECTS.map((proj) => {
        const cleanUrl = (proj.liveUrl || "").trim();
        const isDeployed = Boolean(cleanUrl);

        return `
            <div class="project-3d-wrap reveal">
                <div class="deploy-beacon">
                    ${isDeployed
                        ? `<a href="${escapeHtml(cleanUrl)}" target="_blank" rel="noopener noreferrer" class="deploy-url-pill">${escapeHtml(cleanUrl)}</a>`
                        : `<span class="deploy-url-pill is-pending">To Be Deployed</span>`
                    }
                    <div class="deploy-beam"></div>
                </div>

                <article class="project-card-3d">
                    <div>
                        <div class="project-preview-box">
                            ${proj.image
                                ? `<img src="${escapeHtml(proj.image)}" alt="${escapeHtml(proj.title)} preview">`
                                : `<div class="preview-empty"><i class="fas fa-layer-group"></i><span>PREVIEW ${escapeHtml(proj.slot)}</span></div>`
                            }
                        </div>

                        <div class="project-info">
                            <div class="project-submeta">${escapeHtml(proj.period)}</div>
                            <h3>${escapeHtml(proj.title)}</h3>
                            <p>${escapeHtml(proj.description)}</p>
                        </div>
                    </div>

                    <div class="project-bottom">
                        <div class="tech-logos">
                            ${renderTechLogos(proj.tech)}
                        </div>

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
}

// ==========================================================================
// 2. CUSTOM DIFFERENCE CURSOR FOLLOWER
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
    const interactive = e.target.closest("a, button, input, textarea, .edu-node, .project-3d-wrap, .profile-cutout-stage, .exp-milestone-btn, .cert-pdf-btn, .cert-pass-card");
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

// ==========================================================================
// 3. INTERACTIVE PROFILE CUTOUT PARALLAX & IMAGE FALLBACK HANDLER
// ==========================================================================
const profileStage = document.getElementById("profileCutoutStage");
const profileImg = document.getElementById("profileCutoutImg");
const profileFallback = document.getElementById("profileCutoutFallback");

function syncProfileCutout() {
    if (!profileImg || !profileFallback) return;
    const src = profileImg.getAttribute("src");
    if (src && src.trim() !== "") {
        profileImg.classList.remove("is-empty");
        profileFallback.style.display = "none";
    } else {
        profileImg.classList.add("is-empty");
        profileFallback.style.display = "flex";
    }
}
syncProfileCutout();

profileStage?.addEventListener("pointermove", (e) => {
    const rect = profileStage.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    profileStage.style.transform = `perspective(900px) rotateY(${relX * 10}deg) rotateX(${-relY * 10}deg)`;
});

profileStage?.addEventListener("pointerleave", () => {
    profileStage.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
});

// ==========================================================================
// 4. SCROLL-DRIVEN EDUCATION SIDELINE INDICATOR
// ==========================================================================
const timelineEl = document.getElementById("educationTimeline");
const timelineFill = document.getElementById("timelineFill");
const timelineGlowDot = document.getElementById("timelineGlowDot");
const eduNodes = document.querySelectorAll(".edu-node");

function updateEducationTimeline() {
    if (!timelineEl || !timelineFill || !timelineGlowDot) return;

    const rect = timelineEl.getBoundingClientRect();
    const railHeight = Math.max(rect.height - 24, 1);
    const viewportAnchor = window.innerHeight * 0.52;

    const rawProgress = (viewportAnchor - rect.top) / railHeight;
    const clamped = Math.max(0, Math.min(1, rawProgress));
    const travelPx = clamped * railHeight;

    timelineFill.style.height = `${travelPx}px`;
    timelineGlowDot.style.top = `${12 + travelPx}px`;

    let closestIdx = 0;
    let minDistance = Infinity;
    eduNodes.forEach((node, idx) => {
        const nRect = node.getBoundingClientRect();
        const nodeCenter = nRect.top + 30;
        const dist = Math.abs(nodeCenter - viewportAnchor);
        if (dist < minDistance) {
            minDistance = dist;
            closestIdx = idx;
        }
    });

    eduNodes.forEach((node, idx) => {
        node.classList.toggle("active-node", idx === closestIdx);
    });
}

window.addEventListener("scroll", updateEducationTimeline, { passive: true });
window.addEventListener("resize", updateEducationTimeline);

// ==========================================================================
// 5. SECTION-REACTIVE BACKGROUND CANVAS (CLEAN & UNCROWDED)
// ==========================================================================
const bgCanvas = document.getElementById("bg-stage");
const bgCtx = bgCanvas?.getContext("2d");

const SCENE_CONFIG = {
    hero:           { speed: 0.0007, amp: 30, count: 14, alpha: 0.12 },
    about:          { speed: 0.0006, amp: 24, count: 12, alpha: 0.10 },
    education:      { speed: 0.0005, amp: 20, count: 14, alpha: 0.11 },
    experience:     { speed: 0.0008, amp: 28, count: 15, alpha: 0.12 },
    certifications: { speed: 0.0007, amp: 24, count: 14, alpha: 0.11 },
    projects:       { speed: 0.0010, amp: 42, count: 18, alpha: 0.15 },
    connect:        { speed: 0.0005, amp: 22, count: 12, alpha: 0.10 }
};

let currentBg = { ...SCENE_CONFIG.hero };
let targetBg = SCENE_CONFIG.hero;
let bgW = 0;
let bgH = 0;
let waveNodes = [];

function resizeBg() {
    if (!bgCanvas) return;
    bgW = bgCanvas.width = window.innerWidth;
    bgH = bgCanvas.height = window.innerHeight;
    waveNodes = Array.from({ length: 18 }, (_, i) => ({
        x0: (bgW / 18) * i + bgW / 36,
        y0: bgH * (0.28 + ((i * 31) % 44) / 100),
        phase: i * 0.68
    }));
}

function renderBg(now) {
    if (!bgCtx) return;

    currentBg.speed += (targetBg.speed - currentBg.speed) * 0.04;
    currentBg.amp += (targetBg.amp - currentBg.amp) * 0.04;
    currentBg.alpha += (targetBg.alpha - currentBg.alpha) * 0.04;

    bgCtx.clearRect(0, 0, bgW, bgH);

    const aura = bgCtx.createRadialGradient(bgW * 0.74, bgH * 0.34, 10, bgW * 0.74, bgH * 0.34, Math.max(bgW, bgH) * 0.52);
    aura.addColorStop(0, "rgba(37, 99, 235, 0.12)");
    aura.addColorStop(1, "rgba(16, 24, 39, 0)");
    bgCtx.fillStyle = aura;
    bgCtx.fillRect(0, 0, bgW, bgH);

    const activePts = waveNodes.slice(0, Math.round(targetBg.count)).map((n) => ({
        x: n.x0 + Math.cos(now * currentBg.speed + n.phase) * 20,
        y: n.y0 + Math.sin(now * currentBg.speed * 1.3 + n.phase) * currentBg.amp
    }));

    bgCtx.strokeStyle = `rgba(96, 165, 250, ${currentBg.alpha.toFixed(3)})`;
    bgCtx.lineWidth = 1;
    bgCtx.beginPath();
    activePts.forEach((pt, idx) => (idx === 0 ? bgCtx.moveTo(pt.x, pt.y) : bgCtx.lineTo(pt.x, pt.y)));
    bgCtx.stroke();

    bgCtx.fillStyle = "rgba(96, 165, 250, 0.32)";
    activePts.forEach((pt) => {
        bgCtx.beginPath();
        bgCtx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
        bgCtx.fill();
    });

    requestAnimationFrame(renderBg);
}

window.addEventListener("resize", resizeBg);
resizeBg();
requestAnimationFrame(renderBg);

// ==========================================================================
// 6. SECTION SCROLL OBSERVER & CONTACT FORM
// ==========================================================================
const navLinks = document.querySelectorAll(".nav-link");
const stageSections = document.querySelectorAll(".stage-section");

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const scene = entry.target.getAttribute("data-scene") || "hero";
                document.body.setAttribute("data-scene", scene);
                targetBg = SCENE_CONFIG[scene] || SCENE_CONFIG.hero;

                entry.target.classList.add("is-visible");
                entry.target.querySelectorAll(".reveal").forEach((el, idx) => {
                    el.style.transitionDelay = `${idx * 70}ms`;
                });

                navLinks.forEach((a) => {
                    a.classList.toggle("active", a.dataset.nav === scene);
                });
            }
        });
    },
    { threshold: 0.22 }
);

const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");

function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

document.getElementById("contactForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const sender = String(new FormData(e.target).get("name") || "").trim();
    showToast(`Message received${sender ? `, ${sender}` : ""}.`);
    e.target.reset();
});

// ==========================================================================
// SCRAMBLE-TO-REVEAL + CLICK-TO-COPY EMAIL IN CONNECT
// ==========================================================================
const mailBtn = document.getElementById("mailScrambleBtn");
const mailHint = document.getElementById("mailHint");
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#%&*";

let scrambleFrameId = null;

function runScramble(targetText, onComplete) {
    cancelAnimationFrame(scrambleFrameId);
    const length = targetText.length;
    const startTime = performance.now();
    const duration = 560;

    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const resolvedCount = Math.floor(progress * length);

        let output = "";
        for (let i = 0; i < length; i++) {
            const ch = targetText[i];
            if (i < resolvedCount || ch === " ") {
                output += ch;
            } else {
                output += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            }
        }

        if (mailBtn) mailBtn.textContent = output;

        if (progress < 1) {
            scrambleFrameId = requestAnimationFrame(step);
        } else {
            if (mailBtn) mailBtn.textContent = targetText;
            if (typeof onComplete === "function") onComplete();
        }
    }

    scrambleFrameId = requestAnimationFrame(step);
}

mailBtn?.addEventListener("pointerenter", () => {
    const email = mailBtn.dataset.email || "devagangasanil@gmail.com";
    mailBtn.classList.add("is-revealed");
    runScramble(email, () => {
        if (mailHint) mailHint.textContent = "click to copy address";
    });
});

mailBtn?.addEventListener("click", async () => {
    const email = mailBtn.dataset.email || "ds0513@gmail.com";
    mailBtn.classList.add("is-revealed");
    mailBtn.textContent = email;

    try {
        await navigator.clipboard.writeText(email);
        if (mailHint) mailHint.textContent = "copied to clipboard";
        showToast("Email copied.");
    } catch {
        window.location.href = `mailto:${email}`;
    }
});

// ==========================================================================
// 7. INITIALIZE
// ==========================================================================
renderExperienceSection();
renderCertificationsSection();
renderSkillsMarquee()
renderProjects();
stageSections.forEach((sec) => sectionObserver.observe(sec));
updateEducationTimeline();