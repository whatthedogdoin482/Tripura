/**
 * Weather recommendation system – nutzt die kostenlose Open-Meteo API
 * (https://open-meteo.com, kein API-Key nötig). Fällt ohne Koordinaten
 * oder bei Netzwerkfehlern auf Mock-Daten zurück.
 */

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'foggy' | 'partly_cloudy'

export type PlaceType = 'sightseeing' | 'restaurant' | 'activity' | 'attraction' | 'outdoor' | 'indoor'

export type RecommendationLevel = 'perfect' | 'good' | 'not_recommended' | 'not_ideal'

export interface WeatherSnapshot {
  tempC: number
  condition: WeatherCondition
  rainProbabilityPercent: number
  windKmh: number
  humidityPercent?: number
}

export interface WeatherRecommendation {
  level: RecommendationLevel
  label: string
  snapshot: WeatherSnapshot
  explanation: string
}

const LABELS: Record<RecommendationLevel, string> = {
  perfect: 'Perfekt für heute',
  good: 'Gut',
  not_recommended: 'Nicht empfohlen',
  not_ideal: 'Wetter nicht ideal',
}

const CONDITION_LABELS: Record<WeatherCondition, string> = {
  sunny: 'Sonnig',
  cloudy: 'Bewölkt',
  rainy: 'Regnerisch',
  snowy: 'Schnee',
  stormy: 'Gewitter',
  foggy: 'Nebel',
  partly_cloudy: 'Teilweise bewölkt',
}

/**
 * WMO Weather Code (Open-Meteo) → vereinfachte Bedingung.
 * https://open-meteo.com/en/docs#weather_variable_documentation
 */
function mapWmoCode(code: number): WeatherCondition {
  if (code === 0) return 'sunny'
  if (code === 1 || code === 2) return 'partly_cloudy'
  if (code === 3) return 'cloudy'
  if (code === 45 || code === 48) return 'foggy'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rainy'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snowy'
  if (code >= 95) return 'stormy'
  return 'cloudy'
}

// Kurzer In-Memory-Cache, um die API nicht bei jedem Render zu treffen
const weatherCache = new Map<string, { snapshot: WeatherSnapshot; fetchedAt: number }>()
const CACHE_TTL_MS = 10 * 60 * 1000

async function fetchOpenMeteo(coords: { lat: number; lng: number }): Promise<WeatherSnapshot | null> {
  const cacheKey = `${coords.lat.toFixed(2)},${coords.lng.toFixed(2)}`
  const cached = weatherCache.get(cacheKey)
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.snapshot
  }

  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude', String(coords.lat))
    url.searchParams.set('longitude', String(coords.lng))
    url.searchParams.set(
      'current',
      'temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m',
    )
    url.searchParams.set('timezone', 'auto')

    const res = await fetch(url.toString())
    if (!res.ok) return null
    const data = await res.json()
    const current = data?.current
    if (!current || typeof current.temperature_2m !== 'number') return null

    const snapshot: WeatherSnapshot = {
      tempC: Math.round(current.temperature_2m),
      condition: mapWmoCode(Number(current.weather_code ?? 3)),
      rainProbabilityPercent: Math.round(current.precipitation_probability ?? 0),
      windKmh: Math.round(current.wind_speed_10m ?? 0),
      humidityPercent: typeof current.relative_humidity_2m === 'number'
        ? Math.round(current.relative_humidity_2m)
        : undefined,
    }
    weatherCache.set(cacheKey, { snapshot, fetchedAt: Date.now() })
    return snapshot
  } catch {
    return null
  }
}

/** Mock-Fallback: variiert mit der Zeit, damit es dynamisch wirkt. */
function mockSnapshot(): WeatherSnapshot {
  const seed = (Date.now() / 60000) % 4
  const scenarios: WeatherSnapshot[] = [
    { tempC: 22, condition: 'sunny', rainProbabilityPercent: 5, windKmh: 8 },
    { tempC: 18, condition: 'partly_cloudy', rainProbabilityPercent: 20, windKmh: 15 },
    { tempC: 32, condition: 'sunny', rainProbabilityPercent: 0, windKmh: 5 },
    { tempC: 12, condition: 'rainy', rainProbabilityPercent: 80, windKmh: 25 },
  ]
  return scenarios[Math.floor(seed) % scenarios.length]
}

/**
 * Wetter holen (Open-Meteo, kostenlos und ohne Key) und Empfehlung berechnen.
 * Ohne Koordinaten oder bei Fehlern wird ein Mock-Snapshot verwendet.
 */
export async function getWeatherRecommendation(
  placeType: PlaceType,
  coords?: { lat: number; lng: number }
): Promise<WeatherRecommendation> {
  let snapshot: WeatherSnapshot | null = null
  if (coords) {
    snapshot = await fetchOpenMeteo(coords)
  }
  return computeRecommendation(placeType, snapshot ?? mockSnapshot())
}

export function computeRecommendation(
  placeType: PlaceType,
  snapshot: WeatherSnapshot
): WeatherRecommendation {
  const { tempC, condition, rainProbabilityPercent, windKmh } = snapshot
  const isOutdoor = placeType !== 'restaurant' && placeType !== 'indoor'
  const isIndoor = placeType === 'indoor' || placeType === 'restaurant'

  let level: RecommendationLevel = 'good'
  let explanation = ''

  if (isOutdoor) {
    if (rainProbabilityPercent > 60 || condition === 'stormy') {
      level = 'not_recommended'
      explanation = `Das ist ein Outdoor-Erlebnis. Bei ${rainProbabilityPercent} % Regenwahrscheinlichkeit und ${CONDITION_LABELS[condition].toLowerCase()} kann es unangenehm oder unsicher sein.`
    } else if (tempC >= 32 && condition === 'sunny') {
      level = 'not_ideal'
      explanation = `Outdoor-Spot. Bei ${tempC}°C und starker Sonne kann es anstrengend werden. Besser morgens oder abends.`
    } else if (tempC <= 5 && (condition === 'rainy' || condition === 'snowy')) {
      level = 'not_recommended'
      explanation = `Kalt (${tempC}°C) und ${CONDITION_LABELS[condition].toLowerCase()} — nicht ideal für Aktivitäten im Freien.`
    } else if (windKmh > 40) {
      level = 'not_ideal'
      explanation = `Starker Wind (${windKmh} km/h). Outdoor-Aktivitäten können weniger schön sein.`
    } else if (tempC >= 18 && tempC <= 26 && rainProbabilityPercent < 20) {
      level = 'perfect'
      explanation = `Gute Bedingungen für draußen: ${tempC}°C, ${CONDITION_LABELS[condition].toLowerCase()}, geringe Regenwahrscheinlichkeit.`
    } else {
      explanation = `Outdoor-Bedingungen: ${tempC}°C, ${CONDITION_LABELS[condition].toLowerCase()}. Mit passender Kleidung meist okay.`
    }
  } else {
    if (condition === 'stormy' && rainProbabilityPercent > 70) {
      level = 'not_ideal'
      explanation = `Starkregen oder Gewitter können die Anfahrt erschweren. Ansonsten sind Innenbesuche angenehm.`
    } else {
      level = tempC >= 18 && tempC <= 28 ? 'perfect' : 'good'
      explanation = `Indoor — das Wetter hat wenig Einfluss. Aktuell: ${tempC}°C, ${CONDITION_LABELS[condition].toLowerCase()}.`
    }
  }

  return {
    level,
    label: LABELS[level],
    snapshot,
    explanation,
  }
}

export function getConditionLabel(c: WeatherCondition): string {
  return CONDITION_LABELS[c]
}
