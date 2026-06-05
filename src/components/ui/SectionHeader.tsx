import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SectionHeaderProps = {
  title: string
  eyebrow?: string
  actions?: ReactNode
  className?: string
}

export function SectionHeader({ title, eyebrow, actions, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-5 flex items-end justify-between gap-4', className)}>
      <div className="space-y-1">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">{eyebrow}</p>}
        <h2 className="text-2xl text-[var(--text-main)]">{title}</h2>
      </div>
      {actions}
    </div>
  )
}
