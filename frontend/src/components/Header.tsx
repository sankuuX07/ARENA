import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Sun, Moon, Menu, LayoutDashboard, Home, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { APP_NAME } from '../constants';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export interface HeaderProps {
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, userProfile, logout } = useAuth();

  const getInitials = (name?: string): string => {
    if (!name) return 'ST';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="shell-header">
      <div className="header-container">
        <div className="header-left">
          {isAuthenticated && onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="mobile-menu-toggle"
              aria-label="Toggle navigation menu"
            >
              <Menu size={22} />
            </button>
          )}

          <Link to="/" className="brand-link">
            <div className="brand-logo-box">
              <Shield size={22} />
            </div>
            <span className="brand-title">{APP_NAME}</span>
            <Badge variant="primary">v4 Profile</Badge>
          </Link>
        </div>

        <div className="header-right">
          <nav className="header-nav-links">
            <Link
              to="/"
              className={`header-nav-item ${location.pathname === '/' ? 'active' : ''}`}
            >
              <Home size={16} />
              <span>Home</span>
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`header-nav-item ${location.pathname.startsWith('/dashboard') ? 'active' : ''}`}
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/profile"
                  className={`header-nav-item ${location.pathname.startsWith('/profile') ? 'active' : ''}`}
                >
                  <User size={16} />
                  <span>Profile</span>
                </Link>
              </>
            )}
          </nav>

          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                className="user-profile-badge"
                title={`Manage Profile: ${userProfile?.fullName || 'Student'}`}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/profile')}
              >
                <div className="avatar-circle" style={{ overflow: 'hidden' }}>
                  {userProfile?.profilePhotoUrl ? (
                    <img
                      src={userProfile.profilePhotoUrl}
                      alt={userProfile.fullName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    getInitials(userProfile?.fullName)
                  )}
                </div>
                <div className="user-info-text">
                  <span className="user-name">{userProfile?.fullName || 'Student Account'}</span>
                  <span className="user-role">Role: {userProfile?.role || 'student'}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" icon={<LogOut size={16} />} onClick={handleLogout} title="Logout">
                Logout
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="ghost" size="sm" icon={<LogIn size={16} />}>
                  Login
                </Button>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="sm" icon={<UserPlus size={16} />}>
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
