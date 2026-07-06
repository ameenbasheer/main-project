import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMinus, FiPlus, FiTrash2, FiShoppingCart, FiCheckCircle } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import PaymentModal from '../components/payment/PaymentModal';

export default function Cart() {
  const { cart, updateCartQty, removeFromCart, clearCart, placeOrder } = useApp();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handlePaymentSuccess = (payment) => {
    const order = placeOrder(undefined, payment);
    setShowPayment(false);
    if (order) navigate('/orders');
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-2 text-light-muted hover:text-accent text-sm mb-5 no-underline transition-colors relative z-10"
      >
        <FiArrowLeft size={16} />
        Continue shopping
      </Link>

      <div className="mb-5 relative z-10 flex items-end justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-light text-light-text">Your</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-accent">Cart</h2>
        </div>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-light-muted hover:text-red-600 text-sm transition-colors"
          >
            Clear cart
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="rounded-2xl border border-light-border bg-white p-5 text-center relative z-10">
          <FiShoppingCart size={36} className="mx-auto text-light-muted mb-3" />
          <p className="text-light-text text-lg font-medium mb-1">Your cart is empty</p>
          <p className="text-light-muted text-sm mb-5">
            Browse the marketplace and add some fresh produce.
          </p>
          <Link to="/marketplace" className="pill-btn inline-flex items-center gap-2 text-sm no-underline">
            <FiShoppingCart size={15} /> Go to Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative z-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-light-border bg-white p-4 flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-accent/10 flex items-center justify-center shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <FiShoppingCart className="text-accent" size={22} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-light-text font-semibold text-sm truncate">{item.name}</p>
                  {item.farmer && (
                    <p className="text-light-muted text-xs truncate">by {item.farmer}</p>
                  )}
                  <p className="text-accent font-bold text-sm mt-0.5">
                    ₹{item.price.toFixed(2)}
                    <span className="text-light-muted text-xs font-normal">{item.unit}</span>
                  </p>
                </div>

                {/* Quantity stepper */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateCartQty(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full border border-light-border flex items-center justify-center text-light-muted hover:border-accent hover:text-accent transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus size={13} />
                  </button>
                  <span className="text-light-text text-sm font-medium w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQty(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border border-light-border flex items-center justify-center text-light-muted hover:border-accent hover:text-accent transition-colors"
                    aria-label="Increase quantity"
                  >
                    <FiPlus size={13} />
                  </button>
                </div>

                <div className="text-right shrink-0 w-20">
                  <p className="text-light-text font-semibold text-sm">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-light-muted hover:text-red-600 text-xs inline-flex items-center gap-1 mt-1 transition-colors"
                  >
                    <FiTrash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-light-border bg-white p-5 sticky top-5">
              <p className="text-light-muted text-xs uppercase tracking-wider mb-3">Order summary</p>
              <div className="flex justify-between text-sm text-light-text mb-2">
                <span>Items</span>
                <span>{cart.reduce((n, i) => n + i.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-sm text-light-text mb-3">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <hr className="border-light-border mb-3" />
              <div className="flex justify-between text-base font-bold text-light-text mb-4">
                <span>Total</span>
                <span className="text-accent">₹{subtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={() => setShowPayment(true)}
                className="pill-btn w-full flex items-center justify-center gap-2 text-sm !py-3"
              >
                <FiCheckCircle size={16} />
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {showPayment && (
        <PaymentModal
          amount={subtotal}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}
