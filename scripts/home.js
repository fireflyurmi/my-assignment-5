let allIssues = [];
let currentActiveTab = 'all';

// get elements
const spinner = document.getElementById('loading-spinner');
const wrapper = document.getElementById('cards-wrapper');
const issueCount = document.getElementById('issue-count');

// modal elements
const modal = document.getElementById('issue_modal');
const modalTitle = document.getElementById('modal-title');
const modalMeta = document.getElementById('modal-meta');
const modalDesc = document.getElementById('modal-desc');
const modalAssignee = document.getElementById('modal-assignee');
const modalLabels = document.getElementById('modal-labels');
const modalPriority = document.getElementById('modal-priority-badge');
const modalStatus = document.getElementById('modal-status-badge');


// styling
const styleMap = {
    high: { badge: "bg-red-50 text-red-400 border-red-100" },
    medium: { badge: "bg-orange-50 text-orange-400 border-orange-100" },
    low: { badge: "bg-gray-100 text-gray-400 border-gray-200" }
};

const labelStyleMap = {
    bug: "bg-red-50 text-red-400 border-red-100",
    "help wanted": "bg-orange-50 text-orange-400 border-orange-100",
    enhancement: "bg-emerald-50 text-emerald-400 border-emerald-100",
    "good first issue": "bg-blue-50 text-blue-400 border-blue-100",
    default: "bg-gray-50 text-gray-500 border-gray-100"
};


function generateLabels(labels) {
    return labels.map(l => {
        const style = labelStyleMap[l.toLowerCase()] || labelStyleMap.default;
        return `<span class="px-2 py-0.5 rounded text-[10px] font-bold border ${style}">
            ${l.toUpperCase()}
        </span>`;
    }).join('');
}


// issues loading
function loadIssues(query = '') {
    spinner.classList.remove('hidden');
    const url = query
        ? `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(query)}`
        : "https://phi-lab-server.vercel.app/api/v1/lab/issues";

    fetch(url)
        .then(res => res.json())
        .then(data => {
            allIssues = data.data || [];
            switchTab(currentActiveTab);
        })
        .catch(err => {
            console.error("Failed to load issues:", err);
        })
        .finally(() => {
            spinner.classList.add('hidden');
        });
}

// cards rendering
function renderCards(issues) {
    issueCount.innerText = `${issues.length} Issues`;
    wrapper.innerHTML = '';

    issues.forEach(issue => {
        const status = issue.status.toLowerCase();
        const isClosed = status === 'closed';

        const statusStyle = isClosed
            ? "border-t-purple-400"
            : "border-t-emerald-400";

        const statusIcon = isClosed
            ? "./assets/Closed- Status .png"
            : "./assets/Open-Status.png";

        const priorityBadge =
            styleMap[issue.priority.toLowerCase()]?.badge ||
            styleMap.low.badge;
        const card = document.createElement('div');

        card.className = `
            bg-white rounded-lg border border-gray-200 shadow-sm
            border-t-[3px] ${statusStyle}
            flex flex-col cursor-pointer
        `;
        card.onclick = () => showModal(issue.id);
        card.innerHTML = `
            <div class="p-4 grow">

                <div class="flex justify-between items-start mb-3">
                    <img src="${statusIcon}" class="w-5 h-5">

                    <span class="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase ${priorityBadge} border">
                        ${issue.priority}
                    </span>
                </div>

                <h4 class="font-bold text-gray-800 text-[13px] mb-1">
                    ${issue.title}
                </h4>

                <p class="text-[11px] text-gray-400 mb-4 line-clamp-2">
                    ${issue.description}
                </p>

                <div class="flex flex-wrap gap-2">
                    ${generateLabels(issue.labels)}
                </div>

            </div>

            <div class="px-4 py-3 border-t text-[11px] text-gray-400">
                <p>#${issue.id} by ${issue.author}</p>
                <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
            </div>
        `;

        wrapper.appendChild(card);
    });
}

// btn-toggling
function switchTab(tabType) {
    spinner.classList.remove('hidden');
    wrapper.style.display = "none";

    setTimeout(() => {
        currentActiveTab = tabType;
        const tabs = ['all', 'open', 'closed'];

        tabs.forEach(tab => {
            const btn = document.getElementById(`btn-${tab}`);

            btn.classList.toggle('bg-indigo-600', tab === tabType);
            btn.classList.toggle('text-white', tab === tabType);
            btn.classList.toggle('bg-white', tab !== tabType);
            btn.classList.toggle('text-gray-600', tab !== tabType);

        });

        let filtered = allIssues;

        if (tabType === 'open') {
            filtered = allIssues.filter(i => i.status.toLowerCase() === 'open');
        }else if (tabType === 'closed') {
            filtered = allIssues.filter(i => i.status.toLowerCase() === 'closed');
        }
        renderCards(filtered);

        spinner.classList.add('hidden');
        wrapper.style.display = "contents";

    }, 300);
}


// for modal 
function showModal(id) {
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
        .then(res => res.json())
        .then(res => {
            const data = res.data;
            modalTitle.innerText = data.title;
            const status = data.status.toLowerCase();

            modalStatus.innerText =
                status.charAt(0).toUpperCase() + status.slice(1);

            modalStatus.className =
                status === 'open'
                    ? "bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold"
                    : "bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold";

            modalMeta.innerText =
                ` • Opened by ${data.author} • ${new Date(data.createdAt).toLocaleDateString()}`;

            modalDesc.innerText = data.description;
            modalAssignee.innerText = data.assignee || "Not found";
            modalLabels.innerHTML = generateLabels(data.labels);

            modalPriority.innerText = data.priority.toUpperCase();

            const pColors = {
                high: "bg-red-500",
                medium: "bg-orange-400",
                low: "bg-gray-400"
            };

            modalPriority.className =
                `px-3 py-1 rounded-md text-[10px] font-bold text-white ${
                    pColors[data.priority.toLowerCase()] || 'bg-gray-400'
                }`;
            modal.showModal();
        });
}

// for search function
let searchTimeout;

document.getElementById('search-input')?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        loadIssues(e.target.value.trim());
    }, 500);
});

loadIssues();