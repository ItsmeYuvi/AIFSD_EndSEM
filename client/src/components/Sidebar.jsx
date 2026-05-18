import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  BrainCircuit,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';

/**
 * Sidebar - Main navigation sidebar with glassmorphism styling.
 * Always visible on lg+ screens, collapsible drawer on mobile.
 */
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/employees', icon: Users, label: 'Employees' },
    { to: '/ai-insights', icon: BrainCircuit, label: 'AI Insights' }
  ];

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: 'linear-gradient(135deg, #06d6a0, #3b82f6)'
        }}>
          <Sparkles size={20} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '16px', fontWeight: 'bold', color: '#f1f1f7', margin: 0 }}>PerformAI</h1>
          <p style={{ fontSize: '12px', color: '#8b8b9e', margin: 0 }}>HR Intelligence</p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setIsOpen(false)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              transition: 'all 0.2s',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              background: isActive ? 'rgba(6, 214, 160, 0.1)' : 'transparent',
              color: isActive ? '#06d6a0' : '#8b8b9e',
              border: isActive ? '1px solid rgba(6, 214, 160, 0.2)' : '1px solid transparent'
            })}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Card */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          padding: '12px',
          borderRadius: '12px',
          marginBottom: '12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#f1f1f7', margin: 0 }}>
            {user?.name || 'Admin'}
          </p>
          <p style={{ fontSize: '12px', color: '#8b8b9e', margin: '2px 0 0 0' }}>
            {user?.email || 'admin@company.com'}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      {!isDesktop && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'fixed',
            top: '16px',
            left: '16px',
            zIndex: 50,
            padding: '8px',
            borderRadius: '12px',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#f1f1f7'
          }}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Desktop Sidebar */}
      {isDesktop && (
        <aside style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 40,
          height: '100%',
          width: '260px',
          background: 'rgba(12, 12, 20, 0.95)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(30px)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <SidebarContent />
        </aside>
      )}

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {!isDesktop && isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 30,
                background: 'rgba(0,0,0,0.6)'
              }}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 40,
                height: '100%',
                width: '260px',
                background: 'rgba(12, 12, 20, 0.98)',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(30px)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
