import { Link } from 'react-router-dom';
import { FiPlus, FiCloud, FiShoppingBag, FiCamera, FiZap, FiCalendar } from 'react-icons/fi';

const actions = [
  { icon: <FiPlus />, label: 'Add Crop', to: '/dashboard/crops/add' },
  { icon: <FiCalendar />, label: 'Calendar', to: '/dashboard/calendar' },
  { icon: <FiZap />, label: 'AI Suggest', to: '/dashboard/suggest' },
  { icon: <FiCloud />, label: 'Weather', to: '/dashboard/weather' },
  { icon: <FiShoppingBag />, label: 'Marketplace', to: '/marketplace' },
  { icon: <FiCamera />, label: 'Scan Plant', to: '/dashboard/disease' },
];

export default function QuickActions() {
  return (
    <div className="glass-card p-5 ">
      <span className="text-accent text-xs font-semibold mb-2 block">04</span>
      <h3 className="text-white font-bold text-base mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-accent/5 border border-dark-border text-dark-text text-xs hover:bg-accent/10 hover:text-accent transition-all no-underline"
          >
            <span className="text-accent">{action.icon}</span>
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
