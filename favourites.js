/* --- FAVORITES & ALERTS SYSTEM --- */
let followed = JSON.parse(localStorage.getItem('followedProjects')) || [];
let seenUpdates = JSON.parse(localStorage.getItem('seenUpdates')) || [];
let clickedUpdates = JSON.parse(localStorage.getItem('clickedUpdates')) || [];

document.addEventListener("DOMContentLoaded", () => {
    initHeartButtons();
    
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    checkForUpdates();

    // Render the specific parts of the notifications page
    if (document.getElementById('notification-container')) renderNotificationPage();
    if (document.getElementById('followed-list')) renderFollowedProjects();
});

function initHeartButtons() {
    const hearts = document.querySelectorAll('.heart-icon');
    hearts.forEach(btn => {
        const projectName = btn.getAttribute('data-project');
        
        // Update button text/state based on storage
        updateHeartUI(btn, followed.includes(projectName));

        btn.onclick = () => {
            const isFollowing = followed.includes(projectName);
            if (isFollowing) {
                followed = followed.filter(p => p !== projectName);
            } else {
                followed.push(projectName);
                checkForUpdates(); 
            }
            localStorage.setItem('followedProjects', JSON.stringify(followed));
            updateHeartUI(btn, !isFollowing);
            
            // If we are on the notifications page, refresh the "Following" list
            if (document.getElementById('followed-list')) renderFollowedProjects();
        };
    });
}

function updateHeartUI(btn, isActive) {
    if (isActive) {
        btn.classList.add('active');
        btn.querySelector('span').innerText = "Following";
    } else {
        btn.classList.remove('active');
        btn.querySelector('span').innerText = "Follow Project";
    }
}

async function checkForUpdates() {
    try {
        const response = await fetch(alerts.json);
        const allUpdates = await response.json();

        allUpdates.forEach(item => {
            const isProject = item.type === 'project';
            const isFollowed = followed.includes(item.project);
            const hasSeen = seenUpdates.includes(item.id);

            // ONLY show if user hasn't manually dismissed (X) or clicked it yet
            if (!hasSeen && (!isProject || isFollowed)) {
                spawnToast(item);
            }
        });
    } catch (err) { console.error("Fetch error:", err); }
}

function spawnToast(item) {
    if (document.querySelector(`[data-toast-id="${item.id}"]`)) return;

    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `update-toast ${item.type}`;
    toast.setAttribute('data-toast-id', item.id);
    
    // X is now top right
    toast.innerHTML = `
        <span class="toast-close" onclick="dismissToast('${item.id}')">&times;</span>
        <div class="toast-content">
            <h4>${item.project}</h4>
            <p>${item.changelog}</p>
            <div class="toast-actions">
                <a href="${item.viewUrl}" class="btn-view" onclick="markAsClicked('${item.id}')">Learn More</a>
            </div>
        </div>
    `;
    container.appendChild(toast);
}

window.dismissToast = (id) => {
    const toast = document.querySelector(`[data-toast-id="${id}"]`);
    if (toast) toast.remove();
    markAsSeen(id); // ONLY mark as seen when they actually click the X
};

function markAsSeen(id) {
    if (!seenUpdates.includes(id)) {
        seenUpdates.push(id);
        localStorage.setItem('seenUpdates', JSON.stringify(seenUpdates));
    }
}

function markAsClicked(id) {
    markAsSeen(id); // Clicking 'Learn More' also counts as seeing it
    if (!clickedUpdates.includes(id)) {
        clickedUpdates.push(id);
        localStorage.setItem('clickedUpdates', JSON.stringify(clickedUpdates));
    }
}

// DISPLAYS ALL PREVIOUS NOTIFICATIONS (Even if unfollowed)
async function renderNotificationPage() {
    const container = document.getElementById('notification-container');
    const response = await fetch(UPDATES_FILE);
    const data = await response.json();

    // Show alerts + updates for anything they HAVE EVER SEEN
    container.innerHTML = data.filter(upd => seenUpdates.includes(upd.id)).map(upd => {
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

// DISPLAYS CURRENTLY FOLLOWED PROJECTS
function renderFollowedProjects() {
    const list = document.getElementById('followed-list');
    if (followed.length === 0) {
        list.innerHTML = "<p>You aren't following any projects yet.</p>";
        return;
    }
    list.innerHTML = followed.map(p => `
        <div class="followed-item">
            <span>${p}</span>
            <button onclick="unfollowManual('${p}')">Unfollow</button>
        </div>
    `).join('');
}

window.unfollowManual = (name) => {
    followed = followed.filter(p => p !== name);
    localStorage.setItem('followedProjects', JSON.stringify(followed));
    location.reload();
};
