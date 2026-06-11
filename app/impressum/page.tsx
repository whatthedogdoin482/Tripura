import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Impressum – Tripura',
};

export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum" subtitle="Angaben gemäß § 5 TMG / DDG">
      <h2>Anbieter</h2>
      <p>
        Tripura (in Gründung)
        <br />
        Musterstraße 1
        <br />
        79098 Freiburg im Breisgau
        <br />
        Deutschland
      </p>

      <h2>Kontakt</h2>
      <p>
        E-Mail: kontakt@tripura.example
        <br />
        (Platzhalter – vor Veröffentlichung durch echte Kontaktdaten ersetzen)
      </p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>
        [Vor- und Nachname]
        <br />
        Musterstraße 1, 79098 Freiburg im Breisgau
      </p>

      <h2>Haftungsausschluss</h2>
      <p>
        Die Inhalte dieser Seite wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
        Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
        Diese Anwendung befindet sich in der Entwicklung; Preise und Angebote sind Testdaten.
      </p>

      <h2>Hinweis</h2>
      <p>
        Dieses Impressum ist ein Platzhalter für die Entwicklungsphase. Vor dem öffentlichen
        Launch müssen die Angaben durch die echten Unternehmensdaten ersetzt und rechtlich
        geprüft werden.
      </p>
    </LegalPage>
  );
}
