import { Link } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiShoppingCart } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const STATUS_STYLES = {
  Processing: 'text-amber-700 bg-amber-100',
  Shipped: 'text-blue-700 bg-blue-100',
  Delivered: 'text-accent bg-accent/10',
  Cancelled: 'text-red-700 bg-red-100',
};

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function MyOrders() {
  const { orders } = useApp();

  return (
    <div className="relative max-w-4xl mx-auto">
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-2 text-light-muted hover:text-accent text-sm mb-5 no-underline transition-colors relative z-10"
      >
        <FiArrowLeft size={16} />
        Back to Marketplace
      </Link>

      <div className="mb-5 relative z-10">
        <h1 className="text-3xl md:text-4xl font-light text-light-text">My</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-accent">Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-light-border bg-white p-10 text-center relative z-10">
          <FiPackage size={36} className="mx-auto text-light-muted mb-3" />
          <p className="text-light-text text-lg font-medium mb-1">No orders yet</p>
          <p className="text-light-muted text-sm mb-5">
            Once you check out, your orders will show up here.
          </p>
          <Link to="/marketplace" className="pill-btn inline-flex items-center gap-2 text-sm no-underline">
            <FiShoppingCart size={15} /> Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4 relative z-10">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-light-border bg-white p-5">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <div>
                  <p className="text-light-text font-semibold text-sm">
                    Order #{order.id.replace('ord_', '').slice(-8)}
                  </p>
                  <p className="text-light-muted text-xs">{formatDate(order.createdAt)}</p>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-semibold ${
                    STATUS_STYLES[order.status] || 'text-light-muted bg-light-bg'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="divide-y divide-light-border">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-accent/10 flex items-center justify-center shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <FiShoppingCart className="text-accent" size={16} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-light-text text-sm truncate">{item.name}</p>
                      <p className="text-light-muted text-xs">
                        {item.quantity} × ₹{item.price.toFixed(2)}
                        {item.unit}
                      </p>
                    </div>
                    <p className="text-light-text text-sm font-medium shrink-0">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-light-border">
                <span className="text-light-muted text-xs">
                  {order.items.reduce((n, i) => n + i.quantity, 0)} item(s)
                  {order.payment && (
                    <>
                      {' · '}
                      {order.payment.label}
                      {order.payment.last4 && ` ••${order.payment.last4}`}
                      {' · '}
                      <span
                        className={
                          order.payment.status === 'Paid' ? 'text-accent' : 'text-amber-600'
                        }
                      >
                        {order.payment.status}
                      </span>
                    </>
                  )}
                </span>
                <span className="text-light-text font-bold">
                  Total <span className="text-accent">₹{order.total.toFixed(2)}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
