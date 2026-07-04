export function SkeletonCard({ idx }: { idx: number }) {
  return (
    <div
      key={`skeleton-${idx}`}
      className="w-64 rounded-3xl p-4 animate-pulse"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div className="h-36 rounded-2xl" style={{ backgroundColor: "var(--bg-elevated)" }} />
      <div className="mt-4 h-6 w-3/4 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
      <div className="mt-2 h-5 w-1/2 rounded" style={{ backgroundColor: "rgba(201, 161, 93, 0.25)" }} />
    </div>
  );
}