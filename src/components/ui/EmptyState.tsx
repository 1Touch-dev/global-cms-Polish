import { ReactNode } from 'react'
import { Card } from './Card'

export function EmptyState({
  title,
  description,
  icon,
}: {
  title: string
  description?: string
  icon?: ReactNode
}) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      {icon}
      <div className="space-y-1">
        <h3 className="text-lg text-[var(--text-main)]">{title}</h3>
        {description && <p className="max-w-md text-sm text-[var(--text-muted)]">{description}</p>}
      </div>
    </Card>
  )
}
