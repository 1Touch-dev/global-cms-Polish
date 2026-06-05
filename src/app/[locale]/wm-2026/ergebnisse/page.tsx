import { getWMErgebnisseData } from '@/lib/serverData'
import { CheckCircle } from 'lucide-react'
import { SpielKarte } from '@/components/wm/SpielKarte'

export default async function ErgebnissePage() {
  const ergebnisse = await getWMErgebnisseData()
  const beendeteSpiele = ergebnisse.filter(s => s.status === 'Beendet')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <CheckCircle className="w-8 h-8 text-[var(--color-aka)]" />
        <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-aka)] tracking-wide">
          ERGEBNISSE
        </h1>
      </div>
      <p className="text-(--color-text-muted) mb-8">
        Alle abgeschlossenen Spiele der WM 2026 {beendeteSpiele.length > 0 && `• ${beendeteSpiele.length} Spiele`}
      </p>

      {beendeteSpiele.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {beendeteSpiele.map(spiel => (
            <SpielKarte key={spiel.id} spiel={spiel} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[var(--color-grau)] rounded-xl border border-(--color-border)">
          <CheckCircle className="w-12 h-12 text-(--color-text-secondary) mx-auto mb-4" />
          <p className="text-(--color-text-muted) text-lg">Noch keine Ergebnisse verfügbar</p>
          <p className="text-(--color-text-secondary) text-sm mt-1">Daten werden live aktualisiert</p>
        </div>
      )}
    </div>
  )
}
