import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiPackage,
  FiShoppingBag,
  FiUserCheck,
  FiUserX,
  FiArrowRight,
} from 'react-icons/fi';
import { GiFarmer } from 'react-icons/gi';
import { useApp } from '../../context/AppContext';

function StatTile({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-light-border bg-white p-4 flex items-center gap-3">
      <span className="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
        {icon}
      </span>
      <div>
        <p className="text-light-text font-bold text-2xl leading-none">{value}</p>
        <p className="text-light-muted text-xs mt-1">{label}</p>
      </div>
    </div>
  );
}

function QuickLink({ to, icon, title, subtitle }) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-light-border bg-white p-5 no-underline group flex items-start gap-4 hover:border-accent/40 transition-colors"
    >
      <span className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
        {icon}
      </span>
      <div className="flex-1">
        <h3 className="text-light-text font-semibold flex items-center gap-2">
          {title}
          <FiArrowRight size={15} className="text-accent group-hover:translate-x-1 transition-transform" />
        </h3>
        <p className="text-light-muted text-sm mt-1">{subtitle}</p>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const { users, products } = useApp();

  const stats = useMemo(
    () => ({
      total: users.length,
      farmers: users.filter((u) => u.role === 'farmer').length,
      buyers: users.filter((u) => u.role === 'buyer').length,
      active: users.filter((u) => u.status === 'active').length,
      inactive: users.filter((u) => u.status === 'inactive').length,
      products: products.length,
    }),
    [users, products]
  );

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl md:text-3xl font-light text-light-text">Admin</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-accent">Overview</h2>
        <p className="text-light-muted text-sm mt-2">Platform activity at a glance.</p>
      </div>

      {/* Stats — gap (not margin) drives the rhythm so nothing collapses */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        <StatTile icon={<FiUsers size={20} />} label="Total users" value={stats.total} />
        <StatTile icon={<GiFarmer size={20} />} label="Farmers" value={stats.farmers} />
        <StatTile icon={<FiShoppingBag size={20} />} label="Buyers" value={stats.buyers} />
        <StatTile icon={<FiUserCheck size={20} />} label="Active" value={stats.active} />
        <StatTile icon={<FiUserX size={20} />} label="Deactivated" value={stats.inactive} />
        <StatTile icon={<FiPackage size={20} />} label="Products" value={stats.products} />
      </div>

      {/* Quick links to the management pages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuickLink
          to="/admin/users"
          icon={<FiUsers size={22} />}
          title="Manage Users"
          subtitle="Activate or deactivate accounts and remove users."
        />
        <QuickLink
          to="/admin/products"
          icon={<FiPackage size={22} />}
          title="Manage Products"
          subtitle="Moderate the marketplace and remove listings."
        />
      </div>
    </div>
  );
}
