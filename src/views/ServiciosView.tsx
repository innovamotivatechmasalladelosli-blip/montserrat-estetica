import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { categories, services } from '../data';
import { SearchBar } from '../components/SearchBar';
import { FilterChips } from '../components/FilterChips';
import { FeaturedServiceCard } from '../components/FeaturedServiceCard';
import { StandardServiceCard } from '../components/StandardServiceCard';
import { Sparkles, RotateCcw } from 'lucide-react';

interface Props {
  selectedServices: string[];
  handleSelectService: (id: string) => void;
}

export function ServiciosView({ selectedServices, handleSelectService }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('');

  // Primary category tabs
  const categoryTabs = useMemo(() => [
    'Todos',
    'Colorimetría',
    'Alisados y Reconstrucción',
    'Corte y Styling',
    'Nutrición Profunda',
    'Manicura y Pedicura'
  ], []);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      // Category filter
      if (activeCategory && activeCategory !== 'Todos') {
        if (service.category !== activeCategory) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = service.title.toLowerCase().includes(query);
        const matchesDesc = service.description.toLowerCase().includes(query);
        const matchesCat = service.category.toLowerCase().includes(query);
        const matchesTags = service.tags?.some(tag => tag.toLowerCase().includes(query));
        const matchesFeatures = service.features?.some(f => f.toLowerCase().includes(query));

        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesTags && !matchesFeatures) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, activeCategory]);

  return (
    <main className="px-5 md:px-10 pt-6 pb-20 max-w-7xl mx-auto space-y-8 w-full">
      
      {/* Header Text */}
      <section className="max-w-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-[1px] w-8 bg-brand-gold"></div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">Colección 2026</span>
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
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          placeholder="Buscar balayage, botox, corte, spa, olaplex..." 
        />
      </div>

      {/* Category Chips */}
      <section className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold tracking-widest uppercase text-brand-espresso text-[10px] flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-brand-gold" /> Filtrar por diagnóstico
          </span>
          <button 
            onClick={() => { setActiveCategory(''); setSearchQuery(''); }}
            className="text-brand-muted font-medium hover:text-brand-espresso transition-colors text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Ver todos ({services.length})
          </button>
        </div>
        <FilterChips 
          categories={categories} 
          activeCategory={activeCategory} 
          onSelect={(cat) => setActiveCategory(cat)} 
        />
      </section>

      {/* Sub Tabs */}
      <section className="border-b border-brand-border/60">
        <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar">
          {categoryTabs.map(tab => {
            const isTabActive = (!activeCategory && tab === 'Todos') || (activeCategory === tab);
            return (
              <button 
                key={tab}
                onClick={() => setActiveCategory(tab === 'Todos' ? '' : tab)}
                className={`pb-3 text-[13px] md:text-[15px] font-semibold whitespace-nowrap transition-colors relative ${
                  isTabActive ? 'text-brand-espresso' : 'text-brand-muted hover:text-brand-espresso/70'
                }`}
              >
                {tab}
                {isTabActive && (
                  <motion.div 
                    layoutId="serviceTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold rounded-t-full" 
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Active filters status */}
      <div className="flex items-center justify-between text-xs text-brand-muted px-1">
        <span>
          Mostrando <strong>{filteredServices.length}</strong> de {services.length} servicios
          {activeCategory && <span className="ml-1 text-brand-espresso">• Categoría: <strong>{activeCategory}</strong></span>}
          {searchQuery && <span className="ml-1 text-brand-espresso">• Búsqueda: "<strong>{searchQuery}</strong>"</span>}
        </span>
        {(activeCategory || searchQuery) && (
          <button 
            onClick={() => { setActiveCategory(''); setSearchQuery(''); }}
            className="text-brand-gold font-semibold hover:underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Service List Grid */}
      {filteredServices.length > 0 ? (
        <motion.section 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, index) => (
              <motion.div 
                key={service.id} 
                layout
                className={service.isFeatured ? 'md:col-span-2 lg:col-span-2 h-full' : 'col-span-1 h-full'}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
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
          </AnimatePresence>
        </motion.section>
      ) : (
        <div className="py-16 text-center space-y-4 bg-brand-surface-container/30 rounded-3xl border border-brand-border/60">
          <p className="font-serif text-xl font-medium text-brand-espresso">No se encontraron servicios</p>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">
            Prueba ajustando los términos de búsqueda o seleccionando otra categoría.
          </p>
          <button 
            onClick={() => { setActiveCategory(''); setSearchQuery(''); }}
            className="px-5 py-2.5 bg-brand-espresso text-white rounded-full text-xs font-semibold hover:bg-brand-espresso/90 transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Ver todos los servicios
          </button>
        </div>
      )}

    </main>
  );
}
