-- Tabelle für Login/Profil-Daten (verknüpft mit Supabase Auth)
-- Führe diese Migration im Supabase Dashboard (SQL Editor) oder mit Supabase CLI aus.

-- Profil-Tabelle: erweitert auth.users um Anzeigename und Avatar
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text default 'Nutzer',
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Index für Abfragen
create index if not exists profiles_email_idx on public.profiles (email);

-- RLS aktivieren
alter table public.profiles enable row level security;

-- Nutzer dürfen nur ihr eigenes Profil lesen und aktualisieren
create policy "Nutzer können eigenes Profil lesen"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Nutzer können eigenes Profil aktualisieren"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Neue Nutzer können eigenes Profil anlegen"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Trigger: Profil automatisch anlegen bei neuem Auth-User
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'Nutzer'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    display_name = coalesce(excluded.display_name, profiles.display_name),
    avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url),
    updated_at = now();
  return new;
end;
$$;

-- Trigger nur anlegen, wenn er noch nicht existiert (idempotent)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Optional: Kommentar für Dokumentation
comment on table public.profiles is 'Profil- und Login-Daten, verknüpft mit Supabase Auth (auth.users)';
