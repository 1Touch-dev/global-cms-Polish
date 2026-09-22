import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'
import { CMS_API_BASE, parseCmsRedirects, SITE_HOST } from './lib/cmsSeo'

const handleI18n = createMiddleware(routing)

function normalizePath(path: string): string {
  const url = path.startsWith('http') ? new URL(path).pathname : path
  return url.replace(/\/+$/, '') || '/'
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const stale = pathname.match(/^\/(pl|en)\/wiadomosc(?:\/([^/]+))?\/?$/)
  if (stale) {
    const url = request.nextUrl.clone()
    url.pathname = stale[2] ? `/${stale[1]}/news/${stale[2]}` : `/${stale[1]}/news`
    return NextResponse.redirect(url, 301)
  }

  try {
    const res = await fetch(`${CMS_API_BASE}/seo/redirects/${SITE_HOST}?limit=5000`, {
      next: { revalidate: 120 },
    })
    if (res.ok) {
      const redirects = parseCmsRedirects(await res.json())
      const current = normalizePath(pathname)
      const match = redirects.find((item) => {
        const from = normalizePath(item.from)
        return from === current || item.from === pathname
      })
      if (match) {
        const dest = match.to.startsWith('http')
          ? match.to
          : new URL(match.to.startsWith('/') ? match.to : `/${match.to}`, request.nextUrl.origin).toString()
        return NextResponse.redirect(dest, 301)
      }
    }
  } catch {
    /* CMS redirects are best-effort */
  }

  return handleI18n(request)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
