import Link from 'next/link';

export default function ChefScalePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/" className="text-sm text-white/50 hover:text-white">← Toolkit</Link>
        <div className="mt-6 text-5xl">👨‍🍳</div>
        <h1 className="mt-2 text-5xl font-semibold tracking-tighter">ChefScale</h1>
        <p className="text-white/60">Recipe scaling, AI suggestions &amp; photo library for professional chefs</p>

        <div className="mt-8 prose prose-invert max-w-none text-white/80">
          <p>Mobile-first prototype for scaling recipes by multiplier or target quantity. Built from real workflows at Coq au Vin. AI assist and photo library planned for Pro.</p>
          <p className="text-sm">Current artifact is a mobile prototype (available separately). This page will link to the hosted PWA version as part of ongoing PA-005 / toolkit work.</p>
        </div>

        <p className="mt-10 text-xs text-white/40">Will be available with Pro access. Cross-sells with PaperAirplane for farm families and FarmForge for on-farm ops.</p>
      </div>
    </div>
  );
}
