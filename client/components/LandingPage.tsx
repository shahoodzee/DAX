import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  Crosshair,
  Gamepad2,
  Gem,
  Github,
  Instagram,
  Linkedin,
  Menu,
  ShieldCheck,
  Sparkles,
  Star,
  Swords,
  Trophy,
  Twitter,
  UserRoundCheck,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const games = [
  { name: "VALORANT", label: "V", tone: "from-red-500/30 to-rose-700/10", icon: Crosshair },
  { name: "CS:GO", label: "CS", tone: "from-amber-400/30 to-orange-700/10", icon: Swords },
  { name: "STEAM", label: "S", tone: "from-sky-400/30 to-blue-700/10", icon: Gamepad2 },
  { name: "LEAGUE", label: "L", tone: "from-purple-500/30 to-indigo-700/10", icon: Trophy },
  { name: "OVERWATCH", label: "OW", tone: "from-orange-400/30 to-red-700/10", icon: Zap },
];

const listings = [
  { game: "VALORANT", name: "Immortal // Radiant Ready", rank: "IMMORTAL 3", skins: "47 premium skins", price: "$289", color: "from-red-500 to-rose-800", icon: Crosshair },
  { game: "CS:GO", name: "Prime // Knife Collection", rank: "GLOBAL ELITE", skins: "31 rare items", price: "$425", color: "from-amber-400 to-orange-700", icon: Swords },
  { game: "LEAGUE", name: "Challenger // 180 Champions", rank: "CHALLENGER", skins: "103 legacy skins", price: "$342", color: "from-violet-500 to-indigo-800", icon: Trophy },
];

const testimonials = [
  { quote: "Sold my old main in less than a day. The verification flow was clear, fast, and I was paid immediately.", name: "Khalid M.", role: "Verified seller", initials: "KM" },
  { quote: "Found the exact Valorant account I was after. Everything was securely transferred and exactly as described.", name: "Natalie R.", role: "Verified buyer", initials: "NR" },
  { quote: "DAX feels like the first marketplace built for people who actually care about their accounts.", name: "Santiago V.", role: "Power trader", initials: "SV" },
];

const steps: Array<{ number: string; title: string; copy: string; icon: LucideIcon }> = [
  { number: "01", title: "List your account", copy: "Set your price, showcase rare items, and reach ready buyers.", icon: UserRoundCheck },
  { number: "02", title: "We verify it", copy: "Our specialists confirm ownership and listing details.", icon: ShieldCheck },
  { number: "03", title: "Trade with confidence", copy: "Funds stay protected until both sides are ready.", icon: Gem },
];

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="mb-4 text-xs font-bold tracking-[0.26em] text-cyan-300">// {eyebrow}</p>
      <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
      {description && <p className="mt-5 text-base leading-7 text-slate-400">{description}</p>}
    </div>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="dax-site min-h-screen overflow-x-hidden bg-[#0f172a] text-white">
      <div className="dax-grid fixed inset-0 pointer-events-none opacity-50" />
      <div className="pointer-events-none fixed left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[150px]" />

      <header className="relative z-20 border-b border-cyan-300/10 bg-[#0f172a]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link to="/" className="group text-2xl font-black tracking-[-0.12em] text-cyan-300">
            DAX<span className="text-white transition-colors group-hover:text-cyan-200">.</span>
          </Link>
          <nav className="hidden items-center gap-9 text-sm font-medium text-slate-300 md:flex">
            <a className="transition hover:text-cyan-300" href="#marketplace">Marketplace</a>
            <a className="transition hover:text-cyan-300" href="#community">Community</a>
            <a className="transition hover:text-cyan-300" href="#pricing">Pricing</a>
          </nav>
          <div className="hidden items-center gap-5 md:flex">
            <Link to="/login" className="text-sm font-semibold text-slate-300 transition hover:text-white">Log in</Link>
            <Link to="/sign-up" className="dax-cta rounded-md px-5 py-2.5 text-sm font-bold text-white">Get Started <ArrowRight className="ml-1 inline h-4 w-4" /></Link>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-md border border-cyan-300/20 p-2 text-cyan-200 md:hidden" aria-label="Toggle navigation">
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
        {menuOpen && <div className="border-t border-cyan-300/10 bg-[#101a30] px-5 py-5 md:hidden"><div className="flex flex-col gap-4 text-sm font-semibold text-slate-200"><a href="#marketplace">Marketplace</a><a href="#community">Community</a><a href="#pricing">Pricing</a><Link to="/sign-up" className="dax-cta mt-1 rounded-md px-4 py-3 text-center">Get Started</Link></div></div>}
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-20 sm:pt-28 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-32">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-3 py-1.5 text-xs font-semibold text-cyan-200"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" /> THE PREMIUM ACCOUNT MARKETPLACE</div>
            <h1 className="text-5xl font-black leading-[0.97] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">Buy &amp; sell gaming accounts, <span className="dax-gradient-text">securely.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">Discover verified accounts, rare skins, and competitive-ready profiles from a community that takes trust seriously.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/marketplace" className="dax-cta rounded-md px-6 py-3.5 text-center text-sm font-bold text-white shadow-[0_0_30px_rgba(230,57,70,.23)]">Explore marketplace <ArrowRight className="ml-1 inline h-4 w-4" /></Link>
              <a href="#how-it-works" className="rounded-md border border-cyan-300/30 bg-cyan-300/5 px-6 py-3.5 text-center text-sm font-bold text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-300/10">How it works</a>
            </div>
            <div className="mt-11 flex items-center gap-6 text-xs text-slate-400"><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cyan-300" />Escrow protected</span><span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-cyan-300" />Verified sellers</span></div>
          </div>

          <div className="relative mx-auto w-full max-w-[530px] py-8">
            <div className="absolute inset-10 rounded-full bg-cyan-400/20 blur-[90px]" />
            <div className="dax-dashboard relative rotate-[-4deg] overflow-hidden rounded-xl border border-cyan-200/30 bg-[#15213a]/85 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><div className="flex gap-1.5"><i className="h-2 w-2 rounded-full bg-red-400" /><i className="h-2 w-2 rounded-full bg-yellow-300" /><i className="h-2 w-2 rounded-full bg-cyan-300" /></div><span className="text-[10px] font-bold tracking-[.2em] text-cyan-200">DAX MARKETPLACE</span><span className="h-3 w-3" /></div>
              <div className="grid grid-cols-[92px_1fr] gap-4 p-5 sm:grid-cols-[110px_1fr]"><div className="space-y-3 border-r border-white/10 pr-3"><div className="h-4 w-12 rounded bg-cyan-300/70" /><div className="h-3 w-full rounded bg-white/10" /><div className="h-3 w-4/5 rounded bg-white/10" /><div className="h-3 w-full rounded bg-white/10" /><div className="h-3 w-3/5 rounded bg-white/10" /></div><div><div className="mb-3 flex justify-between"><div><p className="text-[10px] text-slate-400">FEATURED LISTINGS</p><p className="text-lg font-black">Top Accounts</p></div><div className="rounded bg-cyan-300/10 px-2 py-1 text-[10px] text-cyan-200">LIVE</div></div><div className="space-y-2">{["Radiant // 54 Skins", "Global Elite // Prime", "Challenger // Legacy"].map((item, i) => <div key={item} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[.035] px-3 py-2.5"><div className="flex items-center gap-2"><span className={`h-6 w-6 rounded ${i === 0 ? "bg-red-500/80" : i === 1 ? "bg-amber-400/80" : "bg-violet-500/80"}`} /><span className="text-[10px] font-semibold">{item}</span></div><span className="text-[10px] font-black text-amber-300">${[289, 425, 342][i]}</span></div>)}</div></div></div>
            </div>
            <div className="dax-float absolute -bottom-2 -left-5 rounded-lg border border-cyan-300/30 bg-[#17243d]/90 px-4 py-3 shadow-xl backdrop-blur-xl"><p className="text-[10px] font-bold tracking-widest text-slate-400">SAFE TRADES</p><p className="text-xl font-black text-cyan-200">99.9% <span className="text-xs font-medium text-slate-300">secured</span></p></div>
            <div className="dax-float-delayed absolute -right-2 top-5 rounded-lg border border-white/15 bg-[#17243d]/90 px-4 py-3 shadow-xl backdrop-blur-xl"><p className="text-[10px] font-bold tracking-widest text-slate-400">NEW LISTING</p><p className="mt-1 flex items-center gap-1 text-sm font-bold"><Gem className="h-3.5 w-3.5 text-amber-300" /> 47 premium skins</p></div>
          </div>
        </section>

        <section id="marketplace" className="border-y border-cyan-300/10 bg-[#111c31]/70 py-20"><div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionHeading eyebrow="SUPPORTED GAMES" title="Your next main is waiting." description="Trade across the games that define competitive culture." /><div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-5">{games.map(({ name, label, tone, icon: Icon }) => <div key={name} className="dax-game-card group relative min-h-40 overflow-hidden rounded-lg border border-cyan-300/20 bg-[#1f2937]/70 p-5 backdrop-blur"><div className={`absolute inset-0 bg-gradient-to-br ${tone} opacity-70`} /><Icon className="relative h-7 w-7 text-cyan-100" /><div className="relative mt-9"><p className="text-2xl font-black tracking-tight">{label}</p><p className="mt-1 text-xs font-bold tracking-[.12em] text-slate-300">{name}</p></div></div>)}</div></div></section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><SectionHeading eyebrow="HOW IT WORKS" title="A safer way to trade." description="A streamlined process designed to keep every transaction transparent and protected." /><div className="relative mt-16 grid gap-8 md:grid-cols-3"><div className="dax-flow-line hidden md:block" />{steps.map(({ number, title, copy, icon: Icon }) => <div key={number} className="relative z-10 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 shadow-[0_0_25px_rgba(0,255,255,.11)]"><Icon size={27} /></div><p className="mt-5 text-xs font-bold tracking-[.2em] text-cyan-300">{number}</p><h3 className="mt-2 text-xl font-bold">{title}</h3><p className="mx-auto mt-3 max-w-xs leading-7 text-slate-400">{copy}</p></div>)}</div></section>

        <section className="border-y border-cyan-300/10 bg-[#111c31]/70 py-24"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"><div><p className="text-xs font-bold tracking-[.26em] text-cyan-300">// FEATURED LISTINGS</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Most wanted accounts.</h2></div><Link to="/marketplace" className="group text-sm font-bold text-cyan-200">View all listings <ChevronRight className="inline h-4 w-4 transition group-hover:translate-x-1" /></Link></div><div className="mt-11 grid gap-6 lg:grid-cols-3">{listings.map(({ game, name, rank, skins, price, color, icon: Icon }, index) => <article key={game} className="dax-listing group overflow-hidden rounded-xl border border-cyan-300/20 bg-[#1f2937]/80"><div className={`relative flex h-36 items-start justify-between overflow-hidden bg-gradient-to-br ${color} p-5`}><div className="absolute -bottom-12 -right-5 text-white/15"><Icon size={140} /></div><span className="relative rounded border border-white/25 bg-black/20 px-2 py-1 text-[10px] font-bold tracking-wider">{game}</span><span className="relative rounded bg-black/25 px-2 py-1 text-[10px] font-bold text-amber-200">VERIFIED</span></div><div className="p-5"><p className="text-xs font-bold text-cyan-200">{rank}</p><h3 className="mt-2 text-lg font-bold">{name}</h3><p className="mt-2 text-sm text-slate-400">{skins}</p><div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"><span className="text-2xl font-black text-amber-300">{price}</span><Link to="/marketplace" className="rounded-md border border-cyan-300/30 px-3 py-2 text-xs font-bold text-cyan-100 transition hover:bg-cyan-300 hover:text-slate-950">View account</Link></div></div></article>)}</div></div></section>

        <section id="community" className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><SectionHeading eyebrow="TRUST & SECURITY" title="Built for better trades." /><div className="mt-14 grid gap-5 md:grid-cols-3">{[["10K+", "Verified accounts", "Every listing is reviewed before it reaches the marketplace."], ["50K+", "Successful trades", "A growing community of serious buyers and sellers."], ["99.9%", "Secure transactions", "Protected payments, clear ownership, zero guesswork."]].map(([stat, label, copy]) => <div key={label} className="rounded-xl border border-cyan-300/25 bg-[#1f2937]/60 p-7 text-center backdrop-blur"><p className="dax-gradient-text text-4xl font-black">{stat}</p><h3 className="mt-3 font-bold">{label}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p></div>)}</div></section>

        <section className="border-y border-cyan-300/10 bg-[#111c31]/70 py-24"><div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionHeading eyebrow="COMMUNITY VOICES" title="Trusted by players." /><div className="mt-12 grid gap-5 lg:grid-cols-3">{testimonials.map(({ quote, name, role, initials }) => <figure key={name} className="rounded-xl border border-white/10 bg-[#1f2937]/70 p-6"><div className="flex gap-1 text-amber-300">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div><blockquote className="mt-5 leading-7 text-slate-300">“{quote}”</blockquote><figcaption className="mt-6 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-300/15 text-xs font-bold text-cyan-200">{initials}</span><span><b className="block text-sm">{name}</b><span className="text-xs text-slate-400">{role}</span></span></figcaption></figure>)}</div></div></section>

        <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="relative overflow-hidden rounded-2xl bg-gradient-to-[135deg] from-[#e63946] via-[#d94e43] to-[#ffd700] px-7 py-16 text-center shadow-[0_0_80px_rgba(230,57,70,.24)] sm:px-16"><div className="absolute inset-0 opacity-20 dax-grid" /><Sparkles className="absolute left-8 top-7 h-8 w-8 text-white/50" /><Zap className="absolute bottom-7 right-9 h-8 w-8 text-white/50" /><div className="relative"><p className="text-xs font-black tracking-[.26em] text-white/70">YOUR NEXT ACCOUNT IS HERE</p><h2 className="mx-auto mt-4 max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl">Start trading today.</h2><p className="mx-auto mt-4 max-w-lg text-white/85">Join the marketplace where every account is more than a transaction.</p><Link to="/sign-up" className="mt-8 inline-block rounded-md bg-[#0f172a] px-6 py-3.5 text-sm font-bold text-white shadow-xl transition hover:scale-[1.03]">Create your free account <ArrowRight className="ml-1 inline h-4 w-4" /></Link></div></div></section>
      </main>

      <footer className="relative z-10 border-t border-cyan-300/10 bg-[#0b1220] py-12"><div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:flex-row sm:items-end sm:justify-between lg:px-8"><div><Link to="/" className="text-2xl font-black tracking-[-0.12em] text-cyan-300">DAX.</Link><p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">The premium marketplace for gaming accounts, built around trust.</p></div><div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400"><a href="#marketplace" className="hover:text-cyan-200">Marketplace</a><a href="#how-it-works" className="hover:text-cyan-200">How it works</a><Link to="/community" className="hover:text-cyan-200">Community</Link><a href="#pricing" className="hover:text-cyan-200">Pricing</a></div><div className="flex gap-3 text-slate-400"><Twitter className="h-4 w-4 hover:text-cyan-200" /><Instagram className="h-4 w-4 hover:text-cyan-200" /><Github className="h-4 w-4 hover:text-cyan-200" /><Linkedin className="h-4 w-4 hover:text-cyan-200" /></div></div><p className="mx-auto mt-10 max-w-7xl px-5 text-xs text-slate-600 lg:px-8">© 2025 DAX Marketplace. All rights reserved.</p></footer>
    </div>
  );
}
