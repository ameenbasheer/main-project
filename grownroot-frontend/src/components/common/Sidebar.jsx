import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo-green.png';

export default function Sidebar({ links = [] }) {
  return (
    <aside className="w-56 lg:w-64 min-h-screen border-r border-light-border bg-white hidden md:flex flex-col py-5 px-3 shrink-0">
      <NavLink to="/admin" className="flex items-center px-3 mb-4 no-underline">
        <img src={logo} alt="GrownRoot" className="h-8 w-auto object-contain" />
      </NavLink>
      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors no-underline ${
                isActive
                  ? 'text-accent bg-accent/10 font-semibold'
                  : 'text-light-muted hover:text-light-text hover:bg-accent/5'
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
