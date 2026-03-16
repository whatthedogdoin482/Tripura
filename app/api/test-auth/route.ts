import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * GET: Prüft Supabase-Verbindung und optional die Tabelle profiles.
 * POST: Sendet einen Magic-Link an die angegebene E-Mail (Body: { "email": "deine@email.de" }).
 */
export async function GET() {
  if (!url || !anonKey) {
    return NextResponse.json({
      ok: false,
      error: 'Supabase nicht konfiguriert',
      hint: 'NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local setzen.',
    }, { status: 503 });
  }

  const supabase = createClient(url, anonKey);

  const { error } = await supabase.from('profiles').select('id').limit(1).maybeSingle();

  if (error) {
    const tableMissing = /schema cache|relation.*does not exist|profiles/i.test(error.message);
    return NextResponse.json({
      ok: true,
      message: 'Supabase erreichbar',
      profilesTable: tableMissing
        ? 'Tabelle fehlt – siehe fixHint unten.'
        : 'Fehler beim Abfragen.',
      errorMessage: error.message,
      fixHint: tableMissing
        ? 'Im Supabase Dashboard: SQL Editor → New query → Inhalt von supabase/create-profiles-table.sql einfügen → Run.'
        : undefined,
    });
  }

  return NextResponse.json({
    ok: true,
    message: 'Supabase erreichbar',
    profilesTable: 'Vorhanden (Migration ausgeführt)',
  });
}

export async function POST(request: Request) {
  if (!url || !anonKey) {
    return NextResponse.json({
      ok: false,
      error: 'Supabase nicht konfiguriert',
    }, { status: 503 });
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Body muss JSON mit "email" sein.' }, { status: 400 });
  }

  const email = body?.email?.trim();
  if (!email) {
    return NextResponse.json({ ok: false, error: 'Feld "email" fehlt oder ist leer.' }, { status: 400 });
  }

  const supabase = createClient(url, anonKey);
  const origin = request.headers.get('origin') || request.headers.get('referer')?.replace(/\/$/, '') || 'http://localhost:3000';

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    return NextResponse.json({
      ok: false,
      error: error.message,
      code: error.code,
    }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: 'Magic-Link wurde an die E-Mail gesendet.',
    email,
    hint: 'Postfach prüfen (evtl. Spam). Link anklicken, dann bist du eingeloggt.',
  });
}
