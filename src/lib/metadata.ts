import type { Metadata } from 'next'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bialoczerwoni.live'

type PageKey =
  | 'home'
  | 'wm'
  | 'gruppen'
  | 'spielplan'
  | 'ergebnisse'
  | 'bracket'
  | 'teams'
  | 'spieler'
  | 'spiele'
  | 'statistiken'
  | 'torschuetzen'
  | 'stadien'
  | 'ligen'
  | 'vorhersage'
  | 'suche'
  | 'news'

const metaData: Record<PageKey, { pl: Metadata; en: Metadata }> = {
  home: {
    pl: {
      title: 'Mistrzostwa Świata 2026 | Matchday Arena',
      description: 'Polski portal Matchday Arena dla Mistrzostw Świata 2026 z wynikami na żywo, terminarzem, grupami i statystykami.',
    },
    en: {
      title: 'World Cup 2026 | Matchday Arena',
      description: 'Your Matchday Arena portal for the FIFA World Cup 2026 with live scores, schedule, groups and stats.',
    },
  },
  wm: {
    pl: {
      title: 'Mistrzostwa Świata 2026 | Grupy, terminarz i wyniki',
      description: 'Kompletny przewodnik po FIFA World Cup 2026: 48 drużyn, 104 mecze i 16 stadionów.',
    },
    en: {
      title: 'World Cup 2026 | Groups, Schedule, Results',
      description: 'Everything about FIFA World Cup 2026: 48 teams, 104 matches and 16 stadiums.',
    },
  },
  gruppen: {
    pl: {
      title: 'Mistrzostwa Świata 2026 | Grupy A-L',
      description: 'Tabela, punkty i wyniki wszystkich 12 grup turniejowych.',
    },
    en: {
      title: 'World Cup 2026 Groups A-L | All 12 Groups',
      description: 'All 12 groups of the 2026 World Cup with standings, points and results.',
    },
  },
  spielplan: {
    pl: {
      title: 'Mistrzostwa Świata 2026 | Terminarz',
      description: 'Pełny terminarz turnieju z datami, stadionami i godzinami rozpoczęcia wszystkich meczów.',
    },
    en: {
      title: 'World Cup 2026 Schedule | All Matches',
      description: 'Complete FIFA World Cup 2026 schedule with dates, stadiums and kick-off times.',
    },
  },
  ergebnisse: {
    pl: {
      title: 'Mistrzostwa Świata 2026 | Wyniki',
      description: 'Wszystkie wyniki FIFA World Cup 2026 w jednym miejscu.',
    },
    en: {
      title: 'World Cup 2026 Results | Live Scores',
      description: 'All FIFA World Cup 2026 results at a glance.',
    },
  },
  bracket: {
    pl: {
      title: 'Mistrzostwa Świata 2026 | Drabinka',
      description: 'Faza pucharowa: od 1/8 finału do finału.',
    },
    en: {
      title: 'World Cup 2026 Knockout | Bracket',
      description: 'The 2026 World Cup knockout stage: Round of 16 to Final.',
    },
  },
  teams: {
    pl: {
      title: 'Mistrzostwa Świata 2026 | Drużyny',
      description: 'Pełna lista 48 drużyn uczestniczących w turnieju.',
    },
    en: {
      title: 'World Cup 2026 Teams | All 48 Teams',
      description: 'All 48 participating teams of the FIFA World Cup 2026.',
    },
  },
  spieler: {
    pl: {
      title: 'Mistrzostwa Świata 2026 | Zawodnicy',
      description: 'Profile, statystyki i składy najlepszych piłkarzy turnieju.',
    },
    en: {
      title: 'World Cup 2026 Players | Stars & Squads',
      description: 'The best players of the 2026 World Cup with profiles, stats and squads.',
    },
  },
  spiele: {
    pl: {
      title: 'Mecze | Piłkarskie wyniki i terminarz',
      description: 'Mecze FIFA World Cup 2026, ligi i spotkania na żywo.',
    },
    en: {
      title: 'Matches | All Football Matches',
      description: 'All football matches, from World Cup 2026 to major club competitions.',
    },
  },
  statistiken: {
    pl: {
      title: 'Statystyki | Gole, asysty, posiadanie',
      description: 'Szczegółowe statystyki piłkarskie: gole, asysty, posiadanie piłki i więcej.',
    },
    en: {
      title: 'Statistics | Goals, Assists, Possession',
      description: 'Comprehensive football statistics: scorers, assists, possession and more.',
    },
  },
  torschuetzen: {
    pl: {
      title: 'Klasyfikacja strzelców | Golden Boot 2026',
      description: 'Wyścig po Złoty But w Mistrzostwach Świata 2026 na żywo.',
    },
    en: {
      title: 'Top Scorers | WC 2026 Golden Boot',
      description: 'The top scorers of the 2026 World Cup and the Golden Boot race.',
    },
  },
  stadien: {
    pl: {
      title: 'Stadiony | 16 turniejowych aren',
      description: 'Interaktywna mapa wszystkich stadionów mistrzostw świata.',
    },
    en: {
      title: 'World Cup 2026 Stadiums | 16 Venues',
      description: 'All 16 World Cup stadiums in USA, Canada and Mexico on an interactive map.',
    },
  },
  ligen: {
    pl: {
      title: 'Ligi | Bundesliga, Champions League, Premier League',
      description: 'Tabela i wyniki najlepszych lig piłkarskich na świecie.',
    },
    en: {
      title: 'Leagues | Bundesliga, Champions League, Premier League',
      description: 'Standings and results from the best football leagues in the world.',
    },
  },
  vorhersage: {
    pl: {
      title: 'Typy meczowe | prognozy 2026',
      description: 'Przewiduj wyniki i zdobywaj punkty.',
    },
    en: {
      title: 'Match Predictor | World Cup 2026 Predictions',
      description: 'Predict World Cup results and earn points.',
    },
  },
  suche: {
    pl: {
      title: 'Szukaj | Mistrzostwa Świata 2026',
      description: 'Wyszukuj drużyny, zawodników, mecze i stadiony.',
    },
    en: {
      title: 'Search | World Cup 2026',
      description: 'Search teams, players, matches and stadiums.',
    },
  },
  news: {
    pl: {
      title: 'Newsy | najnowsze wieści piłkarskie',
      description: 'Najnowsze informacje o Mistrzostwach Świata 2026 i futbolu światowym.',
    },
    en: {
      title: 'News | Football News World Cup 2026',
      description: 'Latest news about the 2026 World Cup and world football.',
    },
  },
}

export function getPageMetadata(page: PageKey, locale: string = 'pl', path = '/'): Metadata {
  const lang = locale === 'en' ? 'en' : 'pl'
  const base = metaData[page]?.[lang] || metaData[page]?.pl
  const canonical = `${SITE_URL}/${locale}${path === '/' ? '' : path}`

  return {
    ...base,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages: {
        pl: `${SITE_URL}/pl${path === '/' ? '' : path}`,
        en: `${SITE_URL}/en${path === '/' ? '' : path}`,
      },
    },
    openGraph: {
      title: base.title as string,
      description: base.description as string,
      url: canonical,
      siteName: 'Biało-Czerwoni | Matchday Arena',
      locale: locale === 'en' ? 'en_US' : 'pl_PL',
      alternateLocale: locale === 'en' ? 'pl_PL' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: base.title as string,
      description: base.description as string,
    },
  }
}
