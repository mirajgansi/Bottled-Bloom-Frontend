export default function Loading() {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      {/* Search bar skeleton */}
      <div className="flex w-full items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 shadow-sm">
        <div className="h-9 w-full rounded-full bg-gray-200" />
        <div className="h-9 w-9 rounded-full bg-gray-200" />
        <div className="h-10 w-40 rounded-2xl bg-gray-300" />
      </div>

      {/* Table skeleton */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <div className="min-w-[1000px] w-full text-sm">
          {/* Header */}
          <div className="grid grid-cols-7 gap-2 bg-gray-50 px-4 py-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-3 rounded bg-gray-200" />
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y">
            {[...Array(8)].map((_, r) => (
              <div key={r} className="grid grid-cols-7 gap-2 px-4 py-4">
                {/* Name (avatar + text) */}
                <div className="col-span-1 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="h-4 w-28 rounded bg-gray-200" />
                </div>

                {/* Email */}
                <div className="h-4 rounded bg-gray-200" />
                {/* Phone */}
                <div className="h-4 rounded bg-gray-200" />
                {/* Address */}
                <div className="h-4 rounded bg-gray-200" />
                {/* Total orders */}
                <div className="h-4 w-12 rounded bg-gray-200" />
                {/* Status pill */}
                <div className="h-6 w-20 rounded-full bg-gray-200" />
                {/* Actions */}
                <div className="h-9 w-9 rounded-lg bg-gray-200 justify-self-end" />
              </div>
            ))}
          </div>

          {/* Pagination skeleton */}
          <div className="flex items-center justify-between gap-3 border-t px-4 py-3">
            <div className="h-4 w-64 rounded bg-gray-200" />
            <div className="flex gap-2">
              <div className="h-8 w-16 rounded-md bg-gray-200" />
              <div className="h-8 w-16 rounded-md bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
