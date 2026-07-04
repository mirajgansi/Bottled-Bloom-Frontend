export default function Loading() {
  return (
    <div className="flex-1 min-h-screen animate-pulse" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* HERO skeleton */}
      <section className="relative h-[55vh] w-full" style={{ backgroundColor: "var(--bg-elevated)" }}>
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(15, 11, 8, 0.3)" }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 flex flex-col justify-center h-full">
          <div
            className="h-10 w-2/3 max-w-xl rounded-lg"
            style={{ backgroundColor: "rgba(201, 161, 93, 0.2)" }}
          />
          <div
            className="mt-4 h-5 w-1/2 max-w-md rounded-lg"
            style={{ backgroundColor: "rgba(245, 237, 224, 0.15)" }}
          />
        </div>
      </section>

      {/* FILTER skeleton */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div
          className="rounded-2xl p-4"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-deep)",
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="h-11 flex-1 rounded-xl" style={{ backgroundColor: "var(--bg-elevated)" }} />
            <div className="h-11 w-full sm:w-52 rounded-xl" style={{ backgroundColor: "var(--bg-elevated)" }} />
            <div
              className="h-11 w-full sm:w-28 rounded-xl"
              style={{ backgroundColor: "rgba(201, 161, 93, 0.25)" }}
            />
          </div>
        </div>
      </section>

      {/* BODY skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT SIDEBAR skeleton */}
          <div
            className="w-full lg:w-60 rounded-2xl p-4 space-y-3 h-fit"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div className="h-5 w-28 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl p-2"
                style={{ border: "1px solid var(--border-subtle)" }}
              >
                <div className="h-10 w-10 rounded-lg" style={{ backgroundColor: "var(--bg-elevated)" }} />
                <div className="h-4 flex-1 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
              </div>
            ))}
          </div>

          {/* RIGHT CONTENT skeleton */}
          <div className="flex-1 space-y-10">
            {[...Array(4)].map((_, section) => (
              <div key={section} className="space-y-4">
                {/* section title */}
                <div className="h-6 w-44 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />

                {/* cards row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, card) => (
                    <div
                      key={card}
                      className="rounded-2xl p-3"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div className="h-36 w-full rounded-xl" style={{ backgroundColor: "var(--bg-elevated)" }} />
                      <div className="mt-3 h-4 w-3/4 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
                      <div className="mt-2 h-4 w-1/2 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
                      <div
                        className="mt-4 h-10 w-full rounded-xl"
                        style={{ backgroundColor: "rgba(201, 161, 93, 0.25)" }}
                      />
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