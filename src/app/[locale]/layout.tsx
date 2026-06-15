import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Bebas_Neue, Inter } from 'next/font/google'
import { routing } from '@/i18n/routing'
import { StoreProvider } from '@/store/provider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { LiveScoreTicker } from '@/components/layout/LiveScoreTicker'
import { TopLoadingBar } from '@/components/ui/TopLoadingBar'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { AppShell } from '@/components/layout/AppShell'
import { getPageMetadata } from '@/lib/metadata'
import '../globals.css'

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
  const metadata = getPageMetadata('home', locale)

  return (
    <html
      lang={locale}
      className={`${displayFont.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />
        <meta name="theme-color" content="#0b6623" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text-main)] antialiased" style={{ fontFamily: 'var(--font-body)' }} suppressHydrationWarning>
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
