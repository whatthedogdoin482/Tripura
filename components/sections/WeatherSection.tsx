import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  CloudSun, 
  Sun, 
  Cloud, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer,
  Umbrella,
  Check
} from 'lucide-react';
import { mockWeatherForecast, mockActivities } from '@/data/mockData';

const weatherIcons: Record<string, React.ElementType> = {
  'Sonnig': Sun,
  'Leicht bewölkt': CloudSun,
  'Bedeckt': Cloud,
  'Leichter Regen': CloudRain,
  'Aufheiternd': CloudSun,
};

export function WeatherSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [selectedDay, setSelectedDay] = useState(0);

  const selectedForecast = mockWeatherForecast[selectedDay];
  const WeatherIcon = weatherIcons[selectedForecast.condition] || CloudSun;

  return (
    <section ref={sectionRef} className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/80 to-white">
      <div className="max-w-4xl mx-auto">
        {/* Kompakter Wetter-Block – nicht im Vordergrund */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-medium mb-2">
            Aktuelles Wetter
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Wetter für deine Aktivitäten
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Kurzüberblick – die KI plant deine Tagesaktivitäten passend zum Wetter.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Weather forecast – kompakter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6"
          >
            {/* Day selector */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
              {mockWeatherForecast.map((forecast, index) => {
                const DayIcon = weatherIcons[forecast.condition] || CloudSun;
                const date = new Date(forecast.date);
                const dayName = date.toLocaleDateString('de-DE', { weekday: 'short' });
                const dayNum = date.getDate();

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDay(index)}
                    className={`flex-shrink-0 p-4 rounded-2xl transition-all ${
                      selectedDay === index
                        ? 'bg-gradient-to-br from-blue-500 to-sky-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">{dayName}</div>
                    <div className="text-2xl font-bold mb-2">{dayNum}</div>
                    <DayIcon className={`w-6 h-6 mx-auto ${selectedDay === index ? 'text-white' : 'text-gray-500'}`} />
                  </motion.button>
                );
              })}
            </div>

            {/* Selected day details */}
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
                    <WeatherIcon className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-gray-900">
                      {selectedForecast.temperature.max}°
                    </div>
                    <div className="text-gray-500">
                      Gefühlt wie {selectedForecast.temperature.feelsLike}°
                    </div>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  {selectedForecast.condition}
                </h4>
                <p className="text-gray-600 mb-6">
                  {selectedForecast.precipitation > 50
                    ? 'Nimm einen Regenschirm mit! Die KI hat Indoor-Aktivitäten für dich geplant.'
                    : selectedForecast.precipitation > 20
                    ? 'Kleine Regenwahrscheinlichkeit. Flexible Planung empfohlen.'
                    : 'Perfektes Wetter für Outdoor-Aktivitäten!'}
                </p>
              </div>

              {/* Weather details grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50">
                  <Droplets className="w-5 h-5 text-blue-500 mb-2" />
                  <div className="text-sm text-gray-500">Niederschlag</div>
                  <div className="text-xl font-semibold text-gray-900">
                    {selectedForecast.precipitation}%
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50">
                  <Wind className="w-5 h-5 text-gray-500 mb-2" />
                  <div className="text-sm text-gray-500">Wind</div>
                  <div className="text-xl font-semibold text-gray-900">
                    {selectedForecast.windSpeed} km/h
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50">
                  <Thermometer className="w-5 h-5 text-red-500 mb-2" />
                  <div className="text-sm text-gray-500">Luftfeuchtigkeit</div>
                  <div className="text-xl font-semibold text-gray-900">
                    {selectedForecast.humidity}%
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50">
                  <Sun className="w-5 h-5 text-yellow-500 mb-2" />
                  <div className="text-sm text-gray-500">UV-Index</div>
                  <div className="text-xl font-semibold text-gray-900">
                    {selectedForecast.uvIndex}/10
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Empfohlene Aktivitäten
            </h3>

            <div className="space-y-4">
              {mockActivities.slice(0, 3).map((activity, index) => {
                const isWeatherSuitable = activity.weatherRating.score >= 7;
                
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-4 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={activity.images[0]}
                        alt={activity.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {activity.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`flex items-center gap-1 text-xs ${
                            isWeatherSuitable ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {isWeatherSuitable ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Umbrella className="w-3 h-3" />
                            )}
                            {activity.weatherRating.recommendation}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                          <span>{activity.duration} Min</span>
                          <span>•</span>
                          <span>{activity.price}€</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Weather-based tip */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 text-white">
              <div className="flex items-center gap-2 mb-2">
                <CloudSun className="w-5 h-5" />
                <span className="font-semibold">KI-Tipp</span>
              </div>
              <p className="text-sm text-white/90">
                {selectedForecast.precipitation > 30
                  ? 'Buche das Louvre für den Nachmittag - perfekt bei diesem Wetter!'
                  : 'Perfektes Wetter für eine Bootstour auf der Seine!'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
