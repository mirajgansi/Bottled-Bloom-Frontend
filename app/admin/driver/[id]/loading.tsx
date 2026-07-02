export default function Loading() {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      {/* Top header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-40 rounded bg-gray-200" />
          <div className="h-4 w-56 rounded bg-gray-200" />
        </div>
        <div className="h-9 w-20 rounded-lg bg-gray-200" />
      </div>

      <div className="space-y-6">
        {/* TOP: Profile + Stats */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Profile card */}
          <div className="lg:col-span-2 rounded-2xl border bg-white">
            <div className="p-4 border-b">
              <div className="h-4 w-20 rounded bg-gray-200" />
            </div>

            <div className="p-4 space-y-4">
              {/* Avatar row */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-gray-200" />
                  <div className="h-3 w-48 rounded bg-gray-200" />
                </div>
              </div>

              {/* Info rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 rounded-lg border bg-gray-50 px-3 py-2"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Stats card */}
          <div className="rounded-2xl border bg-white">
            <div className="p-4 border-b">
              <div className="h-4 w-16 rounded bg-gray-200" />
            </div>
            <div className="p-4 grid gap-4">
              <div className="rounded-xl border p-3 bg-gray-50">
                <div className="h-3 w-28 rounded bg-gray-200" />
                <div className="mt-3 h-8 w-16 rounded bg-gray-200" />
              </div>
              <div className="rounded-xl border p-3 bg-gray-50">
                <div className="h-3 w-28 rounded bg-gray-200" />
                <div className="mt-3 h-8 w-16 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders card */}
        <div className="rounded-2xl border bg-white">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-4 w-40 rounded bg-gray-200" />
          </div>

          <div className="p-4">
            <div className="overflow-x-auto rounded-xl border">
              {/* table header */}
              <div className="grid grid-cols-6 gap-2 bg-gray-50 px-4 py-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-3 rounded bg-gray-200" />
                ))}
              </div>

              {/* table rows */}
              <div className="divide-y">
                {[...Array(6)].map((_, r) => (
                  <div key={r} className="grid grid-cols-6 gap-2 px-4 py-4">
                    <div className="h-4 rounded bg-gray-200 col-span-1" />
                    <div className="h-6 w-20 rounded-full bg-gray-200 col-span-1" />
                    <div className="h-4 rounded bg-gray-200 col-span-1" />
                    <div className="h-4 rounded bg-gray-200 col-span-1" />
                    <div className="h-4 rounded bg-gray-200 col-span-1" />
                    <div className="h-8 w-16 rounded-md bg-gray-200 col-span-1 justify-self-end" />
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-end gap-2">
              <div className="h-8 w-16 rounded-md bg-gray-200" />
              <div className="h-8 w-16 rounded-md bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
