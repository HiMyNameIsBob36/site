/* --- UTILITIES --- */
function revealOnScroll() {
    const reveals = document.querySelectorAll(".reveal");
    const windowHeight = window.innerHeight;
    reveals.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            el.classList.add("active");
        }
    });
}

/* --- CUSTOM HEADER ELEMENT --- */
class SiteHeader extends HTMLElement {
    connectedCallback() {
        // Check localStorage for sidebar state (default to 'open')
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';

        this.innerHTML = `
        <div id="sidebar" class="sidebar ${isCollapsed ? 'collapsed' : ''}">
            <div class="sidebar-inner">
                <nav class="navList">
                    <a href="https://hey36.netlify.app/" class="navItem" data-path="/">
                        <div class="icon-wrapper"><img src="../media/home.png"></div>
                        <span class="nav-text text-green">Home</span>
                    </a>
                    <a href="https://hey36.netlify.app/notifications" class="navItem" data-path="/notifications">
                        <div class="icon-wrapper"><img src="../media/notifications.png"></div>
                        <span class="nav-text">Notifications</span>
                    </a>
                    <a href="https://hey36.netlify.app/tools" class="navItem" data-path="/tools">
                        <div class="icon-wrapper"><img src="../media/tools.png"></div>
                        <span class="nav-text">Tools</span>
                    </a>
                    
                    <div class="nav-section"><span class="nav-title">RECENTLY UPDATED</span></div>

                    <a href="https://hey36.netlify.app/projects/the-bridge" class="navItem" data-path="/projects/the-bridge">
                        <div class="icon-wrapper"><img src="../media/projects/the-bridge.png"></div>
                        <span class="nav-text">The Bridge</span>
                    </a>
                    <a href="https://hey36.netlify.app/projects/bobway" class="navItem" data-path="/projects/bobway">
                        <div class="icon-wrapper"><img src="../media/projects/bobway.png"></div>
                        <span class="nav-text">BOBWAY</span>
                    </a>
                    <a href="https://hey36.netlify.app/projects/whats-different" class="navItem" data-path="/projects/whats-different">
                        <div class="icon-wrapper"><img src="../media/projects/whats-different.png"></div>
                        <span class="nav-text">Whats Different</span>
                    </a>
                    <a href="https://hey36.netlify.app/projects/ranks+" class="navItem" data-path="/projects/ranks+">
                        <div class="icon-wrapper"><img src="../media/projects/ranks+.png"></div>
                        <span class="nav-text">Ranks+</span>
                    </a>
                    <a href="https://hey36.netlify.app/projects/site-tools" class="navItem" data-path="/projects/site-tools">
                        <div class="icon-wrapper"><img src="../media/projects/site-tools.png"></div>
                        <span class="nav-text">Website Tools</span>
                    </a>

                    <div class="nav-section"><span class="nav-title">ARCHIVED</span></div>

                    <a href="https://hey36.netlify.app/projects/kit-pvp" class="navItem" data-path="/projects/kit-pvp">
                        <div class="icon-wrapper"><img src="../media/projects/kit-pvp.png"></div>
                        <span class="nav-text">Kit PvP</span>
                    </a>
                </nav>

                <div class="sidebarFooter">
                    <div id="toggleSidebar" class="navItem toggle-btn">
                        <div class="icon-wrapper"><img src="../media/sidebar-toggle.png"></div>
                        <span class="nav-text">Toggle Sidebar</span>
                    </div>
                </div>
            </div>
        </div>`;

        this.setupEventListeners();
        this.highlightActivePage();
    }

    setupEventListeners() {
        const sidebar = this.querySelector("#sidebar");
        const toggleBtn = this.querySelector("#toggleSidebar");

        toggleBtn.onclick = () => {
            const isNowCollapsed = sidebar.classList.toggle("collapsed");
            // Save preference to localStorage
            localStorage.setItem('sidebarCollapsed', isNowCollapsed);
        };
    }

    highlightActivePage() {
        const currentPath = window.location.pathname;
        const navItems = this.querySelectorAll(".navItem");

        navItems.forEach(item => {
            const itemPath = item.getAttribute('data-path');
            if (itemPath && currentPath.includes(itemPath)) {
                item.classList.add("active-page");
                // The CSS handles the color change for the image and text automatically via the .active-page class
            }
        });
    }
}

customElements.define('the-header', SiteHeader);

/* --- INITIALIZATION --- */
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("DOMContentLoaded", revealOnScroll);
