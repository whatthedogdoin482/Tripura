import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw, Check } from 'lucide-react';
import { SwipeCard } from './SwipeCard';
import type { QuestionnaireOption, QuestionnaireQuestion } from '@/types';

interface SwipeDeckProps {
  question: QuestionnaireQuestion;
  onComplete: (results: { option: QuestionnaireOption; liked: boolean }[]) => void;
}

export function SwipeDeck({ question, onComplete }: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<{ option: QuestionnaireOption; liked: boolean }[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const options = question.options || [];
  const currentOption = options[currentIndex];
  const progress = ((currentIndex + 1) / options.length) * 100;

  const handleSwipe = useCallback((swipeDirection: 'left' | 'right') => {
    if (!currentOption) return;

    const newResult = {
      option: currentOption,
      liked: swipeDirection === 'right',
    };

    setResults((prev) => [...prev, newResult]);

    setTimeout(() => {
      if (currentIndex >= options.length - 1) {
        setIsComplete(true);
        onComplete([...results, newResult]);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 300);
  }, [currentIndex, currentOption, options.length, results, onComplete]);

  const handleGoBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setResults((prev) => prev.slice(0, -1));
    }
  }, [currentIndex]);

  const handleButtonSwipe = useCallback((swipeDirection: 'left' | 'right') => {
    handleSwipe(swipeDirection);
  }, [handleSwipe]);

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center w-full max-w-md mx-auto"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
          <Check className="w-4 h-4" />
          Frage beantwortet
        </div>
        <p className="text-gray-600 text-center mb-4">
          Du hast {results.filter(r => r.liked).length} von {results.length} Optionen ausgewählt. Klicke unten auf „Nächste Frage“.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {results.map((result, idx) => (
            <span
              key={idx}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                result.liked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {result.option.label}
            </span>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Progress bar */}
      <div className="w-full mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Frage {currentIndex + 1} von {options.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{question.question}</h3>
        {question.description && (
          <p className="text-gray-500">{question.description}</p>
        )}
      </motion.div>

      {/* Card stack */}
      <div className="relative w-full aspect-[3/4] mb-6">
        <AnimatePresence mode="popLayout">
          {options.map((option, index) => {
            if (index < currentIndex) return null;
            return (
              <SwipeCard
                key={option.id}
                option={option}
                onSwipe={handleSwipe}
                isActive={index === currentIndex}
                index={index - currentIndex}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleButtonSwipe('left')}
          disabled={currentIndex === 0}
          className="w-14 h-14 rounded-full bg-white border-2 border-red-400 text-red-500 flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoBack}
          disabled={currentIndex === 0}
          className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleButtonSwipe('right')}
          className="w-14 h-14 rounded-full bg-white border-2 border-green-400 text-green-500 flex items-center justify-center shadow-lg hover:bg-green-50 transition-colors"
        >
          <ArrowRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Results summary */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex flex-wrap gap-2 justify-center"
        >
          {results.map((result, idx) => (
            <motion.span
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                result.liked
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {result.option.label}
            </motion.span>
          ))}
        </motion.div>
      )}
    </div>
  );
}
