import React from 'react';
import { Service } from '../types';
import { Clock, Droplet, ArrowRight, Check } from 'lucide-react';

interface FeaturedServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: () => void;
}

export function FeaturedServiceCard({ service, isSelected, onSelect }: FeaturedServiceCardProps) {
  return (
    <div className={`relative group overflow-hidden rounded-[24px] cursor-pointer active:scale-[0.98] transition-all duration-500 h-full flex flex-col ${isSelected ? 'ring-2 ring-brand-espresso shadow-xl' : 'ring-1 ring-brand-border shadow-sm hover:shadow-md'} bg-brand-surface-container`}>
      {/* Image Header */}
      <div className="relative h-64 md:h-80 lg:h-96 w-full shrink-0 overflow-hidden">
        <img referrerPolicy="no-referrer" src={service.imageUrl} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {service.tags.includes('MAÎTRE COLORISTE') && (
            <span className="bg-brand-surface/90 backdrop-blur-md text-brand-espresso px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">
              Maître Coloriste
            </span>
          )}
          {service.tags.includes('SUTIL ANTES / DESPUÉS') && (
            <span className="bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">
              Sutil Antes / Después
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className="bg-brand-espresso text-brand-surface px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">
            Rango Exclusivo
          </span>
        </div>

        <h3 className="font-serif text-[26px] font-semibold leading-tight text-brand-espresso mb-3">
          {service.title}
        </h3>
        <p className="text-brand-muted text-[14px] leading-relaxed mb-6">
          {service.description}
        </p>

        {/* Features Box */}
        {service.features && service.features.length > 0 && (
          <div className="bg-brand-surface rounded-xl p-4 flex items-center gap-3 mb-6 border border-brand-border/50">
            <div className="flex flex-col text-sm">
              <span className="text-brand-muted">{service.features[0]}</span>
              <span className="font-semibold text-brand-espresso">{service.features[1]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Details */}
      <div className="p-5 pt-4 border-t border-brand-border/60 mt-auto">
        <div className="flex justify-between items-end mb-6">
          <div>
             <span className="text-[10px] text-brand-muted uppercase tracking-widest font-bold block mb-1">Inversión</span>
             <p className="font-serif text-3xl font-semibold text-brand-espresso">{service.priceRange || `$${service.price.toLocaleString()} MXN`}</p>
          </div>
          <div className="text-sm font-medium text-brand-muted border border-brand-border/80 px-3 py-1.5 rounded-full">
            {service.duration} min
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button className="text-[13px] font-semibold flex items-center gap-1.5 text-brand-espresso hover:text-brand-gold transition-colors">
            Detalles del protocolo
          </button>
          <button
            onClick={onSelect}
            className={`px-6 py-3 rounded-full text-[14px] font-semibold transition-all ${
              isSelected 
                ? 'bg-brand-espresso text-white shadow-md' 
                : 'bg-brand-surface border border-brand-border text-brand-espresso hover:bg-brand-surface-container'
            }`}
          >
            {isSelected ? 'Seleccionado' : 'Seleccionar'}
          </button>
        </div>
      </div>
    </div>
  );
}
