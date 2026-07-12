import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Bebas_Neue, Inter } from 'next/font/google'
import Script from 'next/script'
import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { StoreProvider } from '@/store/provider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { LiveScoreTicker } from '@/components/layout/LiveScoreTicker'
import { TopLoadingBar } from '@/components/ui/TopLoadingBar'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { AppShell } from '@/components/layout/AppShell'
import { SITE_URL } from '@/lib/metadata'
import { OrganizationSchema } from '@/components/schema/OrganizationSchema'
import '../globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Biało-Czerwoni | Matchday Arena',
    template: '%s | Biało-Czerwoni',
  },
  description: 'Polski portal piłkarski z wynikami na żywo, terminarzem Mistrzostw Świata 2026 i statystykami.',
  keywords: ['Mistrzostwa Świata 2026', 'piłka nożna', 'wyniki na żywo', 'MS 2026', 'World Cup 2026'],
  authors: [{ name: 'Biało-Czerwoni' }],
  creator: 'Biało-Czerwoni',
  publisher: 'Biało-Czerwoni',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { 'msvalidate.01': [process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION] }
      : undefined,
  },
}

const displayFont = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-display',
  weight: '400',
  display: 'swap',
})

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const themeBootstrap = `(function(){try{var key='global-cms-theme';var stored=localStorage.getItem(key);var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var theme=stored||(prefersDark?'dark':'light');var root=document.documentElement;root.classList.toggle('dark',theme==='dark');root.dataset.theme=theme;root.style.colorScheme=theme;}catch(e){}})();`

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'pl' | 'en')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${displayFont.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#0b6623" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Biało-Czerwoni — Aktualności"
          href={`${process.env.NEXT_PUBLIC_CMS_API_URL || 'https://api.golazopro.com/api'}/seo/rss/bialoczerwoni.live`}
        />
        <OrganizationSchema />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YVFJ334HLP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YVFJ334HLP');
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text-main)] antialiased" style={{ fontFamily: 'var(--font-body)' }} suppressHydrationWarning>
        <Script id="theme-bootstrap" strategy="beforeInteractive">{themeBootstrap}</Script>
        <StoreProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider>
              <AppShell>
                <TopLoadingBar />
                <LiveScoreTicker />
                <Navbar />
                <main className="flex-1 relative z-10">
                  {children}
                </main>
                <Footer />
                <ScrollToTop />
              </AppShell>
            </ThemeProvider>
          </NextIntlClientProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
