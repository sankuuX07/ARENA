import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { APP_NAME, APP_TAGLINE } from '../constants';
export const Footer = () => {
    return (_jsx("footer", { className: "footer", children: _jsxs("div", { className: "footer-container", children: [_jsxs("div", { className: "footer-info", children: [_jsx("h4", { children: APP_NAME }), _jsx("p", { children: APP_TAGLINE })] }), _jsx("div", { className: "footer-meta", children: _jsxs("p", { children: ["\u00A9 ", new Date().getFullYear(), " ARENA Platform. Milestone 1 Architecture Established."] }) })] }) }));
};
//# sourceMappingURL=Footer.js.map