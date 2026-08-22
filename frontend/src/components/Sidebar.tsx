import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NAV_ITEMS } from '../constants/navigation';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Button } from './ui/Button';

export interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobileSidebar?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen = false,
  onCloseMobileSidebar,
}) => {
  const navigate = useNavigate();
  const { userProfile, logout } = useAuth();

  const handleLogout = async () => {
    if (onCloseMobileSidebar) onCloseMobileSidebar();
    await logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    if (onCloseMobileSidebar) onCloseMobileSidebar();
    navigate('/profile');
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${mobileOpen ? 'active' : ''}`}
        onClick={onCloseMobileSidebar}
      />
      <aside className={`shell-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-content">
          <div>
            <div className="sidebar-group">
              <div className="sidebar-label">ARENA Platform</div>
              <ul className="sidebar-nav-list" onClick={onCloseMobileSidebar}>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.li 
                      key={item.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `sidebar-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <div className="sidebar-link-left">
                          <span className="sidebar-link-icon">
                            <Icon size={18} />
                          </span>
                          <span>{item.label}</span>
                        </div>
                        {item.isComingSoon && (
                          <span className="sidebar-badge">Soon</span>
                        )}
                      </NavLink>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div>
            {userProfile && (
              <div
                onClick={handleProfileClick}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  marginBottom: '0.75rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                }}
                title="View & Edit Student Profile"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <UserIcon size={14} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {userProfile.fullName}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                  {userProfile.email}
                </div>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              fullWidth
              icon={<LogOut size={14} />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
