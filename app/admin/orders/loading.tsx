export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-36 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
        </div>

        {/* Stat cards */}
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-3xl p-5"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div className="h-4 w-28 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
              <div className="mt-3 h-10 w-20 rounded" style={{ backgroundColor: "rgba(201, 161, 93, 0.25)" }} />
              <div className="mt-3 h-1 w-24 rounded-full" style={{ backgroundColor: "var(--bg-elevated)" }} />
            </div>
          ))}
        </div>

        {/* Toolbar + Table */}
        <div className="mt-6 space-y-4">
          {/* Toolbar skeleton */}
          <div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="h-10 w-full sm:w-80 rounded-lg" style={{ backgroundColor: "var(--bg-elevated)" }} />
              <div className="flex gap-2">
                <div className="h-10 w-28 rounded-lg" style={{ backgroundColor: "var(--bg-elevated)" }} />
                <div className="h-10 w-28 rounded-lg" style={{ backgroundColor: "var(--bg-elevated)" }} />
              </div>
            </div>
          </div>

          {/* Table skeleton */}
          <div
            className="overflow-x-auto rounded-2xl"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div className="min-w-[1000px]">
              {/* header row */}
              <div
                className="grid grid-cols-6 gap-2 px-4 py-3"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-3 rounded" style={{ backgroundColor: "var(--border-strong)" }} />
                ))}
              </div>

              {/* body rows */}
              <div>
                {[...Array(8)].map((_, r) => (
                  <div
                    key={r}
                    className="grid grid-cols-6 gap-2 px-4 py-4"
                    style={{ borderTop: r === 0 ? "none" : "1px solid var(--border-subtle)" }}
                  >
                    <div className="h-4 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
                    <div className="h-4 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
                    <div className="h-4 rounded" style={{ backgroundColor: "rgba(201, 161, 93, 0.25)" }} />
                    <div className="h-6 w-20 rounded-full" style={{ backgroundColor: "var(--bg-elevated)" }} />
                    <div className="h-4 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
                    <div
                      className="h-8 w-16 rounded-md justify-self-end"
                      style={{ backgroundColor: "var(--bg-elevated)" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination skeleton */}
          <div className="flex items-center justify-end gap-2">
            <div className="h-9 w-20 rounded-lg" style={{ backgroundColor: "var(--bg-elevated)" }} />
            <div className="h-9 w-20 rounded-lg" style={{ backgroundColor: "var(--bg-elevated)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}