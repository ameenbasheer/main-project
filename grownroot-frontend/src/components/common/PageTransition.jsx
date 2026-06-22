import { useLocation } from 'react-router-dom';

/**
 * Wraps page content in a smooth fade-up entrance. The `key={pathname}`
 * remounts the wrapper on every navigation, so the .page-enter animation
 * replays each time a new page loads. Drop this around an <Outlet /> (in a
 * layout) or around a standalone page element (in the route table).
 */
export default function PageTransition({ children, className = '' }) {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className={`page-enter ${className}`.trim()}>
      {children}
    </div>
  );
}
