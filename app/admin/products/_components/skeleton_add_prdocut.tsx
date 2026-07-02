export default function CreateProductStep1Skeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Stepper */}
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gray-200" />
          <div className="h-4 w-40 rounded bg-gray-200" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gray-200" />
          <div className="h-4 w-52 rounded bg-gray-200" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gray-200" />
          <div className="h-4 w-44 rounded bg-gray-200" />
        </div>
      </div>

      {/* Step 1 fields */}
      <div className="space-y-4">
        {/* Product name */}
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-10 w-full rounded-md bg-gray-200" />
        </div>

        {/* Images dropzone */}
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="rounded-xl border border-dashed border-gray-300 p-6">
            <div className="grid place-items-center gap-3 py-6">
              <div className="h-10 w-10 rounded-full bg-gray-200" />
              <div className="h-4 w-40 rounded bg-gray-200" />
              <div className="h-3 w-28 rounded bg-gray-200" />
            </div>

            {/* fake thumbnails */}
            <div className="mt-4 flex flex-wrap gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 w-24 rounded-lg bg-gray-200" />
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 w-40 rounded bg-gray-200" />
          <div className="h-28 w-full rounded-md bg-gray-200" />
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="h-10 w-24 rounded-md bg-gray-200" />
        <div className="h-10 w-28 rounded-md bg-gray-300" />
      </div>
    </div>
  );
}
