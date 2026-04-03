'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-surface-1 flex items-center justify-center p-6">
      <div className="text-center max-w-md space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-100">
          Error en la aplicación
        </h2>
        <p className="text-zinc-400">
          Algo no ha funcionado como se esperaba. Puedes reintentar o recargar la página.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
