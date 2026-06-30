import { getWMBracketData } from '@/lib/serverData'
import { KnockoutBracket } from '@/components/wm/KnockoutBracket'

export default async function BracketPage() {
  const koSpiele = await getWMBracketData()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-aka)] tracking-wide mb-2">
        K.O.-RUNDE
      </h1>
      <p className="text-(--color-text-muted) mb-8">Vom Achtelfinale bis zum Finale</p>

      <KnockoutBracket spiele={koSpiele} />
    </div>
  )
}
