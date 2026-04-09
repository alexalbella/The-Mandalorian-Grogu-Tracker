'use client';

import { Era, MediaItem } from '@/data/starwars-list';
import { useProgressStore } from '@/store/progress';
import MediaItemCard from './MediaItemCard';

interface FlatItem {
  item: MediaItem;
  eraLabel: string;
}

interface GalacticGroup {
  label: string;
  yearRange: string;
  items: FlatItem[];
}

const GALACTIC_GROUPS: { label: string; yearRange: string; from: number; to: number }[] = [
  { label: 'Era de la Alta República',  yearRange: 'antes de las Guerras Clon',    from: -Infinity, to: -23 },
  { label: 'Las Guerras Clon',          yearRange: '22 – 19 a.BY',                 from: -23,       to: -18 },
  { label: 'Era Imperial',              yearRange: '19 – 5 a.BY',                  from: -18,       to: -4  },
  { label: 'La Rebelión',               yearRange: '5 a.BY – 4 d.BY',              from: -4,        to: 5   },
  { label: 'Nueva República',           yearRange: '5 d.BY en adelante',           from: 5,         to: Infinity },
];

function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} a.BY`;
  if (year === 0) return 'Batalla de Yavin';
  return `${year} d.BY`;
}

export default function ChronologicalView({ eras }: { eras: Era[] }) {
  const { isCompleted, toggleItem, markMultiple, unmarkMultiple } = useProgressStore();

  // Flatten all items from all eras, keeping era label for display
  const flatItems: FlatItem[] = eras.flatMap((era) =>
    era.items.map((item) => ({ item, eraLabel: era.eraLabel }))
  );

  // Sort by inUniverseYear (items without year go to the end)
  flatItems.sort((a, b) => {
    const ya = a.item.inUniverseYear ?? Infinity;
    const yb = b.item.inUniverseYear ?? Infinity;
    return ya - yb;
  });

  // Group into galactic eras
  const groups: GalacticGroup[] = GALACTIC_GROUPS.map((g) => ({
    label: g.label,
    yearRange: g.yearRange,
    items: flatItems.filter((fi) => {
      const y = fi.item.inUniverseYear ?? Infinity;
      return y >= g.from && y < g.to;
    }),
  })).filter((g) => g.items.length > 0);

  return (
    <section className="space-y-12">
      <div className="flex items-center gap-3 pb-2 border-b border-surface-4/40">
        <span className="text-[9px] uppercase tracking-widest text-text-muted font-mono">Archivo</span>
        <span className="text-[9px] uppercase tracking-widest text-glow-success font-mono">— Orden Cronológico In-Universe</span>
      </div>

      {groups.map((group) => {
        const groupCompleted = group.items.filter((fi) => {
          const sub = fi.item.subItems;
          return sub && sub.length > 0
            ? sub.every((s) => isCompleted(s.id))
            : isCompleted(fi.item.id);
        }).length;
        const groupTotal = group.items.length;
        const pct = groupTotal > 0 ? Math.round((groupCompleted / groupTotal) * 100) : 0;

        return (
          <div key={group.label} className="space-y-4">
            {/* Group header */}
            <div className="flex items-end justify-between gap-4 border-b border-surface-4/30 pb-3">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-text-muted font-mono mb-1">{group.yearRange}</p>
                <h3 className="font-display text-xl font-semibold text-text-heading leading-none">{group.label}</h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono text-text-muted">{groupCompleted}/{groupTotal}</span>
                <div className="w-16 h-px bg-surface-4/40 relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-glow-success transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-glow-success w-8 text-right">{pct}%</span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {group.items.map(({ item }) => (
                <div key={item.id} className="flex gap-3 items-start">
                  {/* Year badge */}
                  <div className="shrink-0 mt-1 w-16 text-right">
                    {item.inUniverseYear !== undefined ? (
                      <span className="text-[9px] font-mono text-text-muted leading-none whitespace-nowrap">
                        {formatYear(item.inUniverseYear)}
                      </span>
                    ) : null}
                  </div>
                  {/* Connector line */}
                  <div className="shrink-0 flex flex-col items-center mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-surface-4 ring-1 ring-glow-success/30" />
                    <div className="w-px flex-1 bg-surface-4/30 min-h-4" />
                  </div>
                  {/* Card */}
                  <div className="flex-1 min-w-0 pb-2">
                    <MediaItemCard
                      item={item}
                      isCompleted={isCompleted}
                      toggleItem={toggleItem}
                      markMultiple={markMultiple}
                      unmarkMultiple={unmarkMultiple}
                      disableLayoutId
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
