import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FiHome, FiUsers, FiPackage, FiMenu, FiSettings } from 'react-icons/fi';
import Sidebar from '../components/common/Sidebar';
import MobileSidebar from '../components/common/MobileSidebar';
import Navbar from '../components/common/Navbar';
import PageTransition from '../components/common/PageTransition';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: <FiHome />, end: true },
  { to: '/admin/users', label: 'Manage Users', icon: <FiUsers /> },
  { to: '/admin/products', label: 'Manage Products', icon: <FiPackage /> },
  { to: '/admin/settings', label: 'Settings', icon: <FiSettings /> },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-dark flex">
      <Sidebar links={adminLinks} />
      <MobileSidebar
        links={adminLinks}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <div className="flex items-center md:hidden px-4 pt-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white p-2 hover:bg-white/5 rounded-lg"
          >
            <FiMenu size={22} />
          </button>
        </div>
        <div className="hidden md:block px-6 md:px-8 lg:px-10">
          <Navbar />
        </div>
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
