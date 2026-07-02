export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-10 animate-pulse">
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-3xl bg-white shadow-sm border border-black/5 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="h-7 w-56 rounded bg-gray-200" />
              <div className="h-4 w-80 rounded bg-gray-200" />
            </div>

            <div className="flex items-center gap-3">
              <div className="h-11 w-40 rounded-full bg-gray-200" />
              <div className="h-11 w-24 rounded-full bg-gray-300" />
            </div>
          </div>

          {/* Body */}
          <div className="mt-8">
            {/* Avatar row */}
            <div className="flex items-center gap-5 mb-8">
              <div className="space-y-2">
                <div className="h-3 w-24 rounded bg-gray-200" />

                <div className="flex items-center gap-6">
                  <div className="relative h-28 w-28">
                    <div className="h-28 w-28 rounded-full bg-gray-200 border-2 border-gray-100" />
                    <div className="absolute bottom-1 right-1 h-10 w-10 rounded-full bg-gray-300" />
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 w-40 rounded bg-gray-200" />
                    <div className="h-3 w-56 rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* Form grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-11 rounded-xl bg-gray-200" />
              </div>

              <div className="space-y-2">
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-11 rounded-xl bg-gray-200" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="h-4 w-36 rounded bg-gray-200" />
                <div className="h-11 rounded-xl bg-gray-200" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="h-11 rounded-xl bg-gray-200" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="h-11 rounded-xl bg-gray-200" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="h-4 w-28 rounded bg-gray-200" />
                <div className="h-11 rounded-xl bg-gray-200" />
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="mt-8 flex items-center justify-end gap-3">
              <div className="h-11 w-36 rounded-full bg-gray-200" />
              <div className="h-11 w-28 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
    