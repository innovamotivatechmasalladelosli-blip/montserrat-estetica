import React from 'react';
import { Service } from '../types';
import { Clock, Wind, ScanFace } from 'lucide-react';

interface StandardServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: () => void;
}

export function StandardServiceCard({ service, isSelected, onSelect }: StandardServiceCardProps) {
  
  const getFeatureIcon = (feature: string) => {
    if (feature.toLowerCase().includes('aromaterapia')) return <Wind className="w-3.5 h-3.5 text-brand-muted" />;
    if (feature.toLowerCase().includes('diagnóstico')) return <ScanFace className="w-3.5 h-3.5 text-brand-muted" />;
    return null;
  };

  return (
    <div className={`group p-4 rounded-[24px] transition-all duration-500 flex flex-col gap-3 cursor-pointer active:scale-[0.98] ${isSelected ? 'ring-2 ring-brand-espresso bg-brand-surface-container/80 shadow-md' : 'ring-1 ring-brand-border bg-brand-surface-container/30 hover:bg-brand-surface-container/60 hover:shadow-sm'} `} onClick={onSelect}>
      
      <div className="flex gap-4">
        {/* Image Thumbnail */}
        <div className="relative w-[88px] h-[104px] shrink-0 rounded-2xl overflow-hidden bg-brand-border">
          <img referrerPolicy="no-referrer" src={service.imageUrl} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 justify-between py-1 min-w-0">
          <div>
            <div className="flex justify-between items-start mb-2 gap-2 border-b border-brand-border/40 pb-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-brand-muted truncate">
                {service.subtitle}
              </span>
              <span className="font-serif font-semibold text-lg leading-none shrink-0">${service.price.toLocaleString()} MXN</span>
            </div>
            <h3 className="font-serif text-[17px] font-semibold leading-tight text-brand-espresso mb-1.5 pr-2">
              {service.title}
            </h3>
            <p className="text-brand-muted text-[12px] leading-snug line-clamp-2">
              {service.description}
            </p>
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="flex items-center justify-between mt-auto pt-2">
        {/* Features/Duration */}
        <div className="flex items-center gap-2 text-xs text-brand-muted">
           <span className="font-medium bg-brand-surface border border-brand-border px-2.5 py-1 rounded-full">{service.duration} min</span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
            isSelected 
              ? 'bg-brand-espresso text-white shadow-md scale-105' 
              : 'bg-brand-surface border border-brand-border text-brand-espresso group-hover:bg-brand-espresso group-hover:text-white'
          }`}
        >
          {isSelected ? 'Seleccionado' : 'Seleccionar'}
        </button>
      </div>

    </div>
  );
}
