import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

// Account pages (any logged-in user)
import Profile from '../pages/Profile';
import Cart from '../pages/Cart';
import MyOrders from '../pages/MyOrders';

// Farmer pages
import FarmerDashboard from '../pages/farmer/FarmerDashboard';
import CropManagement from '../pages/farmer/CropManagement';
import AddCrop from '../pages/farmer/AddCrop';
import CropDetail from '../pages/farmer/CropDetail';
import CropSuggestions from '../pages/farmer/CropSuggestions';
import DiseaseDetection from '../pages/farmer/DiseaseDetection';
import WeatherPage from '../pages/farmer/WeatherPage';
import FarmerOnboarding from '../pages/farmer/FarmerOnboarding';
import FarmerCalendar from '../pages/farmer/FarmerCalendar';

// Marketplace pages
import MarketplacePage from '../pages/marketplace/MarketplacePage';
import ProductDetail from '../pages/marketplace/ProductDetail';
import AddProduct from '../pages/marketplace/AddProduct';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminProducts from '../pages/admin/AdminProducts';

// Route protection
import { ProtectedRoute, AdminRoute, FarmerRoute } from './ProtectedRoute';

// Smooth page entrance for layout-less routes
import PageTransition from '../components/common/PageTransition';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
      <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
      <Route path="/onboarding" element={
        <FarmerRoute>
          <PageTransition><FarmerOnboarding /></PageTransition>
        </FarmerRoute>
      } />

      {/* Marketplace & Weather (public — browse without login) */}
      <Route element={<MainLayout />}>
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/:id" element={<ProductDetail />} />
        {/* WeatherPage self-manages no horizontal gutter, so mirror DashboardLayout's
            <main> wrapper here (MainLayout's <main> has none). Keep these classes in
            sync with DashboardLayout.jsx. The `!` overrides the global `*{padding:0}` reset. */}
        <Route path="/weather" element={
          <main className="max-w-7xl mx-auto px-[1.5rem]! sm:px-[2.5rem]! md:px-[4rem]! lg:px-[6rem]! py-5">
            <WeatherPage />
          </main>
        } />

        {/* Account pages — any authenticated user (farmer or buyer) */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
      </Route>
      <Route path="/marketplace/add" element={
        <ProtectedRoute>
          <PageTransition><AddProduct /></PageTransition>
        </ProtectedRoute>
      } />

      {/* Farmer dashboard (farmer-only) */}
      <Route path="/dashboard" element={
        <FarmerRoute>
          <DashboardLayout />
        </FarmerRoute>
      }>
        <Route index element={<FarmerDashboard />} />
        <Route path="crops" element={<CropManagement />} />
        <Route path="crops/add" element={<AddCrop />} />
        <Route path="crops/:id" element={<CropDetail />} />
        <Route path="calendar" element={<FarmerCalendar />} />
        <Route path="suggest" element={<CropSuggestions />} />
        <Route path="disease" element={<DiseaseDetection />} />
        <Route path="weather" element={<WeatherPage />} />
      </Route>

      {/* Admin dashboard (admin only) */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
      </Route>
    </Routes>
  );
}
