import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Plus, 
  Minus,
  Hotel,
  Utensils,
  Ticket,
  Bus,
  ShoppingBag,
  MoreHorizontal,
  Sparkles
} from 'lucide-react';
import { mockTrip } from '@/data/mockData';

const iconMap: Record<string, React.ElementType> = {
  Hotel,
  Utensils,
  Ticket,
  Bus,
  ShoppingBag,
};

const defaultBudget = {
  ...mockTrip.budget,
  total: 0,
  remaining: 0,
  categories: mockTrip.budget.categories.map(c => ({ ...c, allocated: 0 })),
};

/** Empfohlene Verteilung in % (Unterkunft, Essen, Aktivitäten, Transport, Shopping) */
const RECOMMENDED_PERCENT: Record<string, number> = {
  '1': 33.33,  // Unterkunft
  '2': 26.67,  // Essen
  '3': 20,     // Aktivitäten
  '4': 13.33,  // Transport
  '5': 6.67,   // Shopping
};

interface BudgetSectionProps {
  /** Kompakter Modus innerhalb des Planungs-Flows (Ort → Budget → Fragebogen) */
  embedded?: boolean;
}

export function BudgetSection({ embedded = false }: BudgetSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [budget, setBudget] = useState(defaultBudget);
  const [budgetName, setBudgetName] = useState('Mein Trip');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [totalInput, setTotalInput] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const totalAllocated = budget.categories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalNum = budget.total;
  const remaining = totalNum - totalAllocated;

  const applyTotal = () => {
    const n = parseInt(totalInput.replace(/\D/g, ''), 10) || 0;
    setBudget(prev => ({ ...prev, total: n, remaining: n - totalAllocated }));
  };

  const handleAdjustBudget = (categoryId: string, delta: number) => {
    setBudget(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, allocated: Math.max(0, cat.allocated + delta) }
          : cat
      ),
    }));
  };

  const handleApplyCategoryAmount = (categoryId: string, value: number) => {
    setBudget(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === categoryId ? { ...cat, allocated: Math.max(0, value) } : cat
      ),
    }));
    setEditingCategoryId(null);
    setEditingValue('');
  };

  const handleApplyRecommended = () => {
    const total = totalNum || 0;
    if (total <= 0) return;
    setBudget(prev => ({
      ...prev,
      categories: prev.categories.map(cat => {
        const pct = RECOMMENDED_PERCENT[cat.id] ?? 0;
        return { ...cat, allocated: Math.round((total * pct) / 100) };
      }),
    }));
  };

  const content = (
    <div className={embedded ? 'max-w-5xl mx-auto' : 'max-w-6xl mx-auto'}>
      {!embedded && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
            Budget-Planung
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Behalte dein Budget
            <span className="gradient-text"> im Griff</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unsere KI hilft dir, dein Budget intelligent zu verteilen und Spartipps zu geben.
          </p>
        </motion.div>
      )}
      {embedded && (
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-gray-900">Dein Budget</h3>
          <p className="text-gray-600 mt-1">Lege dein Gesamtbudget fest und verteile es auf die Kategorien.</p>
        </div>
      )}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Budget overview card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Gesamtbudget</h3>
                <input
                  type="text"
                  value={budgetName}
                  onChange={(e) => setBudgetName(e.target.value)}
                  placeholder="Name des Trips"
                  className="text-gray-500 border-0 border-b border-gray-200 bg-transparent pb-1 focus:outline-none focus:border-green-500 mt-1"
                />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Wallet className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-5xl font-bold text-gray-900">
                  {totalNum > 0 ? totalNum.toLocaleString('de-DE') : '–'}
                </span>
                <span className="text-2xl text-gray-500">{budget.currency}</span>
                {totalNum === 0 && (
                  <span className="text-sm text-gray-500">Noch nicht festgelegt</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <input
                  type="text"
                  inputMode="numeric"
                  value={totalInput}
                  onChange={(e) => setTotalInput(e.target.value)}
                  placeholder="Gesamtbudget eingeben (z. B. 2000)"
                  className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors"
                />
                <button
                  type="button"
                  onClick={applyTotal}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-800 border border-gray-200 font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                >
                  Übernehmen
                </button>
              </div>
              {totalNum > 0 && (
                <>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${totalNum ? (totalAllocated / totalNum) * 100 : 0}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {totalAllocated.toLocaleString('de-DE')} {budget.currency} zugewiesen
                    </span>
                    <span className="text-gray-500">
                      {remaining.toLocaleString('de-DE')} {budget.currency} verfügbar
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-medium">Tägliches Budget</span>
                </div>
                <span className="text-2xl font-bold text-gray-800">
                  {totalNum > 0 ? `${Math.round(totalNum / 5).toLocaleString('de-DE')} €` : '–'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">KI-Ersparnis</span>
                </div>
                <span className="text-2xl font-bold text-gray-800">~15%</span>
              </div>
            </div>
          </motion.div>

          {/* Category breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Budget-Verteilung</h3>
            <p className="text-sm text-gray-500 mb-4">
              Klicke auf den Betrag, um ihn direkt einzugeben – oder nutze +/-.
            </p>
            <motion.button
              type="button"
              onClick={handleApplyRecommended}
              disabled={!totalNum || totalNum <= 0}
              className="w-full mb-6 py-3 px-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Nach Empfehlung berechnen
            </motion.button>
            <div className="space-y-4">
              {budget.categories.map((category, index) => {
                const Icon = iconMap[category.icon] || MoreHorizontal;
                const percentage = totalNum > 0 ? (category.allocated / totalNum) * 100 : 0;
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`p-4 rounded-2xl transition-colors ${
                      selectedCategory === category.id ? 'bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: category.color }} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{category.name}</span>
                          {editingCategoryId === category.id ? (
                            <input
                              type="text"
                              inputMode="numeric"
                              autoFocus
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value.replace(/\D/g, ''))}
                              onBlur={() => {
                                const n = parseInt(editingValue.replace(/\D/g, ''), 10) || 0;
                                handleApplyCategoryAmount(category.id, n);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const n = parseInt(editingValue.replace(/\D/g, ''), 10) || 0;
                                  handleApplyCategoryAmount(category.id, n);
                                }
                                if (e.key === 'Escape') {
                                  setEditingCategoryId(null);
                                  setEditingValue('');
                                }
                              }}
                              className="w-24 px-2 py-1 rounded-lg border-2 border-green-400 text-right font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300"
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCategoryId(category.id);
                                setEditingValue(String(category.allocated));
                              }}
                              className="font-semibold text-gray-900 hover:text-green-600 hover:underline focus:outline-none focus:ring-2 focus:ring-green-300 rounded px-1 -mx-1"
                            >
                              {category.allocated.toLocaleString('de-DE')} {budget.currency}
                            </button>
                          )}
                        </div>
                        
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                        </div>
                      </div>
                      
                      {/* Adjust buttons */}
                      <div className="flex items-center gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdjustBudget(category.id, -10);
                          }}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdjustBudget(category.id, 10);
                          }}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* AI Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">KI-Budget-Tipp</h4>
              <p className="text-white/90">
                Basierend auf deinen Präferenzen empfehlen wir, 20% mehr für Restaurants zu budgetieren 
                und dafür bei Aktivitäten zu sparen. Paris hat eine hervorragende kulinarische Szene!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
  );

  if (embedded) {
    return (
      <div ref={sectionRef} className="relative">
        {content}
      </div>
    );
  }
  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      {content}
    </section>
  );
}
