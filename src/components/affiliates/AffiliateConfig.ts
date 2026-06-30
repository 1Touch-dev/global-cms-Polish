export type AffiliateLocale = 'en' | 'pl' | string

export type BannerVariant = 'horizontal' | 'horizontalWide' | 'verticalPrimary' | 'verticalSecondary'

export type AffiliateBannerSlide =
  | { kind: 'iframe'; provider: string; src: string; width: number; height: number }
  | { kind: 'image'; provider: string; href: string; imageSrc: string; width: number; height: number }

const SITE_ID = '5729730'

function buildBannerUrl(adId: number) {
  return `https://refbanners.com/I?tag=d_${SITE_ID}m_${adId}c_&site=${SITE_ID}&ad=${adId}`
}

export const affiliateConfig = {
  provider: '1xBet',
  affiliateUrl: 'https://reffpa.com/L?tag=d_5729730m_1599c_&site=5729730&ad=1599',
  website: 'bialoczerwoni.live',
  banners: {
    horizontal: { src: buildBannerUrl(62437), width: 800, height: 250 },
    horizontalWide: { src: buildBannerUrl(62367), width: 1920, height: 250 },
    verticalPrimary: { src: buildBannerUrl(62431), width: 100, height: 600 },
    verticalSecondary: { src: buildBannerUrl(62369), width: 100, height: 600 },
  },
} as const

export const betwayConfig = {
  provider: 'Betway',
  spadid: 'spadid229646',
  affiliateS: 'bfp49574',
  banners: {
    leaderboard: { destinationUrl: 'https://betway.es/ppc/ufc-sob/es-es/', mediaId: '104184', width: 728, height: 90 },
    skyscraper: { destinationUrl: 'https://www.spingalaxy.com/en', mediaId: '103752', width: 160, height: 600 },
    strip: { destinationUrl: 'https://www.spincasino.com/ca/', mediaId: '102792', width: 468, height: 60 },
  },
} as const

function buildBetwayClickUrl(destinationUrl: string, mediaId: string) {
  return `${destinationUrl}?s=${betwayConfig.affiliateS}&a=${betwayConfig.spadid}&mid=${mediaId}`
}

function buildBetwayImageUrl(mediaId: string) {
  return `https://account.superpartners.com/Media/Download?mediaItemId=${mediaId}`
}

export function getBannerSlides(variant: BannerVariant): AffiliateBannerSlide[] {
  const oneX = affiliateConfig.banners[variant]
  const betwayKey =
    variant === 'verticalPrimary' || variant === 'verticalSecondary'
      ? 'skyscraper'
      : variant === 'horizontalWide'
        ? 'strip'
        : 'leaderboard'
  const betway = betwayConfig.banners[betwayKey]

  return [
    { kind: 'iframe', provider: affiliateConfig.provider, src: oneX.src, width: oneX.width, height: oneX.height },
    {
      kind: 'image',
      provider: betwayConfig.provider,
      href: buildBetwayClickUrl(betway.destinationUrl, betway.mediaId),
      imageSrc: buildBetwayImageUrl(betway.mediaId),
      width: betway.width,
      height: betway.height,
    },
  ]
}

export function getAffiliateCopy(locale: AffiliateLocale) {
  const isPl = locale === 'pl'

  return {
    label: isPl ? 'Sponsorowane' : 'Sponsored',
    title: isPl ? 'Odkryj oferty piłkarskie 1xBet' : 'Explore football offers with 1xBet',
    shortTitle: isPl ? 'Oferta 1xBet' : '1xBet Offer',
    description: isPl
      ? 'Piłka na żywo, rynki przedmeczowe i wybrane oferty na Mistrzostwa Świata 2026.'
      : 'Live football, pre-match markets, and selected offers for World Cup 2026 coverage.',
    cta: isPl ? 'Zobacz ofertę' : 'View Offer',
    matchTitle: isPl ? 'Rynki 1xBet na ten mecz' : '1xBet markets for this match',
    matchDescription: isPl
      ? 'Sprawdź formę drużyn, aktualizacje na żywo i dostępne rynki przed rozpoczęciem meczu.'
      : 'Check team form, live updates, and available markets before kick-off.',
    offersHeading: isPl ? 'Oferty bukmacherskie' : 'Football Betting Offers',
    offersSubheading: isPl
      ? 'Sponsorowane oferty piłkarskie od 1xBet i Betway dla czytelników Biało-Czerwoni.'
      : 'Sponsored football offers from 1xBet and Betway for Biało-Czerwoni readers.',
    terms: isPl
      ? 'Tylko 18+. Obowiązują regulamin i warunki. Graj odpowiedzialnie.'
      : '18+ only. T&Cs apply. Please gamble responsibly.',
    notice: isPl ? 'Reklama' : 'Advertisement',
    featureLive: isPl ? 'Piłka na żywo' : 'Live football',
    featureWorldCup: isPl ? 'Rynki MŚ' : 'World Cup markets',
    featureMobile: isPl ? 'Przyjazny mobile' : 'Mobile friendly',
  }
}

export function getBetwayCopy(locale: AffiliateLocale) {
  const isPl = locale === 'pl'

  return {
    label: isPl ? 'Sponsorowane' : 'Sponsored',
    title: isPl ? 'Odkryj oferty piłkarskie Betway' : 'Explore football offers with Betway',
    shortTitle: isPl ? 'Oferta Betway' : 'Betway Offer',
    description: isPl
      ? 'Zaufane rynki, szybkie wypłaty i wybrane promocje dla fanów piłki nożnej.'
      : 'Trusted markets, fast payouts, and selected promotions for football fans.',
    cta: isPl ? 'Zobacz ofertę' : 'View Offer',
    matchTitle: isPl ? 'Rynki Betway na ten mecz' : 'Betway markets for this match',
    matchDescription: isPl
      ? 'Sprawdź formę, aktualizacje na żywo i dostępne rynki przed meczem.'
      : 'Review form, live updates, and available markets before kick-off.',
    terms: isPl
      ? 'Tylko 18+. Obowiązują regulamin i warunki. Graj odpowiedzialnie.'
      : '18+ only. T&Cs apply. Please gamble responsibly.',
    featureLive: isPl ? 'Piłka na żywo' : 'Live football',
    featureWorldCup: isPl ? 'Rynki MŚ' : 'World Cup markets',
    featureMobile: isPl ? 'Przyjazny mobile' : 'Mobile friendly',
  }
}

export function getAffiliateOffers(locale: AffiliateLocale) {
  const leaderboard = betwayConfig.banners.leaderboard

  return [
    {
      provider: affiliateConfig.provider,
      affiliateUrl: affiliateConfig.affiliateUrl,
      copy: getAffiliateCopy(locale),
      accentClass: 'bg-red-700 text-white border-red-700',
      badgeClass: 'text-red-500',
    },
    {
      provider: betwayConfig.provider,
      affiliateUrl: buildBetwayClickUrl(leaderboard.destinationUrl, leaderboard.mediaId),
      copy: getBetwayCopy(locale),
      accentClass: 'bg-blue-600 text-white border-blue-600',
      badgeClass: 'text-blue-400',
    },
  ]
}
