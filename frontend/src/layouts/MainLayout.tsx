import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/routes/PageTransition';
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
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
      {isLandingPage && <Footer />}
    </div>
  );
};
