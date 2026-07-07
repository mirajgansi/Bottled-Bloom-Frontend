export default function Loading() {
  return (
    <div className="p-4 space-y-4 animate-pulse" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Top header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-40 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
          <div className="h-4 w-56 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
        </div>
        <div className="h-9 w-20 rounded-lg" style={{ backgroundColor: "var(--bg-elevated)" }} />
      </div>

      <div className="space-y-6">
        {/* TOP: Profile + Stats */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Profile card */}
          <div
            className="lg:col-span-2 rounded-2xl"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
          >
            <div className="p-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <div className="h-4 w-20 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
            </div>

            <div className="p-4 space-y-4">
              {/* Avatar row */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full" style={{ backgroundColor: "var(--bg-elevated)" }} />
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
                  <div className="h-3 w-48 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
                </div>
              </div>

              {/* Info rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 rounded-lg px-3 py-2"
                    style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Stats card */}
          <div
            className="rounded-2xl"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
          >
            <div className="p-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <div className="h-4 w-16 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
            </div>
            <div className="p-4 grid gap-4">
              <div
                className="rounded-xl p-3"
                style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
              >
                <div className="h-3 w-28 rounded" style={{ backgroundColor: "var(--border-strong)" }} />
                <div className="mt-3 h-8 w-16 rounded" style={{ backgroundColor: "var(--border-strong)" }} />
              </div>
              <div
                className="rounded-xl p-3"
                style={{ backgroundColor: "rgba(201, 161, 93, 0.12)", border: "1px solid rgba(201, 161, 93, 0.3)" }}
              >
                <div className="h-3 w-28 rounded" style={{ backgroundColor: "rgba(201, 161, 93, 0.3)" }} />
                <div className="mt-3 h-8 w-16 rounded" style={{ backgroundColor: "rgba(201, 161, 93, 0.3)" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Orders card */}
        <div
          className="rounded-2xl"
          style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
        >
          <div
            className="p-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <div className="h-4 w-20 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
            <div className="h-4 w-40 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
          </div>

          <div className="p-4">
            <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--border-subtle)" }}>
              {/* table header */}
              <div
                className="grid grid-cols-6 gap-2 px-4 py-3"
                style={{ backgroundColor: "var(--bg-elevated)" }}
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-3 rounded" style={{ backgroundColor: "var(--border-strong)" }} />
                ))}
              </div>

              {/* table rows */}
              <div>
                {[...Array(6)].map((_, r) => (
                  <div
                    key={r}
                    className="grid grid-cols-6 gap-2 px-4 py-4"
                    style={{ borderTop: r === 0 ? "none" : "1px solid var(--border-subtle)" }}
                  >
                    <div className="h-4 rounded col-span-1" style={{ backgroundColor: "var(--bg-elevated)" }} />
                    <div className="h-6 w-20 rounded-full col-span-1" style={{ backgroundColor: "rgba(201, 161, 93, 0.25)" }} />
                    <div className="h-4 rounded col-span-1" style={{ backgroundColor: "rgba(201, 161, 93, 0.25)" }} />
                    <div className="h-4 rounded col-span-1" style={{ backgroundColor: "var(--bg-elevated)" }} />
                    <div className="h-4 rounded col-span-1" style={{ backgroundColor: "var(--bg-elevated)" }} />
                    <div
                      className="h-8 w-16 rounded-md col-span-1 justify-self-end"
                      style={{ backgroundColor: "var(--bg-elevated)" }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-end gap-2">
              <div className="h-8 w-16 rounded-md" style={{ backgroundColor: "var(--bg-elevated)" }} />
              <div className="h-8 w-16 rounded-md" style={{ backgroundColor: "var(--bg-elevated)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}