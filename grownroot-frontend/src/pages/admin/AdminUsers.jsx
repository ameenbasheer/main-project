import { useMemo, useState } from 'react';
import {
  FiTrash2,
  FiUserX,
  FiUserCheck,
  FiSearch,
  FiAlertTriangle,
  FiLoader,
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import useAdminAction from '../../hooks/useAdminAction';

export default function AdminUsers() {
  const { users, setUserStatus, deleteUser } = useApp();
  const { user: currentUser } = useAuth();
  const { busyId, error, confirm, setConfirm, run, askConfirm } = useAdminAction();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
    );
  }, [users, query]);

  const toggleStatus = (u) => {
    const next = u.status === 'active' ? 'inactive' : 'active';
    run(u.id, () => setUserStatus(u.id, next));
  };

  const askDelete = (u) =>
    askConfirm({
      title: `Delete ${u.name}?`,
      message:
        'This permanently removes the user along with their products and crops. This cannot be undone.',
      confirmLabel: 'Delete user',
      id: u.id,
      action: () => deleteUser(u.id),
    });

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl md:text-3xl font-light text-light-text">Manage</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-accent">Users</h2>
        <p className="text-light-muted text-sm mt-2">
          Deactivate accounts to block sign-in, or remove them entirely.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-red-600 text-sm flex items-center gap-2">
          <FiAlertTriangle size={15} /> {error}
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-light-border w-full sm:max-w-sm mb-4">
        <FiSearch className="text-light-muted shrink-0" size={15} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, role…"
          className="bg-transparent border-none outline-none text-light-text text-sm flex-1 placeholder:text-light-muted"
        />
      </div>

      <div className="rounded-2xl border border-light-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-light-border">
                <th className="text-left text-light-muted font-medium px-4 py-3">Name</th>
                <th className="text-left text-light-muted font-medium px-4 py-3">Email</th>
                <th className="text-left text-light-muted font-medium px-4 py-3">Role</th>
                <th className="text-left text-light-muted font-medium px-4 py-3">Status</th>
                <th className="text-right text-light-muted font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-5 text-center text-light-muted">
                    No users found.
                  </td>
                </tr>
              )}
              {filtered.map((u) => {
                const isSelf = u.id === currentUser?.id;
                const busy = busyId === u.id;
                return (
                  <tr key={u.id} className="border-b border-light-border hover:bg-accent/5 transition-colors">
                    <td className="px-4 py-3 text-light-text font-medium">
                      <span className="flex items-center gap-2">
                        {u.name}
                        {isSelf && (
                          <span className="text-[10px] uppercase tracking-wider bg-accent/15 text-accent px-2 py-1 rounded">
                            You
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-light-muted">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          u.role === 'farmer'
                            ? 'bg-accent/15 text-accent'
                            : u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          u.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {isSelf ? (
                          <span className="text-light-muted text-xs">—</span>
                        ) : (
                          <>
                            <button
                              onClick={() => toggleStatus(u)}
                              disabled={busy}
                              className={`inline-flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition-colors disabled:opacity-50 ${
                                u.status === 'active'
                                  ? 'border-amber-300 text-amber-700 hover:bg-amber-50'
                                  : 'border-green-300 text-green-700 hover:bg-green-50'
                              }`}
                              title={u.status === 'active' ? 'Deactivate user' : 'Activate user'}
                            >
                              {busy ? (
                                <FiLoader size={13} className="animate-spin" />
                              ) : u.status === 'active' ? (
                                <FiUserX size={13} />
                              ) : (
                                <FiUserCheck size={13} />
                              )}
                              {u.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => askDelete(u)}
                              disabled={busy}
                              className="text-light-muted hover:text-red-600 transition-colors disabled:opacity-50 p-2"
                              title="Delete user"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
