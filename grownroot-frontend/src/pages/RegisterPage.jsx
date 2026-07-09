import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiMail,
  FiLock,
  FiUserPlus,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiArrowLeft,
  FiShoppingBag,
  FiCpu,
  FiActivity,
  FiTruck,
  FiCheck,
  FiLoader,
} from 'react-icons/fi';
import { GiFarmer } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import logoGreen from '../assets/logo-green.png';
import Images from '../assets/images';
import DecorativeElements from '../components/common/DecorativeElements';

const ROLES = [
  {
    id: 'farmer',
    title: 'Farmer',
    blurb: 'Manage crops & sell produce.',
    Icon: GiFarmer,
  },
  {
    id: 'buyer',
    title: 'Buyer',
    blurb: 'Shop fresh from local farms.',
    Icon: FiShoppingBag,
  },
];

const FARMER_HIGHLIGHTS = [
  { Icon: FiCpu, label: 'AI crop suggestions & tracking' },
  { Icon: FiActivity, label: 'Disease detection from photos' },
  { Icon: FiShoppingBag, label: 'Sell directly to verified buyers' },
];

const BUYER_HIGHLIGHTS = [
  { Icon: FiShoppingBag, label: 'Browse farm-fresh produce' },
  { Icon: FiTruck, label: 'Buy direct from the grower' },
  { Icon: FiActivity, label: 'Save favorites & reorder fast' },
];

// Password must meet every rule below before an account can be created.
const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { id: 'number', label: 'Contains a number', test: (p) => /\d/.test(p) },
  {
    id: 'special',
    label: 'Contains a special character',
    test: (p) => /[!@#$%^&*(),.?":{}|<>_[\]\\/;'`~+=-]/.test(p),
  },
];

export default function RegisterPage() {
  const [role, setRole] = useState('farmer');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const highlights = role === 'farmer' ? FARMER_HIGHLIGHTS : BUYER_HIGHLIGHTS;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!PASSWORD_RULES.every((r) => r.test(formData.password))) {
      setFormError('Password must be at least 8 characters and include a number and a special character.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
      });
      navigate(user.role === 'farmer' ? '/onboarding' : '/marketplace');
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{
        background:
          'radial-gradient(900px 400px at 80% 0%, rgba(74, 222, 128, 0.18), transparent 60%), linear-gradient(135deg, #1A4D2E 0%, #143E25 100%)',
      }}
    >
      {/* ambient glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />

      <DecorativeElements />

      <div className="w-full max-w-5xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-dark-border bg-dark-surface backdrop-blur-xl">
          {/* Left: image panel */}
          <div className="relative hidden lg:flex flex-col justify-between p-5 min-h-[640px]">
            <img
              src={Images.farm_illustration5}
              alt="Farm"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/70 via-dark-bg/75 to-dark-bg/95" />

            {/* Top: logo + back link */}
            <div className="relative flex items-center justify-between">
              <Link to="/" className="inline-flex items-center no-underline">
                <img src={logo} alt="GrownRoot" className="h-9 w-auto object-contain" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs text-white hover:text-accent transition no-underline"
              >
                <FiArrowLeft size={14} />
                Back home
              </Link>
            </div>

            {/* Bottom: copy */}
            <div className="relative">
              <h1 className="text-4xl font-bold text-white leading-tight mb-3">
                Join <span className="text-accent">GrownRoot</span>.
              </h1>
              <p className="text-white/75 text-sm leading-relaxed mb-7 max-w-sm">
                {role === 'farmer'
                  ? 'Create your farmer account and start farming smarter with AI tools and a marketplace built for you.'
                  : 'Create your buyer account and shop fresh produce directly from the people who grew it.'}
              </p>

              <ul className="space-y-3">
                {highlights.map(({ Icon, label }) => (
                  <li key={label} className="flex items-center gap-2 text-white/85 text-sm mt-2">
                    <span className="w-8 h-8 rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shrink-0">
                      <Icon size={14} />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: form panel — LIGHT */}
          <div className="bg-light-surface p-5 flex flex-col justify-center">
            {/* mobile-only logo */}
            <Link to="/" className="lg:hidden inline-flex items-center justify-center mb-8 no-underline">
              <img src={logoGreen} alt="GrownRoot" className="h-9 w-auto object-contain" />
            </Link>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-light-text mb-1.5">Create account</h2>
              <p className="text-light-muted text-sm">
                Pick how you'll use GrownRoot, then fill in your details.
              </p>
            </div>

            {/* Role selector */}
            <div
              role="tablist"
              aria-label="Select account type"
              className="relative grid grid-cols-2 gap-1 p-1 mb-4 rounded-2xl bg-light-bg border border-light-border shadow-inner"
            >
              <span
                aria-hidden="true"
                className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-xl bg-gradient-to-br from-accent via-accent to-accent/80 shadow-[0_8px_24px_-4px_rgba(22,163,74,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                style={{ transform: role === 'farmer' ? 'translateX(0%)' : 'translateX(100%)' }}
              />
              {ROLES.map(({ id, title, Icon }) => {
                const selected = role === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setRole(id)}
                    className={`relative z-10 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 ${selected
                      ? 'text-white'
                      : 'text-light-muted hover:text-light-text'
                      }`}
                  >
                    <Icon
                      size={16}
                      className={`transition-transform duration-300 ${selected ? 'scale-110' : 'scale-100'}`}
                    />
                    I'm a {title}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" aria-busy={isLoading}>
              {/* Name */}
              <div>
                <label className="text-light-text text-xs font-medium block mb-1">
                  Full name
                </label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-light-bg border border-light-border focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition">
                  <FiUser className="text-accent shrink-0" size={16} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={role === 'farmer' ? 'Maria Santos' : 'Ahmed Khan'}
                    className="bg-transparent border-none outline-none text-light-text text-sm flex-1 placeholder:text-light-muted"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-light-text text-xs font-medium block mt-2 mb-1">
                  Email address
                </label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-light-bg border border-light-border focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition">
                  <FiMail className="text-accent shrink-0" size={16} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={role === 'farmer' ? 'maria@farm.com' : 'ahmed@buyer.com'}
                    className="bg-transparent border-none outline-none text-light-text text-sm flex-1 placeholder:text-light-muted"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-light-text text-xs font-medium block mt-2 mb-1">
                  Password
                </label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-light-bg border border-light-border focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition">
                  <FiLock className="text-accent shrink-0" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="bg-transparent border-none outline-none text-light-text text-sm flex-1 placeholder:text-light-muted"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-light-muted hover:text-accent transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>

                {/* Live password requirements */}
                {formData.password && (
                  <ul className="mt-2 space-y-1">
                    {PASSWORD_RULES.map((rule) => {
                      const met = rule.test(formData.password);
                      return (
                        <li
                          key={rule.id}
                          className={`flex items-center gap-1.5 text-xs transition-colors ${
                            met ? 'text-accent' : 'text-light-muted'
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                              met ? 'bg-accent text-white' : 'border border-light-border'
                            }`}
                          >
                            {met && <FiCheck size={9} />}
                          </span>
                          {rule.label}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-light-text text-xs font-medium block mt-2 mb-1">
                  Confirm password
                </label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-light-bg border border-light-border focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition">
                  <FiLock className="text-accent shrink-0" size={16} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="bg-transparent border-none outline-none text-light-text text-sm flex-1 placeholder:text-light-muted"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="text-light-muted hover:text-accent transition"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              {formError && (
                <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-red-600 text-xs text-center">
                  {formError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[50px] mt-4 flex items-center justify-center gap-2 py-3 rounded-5 bg-accent text-white font-semibold text-sm hover:bg-accent/90 hover:shadow-[0_8px_24px_rgba(22,163,74,0.35)] transition group disabled:cursor-not-allowed disabled:opacity-80"
              >
                {isLoading ? (
                  <>
                    <FiLoader size={14} className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create {role === 'farmer' ? 'Farmer' : 'Buyer'} account
                    <FiArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
                  </>
                )}
              </button>

              {/* Login link */}
              <p className="text-light-muted text-sm text-center pt-2 mt-2">
                Already have an account?{' '}
                <Link to="/login" className="text-black hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
