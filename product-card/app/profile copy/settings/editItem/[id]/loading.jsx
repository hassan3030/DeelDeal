export default function EditItemLoading() {
  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center">
        <div className="h-9 w-24 rounded bg-gray-200 animate-pulse"></div>
        <div className="h-8 w-32 ml-2 rounded bg-gray-200 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="p-6">
              <div className="h-7 w-40 rounded bg-gray-200 animate-pulse mb-2"></div>
              <div className="h-4 w-64 rounded bg-gray-200 animate-pulse mb-6"></div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="h-4 w-20 rounded bg-gray-200 animate-pulse"></div>
                  <div className="h-10 w-full rounded bg-gray-200 animate-pulse"></div>
                </div>

                <div className="space-y-2">
                  <div className="h-4 w-24 rounded bg-gray-200 animate-pulse"></div>
                  <div className="h-32 w-full rounded bg-gray-200 animate-pulse"></div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="h-4 w-20 rounded bg-gray-200 animate-pulse"></div>
                    <div className="h-10 w-full rounded bg-gray-200 animate-pulse"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 w-32 rounded bg-gray-200 animate-pulse"></div>
                    <div className="h-10 w-full rounded bg-gray-200 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card shadow-sm mt-6">
            <div className="p-6">
              <div className="h-7 w-32 rounded bg-gray-200 animate-pulse mb-2"></div>
              <div className="h-4 w-80 rounded bg-gray-200 animate-pulse mb-6"></div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="aspect-square rounded bg-gray-200 animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="p-6">
              <div className="h-7 w-32 rounded bg-gray-200 animate-pulse mb-2"></div>
              <div className="h-4 w-48 rounded bg-gray-200 animate-pulse mb-6"></div>

              <div className="overflow-hidden rounded-md border">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-5 w-32 rounded bg-gray-200 animate-pulse mb-2"></div>
                  <div className="h-4 w-full rounded bg-gray-200 animate-pulse mb-1"></div>
                  <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse mb-2"></div>
                  <div className="flex justify-between mt-2">
                    <div className="h-4 w-16 rounded bg-gray-200 animate-pulse"></div>
                    <div className="h-4 w-20 rounded bg-gray-200 animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="h-10 w-full rounded bg-gray-200 animate-pulse"></div>
                <div className="h-10 w-full rounded bg-gray-200 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
