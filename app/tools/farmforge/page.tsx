import Link from 'next/link';

export default function FarmForgePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/" className="text-sm text-white/50 hover:text-white">← Toolkit</Link>
        <div className="mt-6 text-5xl">🌾</div>
        <h1 className="mt-2 text-5xl font-semibold tracking-tighter">FarmForge</h1>
        <p className="text-white/60">P&amp;L, cash-flow &amp; COGS forecasting for farms + restaurants</p>

        <div className="mt-8 prose prose-invert max-w-none text-white/80">
          <p>Single-file (or hosted) forecasting tool used daily at Sea Breeze Farm and Coq au Vin. Multi-channel ranch economics (ducks, eggs, pork, wholesale/retail) + full restaurant P&amp;L. Cash flow ledger with recurring rules, investor-ready PDF exports, poultry-specific COGS engine.</p>
          <p className="text-sm">Currently the canonical artifact is a polished self-contained HTML app (open anywhere). Pro version will add cloud scenarios, team sharing, and direct integration with accounting layers.</p>
        </div>

        <div className="mt-8">
          <a href="https://github.com/flehmenlips/farmforge-pnl" target="_blank" className="rounded bg-white/90 text-black px-4 py-2 text-sm font-medium">Open the current FarmForge PNL (GitHub / single file)</a>
        </div>

        <p className="mt-10 text-xs text-white/40">Will be available with Pro access in the shared Neverstill portal (Stripe). Cross-sells beautifully with PaperAirplane for farm families and with recipe tools for on-farm restaurants.</p>
      </div>
    </div>
  );
}
