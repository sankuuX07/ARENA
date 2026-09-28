import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Loader2 } from 'lucide-react';
export const LoadingSpinner = ({ message = 'Loading...', size = 24, }) => {
    return (_jsxs("div", { className: "spinner-container", children: [_jsx(Loader2, { className: "spinner-icon", size: size }), message && _jsx("span", { className: "spinner-text", children: message })] }));
};
//# sourceMappingURL=LoadingSpinner.js.map