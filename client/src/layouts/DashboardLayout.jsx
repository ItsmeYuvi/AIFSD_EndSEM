import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

/**
 * DashboardLayout - Main layout wrapper with sidebar and content area.
 * Using inline styles to ensure perfect layout.
 */
const DashboardLayout = () => {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0a0a0f',
      overflowX: 'hidden'
    }}>
      <Sidebar />
      {/* Main Content */}
      <main style={{
        flex: 1,
        minHeight: '100vh',
        marginLeft: window.innerWidth >= 1024 ? '260px' : '0', // Adjust based on lg breakpoint
        padding: '24px',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'margin-left 0.3s ease'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
