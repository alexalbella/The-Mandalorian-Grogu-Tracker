import SeriesManager from '@/components/SeriesManager';

export const metadata = {
  title: 'Star Wars Trackers',
  description: 'Guías cronológicas definitivas para prepararte antes de los estrenos.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-surface-1">
      <SeriesManager />
    </main>
  );
}
