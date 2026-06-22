import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Sidebar({ links = [] }) {
  return (
    <aside className="w-56 lg:w-64 min-h-screen border-r border-dark-border bg-dark-surface hidden md:flex flex-col py-6 px-3 shrink-0 me-4">
      <nav className="flex flex-col gap-1 flex-1 mt-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `sidebar-link flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors no-underline ${isActive
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
  );
}
