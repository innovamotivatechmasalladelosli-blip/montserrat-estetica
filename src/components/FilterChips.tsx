import React from 'react';

interface FilterChipsProps {
  categories: string[];
  activeCategory: string;
  onSelect: (cat: string) => void;
}

export function FilterChips({ categories, activeCategory, onSelect }: FilterChipsProps) {
  const allChips = ['Todos', ...categories];

  return (
    <div className="w-full overflow-x-auto md:overflow-visible no-scrollbar pb-2">
      <div className="flex md:flex-wrap gap-2 px-1">
        {allChips.map((cat) => {
          const isActive = cat === activeCategory || (cat === 'Todos' && !activeCategory);
          
          return (
            <button
              key={cat}
              onClick={() => onSelect(cat === 'Todos' ? '' : cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-semibold transition-all flex items-center gap-2 active:scale-95 ${
                isActive
                  ? 'bg-brand-espresso text-white shadow-sm ring-1 ring-brand-espresso'
                  : 'bg-brand-surface-container/70 text-brand-espresso border border-brand-border/60 hover:bg-brand-surface-container hover:border-brand-gold/40'
              }`}
            >
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>}
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
