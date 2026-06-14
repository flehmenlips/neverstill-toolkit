import { Suspense } from 'react';
import PaperAirplanePwaClient from './pwa-client';

function PwaLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <p className="text-sm text-white/60">Loading PaperAirplane PWA…</p>
    </div>
  );
}

export default function PaperAirplanePwaPage() {
  return (
    <Suspense fallback={<PwaLoading />}>
      <PaperAirplanePwaClient />
    </Suspense>
  );
}
