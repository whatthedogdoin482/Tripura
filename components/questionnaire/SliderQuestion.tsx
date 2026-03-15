'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { QuestionnaireQuestion } from '@/types';

interface SliderQuestionProps {
  question: QuestionnaireQuestion;
  value: number;
  onChange: (value: number) => void;
}

// App-Farben: Tripura Blau/Lila (#3282B8, #4698cf, #BBE1FA, Lila)
const TRACK_GRADIENT = 'linear-gradient(to right, #3282B8 0%, #4698cf 25%, #6b9bd4 50%, #8b7bc9 75%, #a855f7 100%)';

export function SliderQuestion({ question, value, onChange }: SliderQuestionProps) {
  const min = question.scaleMin ?? 1;
  const max = question.scaleMax ?? 5;
  const step = question.scaleStep ?? 1;
  const labels = question.scaleLabels;
  const sliderValue = Math.min(max, Math.max(min, Math.round(value)));
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(sliderValue);
  const dragValueRef = useRef(sliderValue);
  dragValueRef.current = isDragging ? dragValue : sliderValue;

  const displayValue = isDragging ? dragValue : sliderValue;
  const percentage = ((displayValue - min) / (max - min)) * 100;

  const handleChange = useCallback(
    (v: number) => {
      const clamped = Math.min(max, Math.max(min, v));
      const stepped = step ? Math.round((clamped - min) / step) * step + min : clamped;
      onChange(stepped);
    },
    [min, max, step, onChange]
  );

  const valueFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return min;
      const rect = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const raw = min + pct * (max - min);
      return step ? Math.round((raw - min) / step) * step + min : raw;
    },
    [min, max, step]
  );

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-thumb]')) return;
    handleChange(valueFromClientX(e.clientX));
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: PointerEvent) => {
      const v = valueFromClientX(e.clientX);
      setDragValue(v);
      dragValueRef.current = v;
    };
    const onUp = () => {
      handleChange(dragValueRef.current);
      setIsDragging(false);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [isDragging, valueFromClientX, handleChange]);

  const handleThumbPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setDragValue(sliderValue);
    setIsDragging(true);
  };

  const steps = max - min + 1;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{question.question}</h3>
        {question.description && (
          <p className="text-gray-500">{question.description}</p>
        )}
      </motion.div>

      <div className="w-full px-1">
        {labels && (
          <div className="flex justify-between text-sm font-medium mb-3">
            <span className="text-[#3282B8]">{labels[0]}</span>
            <span className="text-[#7c3aed]">{labels[1]}</span>
          </div>
        )}

        {/* Schiebbare Leiste: sichtbar als Segmente, mit Slider-Thumb */}
        <div
          ref={trackRef}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={displayValue}
          aria-label={question.question}
          tabIndex={0}
          onClick={handleTrackClick}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
              e.preventDefault();
              handleChange(displayValue - (step || 1));
            }
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
              e.preventDefault();
              handleChange(displayValue + (step || 1));
            }
          }}
          className="relative w-full cursor-pointer select-none touch-none rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3282B8] focus-visible:ring-offset-2"
        >
          {/* Track als sichtbare Segmente (App-Farbverlauf) */}
          <div
            className="relative h-14 w-full rounded-2xl overflow-hidden"
            style={{
              background: TRACK_GRADIENT,
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.08)',
            }}
          >
            {/* Segment-Trenner (dezent) */}
            {Array.from({ length: steps - 1 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-px bg-white/30 pointer-events-none"
                style={{ left: `${((i + 1) / steps) * 100}%` }}
              />
            ))}
          </div>

          {/* Füllung bis zum Thumb (optional, etwas dunkler) */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-l-2xl pointer-events-none"
            style={{
              width: `${percentage}%`,
              background: 'linear-gradient(to right, #1B262C 0%, #3282B8 100%)',
              opacity: 0.22,
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          />

          {/* Schiebebar (Thumb) */}
          <motion.div
            data-thumb
            onPointerDown={handleThumbPointerDown}
            className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full cursor-grab active:cursor-grabbing z-10 touch-none flex items-center justify-center"
            style={{
              left: `calc(${percentage}% - 20px)`,
              background: 'linear-gradient(145deg, #ffffff 0%, #BBE1FA 100%)',
              boxShadow: isDragging
                ? '0 4px 20px rgba(50, 130, 184, 0.4), 0 0 0 3px rgba(255,255,255,0.95)'
                : '0 2px 12px rgba(27, 38, 44, 0.2), 0 0 0 3px rgba(255,255,255,0.9)',
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 1.05 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
          >
            <span className="text-xs font-bold text-[#1B262C] tabular-nums">{displayValue}</span>
          </motion.div>
        </div>

        {/* Wert-Anzeige */}
        <motion.div
          className="flex justify-center mt-4"
          key={displayValue}
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <span className="inline-flex items-center justify-center min-w-[3rem] px-5 py-2.5 rounded-xl bg-[#BBE1FA]/30 text-[#1B262C] text-lg font-bold tabular-nums border border-[#3282B8]/30">
            {labels
              ? displayValue === min
                ? labels[0]
                : displayValue === max
                  ? labels[1]
                  : `Stufe ${displayValue}`
              : displayValue}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
