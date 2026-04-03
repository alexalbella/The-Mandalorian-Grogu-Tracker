'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">Algo ha fallado</h1>
          <p className="text-zinc-400">
            Ha ocurrido un error inesperado. Puedes intentar recargar la aplicación.
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
