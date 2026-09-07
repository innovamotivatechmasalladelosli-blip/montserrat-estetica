import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export function SearchBar() {
  return (
    <div className="relative flex items-center w-full">
      <div className="absolute left-4 text-brand-muted">
        <Search className="w-5 h-5" />
      </div>
      <input 
        type="text" 
        placeholder="Buscar balayage, keratina, hidratación..." 
        className="w-full bg-brand-surface-container border border-brand-border rounded-full py-3.5 pl-12 pr-12 text-[14px] outline-none focus:ring-1 focus:ring-brand-gold transition-shadow placeholder:text-brand-muted/70 text-brand-espresso"
      />
      <button className="absolute right-4 text-brand-muted hover:text-brand-espresso transition-colors">
        <SlidersHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
}
