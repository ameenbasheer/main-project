import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  FiMail,
  FiLock,
  FiLogIn,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiTrendingUp,
  FiCloud,
  FiShoppingBag,
  FiArrowLeft,
  FiLoader,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import logoGreen from '../assets/logo-green.png';
import farmImage from '../assets/farm_illustration2.jpg';
import Images from '../assets/images';
import DecorativeElements from '../components/common/DecorativeElements';

const HIGHLIGHTS = [
  { Icon: FiTrendingUp, label: 'Track crops & yields' },
  { Icon: FiCloud, label: 'Live weather insights' },
  { Icon: FiShoppingBag, label: 'Sell to verified buyers' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const { login, error, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      const user = await login(email, password);
      if (redirectTo) {
        navigate(redirectTo);
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'buyer') {
        navigate('/marketplace');
      } else {
        navigate('/dashboard');
      }
    } catch {
      // error is surfaced via the `error` state from the auth context
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
          <div className="relative hidden lg:flex flex-col justify-between p-5 min-h-[600px]">
            <img
              src={Images.farm_illustration4}
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
                Welcome <span className="text-accent">back</span>.
              </h1>
              <p className="text-white/75 text-sm leading-relaxed mb-7 max-w-sm">
                Sign in to manage your farm smarter — your dashboard, crops, and buyers are one click away.
              </p>

              <ul className="space-y-3">
                {HIGHLIGHTS.map(({ Icon, label }) => (
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

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-light-text mb-1.5">Sign in</h2>
              <p className="text-light-muted text-sm">
                Enter your credentials to access your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" aria-busy={isLoading}>
              {/* Email */}
              <div>
                <label className="text-light-text text-xs font-medium block mb-2">
                  Email address
                </label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-light-bg border border-light-border focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition">
                  <FiMail className="text-accent shrink-0" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@grownroot.com"
                    className="bg-transparent border-none outline-none text-light-text text-sm flex-1 placeholder:text-light-muted"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mt-3">
                  <label className="text-light-text text-xs font-medium">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[11px] text-accent/90 hover:text-accent transition"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-light-bg border border-light-border focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition">
                  <FiLock className="text-accent shrink-0" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2 text-light-muted text-xs cursor-pointer select-none w-fit mt-3 mb-3">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-3.5 accent-accent rounded me-3 "
                />
                Keep me signed in
              </label>

              {error && (
                <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-red-600 text-xs text-center">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[50px] flex items-center justify-center gap-2 py-3 rounded-5 bg-accent text-white font-semibold text-sm hover:bg-accent/90 hover:shadow-[0_8px_24px_rgba(22,163,74,0.35)] transition group disabled:cursor-not-allowed disabled:opacity-80"
              >
                {isLoading ? (
                  <>
                    <FiLoader size={14} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <FiArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
                  </>
                )}
              </button>

              {/* Register link */}
              <p className="text-light-muted text-sm text-center pt-2 mt-2">
                New to GrownRoot?{' '}
                <Link to="/register" className="text-black hover:underline font-medium">
                  Create an account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
