import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface KawaiiBubbleButtonProps {
  onClick: () => void;
  isOpen: boolean;
  className?: string;
}

export function KawaiiBubbleButton({ onClick, isOpen, className = '' }: KawaiiBubbleButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`fixed z-40 select-none ${className}`}>
      {/* Sleek Tooltip on Hover */}
      <AnimatePresence>
        {isHovered && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-full right-0 mb-2.5 pointer-events-none whitespace-nowrap"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-espresso text-brand-surface text-xs font-medium shadow-md border border-brand-gold/30 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Chat con MontIA+</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Clean Speech Bubble Button: 56x52px mobile, 68x62px desktop */}
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          scale: isOpen ? 0 : isHovered ? 1.05 : 1,
          opacity: isOpen ? 0 : 1,
          y: isHovered ? -2 : 0,
        }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 450, damping: 26 }}
        className="relative w-[56px] h-[52px] md:w-[68px] md:h-[62px] flex items-center justify-center cursor-pointer outline-none focus:outline-none group"
        aria-label="Abrir chat con MontIA+"
      >
        {/* Simple & Elegant Speech Bubble with 3 Conversation Dots */}
        <svg
          viewBox="0 0 64 60"
          className="w-full h-full overflow-visible drop-shadow-[0_8px_20px_rgba(30,27,24,0.16)] transition-all duration-300 group-hover:drop-shadow-[0_12px_26px_rgba(30,27,24,0.22)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ================= 1. CLEAN SPEECH BUBBLE ================= */}
          <path
            d="M 32 6 C 45.5 6 56 15 56 26.5 C 56 38 45.5 47 32 47 C 28.2 47 24.6 46.1 21.4 44.5 L 12 48.8 C 10.6 49.4 9.2 48.1 9.8 46.7 L 12.2 40.8 C 9.5 36.9 8 32 8 26.5 C 8 15 18.5 6 32 6 Z"
            fill="#FFFFFF"
            stroke="#C5A880"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* ================= 2. THREE CLASSIC CONVERSATION DOTS ================= */}
          <g>
            <motion.circle
              cx="22.5"
              cy="26.5"
              r="3.2"
              fill="#1E1B18"
              animate={isHovered ? { y: [-2, 2, -2] } : { y: 0 }}
              transition={{ repeat: Infinity, duration: 1.0, delay: 0, ease: 'easeInOut' }}
            />
            <motion.circle
              cx="32"
              cy="26.5"
              r="3.2"
              fill="#1E1B18"
              animate={isHovered ? { y: [-2, 2, -2] } : { y: 0 }}
              transition={{ repeat: Infinity, duration: 1.0, delay: 0.16, ease: 'easeInOut' }}
            />
            <motion.circle
              cx="41.5"
              cy="26.5"
              r="3.2"
              fill="#1E1B18"
              animate={isHovered ? { y: [-2, 2, -2] } : { y: 0 }}
              transition={{ repeat: Infinity, duration: 1.0, delay: 0.32, ease: 'easeInOut' }}
            />
          </g>
        </svg>
      </motion.button>
    </div>
  );
}
