/* --- NOTIFICATION & ALERTS SYSTEM --- */

const UPDATES_FILE = './updates.json';
let followed = JSON.parse(localStorage.getItem('followedProjects')) || [];
let seenUpdates = JSON.parse(localStorage.getItem('seenUpdates')) || [];
let clickedUpdates = JSON.parse(localStorage.getItem('clickedUpdates')) || [];

document.addEventListener("DOMContentLoaded", () => {
    createToastContainer();
    checkForUpdates();
    if (document.getElementById('notification-container')) renderNotificationPage();
});

// Create the container for stacking toasts
function createToastContainer() {
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
}

async function checkForUpdates() {
    try {
        const response = await fetch(updates.json + '?t=' + Date.now()); // Prevent caching
        const allUpdates = await response.json();
        const container = document.getElementById('toast-container');

        allUpdates.forEach(item => {
            const isProjectUpdate = item.type === 'project';
            const isFollowed = followed.includes(item.project);
            const hasSeen = seenUpdates.includes(item.id);

            // Logic: Show if it's a general alert OR a followed project update
            if (!hasSeen && (!isProjectUpdate || isFollowed)) {
                spawnToast(item);
            }
        });
    } catch (err) { console.log("Update check failed"); }
}

function spawnToast(item) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `update-toast ${item.type}`;
    
    // Only show "Unfollow" if it's a project update
    const optOutBtn = item.type === 'project' 
        ? `<button class="btn-unfollow" onclick="unfollowProject('${item.project}', '${item.id}')">Unfollow</button>` 
        : '';

    toast.innerHTML = `
        <span class="toast-close" onclick="closeToast(this, '${item.id}')">&times;</span>
        <div class="toast-content">
            <h4>${item.project}</h4>
            <p>${item.changelog}</p>
            <div class="toast-actions">
                <a href="${item.viewUrl}" class="btn-view" onclick="markAsClicked('${item.id}')">Learn More</a>
                ${optOutBtn}
            </div>
        </div>
    `;
    container.prepend(toast); // Adds to the top of the stack (bottom-most visually)
}

/* --- ACTIONS --- */

window.closeToast = (el, id) => {
    const toast = el.closest('.update-toast');
    markAsSeen(id);
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 400);
};

window.unfollowProject = (projectName, id) => {
    followed = followed.filter(p => p !== projectName);
    localStorage.setItem('followedProjects', JSON.stringify(followed));
    // Close all toasts related to this project immediately
    document.querySelectorAll('.update-toast').forEach(t => {
        if (t.querySelector('h4').innerText === projectName) t.remove();
    });
    markAsSeen(id);
};

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

async function renderNotificationPage() {
    const container = document.getElementById('notification-container');
    const response = await fetch(UPDATES_FILE);
    const allUpdates = await response.json();

    const history = allUpdates.filter(upd => upd.type === 'alert' || followed.includes(upd.project));

    container.innerHTML = history.map(upd => {
        const isRead = clickedUpdates.includes(upd.id);
        return `
            <div class="notif-item ${isRead ? 'read' : 'unread'}">
                <div class="notif-body">
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
