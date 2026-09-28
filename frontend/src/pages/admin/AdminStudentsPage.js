import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState, useMemo } from 'react';
import { adminService, AdminStudent } from '../../services/adminService';
import { Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
const AdminStudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    useEffect(() => {
        adminService.getStudents()
            .then(setStudents)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);
    const filteredStudents = useMemo(() => {
        if (!debouncedSearchTerm)
            return students;
        const lower = debouncedSearchTerm.toLowerCase();
        return students.filter(s => s.displayName.toLowerCase().includes(lower) ||
            s.email.toLowerCase().includes(lower));
    }, [students, debouncedSearchTerm]);
    const toggleStatus = async (uid, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            await adminService.updateStudentStatus(uid, newStatus);
            setStudents(students.map(s => s.uid === uid ? { ...s, status: newStatus } : s));
        }
        catch (e) {
            console.error("Failed to update status");
        }
    };
    return (_jsxs("div", { className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight text-white", children: "Student Management" }), _jsx("p", { className: "text-gray-400 mt-2", children: "Manage student accounts and view activity." })] }) }), _jsxs("div", { className: "bg-gray-900 border border-gray-800 rounded-2xl p-6", children: [_jsx("div", { className: "flex gap-4 mb-6", children: _jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" }), _jsx("input", { type: "text", placeholder: "Search students by name or email...", value: searchTerm, onChange: e => setSearchTerm(e.target.value), className: "w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors" })] }) }), loading ? (_jsx("div", { className: "text-gray-400 py-8 text-center", children: "Loading students..." })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left", children: [_jsx("thead", { className: "border-b border-gray-800 text-gray-400 text-sm", children: _jsxs("tr", { children: [_jsx("th", { className: "pb-4 font-medium", children: "Name" }), _jsx("th", { className: "pb-4 font-medium", children: "Email" }), _jsx("th", { className: "pb-4 font-medium", children: "Status" }), _jsx("th", { className: "pb-4 font-medium", children: "Actions" })] }) }), _jsxs("tbody", { className: "divide-y divide-gray-800/50", children: [filteredStudents.map(student => (_jsxs("tr", { className: "group", children: [_jsx("td", { className: "py-4 text-white font-medium", children: student.displayName }), _jsx("td", { className: "py-4 text-gray-400", children: student.email }), _jsx("td", { className: "py-4", children: _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`, children: student.status.toUpperCase() }) }), _jsx("td", { className: "py-4", children: _jsx("button", { onClick: () => toggleStatus(student.uid, student.status), className: "text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors", children: "Toggle Status" }) })] }, student.uid))), filteredStudents.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "py-8 text-center text-gray-500", children: "No students found." }) }))] })] }) }))] })] }));
};
export default AdminStudentsPage;
//# sourceMappingURL=AdminStudentsPage.js.map