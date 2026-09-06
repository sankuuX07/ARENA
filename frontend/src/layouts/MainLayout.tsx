import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/routes/PageTransition';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const isLandingPage = location.pathname === '/';
  
  // Also consider login and register pages as pages that should not have a sidebar,
  // though isAuthenticated check already handles it for logged out users.
  // We want to ensure no sidebar on auth pages even if there's a routing glitch.
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  const shouldShowSidebar = !isLandingPage && !isAuthPage && isAuthenticated;

  return (
    <div className="app-shell">
      <Header onToggleMobileSidebar={toggleMobileSidebar} />
      <div className="shell-body">
        {shouldShowSidebar && (
          <Sidebar
            mobileOpen={mobileSidebarOpen}
            onCloseMobileSidebar={closeMobileSidebar}
          />
        )}
        <main className={`shell-main ${(!shouldShowSidebar) ? 'full-width' : ''}`}>
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
