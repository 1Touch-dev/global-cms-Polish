import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Biało-Czerwoni | Matchday Arena',
    short_name: 'Matchday Arena',
    description: 'Polski portal piłkarski z wynikami na żywo, terminarzem Mistrzostw Świata 2026 i statystykami.',
    start_url: '/pl',
    display: 'standalone',
    background_color: '#030712',
    theme_color: '#0b6623',
    orientation: 'portrait-primary',
    categories: ['sports', 'news'],
    lang: 'pl',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
