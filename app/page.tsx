import Link from 'next/link';

const tools = [
  {
    slug: 'paperairplane',
    name: 'PaperAirplane',
    tagline: 'Personalized printable worksheets & educational packs for kids 1–8+',
    description: 'Beautiful, developmentally-aware PDFs for handwriting, mazes, arithmetic and more. PWA (installable + offline) + Python for creators & packs. PA-005 spike active.',
    status: 'PWA demo live • Packs shipping',
    price: 'Free core • Packs $12–29 on Gumroad',
    cta: 'Try local generator or buy packs',
    href: '/tools/paperairplane',
    icon: '✈️',
    category: 'Families & Homeschool',
  },
  {
    slug: 'farmforge',
    name: 'FarmForge',
    tagline: 'Multi-channel P&L, cash flow & COGS forecasting for farms + restaurants',
    description: 'Scenario planning for ranch (ducks, eggs, pork) + restaurant (Coq au Vin). Cash flow ledger, recurring rules, investor PDFs. Real models from operating businesses.',
    status: 'Live (single-file HTML)',
    price: 'Free core • Pro exports & cloud sync coming',
    cta: 'Open the forecaster',
    href: '/tools/farmforge',
    icon: '🌾',
    category: 'Farms & Restaurants',
  },
  {
    slug: 'prep-kanban',
    name: 'PrepBoard',
    tagline: 'Lightweight kitchen prep & production kanban for restaurants',
    description: 'Simple, beautiful, draggable boards for FOH/BOH, butchery, daily prep. Self-contained HTML — works offline.',
    status: 'Prototype (single-file)',
    price: 'Free • Hosted multi-user version planned',
    cta: 'View the kanban',
    href: '/tools/prep-kanban',
    icon: '📋',
    category: 'Restaurant Ops',
  },
  {
    slug: 'recipe-scaler',
    name: 'ChefScale',
    tagline: 'Recipe scaling, AI suggestions & photo library for professional chefs',
    description: 'Scale by multiplier or target ingredient quantity. AI recipe generation. Photo management. Built from real chef workflows.',
    status: 'Early (mobile prototype available)',
    price: 'Free core • Pro web version & packs planned',
    cta: 'Explore recipe tools',
    href: '/tools/recipe-scaler',
    icon: '👨‍🍳',
    category: 'Chefs & Kitchens',
  },
];

export default function NeverstillToolkit() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            <div>
              <div className="font-semibold tracking-tight">Neverstill</div>
              <div className="text-[10px] text-white/50 -mt-1">OPERATOR TOOLKIT</div>
            </div>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="#tools" className="hover:text-white/70 transition">Tools</Link>
            <Link href="#stories" className="hover:text-white/70 transition">From the Farm</Link>
            <a href="https://gumroad.com/neverstill" target="_blank" className="hover:text-white/70 transition">Shop Packs</a>
            <Link href="/account" className="rounded-full border border-white/20 px-4 py-1.5 text-xs hover:bg-white/5">Account / Portal</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs tracking-[2px] mb-6">BUILT BY FARMERS & CHEFS • FOR FARMERS, CHEFS & FAMILIES</div>
          <h1 className="text-6xl font-semibold tracking-tighter leading-none mb-4">
            Practical tools.<br />No spreadsheets.
          </h1>
          <p className="max-w-md mx-auto text-xl text-white/70">
            A small collection of focused, high-signal tools extracted from years of running real small food businesses. Start with one. Grow into the toolkit.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a href="#tools" className="rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90">Browse the tools</a>
            <a href="https://gumroad.com/neverstill" target="_blank" className="rounded-full border border-white/30 px-6 py-3 text-sm hover:bg-white/5">Get started with PaperAirplane packs</a>
          </div>
          <form action="/api/checkout" method="POST" className="mt-3">
            <input type="hidden" name="product" value="toolkit-pass" />
            <button type="submit" className="text-xs text-white/60 hover:text-white underline">Or buy the full Operator Toolkit Pass via Stripe →</button>
          </form>
          <p className="mt-4 text-xs text-white/40">PaperAirplane is live today as our first public tool.</p>
        </section>

        {/* Tools grid */}
        <section id="tools" className="border-t border-white/10 bg-zinc-900/50 py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <div className="uppercase text-xs tracking-[3px] text-white/50">The Toolkit</div>
                <h2 className="text-3xl font-semibold tracking-tight">Micro-products that actually get used</h2>
              </div>
              <div className="text-sm text-white/50 hidden sm:block">One purchase • shared portal • cross-tool value</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tools.map((tool) => (
                <Link key={tool.slug} href={tool.href} className="group block rounded-2xl border border-white/10 bg-zinc-950 p-5 hover:border-white/30 transition flex flex-col">
                  <div className="text-3xl mb-3">{tool.icon}</div>
                  <div className="font-semibold text-lg tracking-tight group-hover:underline">{tool.name}</div>
                  <div className="text-white/70 text-sm mt-1 leading-snug">{tool.tagline}</div>
                  <div className="mt-auto pt-6 text-xs text-white/50 flex items-center justify-between">
                    <span>{tool.status}</span>
                    <span className="text-emerald-400/80 group-hover:text-emerald-400">{tool.price.split('•')[0].trim()}</span>
                  </div>
                  <div className="mt-3 text-[10px] uppercase tracking-widest text-white/40">{tool.category}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* PaperAirplane highlight (first tool) */}
        <section className="mx-auto max-w-5xl px-6 py-16 border-t border-white/10">
          <div className="grid md:grid-cols-5 gap-x-12 gap-y-8 items-start">
            <div className="md:col-span-2">
              <div className="text-xs tracking-[2px] text-white/50 mb-1">FIRST PUBLIC RELEASE</div>
              <h3 className="text-4xl font-semibold tracking-tighter">PaperAirplane</h3>
              <p className="mt-3 text-white/70">Generate beautiful, personalized educational printables locally or buy ready-to-print themed packs.</p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs">
                <span className="rounded bg-white/10 px-2 py-0.5">Writing / Phonics</span>
                <span className="rounded bg-white/10 px-2 py-0.5">Mazes</span>
                <span className="rounded bg-white/10 px-2 py-0.5">Arithmetic</span>
                <span className="rounded bg-white/10 px-2 py-0.5">Themed packs</span>
              </div>
            </div>
            <div className="md:col-span-3 text-sm text-white/80 space-y-4">
              <p>Primary experience is a pure standalone PWA (installable from any browser, works fully offline after first load). Python CLI remains for creators making sellable themed packs. Parallel PA-005 work happening in the PaperAirplane repo for generator ports.</p>
              <div>
                <Link href="/tools/paperairplane" className="inline-block rounded bg-white/90 text-black px-4 py-2 text-sm font-medium hover:bg-white">Open PaperAirplane hub page →</Link>
                <Link href="/tools/paperairplane/pwa" className="ml-3 inline-block rounded border border-white/30 px-4 py-2 text-sm hover:bg-white/5">Try PWA demo (hosted) →</Link>
              </div>
              <div className="pt-2 border-t border-white/10 text-xs text-white/50">
                Digital packs (Farm Week, Dino, Ocean, etc.) available now on Gumroad. Generator itself is free + open.
              </div>
            </div>
          </div>
        </section>

        {/* Content / stories teaser */}
        <section id="stories" className="border-t border-white/10 py-12 bg-black/40">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="text-xs tracking-[3px] text-white/50">FROM THE FARM & KITCHEN</div>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">Real operators, real lessons, better tools.</h3>
            <p className="mt-3 text-white/70 max-w-md mx-auto">Stories, templates, and ops notes from running Sea Breeze Farm, Coq au Vin, and Neverstill Ranch. These power the tools and will become a living content engine for the toolkit.</p>
            <div className="mt-6 text-sm">
              <a href="https://seabreeze.farm" target="_blank" className="underline">seabreeze.farm</a> · <a href="https://cookbook.farm" target="_blank" className="underline">cookbook.farm</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 text-xs text-white/40 text-center">
        Neverstill Operator Toolkit • Built by George Page at Sea Breeze Farm & Coq au Vin, Birkenfeld, Oregon. 
        <span className="mx-2">•</span> 
        <Link href="/account" className="hover:text-white/60">Customer portal</Link>
      </footer>
    </div>
  );
}
