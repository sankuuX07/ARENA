import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
export const ErrorAlert = ({ title = 'Something went wrong', message, onRetry, }) => {
    return (_jsxs("div", { className: "error-alert", children: [_jsxs("div", { className: "error-alert-header", children: [_jsx(AlertTriangle, { className: "error-icon", size: 20 }), _jsx("h4", { className: "error-title", children: title })] }), _jsx("p", { className: "error-message", children: message }), onRetry && (_jsxs("button", { onClick: onRetry, className: "retry-button", children: [_jsx(RefreshCw, { size: 14 }), " Retry"] }))] }));
};
//# sourceMappingURL=ErrorAlert.js.map