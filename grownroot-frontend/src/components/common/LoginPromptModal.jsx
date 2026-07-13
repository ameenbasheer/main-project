import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiX, FiLogIn, FiArrowRight } from 'react-icons/fi';

/**
 * Popup shown when a logged-out user tries to use a feature that needs an
 * account. Offers to sign in or create an account, carrying a `redirect`
 * target so the user lands back on the feature they wanted after auth.
 *
 * Props:
 *  - title    optional heading (defaults to a generic login prompt)
 *  - message  optional supporting copy
 *  - redirect path to return to after a successful login
 *  - onClose  called to dismiss the modal
 */
export default function LoginPromptModal({
  title = 'Login to continue',
  message = 'You need an account to use this feature. Sign in or create one — it only takes a minute.',
  redirect,
  onClose,
}) {
  const navigate = useNavigate();

  // Close on Escape for keyboard users.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const suffix = redirect ? `?redirect=${encodeURIComponent(redirect)}` : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white border border-light-border shadow-2xl p-6 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-light-muted hover:text-light-text transition"
          aria-label="Close"
        >
          <FiX size={18} />
        </button>

        <span className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mx-auto mb-4">
          <FiLock size={24} />
        </span>

        <h3 className="text-light-text font-semibold text-lg mb-2">{title}</h3>
        <p className="text-light-muted text-sm leading-relaxed mb-6">{message}</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate(`/login${suffix}`)}
            className="w-full h-[46px] flex items-center justify-center gap-2 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition"
          >
            <FiLogIn size={15} />
            Sign in
          </button>
          <button
            onClick={() => navigate(`/register${suffix}`)}
            className="w-full h-[46px] flex items-center justify-center gap-2 rounded-xl border border-light-border text-light-text font-medium text-sm hover:border-accent hover:text-accent transition"
          >
            Create an account
            <FiArrowRight size={14} />
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-light-muted hover:text-light-text text-xs transition"
        >
          Keep browsing
        </button>
      </div>
    </div>
  );
}
