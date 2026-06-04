import Link from 'next/link';

export default function PrepKanbanPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-white/50">← Toolkit</Link>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">PrepBoard / Kitchen Kanban</h1>
        <p className="mt-2 text-white/60">Lightweight, beautiful, draggable prep &amp; production boards for restaurants.</p>

        <div className="mt-6 bg-zinc-900 border border-white/10 p-4 rounded">
          <p className="text-sm">Self-contained single HTML file (Tailwind + SortableJS). Works completely offline. Great for daily kitchen prep, butchery, FOH sidework.</p>
          <a href="https://github.com/flehmenlips/agile-chef-kan-ban" target="_blank" className="underline text-sm mt-3 inline-block">View source &amp; current version (agile-chef-kan-ban)</a>
        </div>

        <p className="mt-8 text-xs text-white/40">Future: Hosted multi-user version with templates, photos on cards, and integration into the Neverstill Operator Toolkit (shared billing with PaperAirplane &amp; FarmForge).</p>
      </div>
    </div>
  );
}
