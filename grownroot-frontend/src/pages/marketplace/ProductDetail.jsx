import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiShoppingCart, FiZap, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { productApi } from '../../services/api';
import { DecorativeCircle } from '../../components/common/DecorativeElements';
import PaymentModal from '../../components/payment/PaymentModal';

export default function ProductDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart, placeOrder } = useApp();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    // Reset to the loading state each time the product id changes.
    setLoading(true); // eslint-disable-line react-hooks/set-state-in-effect
    productApi
      .get(id)
      .then((p) => { if (active) setProduct(p); })
      .catch(() => { if (active) setProduct(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const requireAuth = (action) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/marketplace/${id}`);
      return;
    }
    if (action === 'cart') {
      addToCart(product, 1);
      setShowSuccess('cart');
      setTimeout(() => setShowSuccess(false), 2000);
    } else if (action === 'buy') {
      // "Buy Now" collects payment first, then places an order for just this product.
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = (payment) => {
    // "Buy Now" places an order for just this product, leaving the cart alone.
    placeOrder(
      [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          unit: product.unit || '',
          image: product.image || null,
          farmer: product.farmer || '',
          quantity: 1,
        },
      ],
      payment
    );
    setShowPayment(false);
    navigate('/orders');
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-dark-muted text-sm">Loading product…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-dark-text text-xl mb-4">Product not found</p>
          <Link to="/marketplace" className="text-accent hover:underline">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-2 text-dark-muted hover:text-accent text-sm mb-3 no-underline transition-colors"
      >
        <FiArrowLeft size={16} />
        Back to Marketplace
      </Link>

      {/* Product hero — dark-green band */}
      <section className="section-band-green py-5 mb-5">
        <DecorativeCircle size="lg" className="-top-32 right-1/3 opacity-25 !border-white/25" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-5 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* Left: Product image */}
            <div className="img-showcase relative min-h-[18rem] lg:min-h-[24rem] bg-gradient-to-br from-accent/15 to-primary/15 flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-7xl">🥬</span>
              )}
              <span className="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary text-white">
                Fresh {product.freshness}%
              </span>
              {product.category && (
                <span className="absolute top-3 right-3 text-[11px] font-medium px-2.5 py-1 rounded-full bg-black/35 text-white backdrop-blur">
                  {product.category}
                </span>
              )}
            </div>

            {/* Right: Product details */}
            <div className="flex flex-col">
              <p className="text-accent text-xs uppercase tracking-[0.2em] font-semibold mb-2">
                Product Details
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {product.name}
              </h1>

              <p className="text-accent font-bold text-2xl mt-3 mb-4">
                ₹{product.price.toFixed(2)}
                <span className="text-white/60 text-sm font-normal">{product.unit}</span>
              </p>

              <p className="text-dark-muted text-sm leading-relaxed mb-5">
                {product.description} Available in 1kg and 5kg packages.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <div className="flex items-center gap-3 text-dark-text text-sm">
                  <FiMapPin size={15} className="text-accent shrink-0" />
                  {product.location}
                </div>
                <div className="flex items-center gap-3 text-dark-text text-sm">
                  <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                  Freshness: {product.freshness}%
                </div>
              </div>

              {/* Farmer quote */}
              <div className="mt-auto glass-card p-4 relative overflow-hidden">
                <span className="absolute -top-1 left-3 text-5xl text-accent/25 font-serif leading-none select-none">
                  &ldquo;
                </span>
                <p className="text-dark-muted text-sm leading-relaxed italic pl-6 mb-2">
                  Fresh from my family farm to your table. We use only organic methods
                  and harvest at peak ripeness for the best flavor.
                </p>
                <p className="text-dark-text text-sm pl-6">— {product.farmer}, Local Farmer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success toast */}
      {showSuccess && (
        <div className="fixed top-5 right-5 z-50 glass-card border border-accent/40 px-5 py-3 flex items-center gap-3 gr-pop">
          <FiCheckCircle className="text-accent" size={18} />
          <span className="text-dark-text text-sm">
            {showSuccess === 'buy' ? 'Order placed successfully!' : 'Added to cart!'}
          </span>
        </div>
      )}

      {/* Buy actions + badges — light section */}
      <div className="glass-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <button
            onClick={() => requireAuth('buy')}
            className="pill-btn gr-press flex items-center justify-center gap-2 text-sm !py-3 !px-6"
          >
            <FiZap size={16} />
            Buy Now
          </button>
          <button
            onClick={() => requireAuth('cart')}
            className="pill-btn gr-press flex items-center justify-center gap-2 text-sm !py-3 !px-6"
          >
            <FiShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 border-t border-dark-border">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-dark-muted text-sm">100% Organic</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-dark-muted text-sm">Same-day harvest</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-dark-muted text-sm">Farm-to-table fresh</span>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          amount={product.price}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}
