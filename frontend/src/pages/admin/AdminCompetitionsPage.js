import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Plus } from 'lucide-react';
const AdminCompetitionsPage = () => {
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        adminService.getCompetitions()
            .then(setCompetitions)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);
    return (_jsxs("div", { className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight text-white", children: "Competition Management" }), _jsx("p", { className: "text-gray-400 mt-2", children: "Create and manage coding and aptitude competitions." })] }), _jsxs("button", { className: "flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-red-500/20", children: [_jsx(Plus, { className: "w-5 h-5" }), "Create Competition"] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: loading ? (_jsx("div", { className: "col-span-full text-gray-400 text-center py-8", children: "Loading competitions..." })) : competitions.map(comp => (_jsxs("div", { className: "bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("h3", { className: "text-xl font-semibold text-white", children: comp.title }), _jsx("span", { className: `px-2.5 py-1 rounded-md text-xs font-medium uppercase ${comp.status === 'live' ? 'bg-green-500/10 text-green-400' :
                                        comp.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-800 text-gray-400'}`, children: comp.status })] }), _jsx("p", { className: "text-gray-400 text-sm line-clamp-2 mb-4", children: comp.description }), _jsxs("div", { className: "flex justify-between items-center text-sm text-gray-500", children: [_jsx("span", { children: comp.type }), _jsxs("span", { children: [comp.participantCount, " participants"] })] })] }, comp.competitionId))) })] }));
};
export default AdminCompetitionsPage;
//# sourceMappingURL=AdminCompetitionsPage.js.map