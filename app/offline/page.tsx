export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="text-4xl mb-4">🌱</div>
        <h1 className="text-2xl font-semibold tracking-tight">You&apos;re offline</h1>
        <p className="mt-3 text-sm text-white/70">
          Pages you opened before should still work. Reconnect to browse new toolkit pages or complete
          checkout.
        </p>
        <div className="mt-6 flex flex-col gap-2 text-sm">
          {/* Full document navigation so precached shell pages work offline (not RSC via Link). */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="rounded bg-white text-black py-2 font-medium hover:bg-white/90">
            Toolkit home
          </a>
          <a
            href="/tools/paperairplane/pwa"
            className="rounded border border-white/30 py-2 hover:bg-white/5"
          >
            PaperAirplane mazes
          </a>
        </div>
      </div>
    </div>
  );
}
