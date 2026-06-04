import Link from 'next/link';

export default function PaperAirplanePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link href="/" className="text-sm text-white/50 hover:text-white">← Back to Toolkit</Link>

        <div className="mt-6 flex items-center gap-4">
          <span className="text-5xl">✈️</span>
          <div>
            <h1 className="text-5xl font-semibold tracking-tighter">PaperAirplane</h1>
            <p className="text-white/60 mt-1">Personalized printable worksheets for kids 1–8+</p>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6 text-lg text-white/80">
            <p>
              Beautiful, developmentally-aware PDFs: handwriting with support lines, themed mazes, age-appropriate arithmetic with visuals, and more. 
              Primary experience is a pure standalone PWA (installable from browser, fully offline after load). Python version remains for pack creators and power users.
            </p>

            <div>
              <h3 className="font-medium text-white mb-2">Core (free)</h3>
              <ul className="list-disc pl-5 space-y-1 text-base">
                <li>PWA (installable, works offline) + local Python CLI for creators</li>
                <li>Writing/phonics, mazes, arithmetic generators (PWA spike in progress)</li>
                <li>Child name, date, age-appropriate line weights &amp; complexity</li>
                <li>Themes + custom word lists (Pro coming)</li>
                <li>Batch / YAML pack generation for themed weeks (Python power tool)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-white mb-2">Pro &amp; Packs (paid)</h3>
              <p className="text-base">Curated, print-ready themed bundles (Farm Week, Dino Adventures, Ocean, Feelings, seasonal, etc.). Lifetime generator updates. Hosted web version (no install). Priority new generators.</p>
              <a 
                href="https://gumroad.com/neverstill" 
                target="_blank"
                className="mt-3 inline-block rounded bg-white px-5 py-2 text-sm font-medium text-black hover:bg-white/90"
              >
                Buy packs &amp; Pro access on Gumroad →
              </a>

              <form action="/api/checkout" method="POST" className="mt-2">
                <input type="hidden" name="product" value="paperairplane-pro" />
                <button 
                  type="submit"
                  className="text-xs underline text-white/60 hover:text-white"
                >
                  Or buy PaperAirplane Pro directly via Stripe (hosted checkout)
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-4 text-sm border border-white/10 rounded-2xl p-5 bg-zinc-900/50 h-fit">
            <div>
              <div className="uppercase text-[10px] tracking-widest text-white/50">Status</div>
              <div className="font-medium">PWA spike active (PA-005) • Digital packs shipping • Python for creators</div>
            </div>
            <div>
              <div className="uppercase text-[10px] tracking-widest text-white/50">Try it now</div>
              <a href="/tools/paperairplane/pwa" className="block mt-1 underline">Try the hosted PWA demo (no install, works offline)</a>
              <a href="https://github.com/flehmenlips/PaperAirplane" target="_blank" className="block mt-1 underline">GitHub (Python local + packs for creators)</a>
              <p className="text-white/50 text-xs mt-1">PWA is the primary user experience; Python for batch/packs.</p>
            </div>
            <div>
              <div className="uppercase text-[10px] tracking-widest text-white/50">Hosted PWA (Pro)</div>
              <p className="text-white/60">Full featured PWA (unlimited, more themes/generators). Pro unlocks via Stripe below. See parallel PA-005 spike in PaperAirplane repo for generator port details.</p>
            </div>
            <div className="pt-3 border-t border-white/10 text-xs text-white/50">
              Part of the Neverstill Operator Toolkit. One account, shared portal, cross-promotion to FarmForge forecasting, chef tools, etc.
            </div>
          </div>
        </div>

        <div className="mt-12 text-xs text-white/40 border-t border-white/10 pt-6">
          Built with the same care we put into running Sea Breeze Farm and Coq au Vin. Real kids, real farms, real kitchens — not theory.
        </div>
      </div>
    </div>
  );
}
