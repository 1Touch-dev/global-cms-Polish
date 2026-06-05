export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`shimmer rounded-2xl ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="card-surface space-y-3 rounded-[20px] p-5">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}
