import { LegalDocument } from "../components/ui/LegalDocument.jsx";
import { terms } from "../constants/legalContent.js";

export default function TermsOfServicePage() {
  return <LegalDocument titleKey="legal.terms" sections={terms} />;
}
