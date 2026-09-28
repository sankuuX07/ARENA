import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const PageHeader = ({ title, description, subtitle, icon, action, badge, }) => {
    return (_jsxs("div", { className: "page-header-container", children: [_jsxs("div", { children: [_jsxs("div", { className: "page-header-title-box", children: [icon && _jsx("div", { className: "page-header-icon", children: icon }), _jsx("h1", { className: "page-title", children: title }), badge] }), description && _jsx("p", { className: "page-header-description", children: description }), subtitle && _jsx("p", { className: "page-header-subtitle", children: subtitle })] }), action && _jsx("div", { className: "page-header-action", children: action })] }));
};
//# sourceMappingURL=PageHeader.js.map