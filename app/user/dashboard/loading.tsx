export default function Loading() {
  return (
    <div className="flex-1 min-h-screen bg-gray-50 animate-pulse">
      {/* HERO skeleton */}
      <section className="relative h-[55vh] w-full bg-gray-200">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 flex flex-col justify-center h-full">
          <div className="h-10 w-2/3 max-w-xl rounded-lg bg-white/40" />
          <div className="mt-4 h-5 w-1/2 max-w-md rounded-lg bg-white/30" />
        </div>
      </section>

      {/* FILTER skeleton */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="h-11 flex-1 rounded-xl bg-gray-200" />
            <div className="h-11 w-full sm:w-52 rounded-xl bg-gray-200" />
            <div className="h-11 w-full sm:w-28 rounded-xl bg-gray-300" />
          </div>
        </div>
      </section>

      {/* BODY skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT SIDEBAR skeleton */}
          <div className="w-full lg:w-60 bg-white rounded-2xl border border-gray-200 p-4 space-y-3 h-fit">
            <div className="h-5 w-28 rounded bg-gray-200" />
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-gray-100 p-2"
              >
                <div className="h-10 w-10 rounded-lg bg-gray-200" />
                <div className="h-4 flex-1 rounded bg-gray-200" />
              </div>
            ))}
          </div>

          {/* RIGHT CONTENT skeleton */}
          <div className="flex-1 space-y-10">
            {[...Array(4)].map((_, section) => (
              <div key={section} className="space-y-4">
                {/* section title */}
                <div className="h-6 w-44 rounded bg-gray-200" />

                {/* cards row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, card) => (
                    <div
                      key={card}
                      className="rounded-2xl border bg-white p-3"
                    >
                      <div className="h-36 w-full rounded-xl bg-gray-200" />
                      <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />
                      <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
                      <div className="mt-4 h-10 w-full rounded-xl bg-gray-300" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
