import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/marketplace/ProductCard';
import SearchBar from '../../components/common/SearchBar';
import { DecorativeCircle } from '../../components/common/DecorativeElements';

export default function MarketplacePage() {
  const { products } = useApp();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      {/* Dark-green hero band */}
      <section className="section-band-green py-5 mb-5">
        <DecorativeCircle size="lg" className="-top-20 -right-20 opacity-25 !border-white/25" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-5 md:px-5 lg:px-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-5">
            <div>
              <h1 className="text-4xl md:text-5xl font-light text-white leading-tight mt-3">
                Fresh from <span className="gradient-text">Local Farms</span>
              </h1>
              <p className="text-white/70 text-sm mt-2">
                Browse produce direct from the people who grew it — no account needed.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <SearchBar
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {isAuthenticated && (
                <Link
                  to="/marketplace/add"
                  className="pill-btn flex items-center gap-2 text-sm !py-2.5 no-underline shrink-0"
                >
                  <FiPlus size={16} />
                  Add Product
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product grid — light cream */}
      <section className="relative overflow-hidden">
        <DecorativeCircle size="xl" className="-bottom-40 -left-40 opacity-15" />
        <div className="relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-5">
              <p className="text-dark-muted text-lg">No products found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
