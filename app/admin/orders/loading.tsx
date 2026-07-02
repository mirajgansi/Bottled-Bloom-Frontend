export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-36 rounded bg-gray-200" />
        </div>

        {/* Stat cards */}
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
            >
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="mt-3 h-10 w-20 rounded bg-gray-200" />
              <div className="mt-3 h-1 w-24 rounded-full bg-gray-200" />
            </div>
          ))}
        </div>

        {/* Toolbar + Table */}
        <div className="mt-6 space-y-4">
          {/* Toolbar skeleton */}
          <div className="rounded-2xl border bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="h-10 w-full sm:w-80 rounded-lg bg-gray-200" />
              <div className="flex gap-2">
                <div className="h-10 w-28 rounded-lg bg-gray-200" />
                <div className="h-10 w-28 rounded-lg bg-gray-200" />
              </div>
            </div>
          </div>

          {/* Table skeleton */}
          <div className="overflow-x-auto rounded-2xl border bg-white">
            <div className="min-w-[1000px]">
              {/* header row */}
              <div className="grid grid-cols-6 gap-2 border-b bg-gray-50 px-4 py-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-3 rounded bg-gray-200" />
                ))}
              </div>

              {/* body rows */}
              <div className="divide-y">
                {[...Array(8)].map((_, r) => (
                  <div key={r} className="grid grid-cols-6 gap-2 px-4 py-4">
                    <div className="h-4 rounded bg-gray-200" />
                    <div className="h-4 rounded bg-gray-200" />
                    <div className="h-4 rounded bg-gray-200" />
                    <div className="h-6 w-20 rounded-full bg-gray-200" />
                    <div className="h-4 rounded bg-gray-200" />
                    <div className="h-8 w-16 rounded-md bg-gray-200 justify-self-end" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination skeleton */}
          <div className="flex items-center justify-end gap-2">
            <div className="h-9 w-20 rounded-lg bg-gray-200" />
            <div className="h-9 w-20 rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
