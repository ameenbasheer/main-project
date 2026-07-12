import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import PageTransition from '../components/common/PageTransition';

export default function MainLayout() {
  return (
    <div className="light-theme min-h-screen bg-gradient-dark relative">
      {/* Navbar spans full width */}
      <div className="w-screen px-1 sm:px-1.5 md:px-2 px-3 px-3 py-2 md:py-6 border-b border-dark-border">
        <Navbar />
      </div>
      {/* Content with padding */}
      <div className="max-w-[1900px] mx-auto px-5 sm:px-1.5 md:px-2 lg:px-3">
        <main className="pb-10">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
