import { NavLink } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import logo from '../../assets/logo-green.png';

export default function MobileSidebar({ links = [], isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      <aside className="fixed top-0 left-0 w-64 h-full bg-dark-bg border-r border-dark-border z-50 flex flex-col py-6 px-3 md:hidden">
        <div className="flex items-center justify-between px-3 mb-8">
          <span className="flex items-center">
            <img src={logo} alt="GrownRoot" className="h-8 w-auto object-contain" />
          </span>
          <button onClick={onClose} className="text-dark-muted hover:text-white">
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors no-underline ${
                  isActive
                    ? 'active text-accent bg-accent/10'
                    : 'text-dark-muted hover:text-white hover:bg-white/5'
                }`
              }
            >
              {link.icon && <span className="text-lg">{link.icon}</span>}
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
