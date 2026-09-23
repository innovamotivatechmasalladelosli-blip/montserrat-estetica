import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
}

export function SearchBar({ value = '', onChange, placeholder = "Buscar balayage, botox, corte, spa..." }: SearchBarProps) {
  return (
    <div className="relative flex items-center w-full">
      <div className="absolute left-4 text-brand-muted pointer-events-none">
        <Search className="w-5 h-5" />
      </div>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder} 
        className="w-full bg-brand-surface-container/60 border border-brand-border rounded-full py-3.5 pl-12 pr-12 text-[14px] outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-all placeholder:text-brand-muted/70 text-brand-espresso shadow-inner"
      />
      {value ? (
        <button 
          onClick={() => onChange?.('')}
          className="absolute right-4 text-brand-muted hover:text-brand-espresso p-1 rounded-full transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <X className="w-4 h-4" />
        </button>
      ) : null}
    </div>
  );
}
