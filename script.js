class SiteHeader extends HTMLElement {
    connectedCallback() {
        this.render();
        this.setActivePage();
        this.setupEventListeners();
    }

    render() {
        this.innerHTML = `
        <div id="overlay"></div>
        <div class="navbar">
            <a href="https://aunsw.netlify.app/" class="logo">
                <img src="../media/logo.png">
                <span>New South Wales Roleplay</span>
            </a>
            <div class="nav-right">
                <!-- Placeholder for right-side items if needed -->
            </div>
        </div>

        <div id="sidebar" class="sidebar">
            <div class="sidebarHeader">
                <div class="serverName"><img src="../media/logo.png">NSWRP</div>
            </div>

            <nav class="navList">
                <details class="dropdown">
                    <summary class="navItem"><img src="../media/departments.png"><span>Departments</span></summary>
                    <div class="dropdownContent">
                        <div class="dept-item"><img src="../media/department/police.png"><a href="https://aunsw.netlify.app/departments#police">Police</a></div>
                        <div class="dept-item"><img src="../media/department/afp.png"><a href="https://aunsw.netlify.app/departments#afp">AFP</a></div>
                        <div class="dept-item"><img src="../media/department/fire.png"><a href="https://aunsw.netlify.app/departments#fire">Fire & Rescue</a></div>
                        <div class="dept-item"><img src="../media/department/ambulance.png"><a href="https://aunsw.netlify.app/departments#ambulace">Paramedics</a></div>
                        <div class="dept-item"><img src="../media/department/dot.png"><a href="https://aunsw.netlify.app/departments#dot">Transport NSW</a></div>
                    </div>
                </details>

                <a href="https://aunsw.netlify.app/meet-the-team" class="navItem"><img src="../media/team.png"><span>Meet the Team</span></a>
                <a href="https://aunsw.netlify.app/affiliates" class="navItem"><img src="../media/affiliates.png"><span>Affiliates</span></a>
                <a href="https://aunsw.netlify.app/rules" class="navItem"><img src="../media/rulebook.png"><span>Rules & Guidelines</span></a>
            </nav>

            <div class="sidebarFooter">
                <!-- Sidebar Toggle/Open Button now at the bottom -->
                <button id="openNav" class="menuBtn button">☰ Toggle Sidebar</button>
                <div class="social">
                    <a class="button socialBtn" href="https://www.youtube.com/@NSWERLC" target="_blank"><img src="../media/youtube.png"></a>
                    <a class="button socialBtn" href="https://discord.gg/rWtnWX5Esy" target="_blank"><img src="../media/discord.png"></a>
                </div>
            </div>
        </div>`;
    }

    setActivePage() {
        const currentUrl = window.location.href;
        const navItems = this.querySelectorAll('.navItem, .dept-item a');
        
        navItems.forEach(item => {
            if (item.href === currentUrl) {
                item.classList.add('active');
                // If it's inside a dropdown, open the dropdown
                const details = item.closest('details');
                if (details) details.open = true;
            }
        });
    }

    setupEventListeners() {
        const sidebar = this.querySelector("#sidebar");
        const overlay = this.querySelector("#overlay");
        const btn = this.querySelector("#openNav");

        const toggleSidebar = () => {
            sidebar.classList.toggle("open");
            overlay.classList.toggle("show");
        };

        btn.onclick = toggleSidebar;
        overlay.onclick = toggleSidebar;
    }
}

customElements.define('the-header', SiteHeader);

// Simple Reveal Logic
window.addEventListener("scroll", () => {
    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add("active");
        }
    });
});
