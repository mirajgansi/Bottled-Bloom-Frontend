export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-8 animate-pulse space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-4 w-80 bg-gray-200 rounded" />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-44 rounded-2xl border bg-white" />
            <div className="h-64 rounded-2xl border bg-white" />
          </div>
          <div className="space-y-4">
            <div className="h-52 rounded-2xl border bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
