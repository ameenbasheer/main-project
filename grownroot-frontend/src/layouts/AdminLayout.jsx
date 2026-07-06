import { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { FiHome, FiUsers, FiPackage, FiMenu, FiLogOut } from 'react-icons/fi';
import Sidebar from '../components/common/Sidebar';
import MobileSidebar from '../components/common/MobileSidebar';
import PageTransition from '../components/common/PageTransition';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
  { to: '/admin', label: 'Overview', icon: <FiHome />, end: true },
  { to: '/admin/users', label: 'Manage Users', icon: <FiUsers /> },
  { to: '/admin/products', label: 'Manage Products', icon: <FiPackage /> },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = (user?.name || 'A')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-light-bg flex">
      {/* Light sidebar — the primary admin navigation */}
      <Sidebar links={adminLinks} />
      <MobileSidebar links={adminLinks} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Admin top bar — no marketplace / weather / cart / orders here */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-light-border bg-white">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-light-text p-2 hover:bg-accent/10 rounded-lg"
            aria-label="Open menu"
          >
            <FiMenu size={22} />
          </button>

          <span className="text-light-text font-semibold tracking-tight">
            Grown<span className="text-accent">Root</span> Admin
          </span>

          <div className="ms-auto flex items-center gap-3">
            <Link to="/profile" className="flex items-center gap-2 no-underline group" title="Edit profile">
              <span className="w-9 h-9 rounded-full bg-accent/15 text-accent flex items-center justify-center text-xs font-bold border border-accent/30 group-hover:border-accent transition-colors">
                {initials}
              </span>
              <span className="hidden sm:block text-light-text text-sm font-medium">{user?.name}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm text-light-muted hover:text-red-600 border border-light-border hover:border-red-300 rounded-xl px-3 py-2 transition-colors"
            >
              <FiLogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-5">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
