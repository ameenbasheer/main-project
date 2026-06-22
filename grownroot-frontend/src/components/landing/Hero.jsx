import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import farmIllustration from '../../assets/farm_illustration.jpg';
import farmIllustration2 from '../../assets/farm_illustration2.jpg';
import farmIllustration3 from '../../assets/farm_illustration3.jpg';

const slides = [
  {
    type: 'image',
    src: farmIllustration,
    title: 'Farm to Table',
    subtitle: 'Fresh produce, direct from local farmers',
  },
  {
    type: 'image',
    src: farmIllustration2,
    title: 'Smart Harvest',
    subtitle: 'Track crops from seed to harvest',
  },
  {
    type: 'image',
    src: farmIllustration3,
    title: 'Sustainable Growth',
    subtitle: 'AI insights for healthier yields',
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const handleMouseMove = (e) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--mx', `${mx}%`);
    el.style.setProperty('--my', `${my}%`);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="hero-fullbleed spotlight relative min-h-[85vh] flex items-center overflow-hidden"
    >
      {/* Carousel slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`carousel-slide ${i === index ? 'active' : ''}`}
          style={slide.type === 'gradient' ? { background: slide.gradient } : undefined}
        >
          {slide.type === 'image' ? (
            <img
              src={slide.src}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[16rem] md:text-[22rem] drop-shadow-2xl select-none opacity-80">
                {slide.emoji}
              </span>
            </div>
          )}
        </div>
      ))}

      {/* Dark readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/90 via-dark-bg/65 to-dark-bg/30 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent z-[1]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-10 md:px-14 lg:px-20 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <span
            key={`badge-${index}`}
            className="fade-in-up inline-flex items-center gap-2 px-3 py-1 text-accent text-xs uppercase tracking-widest mb-6 backdrop-blur rounded-full border border-accent/30 bg-accent/5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-ring" />
            {slides[index].subtitle}
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
            <span className="word-rise" style={{ animationDelay: '0.05s' }}>From</span>{' '}
            <span className="word-rise" style={{ animationDelay: '0.18s' }}>Root</span>
            <br />
            <span className="gradient-text word-rise inline-block" style={{ animationDelay: '0.32s' }}>to</span>{' '}
            <span className="gradient-text word-rise inline-block" style={{ animationDelay: '0.45s' }}>Growth.</span>
          </h1>
          <p
            key={`sub-${index}`}
            className="fade-in-up text-white/80 text-lg md:text-lg mb-10 max-w-lg mx-auto"
            style={{ animationDelay: '0.55s', animationFillMode: 'both' }}
          >
            Smart farming made simple — manage, grow, and sell.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 fade-in-up" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
            <Link
              to="/marketplace"
              className="pill-btn cta-glow inline-flex items-center gap-4 text-sm !px-3 !py-2 bg-accent/10 backdrop-blur"
            >
              Explore Market
              <span className="w-5 h-5 rounded-full border border-accent/40 flex items-center justify-center">
                <FiArrowRight className="text-accent" />
              </span>
            </Link>
            {/* <Link
              to="/register"
              className="pill-btn inline-flex items-center gap-4 text-sm !px-5 !py-2 bg-dark-bg/40 backdrop-blur"
            >
              Create Account
              <span className="w-5 h-5 rounded-full border border-accent/40 flex items-center justify-center">
                <FiArrowRight className="text-accent" />
              </span>
            </Link> */}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`carousel-dot ${i === index ? 'active' : ''}`}
          />
        ))}
      </div>
    </section>
  );
}
