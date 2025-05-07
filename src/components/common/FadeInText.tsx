// FadeInText.tsx
// A client component for Next.js 15 in TypeScript
// It reveals its children text smoothly, character by character, with a fading effect.

'use client';

import { useEffect, useState } from 'react';

interface FadeInTextProps {
  /** Text to display with fade-in effect */
  children: string;
  /** Delay in milliseconds between each character reveal (default: 50ms) */
  charDelay?: number;
  /** Initial delay before starting the animation (default: 0ms) */
  initialDelay?: number;
  /** Additional CSS classes for styling */
  className?: string;
}

const FadeInText: React.FC<FadeInTextProps> = ({
  children,
  charDelay = 10,
  initialDelay = 0,
  className = '',
}) => {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    // Schedule timeouts to reveal each character
    for (let i = 0; i < children.length; i++) {
      const timeout = setTimeout(() => {
        setVisibleChars((prev) => prev + 1);
      }, initialDelay + i * charDelay);
      timeouts.push(timeout);
    }
    // Cleanup on unmount or children change
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [children, charDelay, initialDelay]);

  return (
    <p className={`${className} text-justify`}>
      {children.split('').map((char, idx) => (
        <span
          key={idx}
          style={{
            opacity: idx < visibleChars ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          {char}
        </span>
      ))}
    </p>
  );
};

export default FadeInText;
