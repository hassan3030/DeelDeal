import { Skeleton } from "@/components/ui/skeleton"

// ...existing code...

export function DeelProductCardSkeleton() {
  return (
    <div className="group relative flex w-[220px] flex-col overflow-hidden rounded-md border bg-background">
      {/* Image skeleton */}
      <div className="relative aspect-square overflow-hidden">
        <Skeleton className="w-full h-full absolute top-0 left-0" />
      </div>
      {/* Content skeleton */}
      <div className="flex flex-1 flex-col p-3">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-6 w-1/3 mb-4" />
        <Skeleton className="h-8 w-full rounded" />
      </div>
    </div>
  )
}

// ...rest of DeelProductCard code...