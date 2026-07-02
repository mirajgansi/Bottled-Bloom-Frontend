export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 animate-pulse space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-8 w-20 bg-gray-300 rounded" />
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-8 w-20 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
