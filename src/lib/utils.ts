import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDatum(datum: string, locale: string = 'pl'): string {
  return new Date(datum).toLocaleDateString(locale === 'en' ? 'en-US' : 'pl-PL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function formatUhrzeit(uhrzeit: string): string {
  return uhrzeit
}

export function tordifferenzFormat(td: number): string {
  if (td > 0) return `+${td}`
  return td.toString()
}
