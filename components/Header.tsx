import { Flame } from 'lucide-react';

export default function Header({ streak }: { streak: number }) {
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
          <Flame className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-100" style={{ fontFamily: 'var(--font-display)' }}>Mando Tracker</h1>
          <p className="text-sm text-zinc-500">Tu camino, tu ritmo</p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
        <Flame className="w-4 h-4 text-orange-500" />
        <span className="text-sm font-mono text-zinc-300">{streak} día streak</span>
      </div>
    </header>
  );
}
