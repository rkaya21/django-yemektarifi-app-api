import type { ReactNode } from 'react'
import '../App.css'

interface PageShellProps {
  eyebrow: string
  title: string
  description: string
  children?: ReactNode
}

export function PageShell({ eyebrow, title, description, children }: PageShellProps) {
  return (
    <main className="shell">
      <section className="section">
        <div className="section__heading">
          <span className="eyebrow">{eyebrow}</span>
        </div>
        <h1 className="page-title">{title}</h1>
        <p className="lede">{description}</p>
        {children}
      </section>
    </main>
  )
}
