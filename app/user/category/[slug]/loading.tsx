export default function Loading() {
  return (
    <div className="w-full animate-pulse">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {/* Header skeleton */}
        <div className="mb-6">
          <div className="h-8 w-56 rounded bg-gray-200" />
          <div className="mt-3 h-4 w-96 max-w-full rounded bg-gray-200" />
        </div>

        {/* Products grid skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="rounded-2xl border bg-white p-3">
              <div className="h-36 w-full rounded-xl bg-gray-200" />
              <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
              <div className="mt-4 h-10 w-full rounded-xl bg-gray-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
