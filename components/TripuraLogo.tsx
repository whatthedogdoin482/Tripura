'use client';

import Link from 'next/link';

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
}

const labelSizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
}

interface TripuraLogoProps {
  /** Link to home. If false, only the image is rendered (no link). */
  asLink?: boolean
  /** Show "Tripura" text next to the logo */
  showLabel?: boolean
  /** Logo size */
  size?: 'sm' | 'md' | 'lg'
  /** Extra class for the wrapper (link or div) */
  className?: string
  /** Style for label (e.g. Tripura brand color) */
  labelClassName?: string
}

export default function TripuraLogo({
  asLink = true,
  showLabel = false,
  size = 'md',
  className = '',
  labelClassName = '',
}: TripuraLogoProps) {
  const boxClass = sizeClasses[size]
  const labelClass = labelSizes[size]

  const content = (
    <>
      <div
        className={`${boxClass} rounded-full flex items-center justify-center overflow-hidden flex-shrink-0`}
      >
        <img
          src="/logo.PNG"
          alt="Tripura Logo"
          className="w-full h-full object-contain"
        />
      </div>
      {showLabel && (
        <span className={`font-bold ${labelClass} ${labelClassName}`.trim()}>
          Tripura
        </span>
      )}
    </>
  )

  if (asLink) {
    return (
      <Link
        href="/"
        className={`flex items-center gap-2 ${className}`.trim()}
        aria-label="Tripura – Startseite"
      >
        {content}
      </Link>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      {content}
    </div>
  )
}
