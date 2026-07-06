import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiUploadCloud } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { DecorativeCircle } from '../../components/common/DecorativeElements';

// Read a File into a base64 data URL the backend stores in the product's `image` field.
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the image file.'));
    reader.readAsDataURL(file);
  });
}

export default function AddProduct() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    unit: '/kg',
    description: '',
    category: 'Vegetables',
    location: '',
    farmer: '',
    freshness: 95,
    organic: true,
  });
  const { addProduct } = useApp();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const image = imageFile ? await fileToDataUrl(imageFile) : null;
      await addProduct({ ...form, price: parseFloat(form.price), image });
      navigate('/marketplace');
    } catch (err) {
      setError(err.message || 'Could not publish product. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="light-theme min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Dark-green hero band */}
      <section className="section-band-green py-5">
        <DecorativeCircle size="lg" className="-top-20 -left-20 opacity-25 !border-white/25" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 py-5">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-3 no-underline transition-colors"
          >
            <FiArrowLeft size={16} />
            Back to Marketplace
          </Link>
          <h1 className="text-4xl md:text-5xl font-light text-white leading-tight">Add New</h1>
          <h2 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="gradient-text">Product</span>
          </h2>
          <p className="text-white/75 text-sm max-w-xl">
            List your farm products for direct sale to buyers. Add clear photos and accurate details.
          </p>
        </div>
      </section>

      {/* Light section: form */}
      <div className="max-w-5xl mx-auto px-5 py-5 relative z-10">
        <DecorativeCircle size="md" className="bottom-20 right-20 opacity-10" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* Left content */}
          <div>
            <div className="border-accent pl-4 mb-4">
              <p className="text-dark-text text-sm font-medium">
                Complete the form on the right to publish.
              </p>
            </div>

            <p className="text-dark-muted text-sm leading-relaxed">
              Include clear photos and accurate details to attract more buyers.
              Organic items get a verified badge automatically.
            </p>

            {/* Image upload */}
            <div
              className="img-showcase mt-5 h-52 bg-gradient-to-br from-accent/5 to-primary/5 flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={() => document.getElementById('product-image-upload').click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Product preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <FiUploadCloud size={36} className="text-accent/60 mx-auto mb-2" />
                  <p className="text-dark-muted text-xs">Upload product photos</p>
                </div>
              )}
              <input
                id="product-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Right: Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="glass-card p-4 sm:col-span-2">
                <label className="text-dark-muted text-xs block mb-2">Product Name & Description</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Fresh Tomatoes"
                  className="w-full bg-transparent border-none outline-none text-dark-text text-sm placeholder:text-dark-muted mb-3"
                  required
                />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your product..."
                  rows={3}
                  className="w-full bg-transparent border-none outline-none text-dark-text text-sm placeholder:text-dark-muted resize-none"
                  required
                />
              </div>

              <div className="glass-card p-4">
                <label className="text-dark-muted text-xs block mb-2">Category selection</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-transparent border-none outline-none text-dark-text text-sm"
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains">Grains</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="glass-card p-4">
                <label className="text-dark-muted text-xs block mb-2">Set price</label>
                <div className="flex items-center gap-2">
                  <span className="text-accent">₹</span>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    className="flex-1 bg-transparent border-none outline-none text-dark-text text-sm placeholder:text-dark-muted"
                    required
                  />
                  <select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    className="bg-transparent border-none outline-none text-dark-muted text-sm"
                  >
                    <option value="/kg">/kg</option>
                    <option value="/head">/head</option>
                    <option value="/bunch">/bunch</option>
                    <option value="/dozen">/dozen</option>
                  </select>
                </div>
              </div>

              <div className="glass-card p-4">
                <label className="text-dark-muted text-xs block mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Green Valley"
                  className="w-full bg-transparent border-none outline-none text-dark-text text-sm placeholder:text-dark-muted"
                  required
                />
              </div>

              <div className="glass-card p-4">
                <label className="text-dark-muted text-xs block mb-2">Farmer Name</label>
                <input
                  type="text"
                  name="farmer"
                  value={form.farmer}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full bg-transparent border-none outline-none text-dark-text text-sm placeholder:text-dark-muted"
                  required
                />
              </div>
            </div>

            <div className="glass-card p-4 flex items-center gap-3 mt-3 mb-3">
              <input
                type="checkbox"
                name="organic"
                checked={form.organic}
                onChange={handleChange}
                className="accent-accent"
              />
              <label className="text-dark-text text-sm">This product is organically grown</label>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="pill-btn w-full flex items-center justify-center gap-2 !py-3 text-base disabled:opacity-60"
            >
              <FiSave size={18} />
              {saving ? 'Publishing…' : 'Publish product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
