import Link from 'next/link';

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-md mx-auto">
        <Link href="/" className="text-sm text-white/50">← Toolkit</Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Neverstill Customer Portal</h1>
        <p className="mt-2 text-white/60 text-sm">Manage your toolkit access, downloads, and subscriptions in one place.</p>

        <div className="mt-8 rounded-2xl border border-white/10 p-6 bg-zinc-900">
          <p className="text-sm">This is a placeholder. In the real implementation:</p>
          <ul className="mt-3 text-sm list-disc pl-5 space-y-1 text-white/70">
            <li>Link to Stripe Customer Portal (manage cards, invoices, cancellations)</li>
            <li>Download links for purchased packs / Pro unlocks</li>
            <li>License keys for hosted tools (PaperAirplane, FarmForge, etc.)</li>
            <li>Access to private content / updates</li>
          </ul>

          <a 
            href="https://billing.stripe.com/p/login/placeholder" 
            target="_blank"
            className="mt-6 block text-center rounded bg-white/90 py-2 text-sm font-medium text-black"
          >
            Open Stripe Customer Portal (example)
          </a>
        </div>

        <p className="mt-6 text-xs text-white/40 text-center">
          Questions? Email from your purchase receipt or via the Gumroad store.
        </p>
      </div>
    </div>
  );
}
