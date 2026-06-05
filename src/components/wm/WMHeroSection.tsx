'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Trophy, Users, CalendarDays, MapPin, Timer } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { CountdownTimer } from './CountdownTimer'

export function WMHeroSection() {
  const t = useTranslations('wm')

  const stats = [
    { icon: Users, value: '48', label: t('mannschaften') },
    { icon: CalendarDays, value: '104', label: t('spieleTotal') },
    { icon: MapPin, value: '16', label: t('stadienTotal') },
    { icon: Timer, value: '39', label: t('tageTotal') },
  ]

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[var(--bg)] flex items-center justify-center">
      <div className="absolute inset-0 pitch-stripe-pattern opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--accent)_18%,transparent),transparent_55%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 180 }}
            className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-soft)]"
          >
            <Trophy className="h-8 w-8 text-[var(--accent)]" />
          </motion.div>

          <h1 className="mb-4 font-[var(--font-display)] text-5xl leading-tight tracking-[0.06em] text-[var(--text-main)] uppercase sm:text-7xl lg:text-8xl">
            Mistrzostwa Świata FIFA
            <br />
            <span className="text-[var(--accent)]">2026</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-10 text-xl font-medium tracking-wide text-[var(--text-muted)] sm:text-2xl"
          >
            USA • Kanada • Meksyk
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mb-12 flex justify-center"
        >
          <CountdownTimer />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="mb-10 flex flex-wrap justify-center gap-3 sm:gap-4"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/85 px-4 py-2 shadow-[var(--shadow-soft)] backdrop-blur"
            >
              <stat.icon className="h-4 w-4 text-[var(--accent)]" />
              <span className="font-[var(--font-display)] text-lg text-[var(--text-main)]">{stat.value}</span>
              <span className="text-sm text-[var(--text-muted)]">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95 }}
        >
          <Link href="/wm-2026/spielplan" className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 text-lg">
            <CalendarDays className="h-5 w-5" />
            {t('spielplan_link')}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
