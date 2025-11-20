export const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      {/* Un spinner simple con CSS de Tailwind */}
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
      <p className="text-gray-400 text-sm animate-pulse">Cargando...</p>
    </div>
  );
};