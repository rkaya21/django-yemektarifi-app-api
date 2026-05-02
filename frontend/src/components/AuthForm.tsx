import type { FormEventHandler, ReactNode } from 'react'

interface AuthFormProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
  onSubmit: FormEventHandler<HTMLFormElement>
  submitLabel: string
  error?: string | null
  helpText?: ReactNode
}

export default function AuthForm({
  title,
  description,
  children,
  footer,
  onSubmit,
  submitLabel,
  error,
  helpText,
}: AuthFormProps) {
  return (
    <div className="auth-card">
      <div className="auth-card__header">
        <h1 className="page-title">{title}</h1>
        <p className="lede">{description}</p>
      </div>

      <form className="auth-form" onSubmit={onSubmit}>
        {children}

        {error ? <p className="form-error" role="alert">{error}</p> : null}

        <button className="button button--primary auth-submit" type="submit">
          {submitLabel}
        </button>

        {helpText ? <div className="auth-help">{helpText}</div> : null}
      </form>

      {footer ? <div className="auth-footer">{footer}</div> : null}
    </div>
  )
}
