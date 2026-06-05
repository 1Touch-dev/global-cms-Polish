import { TriangleAlert } from 'lucide-react'
import { Card } from './Card'

export function ErrorState({
  title = 'Coś poszło nie tak',
  description = 'Nie udało się wczytać danych.',
}: {
  title?: string
  description?: string
}) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--danger)]/30 bg-[var(--danger)]/10 text-[var(--danger)]">
        <TriangleAlert className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg text-[var(--text-main)]">{title}</h3>
        <p className="max-w-md text-sm text-[var(--text-muted)]">{description}</p>
      </div>
    </Card>
  )
}
