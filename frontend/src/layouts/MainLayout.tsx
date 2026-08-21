import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isLandingPage = location.pathname === '/';

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="app-shell">
      <Header onToggleMobileSidebar={toggleMobileSidebar} />
      <div className="shell-body">
        {!isLandingPage && (
          <Sidebar
            mobileOpen={mobileSidebarOpen}
            onCloseMobileSidebar={closeMobileSidebar}
          />
        )}
        <main className={`shell-main ${isLandingPage ? 'full-width' : ''}`}>
          <Outlet />
        </main>
      </div>
      {isLandingPage && <Footer />}
    </div>
  );
};
