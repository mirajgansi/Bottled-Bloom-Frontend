export default function Loading() {
  return (
    <div
      className="mx-auto max-w-5xl p-6 animate-pulse min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-28 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
          <div className="h-7 w-56 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
          <div className="h-4 w-72 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
          <div className="h-4 w-48 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
        </div>

        <div
          className="rounded-2xl p-4 w-44"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div className="h-3 w-14 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
          <div
            className="mt-3 h-8 w-28 rounded-full"
            style={{ backgroundColor: "rgba(201, 161, 93, 0.25)" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Items */}
        <div
          className="lg:col-span-2 rounded-2xl"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div className="p-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <div className="h-5 w-24 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
          </div>

          <div>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-4 p-4"
                style={{ borderTop: i === 0 ? "none" : "1px solid var(--border-subtle)" }}
              >
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-xl" style={{ backgroundColor: "var(--bg-elevated)" }} />
                  <div className="space-y-2">
                    <div className="h-4 w-44 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
                    <div className="h-3 w-64 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
                  </div>
                </div>
                <div className="h-4 w-20 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
              </div>
            ))}
          </div>

          <div className="p-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <div className="h-10 w-44 rounded-xl" style={{ backgroundColor: "var(--bg-elevated)" }} />
          </div>
        </div>

        {/* Summary */}
        <div
          className="rounded-2xl"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div className="p-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <div className="h-5 w-24 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
          </div>

          <div className="space-y-3 p-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-24 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
                <div className="h-4 w-16 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
              </div>
            ))}

            <div
              className="my-2 pt-3 flex items-center justify-between"
              style={{ borderTop: "1px solid var(--border-subtle)" }}
            >
              <div className="h-4 w-16 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
              <div
                className="h-4 w-20 rounded"
                style={{ backgroundColor: "rgba(201, 161, 93, 0.25)" }}
              />
            </div>
          </div>

          <div className="p-4 space-y-2" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <div className="h-4 w-32 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
            <div className="h-3 w-full rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
            <div className="h-3 w-5/6 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
            <div className="h-3 w-2/3 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}