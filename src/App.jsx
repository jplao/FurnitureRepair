import { useState, useEffect, useRef } from "react";

// ─── Static Data ───────────────────────────────────────────────────────────────

const SERVICES = [
  { id: 1, emoji: "🪚", title: "Scratch & Dent Repair", desc: "Invisible blending using hand-mixed stains matched exactly to your piece's original finish. No patches, no traces." },
  { id: 2, emoji: "🏺", title: "Antique Restoration", desc: "We treat every heirloom with reverence — using period-appropriate techniques that preserve character and value." },
  { id: 3, emoji: "🔩", title: "Structural Repair", desc: "Full disassembly, old glue removal, and precision regluing. Wobbly chairs and loose legs won't last long with us." },
  { id: 4, emoji: "✨", title: "Refinishing & Polishing", desc: "Strip decades of wear and apply a hand-rubbed oil, lacquer, or shellac finish perfectly suited to your piece." },
];

// ─── Portfolio filenames — add new filenames here when new items are added ─────
// Each filename corresponds to a JSON file in /public/portfolio/
const PORTFOLIO_FILES = [
  "victorian-parlour-chair",
  "mid-century-credenza",
  "farmhouse-dining-table",
  "antique-secretary-desk",
];

const REVIEWS = [
  { id: 1, initial: "S", name: "Sarah M.", loc: "Cherry Creek, Denver", text: "They restored my grandmother's dining set. I cried when I saw it. Absolutely incredible work and so reasonably priced." },
  { id: 2, initial: "T", name: "Tom R.", loc: "Highlands Ranch", text: "They came right to my home and fixed my dining table in a few hours. No hassle, no hauling — just great results." },
  { id: 3, initial: "L", name: "Lisa K.", loc: "Lakewood", text: "Honest pricing, fast turnaround, exceptional results. I'm now having them restore our entire bedroom set. Brandon and Carla are the real deal." },
];

const STEPS = [
  { num: "01", title: "Share Your Photos", desc: "Fill out our quick form and upload a photo of the damage. Takes under 2 minutes." },
  { num: "02", title: "Get a Free Estimate", desc: "We personally review every job and send an honest, no-obligation quote within 24 hours." },
  { num: "03", title: "We Come to You", desc: "All work is done right in your home — no hauling heavy furniture. We bring the tools and expertise to you." },
  { num: "04", title: "Enjoy the Results", desc: "We clean up, you enjoy the transformation. 100% satisfaction guaranteed, every single time." },
];

const OWNERS = [
  {
    name: "Brandon Maestas",
    role: "Co-Owner & Lead Restorer",
    years: "20+",
    img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&q=85",
    bio: "Brandon has been repairing furniture since he was a teenager working summers in his uncle's shop. Over 20 years later, he specializes in structural repair and wood restoration — from hairline scratches to full refinishes.",
    tags: ["Wood Repair", "Antique Restoration", "Refinishing"],
  },
  {
    name: "Carla Vega",
    role: "Co-Owner & Client Relations",
    years: "15+",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=85",
    bio: "Carla manages every client relationship from first quote to final reveal. With a background in antique restoration and fine finishing, her eye for detail and passion for quality keeps clients coming back.",
    tags: ["Antique Restoration", "Fine Finishing", "Client Relations"],
  },
];

// ─── Hook: scroll reveal ───────────────────────────────────────────────────────

function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── Hook: load portfolio from CMS JSON files ─────────────────────────────────
// First tries to fetch the list of portfolio files from the Netlify Function
// (/portfolio-index.json), which auto-discovers any new items
// added via the CMS admin panel without needing a code change.
// Falls back to the PORTFOLIO_FILES array if the function isn't available
// (e.g. during local development).

function usePortfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Try the Netlify Function first (works in production)
        let filenames = PORTFOLIO_FILES;
        try {
          const res = await fetch("/portfolio-index.json");
          if (res.ok) {
            const data = await res.json();
            if (data.items && data.items.length > 0) {
              filenames = data.items;
            }
          }
        } catch {
          // Function not available (local dev) — use the static array
        }

        // Fetch each individual JSON file
        const results = await Promise.all(
          filenames.map(name =>
            fetch(`/portfolio/${name}.json`)
              .then(r => r.ok ? r.json() : null)
              .catch(() => null)
          )
        );

        // Filter out failed fetches and sort by the order field
        const valid = results
          .filter(Boolean)
          .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

        setItems(valid);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { items, loading };
}

// ─── Tag ──────────────────────────────────────────────────────────────────────

function SectionTag({ label }) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#c4571a] mb-4">
      <span className="w-5 h-0.5 bg-[#c4571a] rounded inline-block" />
      {label}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["Services", "Portfolio", "About", "Contact"];
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#faf6f0]/97 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-[76px] flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-[#c4571a] rounded-xl flex items-center justify-center text-2xl shadow-md shadow-[#c4571a]/30 group-hover:bg-[#d96b2a] transition-colors">🪑</div>
          <div>
            <div className="font-display text-[17px] font-bold text-[#3d2b1a] leading-tight">Restore & Refinish</div>
            <div className="text-[11px] text-[#9c7d62] font-medium">Furniture Repair · Denver, CO</div>
          </div>
        </a>
        <ul className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <li key={l}><a href={`#${l.toLowerCase()}`} className="text-[#6b4e35] text-sm font-medium hover:text-[#c4571a] transition-colors">{l}</a></li>
          ))}
          <li><a href="#contact" className="px-5 py-2.5 bg-[#c4571a] text-white text-sm font-bold rounded-full hover:bg-[#d96b2a] transition-all shadow-md shadow-[#c4571a]/30 hover:-translate-y-0.5 inline-block">Free Quote</a></li>
        </ul>
        <button className="md:hidden p-2 text-[#3d2b1a]" onClick={() => setOpen(!open)}>
          <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all ${open ? "opacity-0" : ""}`} />
          <div className={`w-6 h-0.5 bg-current transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-72" : "max-h-0"}`}>
        <div className="bg-[#faf6f0] border-t border-[#ece4d8] px-6 py-5 flex flex-col gap-4">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)} className="text-[#6b4e35] font-medium hover:text-[#c4571a] transition-colors">{l}</a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="px-5 py-2.5 bg-[#c4571a] text-white text-sm font-bold rounded-full text-center">Free Quote</a>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="hero" className="pt-[76px] min-h-screen bg-[#faf6f0] relative overflow-hidden flex items-center">
      <div className="absolute top-[-10%] right-[-5%] w-[55%] aspect-square bg-[#ece4d8] rounded-[60%_40%_70%_30%/50%_60%_40%_50%] z-0" />
      <div className="absolute bottom-[5%] left-[-8%] w-[30%] aspect-square bg-[#c4571a]/10 rounded-[40%_60%_30%_70%/60%_40%_60%_40%] z-0" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center w-full">
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-2 bg-[#5a7358]/12 border border-[#5a7358]/25 text-[#5a7358] px-4 py-2 rounded-full text-xs font-bold mb-7 self-start tracking-wide">
            <span className="text-[10px]">✦</span> Denver's Trusted Furniture Repair Experts
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#3d2b1a] leading-[1.05] font-bold mb-6">
            Give Your<br />Furniture a<br /><em className="text-[#c4571a] not-italic">Second Life</em>
          </h1>
          <p className="text-[#6b4e35] text-lg leading-relaxed max-w-[460px] mb-10">
            We repair, restore, and refinish wood furniture of all kinds — all in your home. Locally owned in Denver by Brandon & Carla for 20+ years.
          </p>
          <div className="flex gap-4 flex-wrap mb-12">
            <a href="#contact" className="px-8 py-4 bg-[#c4571a] text-white font-bold rounded-full hover:bg-[#d96b2a] transition-all shadow-lg shadow-[#c4571a]/30 hover:-translate-y-0.5 inline-block">Get a Free Quote →</a>
            <a href="#portfolio" className="px-8 py-4 bg-[#ece4d8] text-[#3d2b1a] font-semibold rounded-full hover:bg-[#ddd4c4] transition-all border border-[#ece4d8] inline-block">See Our Work</a>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[["⭐", "5.0 on Google"], ["✅", "100% Satisfaction"], ["🏠", "In-Home Service"]].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2 bg-white border border-[#ece4d8] text-[#6b4e35] text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
                <span>{icon}</span>{label}
              </div>
            ))}
          </div>
        </div>
        <div className="relative hidden lg:block">
          <div className="absolute top-6 -right-4 bg-[#c4571a] text-white rounded-2xl px-5 py-4 text-center shadow-lg z-20">
            <div className="font-display text-3xl font-bold leading-none">20+</div>
            <div className="text-[11px] font-semibold uppercase tracking-widest opacity-85 mt-1">Years<br />Experience</div>
          </div>
          <div className="w-full rounded-3xl overflow-hidden shadow-2xl shadow-[#2c1d10]/18">
            <img src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=900&q=85" alt="Furniture repair workshop" className="w-full aspect-[4/5] object-cover" />
          </div>
          <div className="absolute -bottom-6 -left-6 w-[55%] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#faf6f0]">
            <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80" alt="Restored chair" className="w-full aspect-[4/3] object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────

function Services() {
  const [ref, visible] = useScrollReveal();
  return (
    <section id="services" className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-end mb-14">
          <div>
            <SectionTag label="Our Services" />
            <h2 className="font-display text-4xl lg:text-5xl text-[#3d2b1a] leading-tight">We Fix All Types<br />of Wood Furniture</h2>
          </div>
          <p className="text-[#6b4e35] text-base leading-relaxed">From a wobbly dining chair to a family heirloom — if it's wood furniture, we can fix it. All work done in your home, on your schedule.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((s, i) => (
            <div
              key={s.id}
              className="bg-[#faf6f0] border border-[#ece4d8] rounded-2xl p-8 relative overflow-hidden hover:shadow-xl hover:shadow-[#2c1d10]/10 hover:-translate-y-1 transition-all duration-300 group"
              style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: `opacity 0.6s ease ${i * 100}ms, transform 0.6s ease ${i * 100}ms, box-shadow 0.3s` }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#c4571a] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <span className="text-3xl mb-5 block">{s.emoji}</span>
              <h3 className="font-display text-[19px] text-[#3d2b1a] font-bold mb-3">{s.title}</h3>
              <p className="text-[#6b4e35] text-sm leading-[1.7]">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Process ──────────────────────────────────────────────────────────────────

function Process() {
  const [ref, visible] = useScrollReveal();
  return (
    <section className="bg-[#3d2b1a] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <h2 className="font-display text-4xl lg:text-5xl text-[#faf6f0] leading-tight mb-16">
          How It Works —<br /><em className="text-[#d96b2a]">Simple & Stress-Free</em>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((s, i) => (
            <div
              key={s.num}
              className="relative"
              style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: `opacity 0.6s ease ${i * 120}ms, transform 0.6s ease ${i * 120}ms` }}
            >
              {i < STEPS.length - 1 && <div className="hidden lg:block absolute right-[-20px] top-[22px] text-[#faf6f0]/20 text-xl">→</div>}
              <div className="w-[52px] h-[52px] rounded-full border-2 border-[#c4571a]/50 flex items-center justify-center mb-5">
                <span className="font-display text-xl text-[#d96b2a] font-bold">{s.num}</span>
              </div>
              <h3 className="font-display text-xl text-[#faf6f0] font-semibold mb-3">{s.title}</h3>
              <p className="text-[#faf6f0]/55 text-sm leading-[1.7]">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

function Portfolio() {
  const [ref, visible] = useScrollReveal(0);
  const { items, loading } = usePortfolio();

  return (
    <section id="portfolio" className="bg-[#faf6f0] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <SectionTag label="Before & After" />
            <h2 className="font-display text-4xl lg:text-5xl text-[#3d2b1a] leading-tight">The Work Speaks<br />for Itself</h2>
          </div>
          <a href="#contact" className="px-6 py-3 bg-[#ece4d8] text-[#3d2b1a] font-semibold rounded-full hover:bg-[#ddd4c4] transition-all text-sm self-start md:self-end">Get a Quote →</a>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-[#ece4d8] rounded-2xl animate-pulse aspect-[4/3]" />
            ))}
          </div>
        )}

        {/* Portfolio grid */}
        {!loading && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, i) => (
              <div
                key={item.label}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#2c1d10]/12 transition-all duration-300 ${item.wide ? "sm:col-span-2" : ""}`}
              >
                <div className="grid grid-cols-2 relative">
                  <span className="absolute top-2.5 left-2.5 z-10 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-[#2c1d10]/60 text-white/90">Before</span>
                  <span className="absolute top-2.5 right-2.5 z-10 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-[#c4571a] text-white">After</span>
                  <img src={item.before} alt={`${item.label} — Before`} className="w-full aspect-[4/3] object-cover" />
                  <img src={item.after} alt={`${item.label} — After`} className="w-full aspect-[4/3] object-cover" />
                </div>
                <div className="px-5 py-4">
                  <div className="font-display text-[#3d2b1a] font-bold text-base">{item.label}</div>
                  <div className="text-[#9c7d62] text-xs mt-1">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state — only shows if CMS has no items yet */}
        {!loading && items.length === 0 && (
          <div className="text-center py-20 text-[#9c7d62]">
            <div className="text-4xl mb-4">📸</div>
            <p className="font-display text-xl text-[#3d2b1a] mb-2">Portfolio coming soon</p>
            <p className="text-sm">Check back to see our latest before & after transformations.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

function Reviews() {
  const [ref, visible] = useScrollReveal();
  return (
    <section className="bg-[#f3ede4] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-12">
          <SectionTag label="Customer Reviews" />
          <h2 className="font-display text-4xl lg:text-5xl text-[#3d2b1a] leading-tight">What Denver<br />Homeowners Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl p-7 border border-[#ece4d8] shadow-sm hover:shadow-lg transition-all duration-300"
              style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: `opacity 0.6s ease ${i * 120}ms, transform 0.6s ease ${i * 120}ms` }}
            >
              <div className="text-[#c4571a] text-base tracking-[2px] mb-4">★★★★★</div>
              <p className="font-display italic text-base text-[#3d2b1a] leading-[1.65] mb-6">"{r.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#ece4d8]">
                <div className="w-10 h-10 rounded-full bg-[#c4571a]/10 text-[#c4571a] flex items-center justify-center font-display text-lg font-bold flex-shrink-0">{r.initial}</div>
                <div>
                  <div className="text-sm font-bold text-[#3d2b1a]">{r.name}</div>
                  <div className="text-xs text-[#9c7d62] mt-0.5">{r.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  const [ref, visible] = useScrollReveal(0);
  return (
    <section id="about" className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-12">
          <SectionTag label="Meet the Owners" />
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <h2 className="font-display text-4xl lg:text-5xl text-[#3d2b1a] leading-tight">The People Behind<br />Every Repair</h2>
            <p className="text-[#6b4e35] text-sm leading-relaxed max-w-xs md:text-right">A locally owned Denver business — you work directly with Brandon and Carla, never a call center.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {OWNERS.map((owner, i) => (
            <div
              key={owner.name}
              className="bg-[#faf6f0] border border-[#ece4d8] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-[#2c1d10]/10 transition-all duration-300 group"
              style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(28px)", transition: `opacity 0.7s ease ${i * 150}ms, transform 0.7s ease ${i * 150}ms` }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="relative overflow-hidden">
                  <img src={owner.img} alt={owner.name} className="w-full h-64 sm:h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 bg-[#c4571a] text-white rounded-xl px-3 py-2 text-center shadow-md">
                    <div className="font-display text-xl font-bold leading-none">{owner.years}</div>
                    <div className="text-[9px] font-bold uppercase tracking-wide mt-0.5 opacity-85">Yrs</div>
                  </div>
                </div>
                <div className="p-7 flex flex-col justify-between">
                  <div>
                    <div className="text-[#c4571a] text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5">{owner.role}</div>
                    <h3 className="font-display text-2xl text-[#3d2b1a] font-bold mb-4">{owner.name}</h3>
                    <p className="text-[#6b4e35] text-sm leading-[1.7]">{owner.bio}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {owner.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-[#c4571a]/10 text-[#c4571a]">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-5 pt-10 border-t border-[#ece4d8]">
          <p className="text-[#6b4e35] text-sm max-w-md">Together, Brandon and Carla bring decades of hands-on wood furniture expertise — every repair done in your home, on your schedule.</p>
          <a href="#contact" className="flex-shrink-0 px-7 py-3.5 bg-[#c4571a] text-white font-bold rounded-full hover:bg-[#d96b2a] transition-colors shadow-md shadow-[#c4571a]/25 text-sm">Work With Us →</a>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────

function Contact() {
  const [ref, visible] = useScrollReveal();
  const [fileName, setFileName] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="bg-[#f3ede4] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
            <SectionTag label="Contact Us" />
            <h2 className="font-display text-4xl lg:text-5xl text-[#3d2b1a] leading-tight mb-6">
              Get Your Free<br /><span className="text-[#c4571a]">Estimate Today</span>
            </h2>
            <p className="text-[#6b4e35] text-base leading-relaxed mb-10">Describe your piece, upload a photo, and we'll personally respond with a no-obligation quote within one business day.</p>
            <div className="flex flex-col gap-4">
              {[
                ["📞", "Phone", "(720) 555-0192"],
                ["📧", "Email", "hello@restoreandrefinish.com"],
                ["📍", "Service Area", "Denver · Boulder · Aurora · Lakewood · Highlands Ranch"],
                ["🕐", "Hours", "Mon–Fri 8am–6pm · Sat 9am–3pm"],
              ].map(([icon, label, val]) => (
                <div key={label} className="bg-white rounded-xl p-5 flex gap-4 items-start border border-[#ece4d8]">
                  <div className="w-11 h-11 rounded-xl bg-[#c4571a]/10 flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#9c7d62] mb-1">{label}</div>
                    <div className="text-[#3d2b1a] font-medium text-sm leading-snug">{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s" }}>
            {submitted ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#ece4d8]">
                <div className="text-5xl mb-5">🎉</div>
                <h3 className="font-display text-2xl text-[#3d2b1a] mb-3">Quote Request Sent!</h3>
                <p className="text-[#6b4e35] text-sm">Thank you! We'll personally review your project and respond within one business day.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-[#ece4d8]">
                <h3 className="font-display text-2xl text-[#3d2b1a] mb-1">Request a Free Quote</h3>
                <p className="text-[#9c7d62] text-sm mb-7">We'll get back to you within 1 business day.</p>
                <form
                  name="restore-refinish-quote"
                  data-netlify="true"
                  method="POST"
                  encType="multipart/form-data"
                  onSubmit={e => { e.preventDefault(); setSubmitted(true); }}
                  className="flex flex-col gap-4"
                >
                  <input type="hidden" name="form-name" value="restore-refinish-quote" />
                  <div className="grid grid-cols-2 gap-4">
                    {[["first-name", "First Name *", "Jane"], ["last-name", "Last Name", "Doe"]].map(([name, label, ph]) => (
                      <div key={name}>
                        <label className="block text-xs font-bold text-[#6b4226] mb-2 tracking-wide">{label}</label>
                        <input type="text" name={name} placeholder={ph} required={label.includes("*")}
                          className="w-full px-4 py-3 bg-[#faf6f0] border border-[#ece4d8] rounded-lg text-[#2c1d10] text-sm placeholder-[#9c7d62] focus:outline-none focus:border-[#c4571a] focus:ring-2 focus:ring-[#c4571a]/12 transition-colors" />
                      </div>
                    ))}
                  </div>
                  {[["email", "Email *", "jane@email.com", "email"], ["phone", "Phone", "(720) 555-0100", "tel"]].map(([name, label, ph, type]) => (
                    <div key={name}>
                      <label className="block text-xs font-bold text-[#6b4226] mb-2 tracking-wide">{label}</label>
                      <input type={type} name={name} placeholder={ph} required={label.includes("*")}
                        className="w-full px-4 py-3 bg-[#faf6f0] border border-[#ece4d8] rounded-lg text-[#2c1d10] text-sm placeholder-[#9c7d62] focus:outline-none focus:border-[#c4571a] focus:ring-2 focus:ring-[#c4571a]/12 transition-colors" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-bold text-[#6b4226] mb-2 tracking-wide">Describe the Damage *</label>
                    <textarea name="description" rows={4} required placeholder="What piece needs repair? What's wrong with it?"
                      className="w-full px-4 py-3 bg-[#faf6f0] border border-[#ece4d8] rounded-lg text-[#2c1d10] text-sm placeholder-[#9c7d62] focus:outline-none focus:border-[#c4571a] focus:ring-2 focus:ring-[#c4571a]/12 transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6b4226] mb-2 tracking-wide">Upload a Photo</label>
                    <label className="block border-2 border-dashed border-[#ece4d8] rounded-lg p-5 text-center cursor-pointer hover:border-[#c4571a] transition-colors relative">
                      <input type="file" name="image" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        onChange={e => setFileName(e.target.files[0]?.name || null)} />
                      <div className="text-2xl mb-1">📸</div>
                      <div className="text-sm text-[#9c7d62]">
                        {fileName ? <span className="text-[#c4571a] font-semibold">{fileName}</span> : <>Drag & drop or <span className="text-[#c4571a] font-semibold">browse files</span></>}
                      </div>
                    </label>
                  </div>
                  <button type="submit" className="w-full py-4 bg-[#c4571a] text-white font-bold rounded-full hover:bg-[#d96b2a] transition-all shadow-lg shadow-[#c4571a]/25 text-base mt-1">
                    Send My Quote Request →
                  </button>
                  <p className="text-[#9c7d62] text-xs text-center">🔒 Your info is never shared or sold.</p>
                </form>
              </div>
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
    <footer className="bg-[#3d2b1a] py-9 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-display text-[#faf6f0] text-lg">Restore & Refinish Furniture Repair</div>
        <div className="text-[#faf6f0]/40 text-xs">© {new Date().getFullYear()} Restore & Refinish Furniture Repair LLC · Denver, CO</div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="antialiased">
      <Navbar />
      <Hero />
      <Services />
      <Process />
      <Portfolio />
      <Reviews />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
