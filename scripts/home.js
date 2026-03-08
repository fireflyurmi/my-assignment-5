let allIssues = [];
let currentActiveTab = 'all';

// Configuration for Priority Styles
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

function loadIssues(query = '') {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.remove('hidden');
    
    let url = query 
        ? `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}` 
        : "https://phi-lab-server.vercel.app/api/v1/lab/issues";

    fetch(url)
        .then(res => res.json())
        .then(data => {
            allIssues = data.data; 
            switchTab(currentActiveTab); 
        })
        .finally(() => spinner.classList.add('hidden'));
}

function renderCards(issues) {
    const container = document.getElementById('card-container');
    document.getElementById('issue-count').innerText = `${issues.length} Issues`;
    container.innerHTML = '';

    issues.forEach(issue => {
        const isClosed = issue.status.toLowerCase() === 'closed';
        const statusStyle = isClosed ? "border-t-purple-400" : "border-t-emerald-400";
        const statusIcon = isClosed ? "./assets/Closed- Status .png" : "./assets/Open-Status.png";
        const priorityBadge = styleMap[issue.priority.toLowerCase()]?.badge || styleMap.low.badge;

        const card = document.createElement('div');
        card.className = `bg-white rounded-lg border border-gray-200 shadow-sm border-t-[3px] ${statusStyle} flex flex-col cursor-pointer`;
        card.onclick = () => showModal(issue.id);

        card.innerHTML = `
            <div class="p-4 flex-grow">
                <div class="flex justify-between items-start mb-3">
                    <img src="${statusIcon}" class="w-5 h-5">
                    <span class="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase ${priorityBadge} border">
                        ${issue.priority}
                    </span>
                </div>
                <h4 class="font-bold text-gray-800 text-[13px] mb-1">${issue.title}</h4>
                <p class="text-[11px] text-gray-400 mb-4 line-clamp-2">${issue.description}</p>
                <div class="flex flex-wrap gap-2">
                    ${issue.labels.map(l => {
                        const style = labelStyleMap[l.toLowerCase()] || labelStyleMap.default;
                        return `<span class="px-2 py-0.5 rounded text-[10px] font-bold border ${style}">${l.toUpperCase()}</span>`;
                    }).join('')}
                </div>
            </div>
            <div class="px-4 py-3 border-t text-[11px] text-gray-400">
                <p>#${issue.id} by ${issue.author}</p>
                <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

function switchTab(tabType) {
    currentActiveTab = tabType;
    
    const tabs = ['all', 'open', 'closed'];
    tabs.forEach(tab => {
        const btn = document.getElementById(`btn-${tab}`);
        if(btn) {
            btn.classList.toggle('bg-indigo-600', tab === tabType);
            btn.classList.toggle('text-white', tab === tabType);
            btn.classList.toggle('bg-white', tab !== tabType);
            btn.classList.toggle('text-gray-600', tab !== tabType);
        }
    });

    let filtered = allIssues;
    if (tabType === 'open') filtered = allIssues.filter(i => i.status.toLowerCase() === 'open');
    else if (tabType === 'closed') filtered = allIssues.filter(i => i.status.toLowerCase() === 'closed');
    
    renderCards(filtered);
}