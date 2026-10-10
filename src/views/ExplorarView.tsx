import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShoppingBag, Scissors, Sparkles, Check } from 'lucide-react';
import { services, products as seasonalProducts } from '../data';
import { SafeImage } from '../components/SafeImage';
import { LegalModal, type LegalPage } from '../components/LegalModal';

interface ExplorarViewProps {
  onNavigate: (nav: string) => void;
  onSelectService?: (id: string) => void;
  onOpenChat?: () => void;
}
export function ExplorarView({ onNavigate, onSelectService, onOpenChat }: ExplorarViewProps) {
  const [productNotice, setProductNotice] = useState<string | null>(null);
  const [legalPage, setLegalPage] = useState<LegalPage | null>(null);

  useEffect(() => {
    const openLegalPage = (event: Event) => {
      const page = (event as CustomEvent<LegalPage>).detail;
      if (['terms', 'copyright', 'privacy', 'cookies'].includes(page)) setLegalPage(page);
    };
    window.addEventListener('open-legal-page', openLegalPage);
    return () => window.removeEventListener('open-legal-page', openLegalPage);
  }, []);

  const handleBookService = (serviceId: string) => {
    if (onSelectService) {
      onSelectService(serviceId);
    }
    onNavigate('reservar');
  };

  const handleBuyProduct = (productName: string) => {
    setProductNotice(`¡${productName} añadido a tu consulta de boutique!`);
    setTimeout(() => setProductNotice(null), 3500);
  };

  return (
    <main className="px-5 md:px-10 pt-6 pb-20 max-w-7xl mx-auto space-y-12 w-full">
      {/* Product feedback toast */}
      {productNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-brand-espresso text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-brand-gold shrink-0" />
          <span>{productNotice}</span>
        </div>
      )}

      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="relative rounded-[2rem] overflow-hidden h-[420px] md:h-[500px] w-full group bg-brand-espresso text-brand-surface"
      >
         <div className="absolute inset-0 w-full h-full object-cover">
            <SafeImage
              src="https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2938&auto=format&fit=crop" 
              alt="Estética y Botánica" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
            />
         </div>
         <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso via-brand-espresso/60 to-transparent pointer-events-none" />
         <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end pointer-events-none">
            <div className="max-w-xl pointer-events-auto">
               <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-3 text-white">
                 Elige tu servicio y agenda tu cita en segundos
               </h2>
               <p className="text-xs sm:text-sm md:text-base opacity-95 mb-6 font-medium text-brand-surface/90 leading-relaxed">
                 Aquí tienes lo más popular del salón. Elige tu tratamiento ideal, aparta tu fecha con tu estilista preferida o descubre nuestros productos para cuidar tu cabello en casa.
               </p>
               <div className="flex flex-wrap gap-2.5 sm:gap-3">
                 <button 
                   onClick={() => onNavigate('reservar')} 
                   className="bg-brand-gold text-brand-espresso px-5 sm:px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-white transition-colors active:scale-95 cursor-pointer"
                 >
                   Agendar mi cita ahora <ArrowRight className="w-4 h-4 text-brand-espresso" />
                 </button>
                 <button 
                   onClick={() => onNavigate('servicios')} 
                   className="bg-white/15 backdrop-blur-md text-white px-5 sm:px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-white/25 transition-colors active:scale-95 cursor-pointer"
                 >
                   Ver todos los servicios
                 </button>
                 <button 
                   onClick={() => {
                     const el = document.getElementById('productos-temporada');
                     el?.scrollIntoView({ behavior: 'smooth' });
                   }} 
                   className="bg-black/30 backdrop-blur-md text-white/90 hover:text-white px-4 py-3.5 rounded-full text-xs sm:text-sm font-medium hover:bg-black/50 transition-colors active:scale-95 cursor-pointer"
                 >
                   Ver productos
                 </button>
               </div>
            </div>
         </div>
      </motion.div>

      <div className="pt-1 md:pt-2">
        <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-brand-gold">
          Lo más pedido y recomendado
        </span>
      </div>

      <section className="grid gap-5 rounded-[2rem] border border-brand-border/70 bg-brand-surface-container/45 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
        <div>
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[.2em] text-brand-gold">MontIA+ · Orientación personalizada</span>
          <h3 className="mb-3 font-serif text-2xl font-semibold text-brand-espresso">Ideas para el cabello que imaginas</h3>
          <p className="max-w-3xl text-sm leading-6 text-brand-muted">Cuéntale al asistente tu tipo de cabello, tus objetivos y el resultado que buscas. También puedes adjuntar una foto para recibir ideas iniciales de tratamientos, hablar de sus posibles efectos y consultar productos del catálogo que podrían encajar con tu caso. La imagen es una referencia visual, no un diagnóstico ni una garantía de resultados; para confirmar compatibilidad, agenda una valoración.</p>
        </div>
        <button onClick={onOpenChat} className="shrink-0 rounded-full bg-brand-espresso px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-gold">Consultar a MontIA+</button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Funciones del sitio">
        {[
          { title: 'Explorar servicios', text: 'Consulta tratamientos y detalles del catálogo.' },
          { title: 'Orientación MontIA+', text: 'Pregunta sobre cabello, objetivos y fotos de referencia.' },
          { title: 'Productos de cuidado', text: 'Descubre opciones del catálogo para tu rutina en casa.' },
          { title: 'Preparar una reserva', text: 'Elige servicios, especialista, fecha y horario.' },
        ].map(item => (
          <article key={item.title} className="rounded-2xl border border-brand-border/60 bg-brand-surface p-5">
            <h3 className="mb-1 font-serif text-base font-semibold text-brand-espresso">{item.title}</h3>
            <p className="text-xs leading-5 text-brand-muted">{item.text}</p>
          </article>
        ))}
      </section>

      {/* Productos de Temporada */}
      <section id="productos-temporada">
        <div className="flex justify-between items-end mb-6">
          <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gold block mb-1">Cuidado en Casa</span>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-brand-espresso">Productos de Temporada</h3>
          </div>
          <button 
            onClick={() => onNavigate('servicios')}
            className="text-xs font-semibold text-brand-muted hover:text-brand-espresso transition-colors"
          >
            Ver Boutique
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 snap-x snap-mandatory">
          {seasonalProducts.map(product => (
            <div key={product.id} className="min-w-[220px] md:min-w-[250px] group cursor-pointer snap-start active:scale-[0.98] transition-transform">
              <div className="bg-brand-surface-container/60 rounded-3xl p-6 border border-brand-border/60 hover:border-brand-gold/60 transition-colors mb-3 flex flex-col items-start justify-between relative overflow-hidden h-[250px] shadow-sm">
                <SafeImage
                  referrerPolicy="no-referrer" 
                  src={product.img} 
                  alt={product.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                <div className="mb-4 relative z-10 text-white">
                  <h4 className="font-serif font-semibold text-base leading-snug">{product.name}</h4>
                  <p className="text-[11px] text-brand-gold mb-1 font-medium">{product.brand}</p>
                </div>
                <div className="flex items-center justify-between w-full mt-2 relative z-10">
                  <span className="font-semibold text-sm text-white">${product.price.toLocaleString()} MXN</span>
                  <button 
                    onClick={() => handleBuyProduct(product.name)}
                    className="text-[10px] uppercase tracking-widest font-bold text-brand-espresso bg-brand-surface hover:bg-brand-gold hover:text-white px-3.5 py-1.5 rounded-full border border-brand-border transition-colors shadow-sm"
                  >
                    Comprar
                  </button>
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
              <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gold block mb-1">Favoritos del Atelier</span>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-brand-espresso">Más Comprados</h3>
          </div>
          <button 
            onClick={() => onNavigate('servicios')} 
            className="text-xs font-semibold text-brand-muted hover:text-brand-espresso transition-colors flex items-center gap-1"
          >
            Explorar todos <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 snap-x snap-mandatory">
            {services.filter(s => s.isFeatured).map(service => (
               <div 
                 key={service.id} 
                 onClick={() => handleBookService(service.id)} 
                 className="group min-w-[300px] md:min-w-[400px] bg-brand-surface-container/60 rounded-3xl p-6 snap-start border border-brand-border/60 cursor-pointer hover:shadow-xl active:scale-[0.98] transition-all duration-500 flex flex-col relative overflow-hidden h-[320px]"
               >
                  <SafeImage
                    referrerPolicy="no-referrer" 
                    src={service.imageUrl} 
                    alt={service.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/25" />
                  <div className="flex justify-between items-start mb-6 relative z-10">
                     <span className="bg-brand-gold text-white px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                        Bestseller
                     </span>
                     <span className="text-xs font-semibold text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                       4.9 ★
                     </span>
                  </div>
                  <div className="relative z-10 flex flex-col flex-1">
                     <h4 className="font-serif text-xl font-semibold mb-2 text-white">{service.title}</h4>
                     <p className="text-xs text-white/90 line-clamp-2 mb-6">{service.description}</p>
                     <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/20">
                        <div className="text-white">
                           <span className="text-[10px] block opacity-80 uppercase tracking-widest">Inversión</span>
                           <span className="font-serif font-semibold text-lg">${service.price.toLocaleString()} MXN</span>
                        </div>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleBookService(service.id); 
                          }} 
                          className="bg-brand-surface text-brand-espresso px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-brand-gold hover:text-white transition-all shadow-md active:scale-95"
                        >
                          Reservar
                        </button>
                     </div>
                  </div>
               </div>
            ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-brand-surface-container/50 rounded-3xl p-8 md:p-12 text-center border border-brand-border/60">
         <span className="text-[10px] font-bold tracking-widest uppercase text-brand-gold mb-3 block">Reseñas y Testimonios</span>
         <h3 className="font-serif text-xl md:text-2xl font-semibold text-brand-espresso mb-3 leading-relaxed">
           Excelencia y satisfacción avalada por nuestras clientas
         </h3>
         <p className="text-xs text-brand-muted max-w-lg mx-auto mb-6">
           Calificación de <strong>4.9 / 5 estrellas</strong> en Google Reviews con más de 800 experiencias positivas en Monterrey.
         </p>
         <div className="flex justify-center items-center gap-1 text-amber-500">
           {'★'.repeat(5)}
         </div>
      </section>

      <footer className="border-t border-brand-border/70 pt-6 pb-2 text-center">
        <nav aria-label="Avisos del sitio" className="mb-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium text-brand-muted">
          <button onClick={() => setLegalPage('terms')} className="hover:text-brand-espresso">Términos y servicios</button>
          <button onClick={() => setLegalPage('copyright')} className="hover:text-brand-espresso">Derechos de autor</button>
          <button onClick={() => setLegalPage('privacy')} className="hover:text-brand-espresso">Aviso de privacidad</button>
          <button onClick={() => setLegalPage('cookies')} className="hover:text-brand-espresso">Política de cookies</button>
        </nav>
        <p className="text-[11px] text-brand-muted">© 2026 Montserrat Medina Estética. Todos los derechos reservados.</p>
        <p className="mt-1 text-[10px] text-brand-muted/80">Los nombres de marca y productos pertenecen a sus respectivos titulares.</p>
      </footer>
      <LegalModal page={legalPage} onClose={() => setLegalPage(null)} />
    </main>
  );
}
