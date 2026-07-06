import { useState } from 'react';

/**
 * Shared state for admin management tables: tracks which row is mutating,
 * surfaces errors, and drives a confirmation dialog for destructive actions.
 */
export default function useAdminAction() {
  const [busyId, setBusyId] = useState(null); // id of the row currently mutating
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(null); // { title, message, confirmLabel, onConfirm }

  // Run an async action, tracking the busy row and capturing any error.
  const run = async (id, fn) => {
    setError('');
    setBusyId(id);
    try {
      await fn();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setBusyId(null);
    }
  };

  // Ask for confirmation, then run the action once confirmed.
  const askConfirm = ({ title, message, confirmLabel, id, action }) =>
    setConfirm({
      title,
      message,
      confirmLabel,
      onConfirm: () => {
        setConfirm(null);
        run(id, action);
      },
    });

  return { busyId, error, confirm, setConfirm, run, askConfirm };
}
