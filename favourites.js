/* --- FAVORITES & NOTIFICATIONS --- */
const UPDATES_FILE = './alerts.json';
let followed = JSON.parse(localStorage.getItem('followedProjects')) || [];
let seenUpdates = JSON.parse(localStorage.getItem('seenUpdates')) || [];
let clickedUpdates = JSON.parse(localStorage.getItem('clickedUpdates')) || [];

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Hearts
    initHeartButtons();
    
    // 2. Setup Toast Container
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    // 3. Check for updates
    checkForUpdates();

    // 4. If on notification page, render list
    if (document.getElementById('notification-container')) {
        renderNotificationPage();
    }
});

function initHeartButtons() {
    const hearts = document.querySelectorAll('.heart-icon');
    hearts.forEach(btn => {
        const projectName = btn.getAttribute('data-project');
        
        // Initial Visual State
        if (followed.includes(projectName)) btn.classList.add('active');

        btn.onclick = () => {
            if (followed.includes(projectName)) {
                followed = followed.filter(p => p !== projectName);
                btn.classList.remove('active');
            } else {
                followed.push(projectName);
                btn.classList.add('active');
                // Check for updates immediately when they follow
                checkForUpdates(); 
            }
            localStorage.setItem('followedProjects', JSON.stringify(followed));
        };
    });
}

async function checkForUpdates() {
    try {
        const response = await fetch(alerts.json + '?t=' + Date.now());
        const allUpdates = await response.json();

        allUpdates.forEach(item => {
            const isProject = item.type === 'project';
            const isFollowed = followed.includes(item.project);
            const hasSeen = seenUpdates.includes(item.id);

            if (!hasSeen && (!isProject || isFollowed)) {
                spawnToast(item);
            }
        });
    } catch (err) { console.error("Update fetch error:", err); }
}

function spawnToast(item) {
    // Prevent duplicate toasts for same ID
    if (document.querySelector(`[data-toast-id="${item.id}"]`)) return;

    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `update-toast ${item.type}`;
    toast.setAttribute('data-toast-id', item.id);
    
    const optOut = item.type === 'project' ? `<button onclick="unfollow('${item.project}', '${item.id}')" style="background:none; border:none; color:#aaa; cursor:pointer; font-size:11px;">Unfollow</button>` : '';

    toast.innerHTML = `
        <span class="toast-close" onclick="this.parentElement.remove(); markAsSeen('${item.id}')">&times;</span>
        <h4>${item.project}</h4>
        <p style="font-size:12px; margin: 5px 0;">${item.changelog}</p>
        <div style="display:flex; gap:10px; align-items:center; margin-top:10px;">
            <a href="${item.viewUrl}" class="btn-view" onclick="markAsClicked('${item.id}')">Learn More</a>
            ${optOut}
        </div>
    `;
    container.appendChild(toast);
}

function markAsSeen(id) {
    if (!seenUpdates.includes(id)) {
        seenUpdates.push(id);
        localStorage.setItem('seenUpdates', JSON.stringify(seenUpdates));
    }
}

function markAsClicked(id) {
    if (!clickedUpdates.includes(id)) {
        clickedUpdates.push(id);
        localStorage.setItem('clickedUpdates', JSON.stringify(clickedUpdates));
    }
}

window.unfollow = (name, id) => {
    followed = followed.filter(p => p !== name);
    localStorage.setItem('followedProjects', JSON.stringify(followed));
    markAsSeen(id);
    location.reload(); // Refresh to clear toasts
};

async function renderNotificationPage() {
    const container = document.getElementById('notification-container');
    const response = await fetch(UPDATES_FILE);
    const data = await response.json();

    container.innerHTML = data.filter(upd => upd.type === 'alert' || followed.includes(upd.project)).map(upd => {
        const isRead = clickedUpdates.includes(upd.id);
        return `
            <div class="notif-item ${isRead ? 'read' : 'unread'}">
                <div>
                    <strong>${upd.project}</strong>
                    <p>${upd.changelog}</p>
                </div>
                <a href="${upd.viewUrl}" class="notif-link" onclick="markAsClicked('${upd.id}')">
                    ${isRead ? 'Viewed' : 'Learn More'}
                </a>
            </div>
        `;
    }).join('');
}
