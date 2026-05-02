import { PageShell } from '../components/PageShell'

export default function NotFoundPage() {
  return (
    <PageShell
      eyebrow="404"
      title="Sayfa bulunamadı"
      description="Aradığın rota mevcut değil."
    />
  )
}
