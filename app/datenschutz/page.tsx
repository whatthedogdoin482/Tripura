import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung – Tripura',
};

export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutzerklärung" subtitle="Stand: Juni 2026 – Entwurf für die Entwicklungsphase">
      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlich für die Datenverarbeitung auf dieser Website ist der im{' '}
        <a href="/impressum">Impressum</a> genannte Anbieter.
      </p>

      <h2>2. Welche Daten wir verarbeiten</h2>
      <ul>
        <li>
          <strong>Konto-Daten:</strong> E-Mail-Adresse, Anzeigename, optionales Profilbild,
          Reisestil und Sprache. Passwörter werden ausschließlich als bcrypt-Hash gespeichert.
        </li>
        <li>
          <strong>Login-Daten:</strong> Einmal-Login-Tokens (Magic Link, 15 Minuten gültig) und
          Zeitpunkt der letzten Anmeldung.
        </li>
        <li>
          <strong>Reiseplanung:</strong> Deine Fragebogen-Antworten und gespeicherten Reisepläne,
          um personalisierte Vorschläge zu erstellen.
        </li>
        <li>
          <strong>Zahlungsdaten:</strong> Zahlungen werden über Stripe abgewickelt. Wir speichern
          keine Kreditkartendaten – nur Bestellstatus und Betrag.
        </li>
      </ul>

      <h2>3. Cookies</h2>
      <p>
        Wir verwenden ausschließlich technisch notwendige Cookies: ein Session-Cookie
        (<code>tripura_session</code>) für den Login sowie einen Eintrag zur Speicherung deiner
        Cookie-Entscheidung. Es werden keine Tracking- oder Werbe-Cookies gesetzt.
      </p>

      <h2>4. Drittanbieter</h2>
      <ul>
        <li>
          <strong>Supabase</strong> (Datenbank-Hosting, EU-Region möglich) – Speicherung der oben
          genannten Daten.
        </li>
        <li>
          <strong>Stripe</strong> (Zahlungsabwicklung) – verarbeitet Zahlungsdaten gemäß eigener
          Datenschutzerklärung.
        </li>
        <li>
          <strong>Resend</strong> (E-Mail-Versand) – verarbeitet deine E-Mail-Adresse zum Versand
          von Login-Links und Buchungsbestätigungen.
        </li>
        <li>
          <strong>Google Maps</strong> (Kartenanzeige) – beim Laden der Karte wird deine
          IP-Adresse an Google übertragen.
        </li>
      </ul>

      <h2>5. Rechtsgrundlagen</h2>
      <p>
        Die Verarbeitung erfolgt zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO), auf Grundlage
        deiner Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) oder unseres berechtigten Interesses an
        einem sicheren Betrieb (Art. 6 Abs. 1 lit. f DSGVO).
      </p>

      <h2>6. Deine Rechte</h2>
      <p>
        Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
        Datenübertragbarkeit und Widerspruch sowie das Recht auf Beschwerde bei einer
        Aufsichtsbehörde.
      </p>

      <h2>7. Hinweis zur Entwicklungsphase</h2>
      <p>
        Diese Datenschutzerklärung ist ein Entwurf für die Entwicklungsphase und muss vor dem
        öffentlichen Launch durch eine rechtlich geprüfte Fassung ersetzt werden.
      </p>
    </LegalPage>
  );
}
