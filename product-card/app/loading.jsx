export default function Loading() {
  return (
    <>
    
    
      {/* Header Skeleton */}
      <header className="animate-pulse bg-gray-200 h-16 w-full flex items-center px-8"></header>

        <div className="h-8 w-32 bg-gray-300 rounded" />

      {/* Main Content Skeleton */}
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="animate-pulse flex flex-col space-y-4 p-4 border rounded-lg shadow-md max-w-xs w-full">
          <div className="bg-gray-300 h-40 w-full rounded-md" />
          <div className="h-6 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-300 rounded w-1/2" />
          <div className="flex space-x-2 mt-2">
            <div className="h-8 w-20 bg-gray-300 rounded" />
            <div className="h-8 w-20 bg-gray-300 rounded" />
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="animate-pulse bg-gray-200 h-16 w-full flex items-center px-8 mt-auto">
        <div className="h-6 w-24 bg-gray-300 rounded" />
      </footer>

    </>
  
)
}
