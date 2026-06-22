import { Link } from 'react-router-dom';
import { FiArrowRight, FiMapPin } from 'react-icons/fi';

export default function ProductCard({ product }) {
  return (
    <div className="product-card overflow-hidden flex flex-col">
      <div className="h-40 bg-gradient-to-br from-accent/15 to-primary/15 flex items-center justify-center relative">
        <img src={product.image} alt="product image" className="w-full h-full object-cover" />
        <span className="absolute top-2 right-2 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary text-white">
          Fresh {product.freshness}%
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-dark-text font-semibold text-sm mb-1">{product.name}</h3>
        <p className="text-accent font-bold text-lg mb-1">
          ${product.price.toFixed(2)}
          <span className="text-dark-muted text-xs font-normal">{product.unit}</span>
        </p>
        <hr className="border-dark-border my-2" />
        <p className="text-dark-muted text-xs mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-2 text-dark-text text-xs mb-3">
          <FiMapPin size={12} className="text-accent" />
          <span>{product.location}</span>
        </div>

        <Link
          to={`/marketplace/${product.id}`}
          className="mt-auto inline-flex text-black items-center justify-between gap-2 text-accent text-xs font-medium py-1 px-3 rounded-full border border-accent/30 hover:bg-accent/10 transition-colors"
        >
          View Details
          <FiArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
