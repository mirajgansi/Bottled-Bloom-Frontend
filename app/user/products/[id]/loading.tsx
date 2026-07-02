export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        
        <div className="space-y-4">
          <div className="h-96 w-full rounded-2xl bg-gray-200" />
          <div className="flex gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 w-20 rounded-xl bg-gray-200" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-6 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />

          <div className="mt-6 h-12 w-40 rounded-xl bg-gray-300" />
        </div>
      </div>

      {/* Recently viewed skeleton */}
      <div className="mt-10 space-y-4">
        <div className="h-6 w-40 rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
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
