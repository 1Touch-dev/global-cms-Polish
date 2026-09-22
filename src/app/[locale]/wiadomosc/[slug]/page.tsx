import { permanentRedirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export default async function WiadomoscRedirect({ params }: Props) {
  const { locale, slug } = await params
  permanentRedirect(`/${locale}/news/${slug}`)
}
