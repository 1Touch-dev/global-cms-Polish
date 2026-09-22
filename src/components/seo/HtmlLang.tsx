'use client'

import { useEffect } from 'react'

export function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    if (!lang) return
    document.documentElement.lang = lang
  }, [lang])
  return null
}
