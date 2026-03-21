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
                    <a href="https://aunsw.netlify.app/properties" class="navItem" data-path="/properties">
                        <div class="icon-wrapper"><img src="../media/edit.png" class="icon-green"></div>
                        <span class="nav-text text-green">Properties</span>
                    </a>
                    <a href="https://aunsw.netlify.app/tree" class="navItem" data-path="/tree">
                        <div class="icon-wrapper"><img src="../media/tree.png"></div>
                        <span class="nav-text">Tree</span>
                    </a>
                    <a href="https://aunsw.netlify.app/code" class="navItem" data-path="/code">
                        <div class="icon-wrapper"><img src="../media/code.png"></div>
                        <span class="nav-text">Code</span>
                    </a>
                    
                    <div class="nav-spacer"></div>

                    <a href="https://aunsw.netlify.app/view" class="navItem" data-path="/view">
                        <div class="icon-wrapper"><img src="../media/view.png"></div>
                        <span class="nav-text">View</span>
                    </a>
                    <a href="https://aunsw.netlify.app/export" class="navItem" data-path="/export">
                        <div class="icon-wrapper"><img src="../media/export.png"></div>
                        <span class="nav-text">Export</span>
                    </a>

                    <div class="nav-spacer"></div>

                    <a href="https://aunsw.netlify.app/diff" class="navItem" data-path="/diff">
                        <div class="icon-wrapper"><img src="../media/diff.png"></div>
                        <span class="nav-text">Diff</span>
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
