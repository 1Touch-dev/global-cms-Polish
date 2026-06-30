import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Script from 'next/script'
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
      suppressHydrationWarning
    >
      <head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />
        <meta name="theme-color" content="#0b6623" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
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
