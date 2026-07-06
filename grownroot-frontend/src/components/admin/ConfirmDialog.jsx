import { FiAlertTriangle, FiX } from 'react-icons/fi';

/**
 * Small confirmation modal for destructive admin actions (full-light theme).
 */
export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white border border-light-border shadow-2xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-5">
          <span className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <FiAlertTriangle size={18} />
          </span>
          <div className="flex-1">
            <p className="text-light-text font-semibold">{title}</p>
            <p className="text-light-muted text-sm mt-1">{message}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-light-muted hover:text-light-text transition"
            aria-label="Cancel"
          >
            <FiX size={18} />
          </button>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm text-light-muted hover:text-light-text border border-light-border transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
