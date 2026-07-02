export default function Loading() {
  return (
    <div className="p-4 animate-pulse">
      {/* Top bar (search + actions) */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-10 w-full sm:w-80 rounded-lg bg-gray-200" />
        <div className="flex gap-2">
          <div className="h-10 w-28 rounded-lg bg-gray-200" />
          <div className="h-10 w-28 rounded-lg bg-gray-200" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="overflow-x-auto rounded-2xl border bg-white">
        <div className="min-w-[1000px]">
          {/* header */}
          <div className="grid grid-cols-6 gap-2 border-b bg-gray-50 px-4 py-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-3 rounded bg-gray-200" />
            ))}
          </div>

          {/* rows */}
          <div className="divide-y">
            {[...Array(8)].map((_, r) => (
              <div key={r} className="grid grid-cols-6 gap-2 px-4 py-4">
                {/* image */}
                <div className="h-10 w-10 rounded-lg bg-gray-200" />
                {/* name */}
                <div className="h-4 w-48 rounded bg-gray-200" />
                {/* category */}
                <div className="h-4 w-28 rounded bg-gray-200" />
                {/* price */}
                <div className="h-4 w-20 rounded bg-gray-200" />
                {/* stock */}
                <div className="h-6 w-16 rounded-full bg-gray-200" />
                {/* actions */}
                <div className="h-8 w-24 rounded-md bg-gray-200 justify-self-end" />
              </div>
            ))}
          </div>
        </div>

        {/* pagination */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="h-4 w-40 rounded bg-gray-200" />
          <div className="flex gap-2">
            <div className="h-9 w-20 rounded-lg bg-gray-200" />
            <div className="h-9 w-20 rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
