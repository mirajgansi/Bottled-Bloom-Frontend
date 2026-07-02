export default function OrderCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm animate-pulse">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-[240px] space-y-2">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-5 w-40 bg-gray-300 rounded" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>

        <div className="flex gap-2">
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
        </div>

        <div className="text-right space-y-2">
          <div className="h-4 w-16 bg-gray-200 rounded ml-auto" />
          <div className="h-6 w-20 bg-gray-300 rounded ml-auto" />
          <div className="h-3 w-24 bg-gray-200 rounded ml-auto" />
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="h-4 w-40 bg-gray-200 rounded" />
        <div className="h-3 w-60 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
