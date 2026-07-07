export default function Loading() {
  return (
    <div className="p-4 animate-pulse" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Top bar (search + actions) */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-10 w-full sm:w-80 rounded-lg" style={{ backgroundColor: "var(--bg-elevated)" }} />
        <div className="flex gap-2">
          <div className="h-10 w-28 rounded-lg" style={{ backgroundColor: "var(--bg-elevated)" }} />
          <div className="h-10 w-28 rounded-lg" style={{ backgroundColor: "rgba(201, 161, 93, 0.25)" }} />
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
          {/* header */}
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

          {/* rows */}
          <div>
            {[...Array(8)].map((_, r) => (
              <div
                key={r}
                className="grid grid-cols-6 gap-2 px-4 py-4"
                style={{ borderTop: r === 0 ? "none" : "1px solid var(--border-subtle)" }}
              >
                {/* image */}
                <div className="h-10 w-10 rounded-lg" style={{ backgroundColor: "var(--bg-elevated)" }} />
                {/* name */}
                <div className="h-4 w-48 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
                {/* category */}
                <div className="h-4 w-28 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
                {/* price */}
                <div className="h-4 w-20 rounded" style={{ backgroundColor: "rgba(201, 161, 93, 0.25)" }} />
                {/* stock */}
                <div className="h-6 w-16 rounded-full" style={{ backgroundColor: "var(--bg-elevated)" }} />
                {/* actions */}
                <div
                  className="h-8 w-24 rounded-md justify-self-end"
                  style={{ backgroundColor: "var(--bg-elevated)" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* pagination */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <div className="h-4 w-40 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
          <div className="flex gap-2">
            <div className="h-9 w-20 rounded-lg" style={{ backgroundColor: "var(--bg-elevated)" }} />
            <div className="h-9 w-20 rounded-lg" style={{ backgroundColor: "var(--bg-elevated)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}