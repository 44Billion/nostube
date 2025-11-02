interface VideoGridSkeletonProps {
  count?: number
}

/**
 * Loading skeleton for video grid
 */
export function VideoGridSkeleton({ count = 8 }: VideoGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="aspect-video bg-muted animate-pulse rounded-lg" />
          <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
          <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}
