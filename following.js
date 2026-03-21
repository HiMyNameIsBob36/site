/* --- FAVORITES & NOTIFICATIONS LOGIC --- */

const UPDATES_FILE = '../updates.json'; // Ensure path is correct

// Initialize Storage
let followed = JSON.parse(localStorage.getItem('followedProjects')) || [];
let seenUpdates = JSON.parse(localStorage.getItem('seenUpdates')) || [];
let clickedUpdates = JSON.parse(localStorage.getItem('clickedUpdates')) || [];

document.addEventListener("DOMContentLoaded", () => {
    initHeartButtons();
    checkForUpdates();
    if (document.getElementById('notification-container')) {
        renderNotificationPage();
    }
});

// 1. Setup Heart Icons
function initHeartButtons() {
    // Look for any element with class 'heart-icon'
    const hearts = document.querySelectorAll('.heart-icon');
    hearts.forEach(btn => {
        const projectName = btn.getAttribute('data-project');
        
        // Set initial state
        if (followed.includes(projectName)) btn.classList.add('active');

        btn.onclick = () => {
            if (followed.includes(projectName)) {
                followed = followed.filter(p => p !== projectName);
                btn.classList.remove('active');
            } else {
                followed.push(projectName);
                btn.classList.add('active');
            }
            localStorage.setItem('followedProjects', JSON.stringify(followed));
        };
    });
}

// 2. Check for New Updates
async function checkForUpdates() {
    try {
        const response = await fetch(updates.json);
        const allUpdates = await response.json();

        // Filter: Project must be followed AND update not seen yet
        const newUpdates = allUpdates.filter(upd => 
            followed.includes(upd.project) && !seenUpdates.includes(upd.id)
        );

        if (newUpdates.length > 0) {
            showUpdateToast(newUpdates[0], newUpdates.slice(1));
        }
    } catch (err) {
        console.error("Could not load updates", err);
    }
}

// 3. The Toast System
function showUpdateToast(update, queue) {
    const toast = document.createElement('div');
    toast.className = 'update-toast';
    toast.innerHTML = `
        <span class="toast-close">&times;</span>
        <div class="toast-content">
            <h4>${update.project} Update!</h4>
            <p>A project you are following has gotten an update! You can read the full changelog below.</p>
            <div class="toast-actions">
                <a href="${update.viewUrl}" class="btn-view" data-id="${update.id}">View</a>
                <button class="btn-unfollow" data-project="${update.project}">Unfollow</button>
            </div>
        </div>
    `;

    document.body.appendChild(toast);

    // Event: Close (Mark as seen)
    toast.querySelector('.toast-close').onclick = () => {
        markAsSeen(update.id);
        toast.classList.add('hide');
        setTimeout(() => {
            toast.remove();
            if (queue.length > 0) showUpdateToast(queue[0], queue.slice(1));
        }, 500);
    };

    // Event: View (Mark as clicked)
    toast.querySelector('.btn-view').onclick = () => {
        markAsClicked(update.id);
    };

    // Event: Unfollow
    toast.querySelector('.btn-unfollow').onclick = () => {
        followed = followed.filter(p => p !== update.project);
        localStorage.setItem('followedProjects', JSON.stringify(followed));
        toast.querySelector('.toast-close').click();
    };
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

// 4. Notifications Page Logic
async function renderNotificationPage() {
    const container = document.getElementById('notification-container');
    const response = await fetch(UPDATES_FILE);
    const allUpdates = await response.json();

    // Show updates for followed projects
    const history = allUpdates.filter(upd => followed.includes(upd.project));

    if (history.length === 0) {
        container.innerHTML = "<p>No notifications yet. Follow projects to see updates!</p>";
        return;
    }

    container.innerHTML = history.map(upd => {
        const hasRead = clickedUpdates.includes(upd.id);
        return `
            <div class="notif-item ${hasRead ? 'read' : 'unread'}">
                <div class="notif-info">
                    <strong>${upd.project}</strong>
                    <span>${upd.changelog}</span>
                </div>
                <a href="${upd.viewUrl}" class="notif-link" onclick="markAsClicked('${upd.id}')">View Details</a>
            </div>
        `;
    }).join('');
}
