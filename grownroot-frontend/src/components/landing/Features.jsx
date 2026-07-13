import { useState } from 'react';
import { FiSun, FiShield, FiCloudRain, FiShoppingBag } from 'react-icons/fi';
import Card from '../common/Card';
import LoginPromptModal from '../common/LoginPromptModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const features = [
  {
    icon: <FiSun size={28} />,
    title: 'Crop Management',
    description: 'Track and manage your crops from planting to harvest with smart tools.',
  },
  {
    icon: <FiShield size={28} />,
    title: 'Disease Detection',
    description: 'AI-powered plant disease detection using photo analysis.',
  },
  {
    icon: <FiCloudRain size={28} />,
    title: 'Weather Forecast',
    description: 'Real-time weather updates to plan your farming activities.',
  },
  {
    icon: <FiShoppingBag size={28} />,
    title: 'Marketplace',
    description: 'Connect directly with buyers and sell your fresh produce.',
  },
];

export default function Features() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  // Holds the intended destination when a logged-out user clicks a card, which
  // triggers the login prompt instead of a silent redirect.
  const [pendingRedirect, setPendingRedirect] = useState(null);

  const routeFor = (title) => {
    switch (title) {
      case 'Crop Management':
        return '/dashboard/crops';
      case 'Disease Detection':
        return '/dashboard/disease';
      case 'Weather Forecast':
        // weather has a public page, but prefer farmer dashboard weather when farmer
        return user?.role === 'farmer' ? '/dashboard/weather' : '/weather';
      case 'Marketplace':
        return '/marketplace';
      default:
        return '/';
    }
  };

  const handleClick = (title) => {
    const to = routeFor(title);
    if (isAuthenticated) {
      navigate(to);
    } else {
      // prompt the user to log in (with a redirect back to the feature) rather
      // than silently bouncing them to the login page
      setPendingRedirect(to);
    }
  };
  return (
    <section className="py-20 relative pb-5 mb-5">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-dark-text leading-tight mt-5 ">
          Everything You Need
        </h2>
        <p className="text-dark-muted text-sm max-w-xl mx-auto mb-5">
          A complete platform to manage your farm, detect diseases, track weather, and sell your products.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, i) => (
          <Card
            key={i}
            hover
            role="button"
            onClick={() => handleClick(feature.title)}
            className="text-center p-6 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-5 text-accent group-hover:bg-accent/20 transition-colors">
              {feature.icon}
            </div>
            <h3 className="text-dark-text font-semibold text-lg mb-3">{feature.title}</h3>
            <p className="text-dark-muted text-sm leading-relaxed">{feature.description}</p>
          </Card>
        ))}
      </div>

      {pendingRedirect && (
        <LoginPromptModal
          redirect={pendingRedirect}
          onClose={() => setPendingRedirect(null)}
        />
      )}
    </section>
  );
}
