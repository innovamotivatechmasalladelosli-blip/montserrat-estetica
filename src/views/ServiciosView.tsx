import React, { useState } from 'react';
import { motion } from 'motion/react';
import { categories, services } from '../data';
import { SearchBar } from '../components/SearchBar';
import { FilterChips } from '../components/FilterChips';
import { FeaturedServiceCard } from '../components/FeaturedServiceCard';
import { StandardServiceCard } from '../components/StandardServiceCard';

interface Props {
  selectedServices: string[];
  handleSelectService: (id: string) => void;
}

export function ServiciosView({ selectedServices, handleSelectService }: Props) {
  const [activeCategory, setActiveCategory] = useState("Nutrición Profunda");
  const [activeTab, setActiveTab] = useState("Colorimetría");

  return (
    <main className="px-5 md:px-10 pt-6 pb-12 max-w-7xl mx-auto space-y-8 w-full">
      
      {/* Header Text */}
      <section className="max-w-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-[1px] w-8 bg-brand-gold"></div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-brand-muted">Colección 2026</span>
        </div>
        <h2 className="font-serif text-[32px] md:text-[40px] font-semibold leading-tight text-brand-espresso mb-3 md:mb-4">
          Menú de Servicios
        </h2>
        <p className="text-brand-muted text-[14px] md:text-[16px] leading-relaxed">
          Rituales capilares de alta costura diseñados a la medida de tu fisonomía y fibra capilar.
        </p>
      </section>

      {/* Search */}
      <div className="max-w-2xl">
        <SearchBar />
      </div>

      {/* Filters */}
      <section className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold tracking-widest uppercase text-brand-espresso text-[10px]">Filtrar por diagnóstico</span>
          <button className="text-brand-muted font-medium hover:text-brand-espresso transition-colors">Ver todos</button>
        </div>
        <FilterChips 
          categories={categories} 
          activeCategory={activeCategory} 
          onSelect={setActiveCategory} 
        />
      </section>

      {/* Sub Tabs */}
      <section className="border-b border-brand-border">
        <div className="flex gap-6 md:gap-10 overflow-x-auto no-scrollbar">
          {['Colorimetría', 'Alisados y Reconstrucción', 'Corte y Styling'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[14px] md:text-[15px] font-semibold whitespace-nowrap transition-colors relative ${
                activeTab === tab ? 'text-brand-espresso' : 'text-brand-muted hover:text-brand-espresso/70'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-espresso rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Service List Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
        {services.map((service, index) => (
          <motion.div 
            key={service.id} 
            className={service.isFeatured ? 'md:col-span-2 lg:col-span-2 h-full' : 'col-span-1 h-full'}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {service.isFeatured ? (
              <FeaturedServiceCard 
                service={service} 
                isSelected={selectedServices.includes(service.id)}
                onSelect={() => handleSelectService(service.id)}
              />
            ) : (
              <StandardServiceCard 
                service={service} 
                isSelected={selectedServices.includes(service.id)}
                onSelect={() => handleSelectService(service.id)}
              />
            )}
          </motion.div>
        ))}
      </section>

    </main>
  );
}
