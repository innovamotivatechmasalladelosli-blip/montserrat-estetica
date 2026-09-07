import React from 'react';

interface FilterChipsProps {
  categories: string[];
  activeCategory: string;
  onSelect: (cat: string) => void;
}

export function FilterChips({ categories, activeCategory, onSelect }: FilterChipsProps) {
  return (
    <div className="w-full overflow-x-auto md:overflow-visible no-scrollbar pb-2">
      <div className="flex md:flex-wrap gap-2 px-1">
        {categories.map((cat, idx) => {
          const isActive = cat === activeCategory;
          // Special styling for the first one mimicking the image (Nutrición Profunda in dark)
          const isFirstActive = isActive && idx === 0;
          
          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-semibold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-brand-espresso text-white shadow-sm'
                  : 'bg-brand-surface-container text-brand-espresso hover:bg-brand-border/50'
              }`}
            >
              {isFirstActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>}
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
