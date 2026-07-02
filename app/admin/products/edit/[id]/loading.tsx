export default function Loading() {
  return (
    <div className="p-6 animate-pulse">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Page title */}
        <div className="h-8 w-48 rounded bg-gray-200" />

        {/* Form container */}
        <div className="rounded-2xl border bg-white p-6 space-y-6">
          
          {/* Image preview section */}
          <div className="flex items-center gap-6">
            <div className="h-32 w-32 rounded-xl bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-10 w-32 rounded-lg bg-gray-200" />
            </div>
          </div>

          {/* Input fields */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="h-11 rounded-xl bg-gray-200" />
            </div>
          ))}

          {/* Textarea */}
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-28 rounded-xl bg-gray-200" />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <div className="h-10 w-24 rounded-lg bg-gray-200" />
            <div className="h-10 w-28 rounded-lg bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
