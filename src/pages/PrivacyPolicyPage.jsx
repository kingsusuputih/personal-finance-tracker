import { LegalDocument } from '../components/ui/LegalDocument.jsx'
import { privacy } from '../constants/legalContent.js'

export default function PrivacyPolicyPage() {
  return <LegalDocument titleKey="legal.privacy" sections={privacy} />
}