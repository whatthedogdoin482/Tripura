'use client';

import { motion, useReducedMotion } from 'framer-motion';

type AnimateBy = 'words' | 'letters';
type Direction = 'top' | 'bottom' | 'left' | 'right';

interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: AnimateBy;
  direction?: Direction;
  onAnimationComplete?: () => void;
  className?: string;
}

const directionOffset = {
  top: { y: -24, x: 0 },
  bottom: { y: 24, x: 0 },
  left: { x: -24, y: 0 },
  right: { x: 24, y: 0 },
};

export default function BlurText({
  text,
  delay = 0,
  animateBy = 'words',
  direction = 'top',
  onAnimationComplete,
  className = '',
}: BlurTextProps) {
  const reduceMotion = useReducedMotion();
  const offset = directionOffset[direction];

  const items = animateBy === 'words' ? text.split(/\s+/) : text.split('');

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: delay / 1000,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      x: offset.x,
      y: offset.y,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      x: 0,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={`inline-flex flex-wrap justify-center ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
      onAnimationComplete={onAnimationComplete}
    >
      {items.map((item, i) => (
        <motion.span
          key={i}
          variants={child}
          className={animateBy === 'words' ? 'inline-block mr-[0.25em]' : 'inline-block'}
        >
          {item}
        </motion.span>
      ))}
    </motion.span>
  );
}
