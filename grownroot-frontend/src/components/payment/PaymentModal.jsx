import { useState } from 'react';
import {
  FiX,
  FiCreditCard,
  FiSmartphone,
  FiTruck,
  FiLock,
  FiCheckCircle,
  FiLoader,
} from 'react-icons/fi';

const METHODS = [
  { id: 'card', label: 'Card', Icon: FiCreditCard },
  { id: 'upi', label: 'UPI', Icon: FiSmartphone },
  { id: 'cod', label: 'Cash on Delivery', Icon: FiTruck },
];

// Keep only digits and group the card number into 4-digit blocks for display.
const formatCardNumber = (v) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

/**
 * Dummy payment sheet. No real gateway — it fakes a short "processing" delay,
 * then hands a payment summary back to the caller via onSuccess.
 */
export default function PaymentModal({ amount, onSuccess, onClose }) {
  const [method, setMethod] = useState('card');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const validate = () => {
    if (method === 'card') {
      if (card.number.replace(/\s/g, '').length !== 16) return 'Enter a valid 16-digit card number.';
      if (!card.name.trim()) return 'Enter the name on the card.';
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) return 'Enter a valid expiry (MM/YY).';
      if (!/^\d{3}$/.test(card.cvv)) return 'Enter a valid 3-digit CVV.';
    }
    if (method === 'upi' && !/^[\w.-]+@[\w.-]+$/.test(upiId)) {
      return 'Enter a valid UPI ID (e.g. name@bank).';
    }
    return '';
  };

  const handlePay = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setProcessing(true);
    // Simulate a payment gateway round-trip.
    setTimeout(() => {
      const summary = {
        method,
        label: METHODS.find((m) => m.id === method).label,
        amount,
        status: method === 'cod' ? 'Pending' : 'Paid',
        reference: `PAY-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
        last4: method === 'card' ? card.number.replace(/\s/g, '').slice(-4) : null,
      };
      onSuccess(summary);
    }, 1400);
  };

  const inputCls =
    'w-full px-3 py-2 my-1 rounded-xl bg-light-bg border border-light-border outline-none text-light-text text-sm placeholder:text-light-muted focus:border-accent focus:ring-2 focus:ring-accent/20 transition';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-light-border">
          <div>
            <p className="text-light-text font-semibold">Payment</p>
            <p className="text-light-muted text-xs flex items-center gap-1">
              <FiLock size={11} /> Secure dummy checkout
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-light-muted hover:text-light-text transition"
            aria-label="Close"
            disabled={processing}
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handlePay} className="p-4">
          {/* Amount */}
          <div className="rounded-2xl bg-accent/10 border border-accent/20 px-3 py-2 mb-3 flex items-center justify-between">
            <span className="text-light-muted text-sm">Amount payable</span>
            <span className="text-accent font-bold text-xl">₹{amount.toFixed(2)}</span>
          </div>

          {/* Method selector */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {METHODS.map(({ id, label, Icon }) => {
              const selected = method === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setMethod(id);
                    setError('');
                  }}
                  className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border text-xs font-medium transition ${selected
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-light-border text-light-muted hover:border-accent/50'
                    }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Card fields */}
          {method === 'card' && (
            <div className="space-y-3">
              <input
                className={inputCls}
                placeholder="Card number"
                inputMode="numeric"
                value={card.number}
                onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
              />
              <input
                className={inputCls}
                placeholder="Name on card"
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className={inputCls}
                  placeholder="MM/YY"
                  inputMode="numeric"
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                />
                <input
                  className={inputCls}
                  placeholder="CVV"
                  inputMode="numeric"
                  type="password"
                  value={card.cvv}
                  onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                />
              </div>
            </div>
          )}

          {/* UPI field */}
          {method === 'upi' && (
            <input
              className={inputCls}
              placeholder="yourname@bank"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          )}

          {/* COD note */}
          {method === 'cod' && (
            <p className="text-light-muted text-sm rounded-xl bg-light-bg border border-light-border px-4 py-3">
              Pay in cash when your order is delivered. No online payment needed.
            </p>
          )}

          {error && (
            <div className="mt-3 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-red-600 text-xs text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={processing}
            className="pill-btn w-full flex items-center justify-center gap-2 text-sm !py-3 mt-4 disabled:opacity-70"
          >
            {processing ? (
              <>
                <FiLoader size={16} className="animate-spin" /> Processing…
              </>
            ) : (
              <>
                <FiCheckCircle size={16} />
                {method === 'cod' ? `Place order · ₹${amount.toFixed(2)}` : `Pay ₹${amount.toFixed(2)}`}
              </>
            )}
          </button>

          <p className="text-light-muted text-[11px] text-center mt-3">
            This is a demo. No real payment is processed.
          </p>
        </form>
      </div>
    </div>
  );
}
