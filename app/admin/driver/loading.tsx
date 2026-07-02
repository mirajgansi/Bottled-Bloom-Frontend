export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Search bar skeleton */}
      <div className="flex w-full items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 shadow-sm">
        <div className="h-9 w-full rounded-full bg-gray-200" />
      </div>

      {/* Table skeleton */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <div className="min-w-[1050px] w-full">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-2 bg-gray-50 px-4 py-3">
            <div className="col-span-1 h-3 rounded bg-gray-200" />
            <div className="col-span-3 h-3 rounded bg-gray-200" />
            <div className="col-span-3 h-3 rounded bg-gray-200" />
            <div className="col-span-2 h-3 rounded bg-gray-200" />
            <div className="col-span-1 h-3 rounded bg-gray-200" />
            <div className="col-span-1 h-3 rounded bg-gray-200" />
            <div className="col-span-1 h-3 rounded bg-gray-200" />
          </div>

          {/* Body rows */}
          <div className="divide-y">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 px-4 py-4">
                {/* avatar */}
                <div className="col-span-1 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                </div>

                {/* name */}
                <div className="col-span-3 flex items-center">
                  <div className="h-4 w-40 rounded bg-gray-200" />
                </div>

                {/* email */}
                <div className="col-span-3 flex items-center">
                  <div className="h-4 w-56 rounded bg-gray-200" />
                </div>

                {/* phone */}
                <div className="col-span-2 flex items-center">
                  <div className="h-4 w-28 rounded bg-gray-200" />
                </div>

                {/* assigned */}
                <div className="col-span-1 flex items-center">
                  <div className="h-4 w-10 rounded bg-gray-200" />
                </div>

                {/* delivered */}
                <div className="col-span-1 flex items-center">
                  <div className="h-4 w-10 rounded bg-gray-200" />
                </div>

                {/* action */}
                <div className="col-span-1 flex items-center justify-end">
                  <div className="h-9 w-16 rounded-lg bg-gray-200" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination skeleton */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="h-4 w-32 rounded bg-gray-200" />
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
