export default function Loading() {
  return (
    <div className="p-4 space-y-4 animate-pulse" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Search bar skeleton */}
      <div
        className="flex w-full items-center gap-2 rounded-full px-3 py-1"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div className="h-9 w-full rounded-full" style={{ backgroundColor: "var(--bg-elevated)" }} />
        <div className="h-9 w-9 rounded-full" style={{ backgroundColor: "var(--bg-elevated)" }} />
        <div className="h-10 w-40 rounded-2xl" style={{ backgroundColor: "rgba(201, 161, 93, 0.25)" }} />
      </div>

      {/* Table skeleton */}
      <div
        className="overflow-x-auto rounded-xl"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div className="min-w-[1000px] w-full text-sm">
          {/* Header */}
          <div
            className="grid grid-cols-7 gap-2 px-4 py-3"
            style={{ backgroundColor: "var(--bg-elevated)" }}
          >
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-3 rounded" style={{ backgroundColor: "var(--border-strong)" }} />
            ))}
          </div>

          {/* Rows */}
          <div>
            {[...Array(8)].map((_, r) => (
              <div
                key={r}
                className="grid grid-cols-7 gap-2 px-4 py-4"
                style={{ borderTop: r === 0 ? "none" : "1px solid var(--border-subtle)" }}
              >
                {/* Name (avatar + text) */}
                <div className="col-span-1 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full" style={{ backgroundColor: "var(--bg-elevated)" }} />
                  <div className="h-4 w-28 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
                </div>

                {/* Email */}
                <div className="h-4 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
                {/* Phone */}
                <div className="h-4 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
                {/* Address */}
                <div className="h-4 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
                {/* Total orders */}
                <div className="h-4 w-12 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
                {/* Status pill */}
                <div className="h-6 w-20 rounded-full" style={{ backgroundColor: "rgba(201, 161, 93, 0.25)" }} />
                {/* Actions */}
                <div
                  className="h-9 w-9 rounded-lg justify-self-end"
                  style={{ backgroundColor: "var(--bg-elevated)" }}
                />
              </div>
            ))}
          </div>

          {/* Pagination skeleton */}
          <div
            className="flex items-center justify-between gap-3 px-4 py-3"
            style={{ borderTop: "1px solid var(--border-subtle)" }}
          >
            <div className="h-4 w-64 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
            <div className="flex gap-2">
              <div className="h-8 w-16 rounded-md" style={{ backgroundColor: "var(--bg-elevated)" }} />
              <div className="h-8 w-16 rounded-md" style={{ backgroundColor: "var(--bg-elevated)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}