import { useState, useCallback, useRef } from 'react';
import type { PanInfo } from 'framer-motion';

interface SwipeState {
  direction: 'left' | 'right' | null;
  isDragging: boolean;
}

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeComplete?: (direction: 'left' | 'right') => void;
  threshold?: number;
}

export function useSwipe(options: UseSwipeOptions = {}) {
  const { onSwipeLeft, onSwipeRight, onSwipeComplete, threshold = 100 } = options;
  const [swipeState, setSwipeState] = useState<SwipeState>({
    direction: null,
    isDragging: false,
  });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback(() => {
    setSwipeState((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const handleDrag = useCallback(
    (_: unknown, info: PanInfo) => {
      const xOffset = info.offset.x;
      if (xOffset > 50) {
        setSwipeState({ direction: 'right', isDragging: true });
      } else if (xOffset < -50) {
        setSwipeState({ direction: 'left', isDragging: true });
      } else {
        setSwipeState({ direction: null, isDragging: true });
      }
    },
    []
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const xOffset = info.offset.x;
      const velocity = info.velocity.x;

      setSwipeState({ direction: null, isDragging: false });

      if (xOffset > threshold || velocity > 500) {
        onSwipeRight?.();
        onSwipeComplete?.('right');
      } else if (xOffset < -threshold || velocity < -500) {
        onSwipeLeft?.();
        onSwipeComplete?.('left');
      }
    },
    [threshold, onSwipeLeft, onSwipeRight, onSwipeComplete]
  );

  const getSwipeStyles = useCallback(() => {
    if (!swipeState.isDragging || !swipeState.direction) return {};
    
    return {
      scale: 1.02,
      rotate: swipeState.direction === 'right' ? 5 : -5,
    };
  }, [swipeState]);

  return {
    swipeState,
    cardRef,
    handlers: {
      onDragStart: handleDragStart,
      onDrag: handleDrag,
      onDragEnd: handleDragEnd,
    },
    getSwipeStyles,
  };
}

export function useSwipeDeck<T>(items: T[], onComplete?: (results: { item: T; direction: 'left' | 'right' }[]) => void) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<{ item: T; direction: 'left' | 'right' }[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      const currentItem = items[currentIndex];
      if (!currentItem) return;

      const newResult = { item: currentItem, direction };
      const newResults = [...results, newResult];
      setResults(newResults);

      if (currentIndex >= items.length - 1) {
        setIsComplete(true);
        onComplete?.(newResults);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [currentIndex, items, results, onComplete]
  );

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setResults([]);
    setIsComplete(false);
  }, []);

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setResults((prev) => prev.slice(0, -1));
      setIsComplete(false);
    }
  }, [currentIndex]);

  return {
    currentItem: items[currentIndex],
    currentIndex,
    totalItems: items.length,
    progress: ((currentIndex + 1) / items.length) * 100,
    results,
    isComplete,
    handleSwipe,
    reset,
    goBack,
  };
}
