export function SkeletonCard({ idx }: { idx: number }) {
  return (
    <div
      key={`skeleton-${idx}`}
      className="w-64 rounded-3xl p-4 border bg-white animate-pulse"
    >
      <div className="h-36 rounded-2xl bg-gray-100" />
      <div className="mt-4 h-6 w-3/4 rounded bg-gray-100" />
      <div className="mt-2 h-5 w-1/2 rounded bg-gray-100" />
    </div>
  );
}