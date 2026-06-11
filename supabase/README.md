# Supabase – Schema & Setup

Die App nutzt **Custom-Auth (JWT-Cookie `tripura_session`)** – kein Supabase Auth.
Supabase dient nur als PostgreSQL-Datenbank; der Server greift mit dem
**Service-Role-Key** zu (`SUPABASE_SERVICE_ROLE_KEY` in `.env.local`).

## Schema anlegen / aktualisieren

1. Im [Supabase Dashboard](https://supabase.com/dashboard) dein Projekt öffnen.
2. **SQL Editor** → **New query**.
3. Inhalt von `migrations/20260611000000_core_schema.sql` einfügen und ausführen.
   Die Migration ist idempotent – mehrfaches Ausführen ist unschädlich.

## Tabellen

| Tabelle | Zweck |
|---|---|
| `users` | Konto + Profil (E-Mail, Passwort-Hash, Anzeigename, Avatar, Reisestil, Sprache) |
| `login_tokens` | Einmal-Tokens für Magic-Link-Login (15 Min gültig) |
| `trips` | Gespeicherte Reisepläne pro Nutzer |
| `trip_surveys` | Fragebogen-Antworten (Personalisierung) als JSON |
| `orders` | Stripe-Bestellungen (eine Rechnung pro Reise) |
| `credit_cards` | Kreditkarten-Empfehlungsdatenbank (öffentlich lesbar, geseedet) |

## RLS

RLS ist auf allen Tabellen aktiviert. Da der Server den Service-Role-Key nutzt
(umgeht RLS), dient RLS als Sicherheitsnetz: anon-Clients haben keinen Zugriff
auf Nutzerdaten. Nur `credit_cards` ist öffentlich lesbar.

## Umgebungsvariablen

```
NEXT_PUBLIC_SUPABASE_URL=https://dein-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key
SUPABASE_SERVICE_ROLE_KEY=dein-service-role-key   # nur Server, niemals committen
AUTH_JWT_SECRET=langer-zufalls-string
```

## Empfehlung: Backups

Im Dashboard unter **Database → Backups** sind tägliche Backups im Free-Tier
automatisch aktiv – kurz prüfen, dass sie laufen.
