export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl p-6 space-y-4 animate-pulse">
      {/* Search card */}
      <div className="rounded-2xl border bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="mt-2 h-3 w-16 rounded bg-gray-200" />
          </div>
          <div className="h-10 w-full sm:w-80 rounded-lg bg-gray-200" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="grid grid-cols-12 gap-2 border-b bg-gray-50 px-4 py-3">
          <div className="col-span-5 h-3 rounded bg-gray-200" />
          <div className="col-span-3 h-3 rounded bg-gray-200" />
          <div className="col-span-2 h-3 rounded bg-gray-200" />
          <div className="col-span-2 h-3 rounded bg-gray-200" />
        </div>

        <div className="divide-y">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 px-4 py-4">
              <div className="col-span-5 space-y-2">
                <div className="h-4 w-40 rounded bg-gray-200" />
                <div className="h-3 w-28 rounded bg-gray-200" />
              </div>
              <div className="col-span-3 h-4 rounded bg-gray-200" />
              <div className="col-span-2 h-4 rounded bg-gray-200" />
              <div className="col-span-2 h-7 w-20 rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
