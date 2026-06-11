'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, Loader2, LogIn, Pencil, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const TRAVEL_STYLES: { value: string; label: string; emoji: string }[] = [
  { value: 'adventure', label: 'Abenteuer', emoji: '🏔️' },
  { value: 'relaxation', label: 'Entspannung', emoji: '🏖️' },
  { value: 'cultural', label: 'Kultur', emoji: '🏛️' },
  { value: 'foodie', label: 'Kulinarik', emoji: '🍜' },
  { value: 'nature', label: 'Natur', emoji: '🌿' },
  { value: 'urban', label: 'Städtetrips', emoji: '🌆' },
];

const LANGUAGES: { value: string; label: string }[] = [
  { value: 'de', label: 'Deutsch' },
  { value: 'en', label: 'English' },
];

interface ProfileSectionProps {
  onOpenAuth?: () => void;
}

export function ProfileSection({ onOpenAuth }: ProfileSectionProps) {
  const { isLoggedIn, isLoading, user, updateProfile, setProfileImage } = useAuth();

  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [travelStyle, setTravelStyle] = useState<string | null>(null);
  const [language, setLanguage] = useState('de');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName ?? '');
      setTravelStyle(user.travelStyle ?? null);
      setLanguage(user.language ?? 'de');
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const { error: err } = await updateProfile({
      displayName: displayName.trim(),
      travelStyle,
      language,
    });
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    if (user) {
      setDisplayName(user.displayName ?? '');
      setTravelStyle(user.travelStyle ?? null);
      setLanguage(user.language ?? 'de');
    }
    setError(null);
    setEditing(false);
  };

  const handleAvatarFile = (file: File) => {
    if (file.size > 350_000) {
      setError('Bild ist zu groß – bitte max. ~350 KB wählen.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : null;
      if (dataUrl) void setProfileImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-10 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center">
            <LogIn className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Du bist nicht angemeldet</h2>
          <p className="text-gray-500 mb-8">
            Melde dich an, um dein Profil zu bearbeiten und deine Reisen zu speichern.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenAuth}
            className="px-8 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg"
          >
            Jetzt anmelden
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const initials =
    (user.displayName ?? '?')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';

  const activeStyle = TRAVEL_STYLES.find((s) => s.value === (user.travelStyle ?? travelStyle));

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold heading-purple-gradient mb-8">Dein Profil</h1>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-8"
      >
        {/* Kopf: Avatar + Name */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          <div className="relative group">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="Profil"
                className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                {initials}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Profilbild ändern"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAvatarFile(file);
                e.target.value = '';
              }}
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            {editing ? (
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={80}
                className="w-full sm:max-w-sm px-4 py-2.5 rounded-2xl border border-gray-200 bg-white/80 text-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Dein Name"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">{user.displayName}</h2>
            )}
            <p className="text-gray-500 mt-1">{user.email}</p>
            {!editing && activeStyle && (
              <span className="inline-flex items-center gap-1.5 mt-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 text-sm font-medium text-blue-700">
                {activeStyle.emoji} {activeStyle.label}
              </span>
            )}
          </div>

          {!editing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 border border-gray-200 text-sm font-semibold text-gray-700 shadow-sm hover:border-blue-300"
            >
              <Pencil className="w-4 h-4" /> Bearbeiten
            </motion.button>
          )}
        </div>

        {/* Bearbeitungsbereich */}
        <AnimatePresence initial={false}>
          {editing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-100 pt-6 mb-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Dein Reisestil
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TRAVEL_STYLES.map((style) => {
                      const active = travelStyle === style.value;
                      return (
                        <button
                          key={style.value}
                          type="button"
                          onClick={() => setTravelStyle(active ? null : style.value)}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                            active
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-md'
                              : 'bg-white/80 text-gray-700 border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          {style.emoji} {style.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Sprache</label>
                  <div className="flex gap-2">
                    {LANGUAGES.map((lang) => {
                      const active = language === lang.value;
                      return (
                        <button
                          key={lang.value}
                          type="button"
                          onClick={() => setLanguage(lang.value)}
                          className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
                            active
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-md'
                              : 'bg-white/80 text-gray-700 border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          {lang.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                    {error}
                  </p>
                )}

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSave}
                    disabled={saving || displayName.trim().length === 0}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-semibold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Speichern
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/80 border border-gray-200 font-semibold text-gray-700"
                  >
                    <X className="w-4 h-4" /> Abbrechen
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {saved && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 text-sm text-green-700 bg-green-50 border border-green-100 rounded-2xl px-4 py-3"
            >
              Profil gespeichert.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Statistiken (Mock, bis echte Trips existieren) */}
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { value: '12', label: 'Geplante Trips', classes: 'bg-blue-50 text-blue-600', sub: 'text-blue-700' },
            { value: '8', label: 'Länder besucht', classes: 'bg-green-50 text-green-600', sub: 'text-green-700' },
            { value: '4.9', label: 'Durchschn. Bewertung', classes: 'bg-purple-50 text-purple-600', sub: 'text-purple-700' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ scale: 1.03 }}
              className={`p-6 rounded-2xl text-center ${stat.classes.split(' ')[0]}`}
            >
              <div className={`text-3xl font-bold mb-1 ${stat.classes.split(' ')[1]}`}>{stat.value}</div>
              <div className={`text-sm ${stat.sub}`}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
