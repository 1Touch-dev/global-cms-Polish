export function BcArticleSkeleton() {
  return (
    <div className="card-surface animate-pulse rounded-[20px] overflow-hidden">
      <div className="aspect-video w-full bg-[var(--border)]" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-1/3 rounded bg-[var(--border)]" />
        <div className="h-5 w-full rounded bg-[var(--border)]" />
        <div className="h-5 w-4/5 rounded bg-[var(--border)]" />
        <div className="h-4 w-full rounded bg-[var(--border)]" />
        <div className="h-4 w-2/3 rounded bg-[var(--border)]" />
      </div>
    </div>
  )
}

export function BcFeaturedSkeleton() {
  return (
    <div className="card-surface animate-pulse rounded-[20px] overflow-hidden">
      <div className="grid md:grid-cols-[1.2fr_1fr]">
        <div className="min-h-[240px] bg-[var(--border)] md:min-h-[360px]" />
        <div className="p-6 space-y-4 md:p-8">
          <div className="h-5 w-1/3 rounded bg-[var(--border)]" />
          <div className="space-y-2">
            <div className="h-8 w-full rounded bg-[var(--border)]" />
            <div className="h-8 w-3/4 rounded bg-[var(--border)]" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-[var(--border)]" />
            <div className="h-4 w-full rounded bg-[var(--border)]" />
            <div className="h-4 w-2/3 rounded bg-[var(--border)]" />
          </div>
        </div>
      </div>
    </div>
  )
}
