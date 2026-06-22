import { useApp } from '../../context/AppContext';
import StatsCard from '../../components/dashboard/StatsCard';
import { FiAlertTriangle, FiTrash2 } from 'react-icons/fi';
import { DecorativeCircle, DecorativeDot } from '../../components/common/DecorativeElements';

export default function AdminDashboard() {
  const { users, products, deleteUser, deleteProduct } = useApp();

  const activeFarmers = users.filter(u => u.role === 'farmer' && u.status === 'active').length;
  const totalRegistered = users.length;
  const pendingProducts = products.length;

  return (
    <div className="relative">
      <DecorativeCircle size="lg" className="-top-20 -left-20 opacity-20" />
      <DecorativeDot size={20} className="top-16 left-1/3 bg-accent/30" />

      {/* Header */}
      <div className="mb-8 relative z-10">
        <h1 className="text-3xl md:text-4xl font-light text-white">Admin</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-white">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Left column: stats */}
        <div className="lg:col-span-1 space-y-4">
          {/* Image */}
          <div className="img-showcase h-64 bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center">
            <span className="text-6xl">📊</span>
          </div>

          <StatsCard number="01" label="User Management Tools" />
          <StatsCard number="02" label="Product Approval & Moderation Queue" />
        </div>

        {/* Center: Dashboard visual */}
        <div className="lg:col-span-1">
          <div className="img-showcase h-64 lg:h-full bg-gradient-to-b from-accent/5 to-primary/10 flex items-center justify-center">
            <div className="text-center p-6">
              <span className="text-7xl block mb-4">🖥️</span>
              <p className="text-dark-muted text-sm">Admin Control Panel</p>
            </div>
          </div>
        </div>

        {/* Right column: overview */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-5">
            <span className="text-accent text-xs font-semibold mb-2 block">10</span>
            <h3 className="text-white font-bold text-lg mb-4">Platform Overview & User Management</h3>
            <hr className="border-dark-border mb-4" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Active Farmers</p>
                  <p className="text-accent text-xs">{totalRegistered} registered</p>
                </div>
                <span className="text-white font-bold">
                  {Math.round((activeFarmers / totalRegistered) * 100)}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Pending Products</p>
                  <p className="text-accent text-xs">{pendingProducts} awaiting approval</p>
                </div>
                <span className="text-white font-bold">{pendingProducts}</span>
              </div>
            </div>

            <button className="mt-4 flex items-center gap-2 text-accent text-sm pill-btn !py-2 !px-4 w-full justify-center">
              <FiAlertTriangle size={14} />
              Review flagged items
            </button>
          </div>

          <div className="glass-card p-5">
            <span className="text-accent text-xs font-semibold mb-2 block">03</span>
            <h3 className="text-white font-bold text-base">Manage Users</h3>
            <p className="text-dark-muted text-xs mt-1">+{totalRegistered} users</p>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="mt-10 relative z-10">
        <h3 className="text-white font-semibold text-lg mb-4">All Users</h3>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left text-dark-muted font-medium px-5 py-3">Name</th>
                  <th className="text-left text-dark-muted font-medium px-5 py-3">Email</th>
                  <th className="text-left text-dark-muted font-medium px-5 py-3">Role</th>
                  <th className="text-left text-dark-muted font-medium px-5 py-3">Status</th>
                  <th className="text-right text-dark-muted font-medium px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-dark-border/50 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3 text-white">{u.name}</td>
                    <td className="px-5 py-3 text-dark-muted">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        u.role === 'farmer' ? 'bg-accent/15 text-accent' : 'bg-blue-500/15 text-blue-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        u.status === 'active' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="text-dark-muted hover:text-red-400 transition-colors"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Products table */}
      <div className="mt-8 relative z-10">
        <h3 className="text-white font-semibold text-lg mb-4">All Products</h3>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left text-dark-muted font-medium px-5 py-3">Product</th>
                  <th className="text-left text-dark-muted font-medium px-5 py-3">Price</th>
                  <th className="text-left text-dark-muted font-medium px-5 py-3">Farmer</th>
                  <th className="text-left text-dark-muted font-medium px-5 py-3">Location</th>
                  <th className="text-right text-dark-muted font-medium px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-dark-border/50 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3 text-white">{p.name}</td>
                    <td className="px-5 py-3 text-accent font-semibold">${p.price.toFixed(2)}{p.unit}</td>
                    <td className="px-5 py-3 text-dark-muted">{p.farmer}</td>
                    <td className="px-5 py-3 text-dark-muted">{p.location}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="text-dark-muted hover:text-red-400 transition-colors"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
