import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import PageTransition from '../components/common/PageTransition';
import AskGrownRoot from '../components/dashboard/AskGrownRoot';

export default function DashboardLayout() {
  return (
    <div className="light-theme min-h-screen bg-gradient-dark relative">
      {/* Outer container kept identical to MainLayout so the Navbar/header matches
          across pages. Side gutters live on <main> below, not here, so they don't
          inset the header. */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 md:px-14 lg:px-20 py-4 md:py-6">
        <Navbar />
        <main className="relative z-10 max-w-7xl mx-auto px-[1.5rem]! sm:px-[2.5rem]! md:px-[4rem]! lg:px-[6rem]! py-5">
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
