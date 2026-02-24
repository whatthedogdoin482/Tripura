/**
 * Weather recommendation system – structured for future API integration.
 * Replace getWeatherRecommendation() body with real API call (e.g. OpenWeatherMap).
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
 * Fetch weather and compute recommendation for a place.
 * In production: call weather API with lat/lng (and optionally placeType for context).
 */
export async function getWeatherRecommendation(
  _placeType: PlaceType,
  _coords?: { lat: number; lng: number }
): Promise<WeatherRecommendation> {
  // TODO: replace with real API, e.g.:
  // const data = await fetch(`/api/weather?lat=${coords?.lat}&lng=${coords?.lng}`).then(r => r.json())
  // return computeRecommendation(placeType, data)

  // Mock: vary by time so it feels dynamic
  const seed = (Date.now() / 60000) % 4
  const scenarios: WeatherSnapshot[] = [
    { tempC: 22, condition: 'sunny', rainProbabilityPercent: 5, windKmh: 8 },
    { tempC: 18, condition: 'partly_cloudy', rainProbabilityPercent: 20, windKmh: 15 },
    { tempC: 32, condition: 'sunny', rainProbabilityPercent: 0, windKmh: 5 },
    { tempC: 12, condition: 'rainy', rainProbabilityPercent: 80, windKmh: 25 },
  ]
  const snapshot = scenarios[Math.floor(seed) % scenarios.length]
  return computeRecommendation(_placeType, snapshot)
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
