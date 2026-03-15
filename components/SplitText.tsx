'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

type SplitType = 'chars' | 'words';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: SplitType;
  from?: { opacity?: number; y?: number; x?: number };
  to?: { opacity?: number; y?: number; x?: number };
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  onLetterAnimationComplete?: () => void;
  showCallback?: boolean;
}

const easeMap: Record<string, number[]> = {
  power3: [0.33, 1, 0.68, 1],
  'power3.out': [0.33, 1, 0.68, 1],
  'power3-out': [0.33, 1, 0.68, 1],
  power2: [0.33, 1, 0.68, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
};

export default function SplitText({
  text,
  className = '',
  delay = 50,
  duration = 1,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  onLetterAnimationComplete,
  showCallback = false,
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);
  const isInView = useInView(ref, { amount: threshold, margin: rootMargin, once: false });

  useEffect(() => setMounted(true), []);

  const effectiveInView = mounted ? isInView : false;

  const items = splitType === 'chars' ? text.split('') : text.split(/\s+/);
  const easeArr = easeMap[ease] || easeMap['power3-out'];

  return (
    <span
      ref={ref}
      className={`inline-flex flex-wrap ${className}`}
      style={{
        justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
      }}
    >
      {items.map((item, i) => {
        const isSpace = splitType === 'chars' && item === ' ';
        if (isSpace) {
          return <span key={i} className="inline-block w-[0.28em] min-w-[0.28em]" aria-hidden />;
        }
        return (
          <motion.span
            key={i}
            initial={{ ...from }}
            animate={effectiveInView ? { ...to } : { ...from }}
            transition={{
              duration,
              delay: i * (delay / 1000),
              ease: easeArr,
            }}
            className={splitType === 'words' ? 'inline-block mr-[0.35em]' : 'inline-block'}
            onAnimationComplete={showCallback && i === items.length - 1 ? onLetterAnimationComplete : undefined}
          >
            {item}
          </motion.span>
        );
      })}
    </span>
  );
}
