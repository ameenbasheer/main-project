import { Link, NavLink } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiCloudRain, FiGrid, FiShoppingCart } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import logo from '../../assets/logo-green.png';

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const { cart } = useApp();
  const cartCount = cart.reduce((n, i) => n + i.quantity, 0);
  // Admins manage the platform — shopping links (marketplace/weather/cart) don't apply.
  const isAdmin = user?.role === 'admin';

  const initials = (user?.name || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const tabClass = ({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`;
  const tabIconClass = ({ isActive }) =>
    `nav-tab !px-3 ${isActive ? 'active' : ''}`;

  return (
    <nav className="w-full flex items-center justify-between pb-3 relative z-10">
      <Link to="/" className="flex items-center">
        <img src={logo} alt="GrownRoot" className="h-15 w-auto object-contain" />
      </Link>

      {/* Public navigation links (hidden for admins) */}
      {!isAdmin && (
        <div className="hidden md:flex items-center gap-2 bg-dark-surface/40 border border-dark-border rounded-full p-1">
          <NavLink to="/marketplace" className={tabClass}>
            <FiShoppingBag size={15} />
            Marketplace
          </NavLink>
          <NavLink to="/weather" className={tabClass}>
            <FiCloudRain size={15} />
            Weather
          </NavLink>
          {isAuthenticated && user?.role === 'farmer' && (
            <NavLink to="/dashboard" className={tabClass}>
              <FiGrid size={15} />
              Dashboard
            </NavLink>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Mobile nav links (hidden for admins) */}
        {!isAdmin && (
          <div className="flex md:hidden items-center gap-1 bg-dark-surface/40 border border-dark-border rounded-full p-1">
            <NavLink to="/marketplace" className={tabIconClass} aria-label="Marketplace">
              <FiShoppingBag size={16} />
            </NavLink>
            <NavLink to="/weather" className={tabIconClass} aria-label="Weather">
              <FiCloudRain size={16} />
            </NavLink>
          </div>
        )}

        {isAuthenticated ? (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart with item-count badge (hidden for admins) */}
            {!isAdmin && (
              <NavLink to="/cart" className={tabIconClass} aria-label="Cart">
                <span className="relative inline-flex">
                  <FiShoppingCart size={16} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </span>
              </NavLink>
            )}
            {/* Profile picture — opens the profile page (orders & logout live there) */}
            <Link to="/profile" aria-label="Profile" className="shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border border-accent/40 hover:border-accent transition-colors"
                />
              ) : (
                <span className="w-9 h-9 rounded-full bg-accent/15 text-accent flex items-center justify-center text-xs font-bold border border-accent/40 hover:border-accent transition-colors">
                  {initials}
                </span>
              )}
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="pill-btn text-sm !py-2 !px-4 flex items-center gap-1">
              <FiUser size={14} />
              Login
            </Link>
            <Link to="/register" className="pill-btn text-sm !py-2 !px-4 hidden sm:flex">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
