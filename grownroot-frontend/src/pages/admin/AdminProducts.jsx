import { useMemo, useState } from 'react';
import { FiTrash2, FiSearch, FiAlertTriangle, FiLoader, FiShoppingCart } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import useAdminAction from '../../hooks/useAdminAction';

export default function AdminProducts() {
  const { products, deleteProduct } = useApp();
  const { busyId, error, confirm, setConfirm, askConfirm } = useAdminAction();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.farmer?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q)
    );
  }, [products, query]);

  const askDelete = (p) =>
    askConfirm({
      title: `Delete "${p.name}"?`,
      message: 'This removes the product from the marketplace. This cannot be undone.',
      confirmLabel: 'Delete product',
      id: p.id,
      action: () => deleteProduct(p.id),
    });

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl md:text-3xl font-light text-light-text">Manage</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-accent">Products</h2>
        <p className="text-light-muted text-sm mt-2">
          Moderate the marketplace by removing products that break the rules.
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
          placeholder="Search product, farmer, location…"
          className="bg-transparent border-none outline-none text-light-text text-sm flex-1 placeholder:text-light-muted"
        />
      </div>

      <div className="rounded-2xl border border-light-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-light-border">
                <th className="text-left text-light-muted font-medium px-4 py-3">Product</th>
                <th className="text-left text-light-muted font-medium px-4 py-3">Price</th>
                <th className="text-left text-light-muted font-medium px-4 py-3">Farmer</th>
                <th className="text-left text-light-muted font-medium px-4 py-3">Location</th>
                <th className="text-right text-light-muted font-medium px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-5 text-center text-light-muted">
                    No products found.
                  </td>
                </tr>
              )}
              {filtered.map((p) => {
                const busy = busyId === p.id;
                return (
                  <tr key={p.id} className="border-b border-light-border hover:bg-accent/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-lg overflow-hidden bg-accent/10 flex items-center justify-center shrink-0">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <FiShoppingCart className="text-accent" size={15} />
                          )}
                        </span>
                        <span className="text-light-text font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-accent font-semibold">
                      ₹{p.price.toFixed(2)}
                      {p.unit}
                    </td>
                    <td className="px-4 py-3 text-light-muted">{p.farmer}</td>
                    <td className="px-4 py-3 text-light-muted">{p.location}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => askDelete(p)}
                        disabled={busy}
                        className="text-light-muted hover:text-red-600 transition-colors disabled:opacity-50 p-2"
                        title="Delete product"
                      >
                        {busy ? <FiLoader size={16} className="animate-spin" /> : <FiTrash2 size={16} />}
                      </button>
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
