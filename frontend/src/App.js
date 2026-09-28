import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
export const App = () => {
    return (_jsx(ThemeProvider, { children: _jsx(AuthProvider, { children: _jsx(BrowserRouter, { children: _jsx(AppRoutes, {}) }) }) }));
};
export default App;
//# sourceMappingURL=App.js.map