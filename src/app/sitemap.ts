import type { MetadataRoute } from 'next'
import { fetchBialoCzerwoniNewsPage } from '@/lib/bialoCzerwoniApi'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bialoczerwoni.live'
const LOCALES = ['pl', 'en'] as const

// Static routes and their SEO priority/changefreq
const STATIC_ROUTES: { path: string; priority: number; changefreq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/',                        priority: 1.0,  changefreq: 'daily'   },
  { path: '/ms-2026',                  priority: 0.9,  changefreq: 'daily'   },
  { path: '/ms-2026/grupy',            priority: 0.85, changefreq: 'daily'   },
  { path: '/ms-2026/terminarz',        priority: 0.85, changefreq: 'daily'   },
  { path: '/ms-2026/faza-pucharowa',   priority: 0.85, changefreq: 'daily'   },
  { path: '/wm-2026',                  priority: 0.8,  changefreq: 'daily'   },
  { path: '/wm-2026/gruppen',          priority: 0.75, changefreq: 'daily'   },
  { path: '/wm-2026/spielplan',        priority: 0.75, changefreq: 'daily'   },
  { path: '/wm-2026/ergebnisse',       priority: 0.75, changefreq: 'daily'   },
  { path: '/wm-2026/bracket',          priority: 0.75, changefreq: 'weekly'  },
  { path: '/teams',                    priority: 0.7,  changefreq: 'weekly'  },
  { path: '/spieler',                  priority: 0.7,  changefreq: 'weekly'  },
  { path: '/zawodnicy',                priority: 0.7,  changefreq: 'weekly'  },
  { path: '/spiele',                   priority: 0.7,  changefreq: 'daily'   },
  { path: '/statistiken',              priority: 0.65, changefreq: 'daily'   },
  { path: '/torschuetzen',             priority: 0.7,  changefreq: 'daily'   },
  { path: '/strzelcy',                 priority: 0.7,  changefreq: 'daily'   },
  { path: '/stadien',                  priority: 0.6,  changefreq: 'monthly' },
  { path: '/stadiony',                 priority: 0.6,  changefreq: 'monthly' },
  { path: '/ligen',                    priority: 0.65, changefreq: 'weekly'  },
  { path: '/ligen/bundesliga',         priority: 0.6,  changefreq: 'weekly'  },
  { path: '/ligen/premier-league',     priority: 0.6,  changefreq: 'weekly'  },
  { path: '/ligen/champions-league',   priority: 0.6,  changefreq: 'weekly'  },
  { path: '/ligen/la-liga',            priority: 0.6,  changefreq: 'weekly'  },
  { path: '/ligen/serie-a',            priority: 0.6,  changefreq: 'weekly'  },
  { path: '/ligen/ligue-1',            priority: 0.6,  changefreq: 'weekly'  },
  { path: '/reprezentacja',            priority: 0.7,  changefreq: 'weekly'  },
  { path: '/transfery',                priority: 0.65, changefreq: 'weekly'  },
  { path: '/news',                     priority: 0.8,  changefreq: 'hourly'  },
  { path: '/vorhersage',               priority: 0.55, changefreq: 'weekly'  },
  { path: '/suche',                    priority: 0.4,  changefreq: 'monthly' },
  { path: '/inne',                     priority: 0.4,  changefreq: 'monthly' },
  { path: '/betting/offers',           priority: 0.5,  changefreq: 'weekly'  },
]

async function getArticleSlugs(): Promise<string[]> {
  try {
    // Fetch up to 200 articles to get all slugs for sitemap
    const [page1, page2] = await Promise.all([
      fetchBialoCzerwoniNewsPage(1, 100),
      fetchBialoCzerwoniNewsPage(2, 100),
    ])
    const slugs = new Set<string>()
    for (const article of [...(page1?.data ?? []), ...(page2?.data ?? [])]) {
      if (article.slug) slugs.add(article.slug)
    }
    return Array.from(slugs)
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const slugs = await getArticleSlugs()

  // Static pages — one entry per locale
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap(({ path, priority, changefreq }) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency: changefreq,
      priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`])
        ),
      },
    }))
  )

  // Dynamic article pages
  const articleEntries: MetadataRoute.Sitemap = slugs.flatMap((slug) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}/wiadomosc/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.65,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE_URL}/${l}/wiadomosc/${slug}`])
        ),
      },
    }))
  )

  return [...staticEntries, ...articleEntries]
}
