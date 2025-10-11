import React, { useState, useRef, useEffect } from 'react';
import glossaryData from '../data/glossary.json';

interface TooltipProps {
  term: keyof typeof glossaryData;
  children: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ term, children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  const glossaryEntry = glossaryData[term];

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Show tooltip above if not enough space below
      setPosition(spaceBelow < 200 && spaceAbove > 200 ? 'top' : 'bottom');
    }
  }, [isVisible]);

  if (!glossaryEntry) {
    return <>{children}</>;
  }

  return (
    <span className="relative inline-block">
      <span
        ref={triggerRef}
        className={`cursor-help border-b-2 border-dotted border-blue-400 ${className}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        tabIndex={0}
        role="button"
        aria-describedby={`tooltip-${term}`}
      >
        {children}
      </span>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          id={`tooltip-${term}`}
          role="tooltip"
          style={{ backgroundColor: '#ffffff' }}
          className={`absolute z-50 w-64 px-4 py-3 text-sm border-2 border-gray-300 text-gray-800 rounded-lg shadow-xl transform transition-all duration-200 ${
            position === 'top'
              ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
              : 'top-full mt-2 left-1/2 -translate-x-1/2'
          }`}
        >
          {/* Arrow */}
          <div
            style={{ backgroundColor: '#ffffff' }}
            className={`absolute w-3 h-3 border-gray-300 transform rotate-45 ${
              position === 'top'
                ? 'bottom-[-7px] left-1/2 -translate-x-1/2 border-b-2 border-r-2'
                : 'top-[-7px] left-1/2 -translate-x-1/2 border-t-2 border-l-2'
            }`}
          />
          
          {/* Content */}
          <div className="relative">
            <p className="font-semibold mb-1 text-blue-700">{glossaryEntry.term}</p>
            <p className="text-gray-700 leading-relaxed">{glossaryEntry.definition}</p>
          </div>
        </div>
      )}
    </span>
  );
};
