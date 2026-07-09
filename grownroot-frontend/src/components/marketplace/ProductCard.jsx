import { Link } from 'react-router-dom';
import { FiArrowRight, FiMapPin } from 'react-icons/fi';

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/marketplace/${product.id}`}
      className="product-card gr-card-hover overflow-hidden flex flex-col no-underline group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
    >
      <div className="h-40 bg-gradient-to-br from-accent/15 to-primary/15 flex items-center justify-center relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-2 right-2 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary text-white">
          Fresh {product.freshness}%
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-dark-text font-semibold text-sm mb-1">{product.name}</h3>
        <p className="text-accent font-bold text-lg mb-1">
          ₹{product.price.toFixed(2)}
          <span className="text-dark-muted text-xs font-normal">{product.unit}</span>
        </p>
        <hr className="border-dark-border my-2" />
        <p className="text-dark-muted text-xs mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-2 text-dark-text text-xs mb-3">
          <FiMapPin size={12} className="text-accent" />
          <span>{product.location}</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 text-accent text-xs font-medium">
          <span>View Details</span>
          <FiArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}
