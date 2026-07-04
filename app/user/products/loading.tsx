export default function Loading() {
  return (
    <div className="w-full animate-pulse" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        {/* Filter skeleton */}
        <div className="sticky top-0 z-20">
          <div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
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
        </div>

        {/* Grid skeleton */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
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
    </div>
  );
}