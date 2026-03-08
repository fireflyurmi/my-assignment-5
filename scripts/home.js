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