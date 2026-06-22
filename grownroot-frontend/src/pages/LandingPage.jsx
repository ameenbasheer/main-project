import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiSun,
  FiDroplet,
  FiCloudRain,
  FiMail,
  FiPhone,
  FiMapPin,
  FiTwitter,
  FiInstagram,
  FiFacebook,
  FiYoutube,
} from 'react-icons/fi';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import ProductCard from '../components/marketplace/ProductCard';
import { useApp } from '../context/AppContext';
import { DecorativeCircle } from '../components/common/DecorativeElements';
import Reveal from '../components/common/Reveal';
import logo from '../assets/logo-green.png';

const testimonials = [
  {
    quote:
      'GrownRoot tripled my reach. I went from selling at the local market to shipping across Kerala — and my margins doubled.',
    name: 'Lakshmi Nair',
    role: 'Farmer, Palakkad',
    avatar: '🌾',
  },
  {
    quote:
      'The freshness is unreal. I order tomatoes Monday morning and they show up by lunch — picked the same day.',
    name: 'Arjun Pillai',
    role: 'Home Chef, Kochi',
    avatar: '🥗',
  },
  {
    quote:
      'The disease detection caught a fungal infection on my chillies before I lost the crop. This app paid for itself.',
    name: 'Mohan Das',
    role: 'Farmer, Wayanad',
    avatar: '🌶️',
  },
  {
    quote:
      'My restaurant runs on GrownRoot. Predictable pricing, verified quality, and I know exactly which farm grew what.',
    name: 'Priya Varma',
    role: 'Restaurant Owner, Trivandrum',
    avatar: '👩‍🍳',
  },
];

const blogPosts = [
  {
    tag: 'Guide',
    title: '5 monsoon crops that thrive in Kerala backyards',
    excerpt:
      'From okra to spinach — the easiest, highest-yielding crops to plant before the rains arrive.',
    read: '6 min read',
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=70',
  },
  {
    tag: 'Tech',
    title: 'How AI is helping smallholder farmers double their yield',
    excerpt:
      'A look at the disease detection and yield-forecast models powering GrownRoot under the hood.',
    read: '8 min read',
    image:
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=600&q=70',
  },
  {
    tag: 'Story',
    title: "Meet the women growing Kerala's finest cardamom",
    excerpt:
      'A photo essay on the all-women cooperative reshaping spice farming in the Western Ghats.',
    read: '4 min read',
    image:
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=70',
  },
];

export default function LandingPage() {
  const { products, weather } = useApp();
  const featuredProducts = products.slice(0, 8);

  const [tIndex, setTIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setTIndex((p) => (p + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative">
      <Hero />

      {/* Featured Products — GREEN BAND */}
      <section className="py-20 relative mt-5 overflow-hidden">
        <DecorativeCircle size="lg" className="-top-20 right-1/4 opacity-15" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 md:px-14 lg:px-20">
          <Reveal direction="up">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 ">
              <div>
                <h2 className="text-3xl md:text-4xl font-light text-black leading-tight">
                  Fresh from <span className="gradient-text">Local Farms</span>
                </h2>
                <p className="text-black/70 text-sm">
                  Browse fresh produce directly from farmers — no account needed.
                </p>
              </div>
              <Link
                to="/marketplace"
                className="pill-btn hidden md:inline-flex items-center gap-2 text-sm !py-2.5 shrink-0 mb-4"
              >
                View All
                <FiArrowRight size={14} />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product, i) => (
              <Reveal key={product.id} direction="up" delay={Math.min(i * 80, 480)} className="tilt-card h-full">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>

          <div className="mt-5 text-center md:hidden">
            <Link
              to="/marketplace"
              className="pill-btn inline-flex items-center gap-2 text-sm !py-2.5 mb-5"
            >
              View All Products
              <FiArrowRight size={14} />
            </Link>
          </div>
        </div>    
      </section>

      {/* Today's Weather — LIGHT */}
      <section className="section-band-green relative mt-5 overflow-hidden">
        <DecorativeCircle size="md" className="-bottom-18 -right-10  opacity-40 !border-white/20" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 md:px-14 lg:px-20 pb-5">
          <Reveal direction="up">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2 mt-5">
              <div>
                <h2 className="text-3xl md:text-4xl font-light text-dark-text leading-tight mt-4">
                  Today's <span className="gradient-text">Weather</span>
                </h2>
                <p className="text-dark-muted text-sm mb-5">
                  Real-time conditions to help plan your day.
                </p>
              </div>
              <Link
                to="/weather"
                className="pill-btn hidden md:inline-flex items-center gap-2 text-sm !py-2.5 shrink-0 mb-4"
              >
                Full Forecast
                <FiArrowRight size={14} />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-5 pb-5">
            <Reveal direction="up" delay={80} className="tilt-card shimmer-border rounded-2xl">
              <div className="glass-card p-2 flex items-center gap-4 px-3 py-3 h-full">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 float-chip">
                  <FiSun size={26} />
                </div>
                <div className="min-w-0">
                  <p className="text-dark-muted text-xs uppercase tracking-wider">Temperature</p>
                  <p className="text-dark-text font-bold text-2xl leading-tight">
                    {weather.temperature}°C
                  </p>
                  <p className="text-accent text-xs">{weather.condition}</p>
                </div>
              </div>
            </Reveal>
            <Reveal direction="up" delay={160} className="tilt-card shimmer-border rounded-2xl">
              <div className="glass-card p-2 flex items-center gap-4 px-3 py-3 h-full">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 float-chip delay-1">
                  <FiDroplet size={26} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-dark-muted text-xs uppercase tracking-wider">Humidity</p>
                  <p className="text-dark-text font-bold text-2xl leading-tight">
                    {weather.humidity}%
                  </p>
                  <p className="text-dark-muted text-xs">Comfort level</p>
                </div>
              </div>
            </Reveal>
            <Reveal direction="up" delay={240} className="tilt-card shimmer-border rounded-2xl">
              <div className="glass-card p-2 flex items-center gap-4 px-3 py-3 h-full">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 float-chip delay-2">
                  <FiCloudRain size={26} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-dark-muted text-xs uppercase tracking-wider">Rainfall</p>
                  <p className="text-dark-text font-bold text-2xl leading-tight">
                    {weather.rainfall}mm
                  </p>
                  <p className="text-dark-muted text-xs">Last 24 hours</p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="mt-5 text-center md:hidden">
            <Link
              to="/weather"
              className="pill-btn inline-flex items-center gap-2 text-sm !py-2.5"
            >
              Full Forecast
              <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features — GREEN BAND */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 md:px-14 lg:px-20">
          <Reveal direction="scale">
            <Features />
          </Reveal>
        </div>
      </section>

      {/* Testimonials — What people say */}
      <section className="section-band-green relative  py-5 my-5 overflow-hidden" >
        <DecorativeCircle size="lg" className="top-1/2 -left-40 -translate-y-1/2 opacity-15 !border-white/20" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 md:px-14 lg:px-20">
          <Reveal direction="up">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mt-4">
                What <span className="gradient-text">people say</span>
              </h2>
              <p className="text-white/70 text-sm max-w-xl mx-auto mt-2 mb-5">
                Loved by farmers and foodies across Kerala.
              </p>
            </div>
          </Reveal>

          <Reveal direction="scale" delay={160}>
            <div className="max-w-3xl mx-auto mb-5">
              <div className="glass-card shimmer-border p-5 md:p-10 text-center min-h-[260px] flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-3 left-5 text-6xl text-accent/30 leading-none select-none">"</div>
                <div className="absolute bottom-3 right-5 text-6xl text-accent/30 leading-none select-none rotate-180">"</div>

                <div key={tIndex} className="fade-in-up">
                  <p className="text-white text-lg md:text-xl leading-relaxed italic mb-5 px-3">
                    {testimonials[tIndex].quote}
                  </p>
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-2xl mb-2 pulse-ring">
                      {testimonials[tIndex].avatar}
                    </div>
                    <p className="text-white font-semibold text-sm">{testimonials[tIndex].name}</p>
                    <p className="text-white/60 text-xs">{testimonials[tIndex].role}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mt-5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTIndex(i)}
                    aria-label={`Testimonial ${i + 1}`}
                    className={`carousel-dot ${i === tIndex ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          {/* Marquee — names of farms / regions */}
          <Reveal direction="up" delay={320}>
            <div className="marquee mt-5">
              <div className="marquee-track gap-5">
                {[...Array(2)].map((_, dup) => (
                  <div key={dup} className="flex items-center gap-5 pr-5">
                    {['Palakkad Farms', 'Wayanad Spice Co.', 'Kochi Greens', 'Trivandrum Organics', 'Idukki Highlands', 'Kollam Coconut Co-op', 'Kannur Cardamom', 'Alappuzha Rice Mills'].map((name, i) => (
                      <span
                        key={`${dup}-${i}`}
                        className="text-white/60 text-sm uppercase tracking-widest whitespace-nowrap inline-flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {name}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stories & Guides — Blog */}
      <section className="py-20 relative overflow-hidden">
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 md:px-14 lg:px-20">
          <Reveal direction="left">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-5">
              <div>
                <h2 className="text-3xl md:text-4xl font-light text-dark-text leading-tight">
                  Stories & <span className="gradient-text">Guides</span>
                </h2>
                <p className="text-dark-muted text-sm mt-2">
                  Fresh ideas from the field.
                </p>
              </div>
              <a
                href="#"
                className="pill-btn hidden md:inline-flex items-center gap-2 text-sm !py-2.5 mb-4 link-draw"
              >
                All Articles
                <FiArrowRight size={14} />
              </a>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {blogPosts.map((p, i) => (
              <Reveal key={i} direction="up" delay={Math.min(i * 120, 480)} className="tilt-card h-full">
              <a
                href="#"
                className="glass-card overflow-hidden p-0 block group h-full"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-110"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full bg-accent text-white">
                    {p.tag}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-dark-text font-semibold text-base leading-snug mb-2 group-hover:text-accent transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-dark-muted text-xs leading-relaxed mb-3 line-clamp-2">
                    {p.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-dark-muted">{p.read}</span>
                    <span className="text-accent font-semibold inline-flex items-center gap-1">
                      Read
                      <FiArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA — LIGHT */}
      <section className="py-20 relative overflow-hidden my-5">
        <Reveal direction="scale">
          <div className="max-w-2xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-text leading-tight mt-5">
              Ready to <span className="gradient-text">grow smarter?</span>
            </h2>
            <p className="text-dark-muted text-sm mb-5">
              Join thousands of farmers already using GrownRoot to manage their farms.
            </p>
            <Link to="/register" className="pill-btn inline-flex text-sm !px-5 !py-3 mb-5 cta-glow">
              Start Free Today
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Footer — LIGHT */}
      <footer className=" section-band-green border-t border-dark-border px-5 pt-5 pb-4">
        <DecorativeCircle size="md" className="-top-18 -right-18  opacity-40 !border-white/40" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 mb-5">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 pr-4">
            <Link to="/" className="inline-flex items-center mb-3">
              <img src={logo} alt="GrownRoot" className="h-8 w-auto object-contain" />
            </Link>
            <p className="text-dark-muted text-sm leading-relaxed max-w-xs mb-4">
              Smart farming for everyone — track crops, watch the weather, and sell direct to verified buyers.
            </p>
            <div className="flex items-center gap-2">
              <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-full border border-dark-border flex items-center justify-center text-dark-muted hover:text-accent hover:border-accent transition">
                <FiTwitter size={14} />
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full border border-dark-border flex items-center justify-center text-dark-muted hover:text-accent hover:border-accent transition">
                <FiInstagram size={14} />
              </a>
              <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full border border-dark-border flex items-center justify-center text-dark-muted hover:text-accent hover:border-accent transition">
                <FiFacebook size={14} />
              </a>
              <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-full border border-dark-border flex items-center justify-center text-dark-muted hover:text-accent hover:border-accent transition">
                <FiYoutube size={14} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-dark-text font-semibold text-sm mb-3 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/marketplace" className="text-dark-muted hover:text-accent transition">Marketplace</Link></li>
              <li><Link to="/weather" className="text-dark-muted hover:text-accent transition">Weather</Link></li>
              <li><Link to="/dashboard" className="text-dark-muted hover:text-accent transition">Dashboard</Link></li>
              <li><Link to="/dashboard/suggest" className="text-dark-muted hover:text-accent transition">AI Suggestions</Link></li>
              <li><Link to="/dashboard/disease" className="text-dark-muted hover:text-accent transition">Disease Detection</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-dark-text font-semibold text-sm mb-3 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-dark-muted hover:text-accent transition">About Us</a></li>
              <li><a href="#" className="text-dark-muted hover:text-accent transition">Careers</a></li>
              <li><a href="#" className="text-dark-muted hover:text-accent transition">Blog</a></li>
              <li><a href="#" className="text-dark-muted hover:text-accent transition">Press</a></li>
              <li><a href="#" className="text-dark-muted hover:text-accent transition">Partners</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-dark-text font-semibold text-sm mb-3 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 text-dark-muted">
                <FiMail size={14} className="text-accent mt-0.5 shrink-0" />
                <a href="mailto:hello@grownroot.com" className="hover:text-accent transition">hello@grownroot.com</a>
              </li>
              <li className="flex items-start gap-2 text-dark-muted">
                <FiPhone size={14} className="text-accent mt-0.5 shrink-0" />
                <a href="tel:+918000000000" className="hover:text-accent transition">+91 80000 00000</a>
              </li>
              <li className="flex items-start gap-2 text-dark-muted">
                <FiMapPin size={14} className="text-accent mt-0.5 shrink-0" />
                <span>Kochi, Kerala, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-border pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-dark-muted text-xs">
            &copy; 2026 GrownRoot. Smart farming made simple.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <a href="#" className="text-dark-muted hover:text-accent transition">Privacy</a>
            <a href="#" className="text-dark-muted hover:text-accent transition">Terms</a>
            <a href="#" className="text-dark-muted hover:text-accent transition">Cookies</a>
            <a href="#" className="text-dark-muted hover:text-accent transition">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
