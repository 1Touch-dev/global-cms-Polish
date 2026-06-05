import { getWMVorhersageSpiele } from '@/lib/serverData'
import VorhersagePageClient from './_components/VorhersagePageClient'

export default async function VorhersagePage() {
  const naechsteSpiele = await getWMVorhersageSpiele()
  return <VorhersagePageClient naechsteSpiele={naechsteSpiele} />
}
