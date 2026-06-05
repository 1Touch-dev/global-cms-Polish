'use client'

import { useLocale } from 'next-intl'
import { Newspaper, ArrowRight, Clock } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ArticleCard, type NewsArtikel } from './ArticleCard'

type LocaleKey = 'pl' | 'en'

type NewsCollections = {
  wm: NewsArtikel[]
  teams: NewsArtikel[]
  players: NewsArtikel[]
  leagues: NewsArtikel[]
  stadiums: NewsArtikel[]
  scorers: NewsArtikel[]
}

const NEWS: Record<LocaleKey, NewsCollections> = {
  pl: {
    wm: [
      {
        id: 101,
        titel: 'Niemcy otwierają turniej zwycięstwem nad Francją',
        zusammenfassung: 'Musiala i Havertz trafiają w wygranym 2:1 meczu otwarcia w Los Angeles. Mbappé odpowiada z rzutu karnego.',
        datum: '2026-06-14',
        kategorie: 'MŚ 2026',
      },
      {
        id: 102,
        titel: 'Mecz otwarcia: Meksyk świętuje domowe zwycięstwo',
        zusammenfassung: 'Gospodarze rozpoczynają turniej pewnym zwycięstwem 3:0 nad Arabią Saudyjską na Estadio Azteca.',
        datum: '2026-06-14',
        kategorie: 'MŚ 2026',
      },
      {
        id: 103,
        titel: 'Stadiony MŚ: wszystkie 16 aren w jednym miejscu',
        zusammenfassung: 'Od MetLife Stadium po Azteca, czyli najważniejsze obiekty turnieju w przejrzystym zestawieniu.',
        datum: '2026-06-12',
        kategorie: 'Stadiony',
      },
      {
        id: 104,
        titel: 'Musiala w kosmicznej formie: trzy punkty w kanale statystyk',
        zusammenfassung: 'Pomocnik Bayernu został bohaterem dnia i otworzył wyścig po Złotą Piłkę turnieju.',
        datum: '2026-06-14',
        kategorie: 'Zawodnicy',
      },
    ],
    teams: [
      {
        id: 201,
        titel: 'Kadra Niemiec: Nagelsmann powołuje 26 zawodników',
        zusammenfassung: 'Niespodzianka: Füllkrug w składzie, Müller poza listą na turniej.',
        datum: '2026-06-01',
        kategorie: 'Niemcy',
      },
      {
        id: 202,
        titel: 'Francja: Mbappé potwierdzony jako kapitan',
        zusammenfassung: 'Didier Deschamps oficjalnie przekazuje opaskę gwieździe Realu Madryt.',
        datum: '2026-06-02',
        kategorie: 'Francja',
      },
      {
        id: 203,
        titel: 'Anglia w kryzysie: Kane z urazem stawu skokowego',
        zusammenfassung: 'Snajper Bayernu walczy z czasem, a sztab medyczny liczy na szybki powrót do pełni zdrowia.',
        datum: '2026-06-03',
        kategorie: 'Anglia',
      },
      {
        id: 204,
        titel: 'Brazylia stawia na młodość: Endrick w kadrze',
        zusammenfassung: 'Nastolatek z Realu Madryt trafia do 26-osobowej kadry Canarinhos.',
        datum: '2026-06-01',
        kategorie: 'Brazylia',
      },
    ],
    players: [
      {
        id: 301,
        titel: 'Musiala na celowniku Europy: najgorętszy talent turnieju',
        zusammenfassung: 'Real Madryt, Barcelona i Manchester City obserwują zawodnika Bayernu z bliska.',
        datum: '2026-06-10',
        kategorie: 'Transfer',
      },
      {
        id: 302,
        titel: 'Haaland bije kolejny rekord: 50 goli w sezonie',
        zusammenfassung: 'Norweg przebija historyczny wynik Manchesteru City i jest głównym faworytem do Złotego Buta.',
        datum: '2026-06-08',
        kategorie: 'Rekord',
      },
      {
        id: 303,
        titel: 'Ostatni taniec Messiego: pożegnanie po turnieju?',
        zusammenfassung: '38-latek sugeruje, że MŚ 2026 mogą być jego ostatnim wielkim turniejem.',
        datum: '2026-06-07',
        kategorie: 'MŚ 2026',
      },
      {
        id: 304,
        titel: 'Wirtz przedłuża kontrakt z Leverkusen do 2029',
        zusammenfassung: 'Mimo ogromnych ofert ofensywny talent pozostaje wierny ekipie z BayArena.',
        datum: '2026-06-05',
        kategorie: 'Transfer',
      },
    ],
    leagues: [
      {
        id: 401,
        titel: 'Bundesliga 2025/26: Bayern ponownie mistrzem',
        zusammenfassung: 'Mistrz Niemiec zdobywa 35. tytuł z pięciopunktową przewagą.',
        datum: '2026-05-18',
        kategorie: 'Bundesliga',
      },
      {
        id: 402,
        titel: 'Liga Mistrzów: Real Madryt sięga po 16. tytuł',
        zusammenfassung: 'W finale przeciwko Arsenalowi klub z Madrytu zwycięża 2:1 po dublecie Bellinghama.',
        datum: '2026-05-31',
        kategorie: 'Champions League',
      },
      {
        id: 403,
        titel: 'Premier League: City bierze 7. tytuł w 8 lat',
        zusammenfassung: '50 bramek Haalanda zapewnia Manchesterowi kolejne historyczne mistrzostwo.',
        datum: '2026-05-19',
        kategorie: 'Premier League',
      },
      {
        id: 404,
        titel: 'Rynek transferowy: letnie okno otwiera się 1 lipca',
        zusammenfassung: 'Po turnieju rynek ma eksplodować, a najgorętsze plotki już krążą po Europie.',
        datum: '2026-06-01',
        kategorie: 'Transfer',
      },
    ],
    stadiums: [
      {
        id: 501,
        titel: 'MetLife Stadium: największa arena od 1994 roku',
        zusammenfassung: 'Stadion w New Jersey mieści 82 500 widzów i ma być sceną wielkiego finału.',
        datum: '2026-06-10',
        kategorie: 'Stadiony',
      },
      {
        id: 502,
        titel: 'Azteca: trzeci mundial i historyczny rekord',
        zusammenfassung: 'Jako pierwszy stadion w historii obiekt z Meksyku przyjmie mundial po raz trzeci.',
        datum: '2026-06-08',
        kategorie: 'Stadiony',
      },
      {
        id: 503,
        titel: 'SoFi Stadium: Hollywood spotyka futbol',
        zusammenfassung: 'Najbardziej nowoczesny stadion świata staje się sceną dla meczów reprezentacji Niemiec.',
        datum: '2026-06-07',
        kategorie: 'Stadiony',
      },
      {
        id: 504,
        titel: 'Bezpieczeństwo: FIFA inwestuje 500 mln w technologię stadionową',
        zusammenfassung: 'Najnowocześniejszy monitoring i strefy kibica mają podnieść standard turnieju.',
        datum: '2026-06-05',
        kategorie: 'Stadiony',
      },
    ],
    scorers: [
      {
        id: 601,
        titel: 'Złoty But: Mbappé prowadzi po drugiej kolejce',
        zusammenfassung: 'Cztery gole w dwóch meczach sprawiają, że Francuz jest głównym faworytem do korony strzelców.',
        datum: '2026-06-18',
        kategorie: 'Strzelcy',
      },
      {
        id: 602,
        titel: 'Główka Haalanda: czy to gol turnieju?',
        zusammenfassung: 'Akrobatyczne trafienie z 12 metrów już teraz obiega media społecznościowe.',
        datum: '2026-06-16',
        kategorie: 'Strzelcy',
      },
      {
        id: 603,
        titel: 'Rekord mundialu: 15 bramek w dniu otwarcia',
        zusammenfassung: 'Nigdy wcześniej pierwszy dzień turnieju nie przyniósł takiego festiwalu goli.',
        datum: '2026-06-14',
        kategorie: 'MŚ 2026',
      },
    ],
  },
  en: {
    wm: [
      {
        id: 101,
        titel: 'Germany open the tournament with a win over France',
        zusammenfassung: 'Musiala and Havertz score in a 2:1 opener in Los Angeles. Mbappé pulls one back from the spot.',
        datum: '2026-06-14',
        kategorie: 'WC 2026',
      },
      {
        id: 102,
        titel: 'Opening match: Mexico celebrate a home victory',
        zusammenfassung: 'The hosts begin the tournament with a confident 3:0 win over Saudi Arabia at Estadio Azteca.',
        datum: '2026-06-14',
        kategorie: 'WC 2026',
      },
      {
        id: 103,
        titel: 'World Cup stadiums: all 16 arenas in one view',
        zusammenfassung: 'From MetLife Stadium to Azteca, the tournament venues are mapped in one place.',
        datum: '2026-06-12',
        kategorie: 'Stadiums',
      },
      {
        id: 104,
        titel: 'Musiala in superstar form: three direct goal contributions',
        zusammenfassung: 'Bayern’s midfielder becomes the standout name of the day and jumps into the Golden Ball race.',
        datum: '2026-06-14',
        kategorie: 'Players',
      },
    ],
    teams: [
      {
        id: 201,
        titel: 'Germany squad: Nagelsmann calls up 26 players',
        zusammenfassung: 'Surprise inclusion for Füllkrug, while Müller misses out on the final tournament list.',
        datum: '2026-06-01',
        kategorie: 'Germany',
      },
      {
        id: 202,
        titel: 'France: Mbappé confirmed as captain',
        zusammenfassung: 'Didier Deschamps officially hands the armband to the Real Madrid superstar.',
        datum: '2026-06-02',
        kategorie: 'France',
      },
      {
        id: 203,
        titel: 'England crisis: Kane suffers ankle issue',
        zusammenfassung: 'The Bayern striker is racing against time as the medical staff target a quick recovery.',
        datum: '2026-06-03',
        kategorie: 'England',
      },
      {
        id: 204,
        titel: 'Brazil go young: Endrick named in the squad',
        zusammenfassung: 'The Real Madrid teenager makes the 26-man Canarinho roster.',
        datum: '2026-06-01',
        kategorie: 'Brazil',
      },
    ],
    players: [
      {
        id: 301,
        titel: 'Musiala on Europe’s radar: tournament’s hottest talent',
        zusammenfassung: 'Real Madrid, Barcelona and Manchester City are all tracking the Bayern star.',
        datum: '2026-06-10',
        kategorie: 'Transfer',
      },
      {
        id: 302,
        titel: 'Haaland breaks another record: 50 goals in a season',
        zusammenfassung: 'The Norwegian outdoes City’s historic mark and leads the Golden Boot conversation.',
        datum: '2026-06-08',
        kategorie: 'Record',
      },
      {
        id: 303,
        titel: 'Messi’s last dance: farewell after the tournament?',
        zusammenfassung: 'The 38-year-old hints that World Cup 2026 may be his final major tournament.',
        datum: '2026-06-07',
        kategorie: 'WC 2026',
      },
      {
        id: 304,
        titel: 'Wirtz extends his Leverkusen deal until 2029',
        zusammenfassung: 'Despite huge offers, the creative talent stays loyal to the BayArena side.',
        datum: '2026-06-05',
        kategorie: 'Transfer',
      },
    ],
    leagues: [
      {
        id: 401,
        titel: 'Bundesliga 2025/26: Bayern are champions again',
        zusammenfassung: 'The German giants claim their 35th title with a five-point cushion.',
        datum: '2026-05-18',
        kategorie: 'Bundesliga',
      },
      {
        id: 402,
        titel: 'Champions League: Real Madrid win the 16th title',
        zusammenfassung: 'A Bellingham brace delivers a 2:1 final win over Arsenal.',
        datum: '2026-05-31',
        kategorie: 'Champions League',
      },
      {
        id: 403,
        titel: 'Premier League: City land a 7th title in 8 years',
        zusammenfassung: 'Haaland’s 50 goals secure another historic championship for Manchester City.',
        datum: '2026-05-19',
        kategorie: 'Premier League',
      },
      {
        id: 404,
        titel: 'Transfer market: summer window opens on July 1',
        zusammenfassung: 'The post-tournament market is ready to explode and the rumours are already flowing.',
        datum: '2026-06-01',
        kategorie: 'Transfer',
      },
    ],
    stadiums: [
      {
        id: 501,
        titel: 'MetLife Stadium: the biggest arena since 1994',
        zusammenfassung: 'The New Jersey venue holds 82,500 fans and is set for the final.',
        datum: '2026-06-10',
        kategorie: 'Stadiums',
      },
      {
        id: 502,
        titel: 'Azteca: a third World Cup and a historic record',
        zusammenfassung: 'The Mexican icon becomes the first stadium to host the tournament three times.',
        datum: '2026-06-08',
        kategorie: 'Stadiums',
      },
      {
        id: 503,
        titel: 'SoFi Stadium: Hollywood meets football',
        zusammenfassung: 'The most modern stadium in the world becomes the stage for Germany’s group matches.',
        datum: '2026-06-07',
        kategorie: 'Stadiums',
      },
      {
        id: 504,
        titel: 'Safety push: FIFA invests 500M in stadium tech',
        zusammenfassung: 'Advanced surveillance and fan-zone systems are set to raise the tournament standard.',
        datum: '2026-06-05',
        kategorie: 'Stadiums',
      },
    ],
    scorers: [
      {
        id: 601,
        titel: 'Golden Boot: Mbappé leads after matchday two',
        zusammenfassung: 'Four goals in two games put the Frenchman at the front of the scoring race.',
        datum: '2026-06-18',
        kategorie: 'Scorers',
      },
      {
        id: 602,
        titel: 'Haaland’s header: goal of the tournament already?',
        zusammenfassung: 'An acrobatic header from 12 meters is already going viral across social feeds.',
        datum: '2026-06-16',
        kategorie: 'Scorers',
      },
      {
        id: 603,
        titel: 'World Cup record: 15 goals on opening day',
        zusammenfassung: 'The first day of the tournament has never produced such a scoring explosion.',
        datum: '2026-06-14',
        kategorie: 'WC 2026',
      },
    ],
  },
}

export function getNewsCollections(locale: string): NewsCollections {
  return locale === 'en' ? NEWS.en : NEWS.pl
}

interface NewsSectionProps {
  title?: string
  titel?: string
  news: NewsArtikel[]
  maxArticles?: number
  maxArtikel?: number
  compact?: boolean
  kompakt?: boolean
}

export function NewsSection({
  title,
  titel,
  news,
  maxArticles,
  maxArtikel,
  compact,
  kompakt,
}: NewsSectionProps) {
  const locale = useLocale()
  const dateLocale = locale === 'en' ? 'en-US' : 'pl-PL'
  const resolvedTitle = title || titel || 'NEWS'
  const resolvedMaxArticles = maxArticles ?? maxArtikel ?? 4
  const resolvedCompact = compact ?? kompakt ?? false
  const articles = news.slice(0, resolvedMaxArticles)

  if (resolvedCompact) {
    return (
      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <h3 className="inline-flex items-center gap-2 text-sm text-[var(--text-main)]">
            <Newspaper className="h-4 w-4 text-[var(--accent)]" />
            {resolvedTitle}
          </h3>
          <Link href="/news" className="text-xs font-semibold text-[var(--accent)]">
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {articles.map((article) => (
            <Link key={article.id} href="/news" className="block px-4 py-3 transition hover:bg-[var(--surface-soft)]">
              <div className="space-y-1">
                <p className="line-clamp-1 text-sm text-[var(--text-main)]">{article.titel}</p>
                <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                  <span className="text-[var(--accent)]">{article.kategorie}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(article.datum).toLocaleDateString(dateLocale, { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <section>
      <SectionHeader
        title={resolvedTitle}
        eyebrow="NEWSROOM"
        actions={
          <Link href="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
            Wszystkie newsy <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {articles.map((article, index) => (
          <div key={article.id} className={index === 0 ? 'md:col-span-2' : ''}>
            <ArticleCard artikel={article} locale={dateLocale} />
          </div>
        ))}
      </div>
    </section>
  )
}

export type { NewsArtikel } from './ArticleCard'
