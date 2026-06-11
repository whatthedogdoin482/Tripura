import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'AGB – Tripura',
};

export default function AgbPage() {
  return (
    <LegalPage
      title="Allgemeine Geschäftsbedingungen"
      subtitle="Stand: Juni 2026 – Entwurf für die Entwicklungsphase"
    >
      <h2>§ 1 Geltungsbereich</h2>
      <p>
        Diese AGB gelten für die Nutzung der Tripura-Plattform zur KI-gestützten Reiseplanung
        sowie für alle darüber vermittelten Buchungen.
      </p>

      <h2>§ 2 Leistungen</h2>
      <p>
        Tripura erstellt personalisierte Reisevorschläge und vermittelt Angebote Dritter (Flüge,
        Mietwagen, eSIMs, Transfers, Versicherungen). Während der Entwicklungsphase handelt es
        sich um Testdaten; Zahlungen laufen ausschließlich im Stripe-Test-Modus und führen zu
        keiner echten Buchung.
      </p>

      <h2>§ 3 Vertragsschluss</h2>
      <p>
        Ein Vertrag über eine Reiseleistung kommt erst mit ausdrücklicher Buchungsbestätigung
        zustande. Die Darstellung von Angeboten in der App stellt kein bindendes Angebot dar.
      </p>

      <h2>§ 4 Preise und Zahlung</h2>
      <p>
        Alle Preise verstehen sich in Euro inklusive der gesetzlichen Mehrwertsteuer. Die
        Zahlungsabwicklung erfolgt über den Zahlungsdienstleister Stripe.
      </p>

      <h2>§ 5 Widerruf und Stornierung</h2>
      <p>
        Für vermittelte Reiseleistungen gelten die Stornierungsbedingungen des jeweiligen
        Anbieters. Gesetzliche Widerrufsrechte bleiben unberührt.
      </p>

      <h2>§ 6 Haftung</h2>
      <p>
        Tripura haftet nur für Vorsatz und grobe Fahrlässigkeit sowie bei Verletzung
        wesentlicher Vertragspflichten. Für die Durchführung vermittelter Leistungen haftet der
        jeweilige Anbieter.
      </p>

      <h2>§ 7 Schlussbestimmungen</h2>
      <p>
        Es gilt das Recht der Bundesrepublik Deutschland. Sollten einzelne Bestimmungen unwirksam
        sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
      </p>

      <h2>Hinweis</h2>
      <p>
        Diese AGB sind ein Entwurf für die Entwicklungsphase und müssen vor dem öffentlichen
        Launch rechtlich geprüft werden.
      </p>
    </LegalPage>
  );
}
