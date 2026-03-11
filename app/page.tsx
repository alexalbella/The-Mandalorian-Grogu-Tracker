import Dashboard from '@/components/Dashboard';
import { eras } from '@/data/starwars-list';

export const metadata = {
  title: 'The Mandalorian & Grogu Tracker',
  description: 'La guía cronológica definitiva para prepararte antes del estreno en cines.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#09090b]">
      <Dashboard eras={eras} />
    </main>
  );
}
