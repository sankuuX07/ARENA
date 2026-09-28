import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const Badge = ({ variant = 'primary', children, icon, className = '', style, }) => {
    return (_jsxs("span", { className: `arena-badge badge-${variant} ${className}`, style: style, children: [icon && _jsx("span", { className: "badge-icon", children: icon }), _jsx("span", { children: children })] }));
};
//# sourceMappingURL=Badge.js.map