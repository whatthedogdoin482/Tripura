# Supabase – Login & Profil

## Tabelle `profiles` (Login-Daten) anlegen

1. Im [Supabase Dashboard](https://supabase.com/dashboard) dein Projekt öffnen.
2. **SQL Editor** → **New query**.
3. Inhalt von `migrations/20250316000000_create_profiles.sql` einfügen und ausführen.

Damit wird erstellt:

- **Tabelle `public.profiles`**: `id`, `email`, `display_name`, `avatar_url`, `created_at`, `updated_at`
- Verknüpfung mit `auth.users` (Supabase Auth)
- RLS-Policies (Nutzer sehen/ändern nur eigenes Profil)
- Trigger: Neuer Auth-User bekommt automatisch einen Profil-Eintrag

## Umgebungsvariablen

In `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://dein-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key
```

**Nach dem Anlegen der Tabelle `profiles`** (Migration ausgeführt) zusätzlich setzen, damit Profil-Daten aus der Tabelle gelesen/geschrieben werden (keine 404 mehr):

```
NEXT_PUBLIC_SUPABASE_PROFILES_ENABLED=true
```

Ohne diese Variablen läuft die App mit **Demo-Login** (localStorage). Ohne `PROFILES_ENABLED` werden nur Auth-Daten genutzt, keine Profil-Tabelle.

## Auth-Flow

- **E-Mail**: Magic Link (Supabase `signInWithOtp`) → Nutzer klickt Link und ist eingeloggt.
- **Google / Apple**: OAuth über Supabase (Provider im Dashboard aktivieren).
- Nach dem Login wird das Profil aus `public.profiles` gelesen; Avatar-Updates werden dort gespeichert.
