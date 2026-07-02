export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl p-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-28 rounded bg-gray-200" />
          <div className="h-7 w-56 rounded bg-gray-200" />
          <div className="h-4 w-72 rounded bg-gray-200" />
          <div className="h-4 w-48 rounded bg-gray-200" />
        </div>

        <div className="rounded-2xl border bg-white p-4 w-44">
          <div className="h-3 w-14 rounded bg-gray-200" />
          <div className="mt-3 h-8 w-28 rounded-full bg-gray-200" />
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 rounded-2xl border bg-white">
          <div className="border-b p-4">
            <div className="h-5 w-24 rounded bg-gray-200" />
          </div>

          <div className="divide-y">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start justify-between gap-4 p-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-xl bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-44 rounded bg-gray-200" />
                    <div className="h-3 w-64 rounded bg-gray-200" />
                  </div>
                </div>
                <div className="h-4 w-20 rounded bg-gray-200" />
              </div>
            ))}
          </div>

          <div className="border-t p-4">
            <div className="h-10 w-44 rounded-xl bg-gray-200" />
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-2xl border bg-white">
          <div className="border-b p-4">
            <div className="h-5 w-24 rounded bg-gray-200" />
          </div>

          <div className="space-y-3 p-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-4 w-16 rounded bg-gray-200" />
              </div>
            ))}

            <div className="my-2 border-t pt-3 flex items-center justify-between">
              <div className="h-4 w-16 rounded bg-gray-200" />
              <div className="h-4 w-20 rounded bg-gray-200" />
            </div>
          </div>

          <div className="border-t p-4 space-y-2">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-3 w-full rounded bg-gray-200" />
            <div className="h-3 w-5/6 rounded bg-gray-200" />
            <div className="h-3 w-2/3 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
