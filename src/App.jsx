import { useState, useEffect, useRef } from "react";

// ─── Dummy Data ────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: 1,
    icon: "🪚",
    title: "Scratch & Dent Repair",
    desc: "From hairline scratches to deep gouges, we blend repairs invisibly using hand-mixed stains matched to your piece's original finish.",
  },
  {
    id: 2,
    icon: "🏺",
    title: "Antique Restoration",
    desc: "Heirloom pieces demand reverence. We use period-appropriate techniques and materials to honor the original craftsman's intent.",
  },
  {
    id: 3,
    icon: "🔩",
    title: "Joint Regluing & Structural Repair",
    desc: "Wobbly chairs and loose table legs get full disassembly, old glue removal, and precision regluing for a lifetime of renewed stability.",
  },
  {
    id: 4,
    icon: "✨",
    title: "Refinishing & French Polish",
    desc: "Strip back decades of grime and old varnish, then apply a hand-rubbed oil, lacquer, or shellac finish tailored to your taste.",
  },
];

const PORTFOLIO = [
  {
    id: 1,
    label: "Victorian Parlour Chair",
    detail: "Reglued joints · Fabric replaced · Finish restored",
    before: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    after: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80",
  },
  {
    id: 2,
    label: "Mid-Century Walnut Credenza",
    detail: "Deep scratch repair · Tung oil refinish",
    before: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80",
    after: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80",
  },
  {
    id: 3,
    label: "Farmhouse Dining Table",
    detail: "Water ring removal · Full refinish · Leg stabilization",
    before: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=600&q=80",
    after: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=600&q=80",
  },
  {
    id: 4,
    label: "Antique Secretary Desk",
    detail: "Veneer rebonded · Hardware replaced · Shellac polish",
    before: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80",
    after: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80",
  },
  {
    id: 5,
    label: "Rocking Chair — 1890s Oak",
    detail: "Broken spindle replaced · Strip & restain",
    before: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    after: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=600&q=80",
  },
  {
    id: 6,
    label: "Arts & Crafts Bookcase",
    detail: "Mortise joint repair · Linseed oil finish",
    before: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    after: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80",
  },
];

// ─── Utility ───────────────────────────────────────────────────────────────────

function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── Nav ───────────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Services", "Portfolio", "About", "Contact"];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-stone-950/95 backdrop-blur-sm shadow-lg shadow-black/30" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-stone-950 font-black text-lg leading-none group-hover:bg-amber-500 transition-colors">
            M
          </div>
          <div className="leading-tight">
            <div className="font-display text-amber-50 text-lg tracking-wide">Maestas Furniture</div>
            <div className="text-amber-600 text-[10px] uppercase tracking-[0.2em] font-medium">Repair & Restoration · Denver</div>
          </div>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l}>
              <a
                href={`#${l.toLowerCase()}`}
                className="text-stone-300 text-sm uppercase tracking-widest hover:text-amber-400 transition-colors duration-300 font-medium"
              >
                {l}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="ml-2 px-5 py-2.5 bg-amber-600 text-stone-950 text-sm font-bold uppercase tracking-widest rounded hover:bg-amber-500 transition-colors"
            >
              Free Quote
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-amber-50 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <div className={`w-6 h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-64" : "max-h-0"}`}>
        <div className="bg-stone-950/98 border-t border-stone-800 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="text-stone-300 uppercase tracking-widest text-sm hover:text-amber-400 transition-colors"
            >
              {l}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="px-5 py-2.5 bg-amber-600 text-stone-950 text-sm font-bold uppercase tracking-widest rounded text-center hover:bg-amber-500 transition-colors"
          >
            Free Quote
          </a>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1800&q=85"
          alt="Workshop"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-stone-950/90 via-stone-900/75 to-amber-950/60" />
        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Decorative rule */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-48 bg-gradient-to-b from-transparent via-amber-600 to-transparent opacity-60" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-3 mb-8 animate-fade-in">
          <div className="h-px w-12 bg-amber-600" />
          <span className="text-amber-500 text-xs uppercase tracking-[0.3em] font-semibold">
            Denver's Premier Furniture Repair Specialists
          </span>
          <div className="h-px w-12 bg-amber-600" />
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-amber-50 leading-[0.95] mb-8 animate-slide-up">
          Bringing Your
          <br />
          <em className="text-amber-400 not-italic">Beloved Furniture</em>
          <br />
          Back to Life
        </h1>

        {/* Sub */}
        <p className="text-stone-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up animation-delay-200">
          Trusted furniture repair and restoration, now serving the Denver metro area.
          We fix the pieces that matter most — from family heirlooms to everyday favorites, wood, upholstery, and everything in between.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-400">
          <a
            href="#contact"
            className="group px-8 py-4 bg-amber-600 text-stone-950 font-bold uppercase tracking-widest text-sm rounded hover:bg-amber-400 transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/30 hover:-translate-y-0.5"
          >
            Get a Free Quote
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <a
            href="#portfolio"
            className="px-8 py-4 border border-stone-500 text-stone-200 font-medium uppercase tracking-widest text-sm rounded hover:border-amber-600 hover:text-amber-400 transition-all duration-300"
          >
            View Our Work
          </a>
        </div>

        {/* Stats strip */}
        <div className="mt-20 grid grid-cols-3 gap-4 max-w-lg mx-auto animate-slide-up animation-delay-600">
          {[["20+", "Years Experience"], ["1,200+", "Pieces Restored"], ["5★", "Google Rating"]].map(
            ([num, label]) => (
              <div key={label} className="text-center">
                <div className="font-display text-3xl text-amber-400">{num}</div>
                <div className="text-stone-400 text-xs uppercase tracking-widest mt-1">{label}</div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-500 animate-bounce">
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-stone-500 to-transparent" />
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────

function Services() {
  const [ref, visible] = useScrollReveal();

  return (
    <section id="services" className="bg-stone-100 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-amber-700" />
            <span className="text-amber-700 text-xs uppercase tracking-[0.25em] font-semibold">What We Do</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-stone-900 max-w-xl leading-tight">
            Craftsmanship for Every Repair
          </h2>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {SERVICES.map((s, i) => (
            <div
              key={s.id}
              className="group bg-white border border-stone-200 p-8 rounded-sm hover:border-amber-600 hover:shadow-xl hover:shadow-amber-900/10 transition-all duration-500 cursor-default"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(24px)",
                transition: `opacity 0.6s ease ${i * 120}ms, transform 0.6s ease ${i * 120}ms, box-shadow 0.3s, border-color 0.3s`,
              }}
            >
              <div className="text-4xl mb-6">{s.icon}</div>
              <div className="w-8 h-0.5 bg-amber-600 mb-5 group-hover:w-12 transition-all duration-300" />
              <h3 className="font-display text-xl text-stone-900 mb-3 leading-snug">{s.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

function PortfolioCard({ item, index, visible }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="group cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(32px)",
        transition: `opacity 0.7s ease ${index * 100}ms, transform 0.7s ease ${index * 100}ms`,
      }}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="bg-stone-900 rounded-sm overflow-hidden border border-stone-800 hover:border-amber-700 transition-colors duration-300">
        {/* Images: before & after */}
        <div className="grid grid-cols-2 gap-0">
          <div className="relative">
            <img
              src={item.before}
              alt={`${item.label} — Before`}
              className="w-full aspect-[4/3] object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500"
            />
            <div className="absolute top-2 left-2 bg-stone-950/80 text-stone-400 text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm font-medium">
              Before
            </div>
          </div>
          <div className="relative">
            <img
              src={item.after}
              alt={`${item.label} — After`}
              className="w-full aspect-[4/3] object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105 transition-transform"
            />
            <div className="absolute top-2 right-2 bg-amber-600/90 text-stone-950 text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm font-bold">
              After
            </div>
          </div>
        </div>
        {/* Label */}
        <div className="p-5 border-t border-stone-800">
          <h3 className="font-display text-amber-50 text-lg mb-1">{item.label}</h3>
          <p className="text-stone-500 text-xs tracking-wide">{item.detail}</p>
        </div>
      </div>
    </div>
  );
}

function Portfolio() {
  const [ref, visible] = useScrollReveal(0.05);

  return (
    <section id="portfolio" className="bg-stone-950 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-amber-700" />
              <span className="text-amber-700 text-xs uppercase tracking-[0.25em] font-semibold">Before & After</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-amber-50 leading-tight max-w-sm">
              The Work Speaks for Itself
            </h2>
          </div>
          <p className="text-stone-400 max-w-xs text-sm leading-relaxed md:text-right">
            Each project is a unique story. Browse a selection of our recent restorations across the Denver metro area.
          </p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {PORTFOLIO.map((item, i) => (
            <PortfolioCard key={item.id} item={item} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  const [ref, visible] = useScrollReveal();

  return (
    <section id="about" className="bg-amber-950 py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Image */}
          <div
            className="relative"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateX(-32px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <div className="absolute -inset-4 border border-amber-700/30 rounded-sm -rotate-2" />
            <img
              src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=85"
              alt="Brandon Maestas at work"
              className="relative w-full aspect-[4/5] object-cover object-center rounded-sm"
            />
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-amber-600 text-stone-950 p-5 rounded-sm shadow-xl">
              <div className="font-display text-3xl leading-none">20</div>
              <div className="text-[10px] uppercase tracking-widest font-bold mt-1">Years<br/>Expert</div>
            </div>
          </div>

          {/* Text */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateX(32px)",
              transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-amber-500" />
              <span className="text-amber-500 text-xs uppercase tracking-[0.25em] font-semibold">Meet the Owner</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-amber-50 leading-tight mb-8">
              Brandon Maestas,<br />
              <span className="text-amber-400">20+ Years</span><br />
              Furniture Repair Pro
            </h2>
            <div className="space-y-5 text-amber-100/70 leading-relaxed">
              <p>
                I've been repairing furniture since I was a teenager working summers in my uncle's shop.
                Over 20 years later, I've seen just about every kind of damage imaginable — and fixed it.
                Wood, metal, upholstery, leather, laminate — if it's furniture, I can bring it back.
              </p>
              <p>
                At Maestas Furniture Repair, we believe every piece of furniture has a story worth
                preserving. Whether it's a dining set that's hosted decades of family dinners, or a
                sofa you just can't part with, our job is to make it look and feel like new.
              </p>
              <p>
                We serve the entire Denver metro, including Boulder, Aurora, Lakewood, and Highlands Ranch.
                Every quote is free, every repair is guaranteed, and every client is treated like a neighbor.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-6">
              <a
                href="#contact"
                className="px-7 py-3.5 bg-amber-500 text-stone-950 font-bold uppercase tracking-widest text-xs rounded hover:bg-amber-400 transition-colors"
              >
                Work With Us
              </a>
              <div className="text-amber-600 text-sm font-medium">
                📞 (720) 555-0192
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  const [ref, visible] = useScrollReveal();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", description: "", image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Netlify will handle actual submission via data-netlify
    // For local demo, just show success state
    setSubmitted(true);
  };

  return (
    <section id="contact" className="bg-stone-100 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-5 gap-16"
        >
          {/* Left panel */}
          <div
            className="lg:col-span-2"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(24px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-amber-700" />
              <span className="text-amber-700 text-xs uppercase tracking-[0.25em] font-semibold">Get in Touch</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-stone-900 leading-tight mb-8">
              Start With a<br />
              <span className="text-amber-700">Free Quote</span>
            </h2>
            <p className="text-stone-500 leading-relaxed mb-10 text-sm">
              Describe your piece and upload a photo of the damage — we'll get back to you within one business day with a no-obligation estimate.
            </p>

            <div className="space-y-6">
              {[
                ["📍", "Service Area", "Denver Metro · Boulder · Aurora\nLakewood · Highlands Ranch"],
                ["📞", "Phone", "(720) 555-0192"],
                ["📧", "Email", "hello@maestasfurniture.com"],
                ["🕐", "Hours", "Mon–Fri: 8am–6pm\nSat: 9am–3pm"],
              ].map(([icon, label, value]) => (
                <div key={label} className="flex gap-4">
                  <span className="text-xl mt-0.5">{icon}</span>
                  <div>
                    <div className="text-stone-900 font-semibold text-sm mb-0.5">{label}</div>
                    <div className="text-stone-500 text-sm whitespace-pre-line">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div
            className="lg:col-span-3"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(24px)",
              transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
            }}
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 bg-white border border-stone-200 rounded-sm px-8">
                <div className="text-5xl mb-6">🪵</div>
                <h3 className="font-display text-3xl text-stone-900 mb-4">Message Received!</h3>
                <p className="text-stone-500 max-w-sm">
                  Thank you for reaching out. Brandon will personally review your project and respond within one business day.
                </p>
              </div>
            ) : (
              <form
                name="thornton-quote"
                method="POST"
                data-netlify="true"
                encType="multipart/form-data"
                onSubmit={handleSubmit}
                className="bg-white border border-stone-200 rounded-sm p-8 md:p-10 shadow-sm"
              >
                {/* Netlify hidden field */}
                <input type="hidden" name="form-name" value="thornton-quote" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  {/* Name */}
                  <div>
                    <label className="block text-stone-700 text-xs font-semibold uppercase tracking-wider mb-2">
                      Full Name <span className="text-amber-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 border border-stone-200 rounded-sm text-stone-800 placeholder-stone-300 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
                    />
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-stone-700 text-xs font-semibold uppercase tracking-wider mb-2">
                      Email <span className="text-amber-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 border border-stone-200 rounded-sm text-stone-800 placeholder-stone-300 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="mb-5">
                  <label className="block text-stone-700 text-xs font-semibold uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(720) 555-0100"
                    className="w-full px-4 py-3 border border-stone-200 rounded-sm text-stone-800 placeholder-stone-300 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="mb-5">
                  <label className="block text-stone-700 text-xs font-semibold uppercase tracking-wider mb-2">
                    Describe the Damage <span className="text-amber-600">*</span>
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g. 'My 1940s oak dining chair has a broken back spindle and the joints are loose. The finish is also worn in several spots...'"
                    className="w-full px-4 py-3 border border-stone-200 rounded-sm text-stone-800 placeholder-stone-300 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors resize-none"
                  />
                </div>

                {/* Image upload */}
                <div className="mb-8">
                  <label className="block text-stone-700 text-xs font-semibold uppercase tracking-wider mb-2">
                    Upload a Photo of the Damage
                  </label>
                  <div className="relative border-2 border-dashed border-stone-200 rounded-sm p-6 text-center hover:border-amber-500 transition-colors cursor-pointer group">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📸</div>
                    {formData.image ? (
                      <p className="text-amber-700 text-sm font-medium">{formData.image.name}</p>
                    ) : (
                      <>
                        <p className="text-stone-400 text-sm">Click to browse or drag & drop</p>
                        <p className="text-stone-300 text-xs mt-1">JPG, PNG, HEIC up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-amber-700 text-amber-50 font-bold uppercase tracking-widest text-sm rounded-sm hover:bg-amber-600 transition-colors duration-300 hover:shadow-lg hover:shadow-amber-900/20"
                >
                  Send My Quote Request →
                </button>

                <p className="text-stone-400 text-xs text-center mt-4">
                  No spam. No obligations. Just honest woodworking.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-stone-800 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-stone-500 text-xs">
        <div className="font-display text-stone-400 text-base">Maestas Furniture Repair</div>
        <p>© {new Date().getFullYear()} Maestas Furniture Repair LLC · Denver, CO · All rights reserved.</p>
        <p>Built with ♥ and sawdust</p>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="font-body antialiased">
      <Navbar />
      <Hero />
      <Services />
      <Portfolio />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
