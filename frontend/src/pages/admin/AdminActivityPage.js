import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Activity } from 'lucide-react';
const AdminActivityPage = () => {
    return (_jsxs("div", { className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight text-white", children: "Platform Activity" }), _jsx("p", { className: "text-gray-400 mt-2", children: "View safe audit logs and system events." })] }) }), _jsxs("div", { className: "bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Activity, { className: "w-8 h-8 text-gray-500" }) }), _jsx("h3", { className: "text-xl font-medium text-white mb-2", children: "No Recent Audits" }), _jsx("p", { className: "text-gray-400 max-w-sm mx-auto", children: "Audit logs will appear here when administrative actions are taken. Safe metadata is recorded automatically." })] })] }));
};
export default AdminActivityPage;
//# sourceMappingURL=AdminActivityPage.js.map