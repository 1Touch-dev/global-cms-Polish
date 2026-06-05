'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center p-8 bg-[var(--color-grau)] rounded-xl border border-(--color-border)">
            <div className="text-[var(--color-aka)] text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-(--color-text-primary) mb-2">
              Ein Fehler ist aufgetreten
            </h3>
            <p className="text-(--color-text-muted) text-sm text-center max-w-md">
              {this.state.error?.message || 'Bitte laden Sie die Seite neu.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 px-4 py-2 bg-[var(--color-aka)] text-(--color-text-primary) rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Erneut versuchen
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
