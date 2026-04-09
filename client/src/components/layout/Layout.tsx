import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.scss';

// --- Minimal Inline SVGs for Premium Look ---
const Icons = {
  Dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"></rect><rect x="14" y="3" width="7" height="5" rx="1"></rect><rect x="14" y="12" width="7" height="9" rx="1"></rect><rect x="3" y="16" width="7" height="5" rx="1"></rect></svg>,
  Settlements: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  Discrepancies: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  Logs: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>,
  Sun: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>,
  Moon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
};

const NavLinks = [
  { name: 'Dashboard', path: '/', icon: Icons.Dashboard },
  { name: 'Settlements', path: '/settlements', icon: Icons.Settlements },
  { name: 'Discrepancies', path: '/discrepancies', icon: Icons.Discrepancies },
  { name: 'System Logs', path: '/logs', icon: Icons.Logs },
];

interface LayoutProps {
  children: React.ReactNode;
  toggleTheme: () => void;
  isDark: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, toggleTheme, isDark }) => {
  const location = useLocation();

  const handleManualTrigger = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/settlements/trigger-reconciliation', {
        method: 'POST'
      });
      if (response.ok) {
        alert('Reconciliation engine initiated manually. Check System Logs for status.');
      } else {
        alert('Failed to initiate reconciliation. Check server connectivity.');
      }
    } catch (error) {
      console.error("Manual trigger error:", error);
      alert('An error occurred while contacting the server.');
    }
  };

  return (
    <div className="layout-root">
      {/* --- Sidebar Navigation --- */}
      <aside className="layout-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">CB</div>
          <span className="brand-name">CleverBooks</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group-label">Main Menu</div>
          {NavLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
              >
                <span className="nav-icon">{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button 
            className="trigger-reconciliation-btn" 
            onClick={handleManualTrigger}
          >
            Run Reconciliation
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="layout-main">
        <header className="main-header">
          <h2 className="header-page-title">
            {NavLinks.find(l => l.path === location.pathname)?.name || 'Dashboard'}
          </h2>

          <div className="header-actions">
            <button 
              onClick={toggleTheme} 
              className="theme-toggle-btn"
              aria-label="Toggle Theme"
            >
              {isDark ? Icons.Sun : Icons.Moon}
            </button>
            <div className="profile-badge">
              <span>Admin</span>
            </div>
          </div>
        </header>

        {/* Animation re-triggers on path change via the key */}
        <div className="main-content-scroll" key={location.pathname}>
          <div className="animate-graceful">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};