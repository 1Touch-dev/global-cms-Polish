import { ChevronDown } from 'lucide-react'

export interface FaqItem {
  question: string
  answer: string
}

interface FaqSchemaProps {
  items: FaqItem[]
  /** Optional heading text — rendered visibly above the accordion */
  heading?: string
}

/**
 * Renders a visible FAQ accordion AND injects FAQPage JSON-LD.
 * Google requires the Q&A content to be visible in the DOM, not schema-only.
 */
export function FaqSchema({ items, heading }: FaqSchemaProps) {
  if (!items.length) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="mx-auto max-w-4xl px-4 py-10">
        {heading && (
          <h2 className="mb-6 text-2xl font-bold text-[var(--text-main)]">{heading}</h2>
        )}
        <div className="space-y-3">
          {items.map(({ question, answer }, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] open:border-[var(--accent)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-[var(--text-main)] marker:hidden">
                {question}
                <ChevronDown className="h-4 w-4 shrink-0 text-[var(--accent)] transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-4 text-sm leading-relaxed text-[var(--text-muted)]">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
