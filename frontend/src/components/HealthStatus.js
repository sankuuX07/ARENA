import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useHealthCheck } from '../hooks/useHealthCheck';
import { CheckCircle2, XCircle, RefreshCw, Server } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
export const HealthStatus = () => {
    const { data, loading, error, refetch } = useHealthCheck();
    return (_jsxs("div", { className: "health-card", children: [_jsxs("div", { className: "health-card-header", children: [_jsxs("div", { className: "health-card-title", children: [_jsx(Server, { size: 18, className: "text-accent" }), _jsx("span", { children: "Backend Connectivity Test" })] }), _jsx("button", { onClick: refetch, className: "icon-button", title: "Refresh health check", disabled: loading, children: _jsx(RefreshCw, { size: 15, className: loading ? 'spin' : '' }) })] }), _jsx("div", { className: "health-card-body", children: loading ? (_jsx(LoadingSpinner, { message: "Testing GET /api/health...", size: 18 })) : error ? (_jsxs("div", { className: "health-status error", children: [_jsx(XCircle, { size: 20, className: "status-icon" }), _jsxs("div", { children: [_jsx("div", { className: "status-label", children: "Backend Unreachable" }), _jsx("div", { className: "status-detail", children: error })] })] })) : data ? (_jsxs("div", { className: "health-status success", children: [_jsx(CheckCircle2, { size: 20, className: "status-icon" }), _jsxs("div", { children: [_jsxs("div", { className: "status-label", children: ["Connected (", data.service, ")"] }), _jsxs("div", { className: "status-detail", children: ["Status: ", _jsx("strong", { children: data.status })] })] })] })) : null })] }));
};
//# sourceMappingURL=HealthStatus.js.map