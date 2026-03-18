import type { ReactNode } from 'react';
import { Clapperboard, Database, LayoutPanelTop, PanelsTopLeft, Radar, ScrollText } from 'lucide-react';
import { Era } from '@/data/starwars-list';
import HeaderHUD from './HeaderHUD';
import QuickLookDrawer from './QuickLookDrawer';
import { StatsPanel, DataManagementPanel } from './DataPanel';
import RouteAtlas from './RouteAtlas';
import Timeline from './Timeline';
import ProgressRail from './ProgressRail';
import ShellBoot from './ShellBoot';

type ShellSectionProps = {
  eyebrow: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
};

function ShellSection({ eyebrow, title, icon, children, className = '' }: ShellSectionProps) {
  return (
    <section className={`shell-panel rounded-[2rem] border border-surface-4/70 bg-surface-2/55 p-5 md:p-8 shadow-2xl shadow-black/30 backdrop-blur-xl ${className}`}>
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-surface-4/60 pb-4">
        <div className="space-y-2">
          <p className="text-[11px] font-mono uppercase tracking-[0.35em] text-glow-success/80">{eyebrow}</p>
          <h2 className="text-2xl font-bold tracking-tight text-text-heading md:text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
            {title}
          </h2>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-surface-4/80 bg-surface-1/70 text-glow-success shadow-inner shadow-black/40">
          {icon}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function AppShell({ eras }: { eras: Era[] }) {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.12),transparent_30%)]" />
      <ShellBoot />

      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 py-4 md:px-8 md:py-8 xl:flex-row">
        <div className="min-w-0 flex-1 space-y-8 md:space-y-10">
          <HeaderHUD eras={eras} />

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
            <div className="space-y-8">
              <ShellSection eyebrow="Mission Brief" title="Quick Look Drawer" icon={<LayoutPanelTop className="h-5 w-5" />}>
                <QuickLookDrawer eras={eras} />
              </ShellSection>

              <ShellSection eyebrow="Tactical Overview" title="Route Atlas" icon={<Radar className="h-5 w-5" />}>
                <RouteAtlas eras={eras} />
              </ShellSection>
            </div>

            <div className="space-y-8">
              <ShellSection eyebrow="Telemetry" title="Stats Snapshot" icon={<PanelsTopLeft className="h-5 w-5" />}>
                <StatsPanel eras={eras} />
              </ShellSection>

              <ShellSection eyebrow="Archive" title="Data Panel" icon={<Database className="h-5 w-5" />}>
                <DataManagementPanel />
              </ShellSection>
            </div>
          </div>

          <ShellSection eyebrow="Chronology" title="Timeline" icon={<ScrollText className="h-5 w-5" />} className="relative overflow-hidden">
            <Timeline eras={eras} />
          </ShellSection>

          <footer className="flex items-center justify-center gap-3 rounded-[2rem] border border-surface-4/60 bg-surface-2/40 px-6 py-6 text-center text-sm text-text-muted backdrop-blur-xl">
            <Clapperboard className="h-4 w-4 text-glow-success" />
            <p>Que la Fuerza te acompañe. Este briefing ya está listo para llevarte hasta el estreno.</p>
          </footer>
        </div>

        <ProgressRail eras={eras} />
      </div>
    </div>
  );
}
