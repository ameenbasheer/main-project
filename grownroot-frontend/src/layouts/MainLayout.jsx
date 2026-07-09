import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import PageTransition from '../components/common/PageTransition';

export default function MainLayout() {
  return (
    <div className="light-theme min-h-screen bg-gradient-dark relative">
      <div className="max-w-[1400px] mx-auto px-1 sm:px-1.5 md:px-2 lg:px-3 py-4 md:py-6">
        <Navbar />
        <main className="pb-10">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
