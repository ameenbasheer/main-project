import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import PageTransition from '../components/common/PageTransition';
import AskGrownRoot from '../components/dashboard/AskGrownRoot';

export default function DashboardLayout() {
  return (
    <div className="light-theme min-h-screen bg-gradient-dark relative">
      {/* Navbar spans full width */}
      <div className="w-screen px-1 sm:px-1.5 md:px-2 px-3 py-3 md:py-6 border-b border-dark-border">
        <Navbar />
      </div>
      {/* Content with padding */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-1.5 md:px-2 lg:px-3">
        <main className="relative z-10 max-w-7xl mx-auto py-5">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
      {/* AI chat assistant — floats over every dashboard page */}
      <AskGrownRoot />
    </div>
  );
}
