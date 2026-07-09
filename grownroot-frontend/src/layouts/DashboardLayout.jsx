import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import PageTransition from '../components/common/PageTransition';
import AskGrownRoot from '../components/dashboard/AskGrownRoot';

export default function DashboardLayout() {
  return (
    <div className="light-theme min-h-screen bg-gradient-dark relative">
      {/* Outer container kept identical to MainLayout so the Navbar/header matches
          across pages. The outer padding provides the side gutters; <main> just
          narrows the content column (max-w-7xl) without adding its own gutter. */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 md:px-14 lg:px-20 py-4 md:py-6">
        <Navbar />
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
