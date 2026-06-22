import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiShoppingBag, FiCloudRain, FiGrid } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo-green.png';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabClass = ({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`;
  const tabIconClass = ({ isActive }) =>
    `nav-tab !px-3 ${isActive ? 'active' : ''}`;

  return (
    <nav className="w-full flex items-center justify-between pb-3 relative z-10">
      <Link to="/" className="flex items-center">
        <img src={logo} alt="GrownRoot" className="h-15 w-auto object-contain" />
      </Link>

      {/* Public navigation links */}
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

      <div className="flex items-center gap-3">
        {/* Mobile nav links */}
        <div className="flex md:hidden items-center gap-1 bg-dark-surface/40 border border-dark-border rounded-full p-1">
          <NavLink to="/marketplace" className={tabIconClass} aria-label="Marketplace">
            <FiShoppingBag size={16} />
          </NavLink>
          <NavLink to="/weather" className={tabIconClass} aria-label="Weather">
            <FiCloudRain size={16} />
          </NavLink>
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="text-dark-text text-sm hidden lg:block">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="pill-btn flex items-center gap-2 text-sm !py-2 !px-4"
            >
              <FiLogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
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
