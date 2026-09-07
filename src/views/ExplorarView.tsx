import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShoppingBag, Scissors } from 'lucide-react';
import { services, products as seasonalProducts } from '../data';

import Spline from '@splinetool/react-spline';

export function ExplorarView({ onNavigate }: { onNavigate: (nav: string) => void }) {
  return (
    <main className="px-5 md:px-10 pt-6 pb-12 max-w-7xl mx-auto space-y-12 w-full">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-[2rem] overflow-hidden h-[400px] md:h-[500px] w-full group bg-brand-espresso text-brand-surface">
         <div className="absolute inset-0 w-full h-full object-cover">
            <Spline scene="https://prod.spline.design/9CFWNtiRN4Ew-AE1/scene.splinecode" />
         </div>
         <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso via-brand-espresso/60 to-transparent pointer-events-none" />
         <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end pointer-events-none">
            <div className="max-w-lg pointer-events-auto">
               <span className="text-[10px] uppercase tracking-widest font-bold opacity-90 mb-3 block text-brand-gold">Estética y Botánica</span>
               <h2 className="font-serif text-4xl md:text-5xl font-semibold leading-tight mb-4">El arte de la transformación capilar</h2>
               <p className="text-sm md:text-base opacity-95 mb-8 font-medium">Tratamientos botánicos regenerativos, balayage couture y rituales sensoriales personalizados.</p>
               <button onClick={() => onNavigate('servicios')} className="bg-brand-surface text-brand-espresso px-6 py-4 rounded-full text-sm font-semibold flex items-center justify-between w-full md:w-auto md:gap-8 hover:bg-brand-surface/90 transition-colors">
                 Reservar experiencia
               </button>
            </div>
         </div>
      </motion.div>

      {/* Productos de Temporada */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-brand-muted block mb-1">Cuidado en Casa</span>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-brand-espresso">Productos de Temporada</h3>
          </div>
          <button className="text-xs font-semibold text-brand-muted hover:text-brand-espresso">Ver Boutique</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 snap-x snap-mandatory">
          {seasonalProducts.map(product => (
            <div key={product.id} className="min-w-[200px] md:min-w-[240px] group cursor-pointer snap-start active:scale-[0.98] transition-transform">
              <div className="bg-brand-surface-container/40 rounded-3xl p-6 border border-brand-border/40 hover:border-brand-gold/50 transition-colors mb-3 flex flex-col items-start justify-between relative overflow-hidden h-[240px]">
                <img referrerPolicy="no-referrer" src={product.img} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="mb-4 relative z-10 text-white">
                  <h4 className="font-serif font-semibold text-base">{product.name}</h4>
                  <p className="text-[11px] text-white/90 mb-1">{product.brand}</p>
                </div>
                <div className="flex items-center justify-between w-full mt-2 relative z-10">
                  <span className="font-semibold text-sm text-white">${product.price.toLocaleString()} MXN</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-brand-espresso bg-brand-surface px-3 py-1 rounded-full border border-brand-border">Comprar</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Servicios Más Comprados */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-brand-muted block mb-1">Favoritos del Atelier</span>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-brand-espresso">Más Comprados</h3>
          </div>
          <button onClick={() => onNavigate('servicios')} className="text-xs font-semibold text-brand-muted hover:text-brand-espresso">Explorar todos</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 snap-x snap-mandatory">
            {services.filter(s => s.isFeatured).map(service => (
               <div key={service.id} onClick={() => onNavigate('servicios')} className="group min-w-[300px] md:min-w-[400px] bg-brand-surface-container/40 rounded-3xl p-6 snap-start border border-brand-border/40 cursor-pointer hover:shadow-lg active:scale-[0.98] transition-all duration-500 flex flex-col relative overflow-hidden h-[300px]">
                  <img referrerPolicy="no-referrer" src={service.imageUrl} alt={service.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                  <div className="flex justify-between items-start mb-6 relative z-10">
                     <span className="bg-brand-gold text-white px-3 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase shadow-sm">
                        Bestseller
                     </span>
                     <span className="text-xs font-semibold text-white">4.9 / 5.0</span>
                  </div>
                  <div className="relative z-10 flex flex-col flex-1">
                     <h4 className="font-serif text-xl font-semibold mb-2 text-white">{service.title}</h4>
                     <p className="text-xs text-white/90 line-clamp-2 mb-6">{service.description}</p>
                     <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/20">
                        <div className="text-white">
                           <span className="text-[10px] block opacity-80">Inversión</span>
                           <span className="font-serif font-semibold">desde ${service.price.toLocaleString()} MXN</span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); onNavigate('servicios'); }} className="bg-brand-surface text-brand-espresso px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-brand-surface/90 transition-colors">
                          Reservar
                        </button>
                     </div>
                  </div>
               </div>
            ))}
        </div>
      </section>

      {/* Reviews Placeholder */}
      <section className="bg-brand-surface-container/50 rounded-3xl p-8 md:p-12 text-center border border-brand-border/40 border-dashed">
         <span className="text-[10px] font-bold tracking-widest uppercase text-brand-muted mb-4 block">Reseñas y Testimonios</span>
         <h3 className="font-serif text-xl md:text-2xl font-medium text-brand-muted mb-4 leading-relaxed">
           [ Espacio reservado para integración futura con reseñas de Google ]
         </h3>
         <p className="text-xs text-brand-muted max-w-lg mx-auto opacity-70">
           Aquí se mostrarán las opiniones y calificaciones de los clientes extraídas automáticamente de Google.
         </p>
      </section>
    </main>
  )
}
