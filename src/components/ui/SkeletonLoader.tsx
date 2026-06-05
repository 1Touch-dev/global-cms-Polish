'use client'

export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-[var(--color-grau)] rounded-lg ${className}`} />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-[var(--color-grau)] rounded-xl p-4 border border-(--color-border) space-y-3">
      <SkeletonLoader className="h-4 w-3/4" />
      <SkeletonLoader className="h-8 w-full" />
      <SkeletonLoader className="h-4 w-1/2" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonLoader key={i} className="h-10 w-full" />
      ))}
    </div>
  )
}
