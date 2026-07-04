export default function Loading() {
  return (
    <div
      className="mx-auto max-w-5xl p-6 space-y-4 animate-pulse min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Search card */}
      <div
        className="rounded-2xl p-4"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-4 w-24 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
            <div className="mt-2 h-3 w-16 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
          </div>
          <div className="h-10 w-full sm:w-80 rounded-lg" style={{ backgroundColor: "var(--bg-elevated)" }} />
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div
          className="grid grid-cols-12 gap-2 px-4 py-3"
          style={{
            backgroundColor: "var(--bg-elevated)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div className="col-span-5 h-3 rounded" style={{ backgroundColor: "var(--border-strong)" }} />
          <div className="col-span-3 h-3 rounded" style={{ backgroundColor: "var(--border-strong)" }} />
          <div className="col-span-2 h-3 rounded" style={{ backgroundColor: "var(--border-strong)" }} />
          <div className="col-span-2 h-3 rounded" style={{ backgroundColor: "var(--border-strong)" }} />
        </div>

        <div>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-2 px-4 py-4"
              style={{ borderTop: i === 0 ? "none" : "1px solid var(--border-subtle)" }}
            >
              <div className="col-span-5 space-y-2">
                <div className="h-4 w-40 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
                <div className="h-3 w-28 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
              </div>
              <div className="col-span-3 h-4 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
              <div className="col-span-2 h-4 rounded" style={{ backgroundColor: "rgba(201, 161, 93, 0.25)" }} />
              <div className="col-span-2 h-7 w-20 rounded-full" style={{ backgroundColor: "var(--bg-elevated)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}