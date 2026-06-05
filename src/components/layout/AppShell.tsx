import { ReactNode } from 'react'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="matchday-shell absolute inset-0 pointer-events-none" />
      <div className="matchday-glow absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  )
}
