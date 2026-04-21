import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyDoEK1VRmy1bmyGpdES-yTVW97LL3c_UoU",
    authDomain: "portfolio-deva-40965.firebaseapp.com",
    projectId: "portfolio-deva-40965",
    storageBucket: "portfolio-deva-40965.firebasestorage.app",
    messagingSenderId: "309031768742",
    appId: "1:309031768742:web:a229f2a23961afeb231a67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * --- 1. LOAD PROJECTS ---
 * Fetches projects from Firestore and injects them into the grid.
 */
async function loadProjects() {
    const grid = document.getElementById('projectGrid');
    if (!grid) return;

    try {
        const querySnapshot = await getDocs(collection(db, "Projects"));
        grid.innerHTML = ''; 
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            grid.innerHTML += `
                <div class="project-card-shadow">
                    <h3>${data.title || "Untitled Project"}</h3>
                    <p>${data.description || "No description provided."}</p>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error loading projects:", error);
        grid.innerHTML = "<p>Unable to load projects at this time.</p>";
    }
}

/**
 * --- 2. LOAD EXPERIENCE ---
 * Fetches work history, formats dates, and handles extra descriptions.
 */
async function loadExperience() {
    console.log("LOAD EXPERIENCE CALLED");
    const container = document.getElementById('experienceContainer');
    if (!container) return;

    try {
        console.log("Trying to fetch Experience...");
        
        // 1. ORDER BY START DATE (This makes it truly dynamic and chronological)
        const q = query(collection(db, "Experience"), orderBy("Start date", "desc"));
        const querySnapshot = await getDocs(q);

        console.log("SIZE FOUND:", querySnapshot.size);
        container.innerHTML = '';

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("RENDERING DOC:", data.Company);

            // --- DATE LOGIC ---
            let displayDate = "";
            if (data["Start date"]) {
                const dateObj = data["Start date"].toDate();
                displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            }

            // --- HTML INJECTION ---
            container.innerHTML += `
                <div class="experience-entry" style="margin-bottom: 50px; border-left: 2px solid var(--cherry-red); padding-left: 25px;">
                    <h2 style="font-size: 1.8rem; margin: 0; line-height: 1.1; color: #fff; text-transform: uppercase;">
                        ${data.Company || data.company}
                    </h2>
                    <p style="font-size: 1.2rem; color: var(--ice-white); margin: 8px 0; font-weight: 700;">
                        ${data.Role || data.role}
                    </p>
                    <p style="font-size: 1rem; color: var(--ice-white); opacity: 0.8;">
                        ${displayDate} (${data.Duration})
                    </p>
                    <p style="font-size: 1rem; color: var(--electric-blue); font-weight: 600; margin-top: 5px;">
                        Domain: ${data.Domain || data.domain || "Technical"}
                    </p>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error loading experience:", error);
        // If the sorting fails, it might need a Firebase Index. 
        // If you see a link in the console, click it!
    }
}
/**
 * --- 3. CONTACT FORM LOGIC ---
 */
const form = document.getElementById("contactForm");
const toast = document.getElementById("toast");
const submitBtn = form?.querySelector("button");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Disable button to prevent double-clicks
        if (submitBtn) {
            submitBtn.innerText = "SENDING...";
            submitBtn.style.opacity = "0.5";
            submitBtn.disabled = true;
        }
        
        try {
            await addDoc(collection(db, "messages"), {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                message: document.getElementById("message").value,
                timestamp: new Date()
            });

            // Trigger Success Toast
            if (toast) {
                toast.classList.add("show");
                
                // Reset form
                form.reset();

                // Hide Toast after 4 seconds
                setTimeout(() => {
                    toast.classList.remove("show");
                }, 2000);
            }

        } catch (error) {
            console.error("Submission Error:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            // Re-enable button
            if (submitBtn) {
                submitBtn.innerText = "SEND";
                submitBtn.style.opacity = "1";
                submitBtn.disabled = false;
            }
        }
    });
}

// --- INITIALIZE ALL DYNAMIC CONTENT ---
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    loadExperience();
});