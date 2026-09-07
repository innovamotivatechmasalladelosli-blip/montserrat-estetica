import React, { useState } from 'react';
import { UserCircle2, Sparkles, MessageCircle, LayoutGrid, Scissors, CalendarCheck2, FileText, User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { services } from './data';
import { ExplorarView } from './views/ExplorarView';
import { ServiciosView } from './views/ServiciosView';
import { ReservarView } from './views/ReservarView';
import { PerfilView } from './views/PerfilView';
import { Chatbot } from './components/Chatbot';

function App() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [currentNav, setCurrentNav] = useState('explorar');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleAddService = (id: string) => {
    setSelectedServices(prev => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const handleSelectService = (id: string) => {
    setSelectedServices(prev => {
      if (prev.includes(id)) {
        return prev.filter(s => s !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const totalSelectedPrice = services
    .filter(s => selectedServices.includes(s.id))
    .reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="min-h-screen bg-brand-surface relative pb-28 md:pb-12 shadow-2xl overflow-x-hidden text-brand-espresso">
      
      {/* Top Navigation / Header */}
      <header className="px-5 md:px-10 py-4 flex items-center justify-between sticky top-0 bg-brand-surface/90 backdrop-blur-md z-40 border-b border-brand-border/30">
        {/* Mobile Left (Empty to balance the right icon) */}
        <div className="w-6 md:hidden"></div>

        {/* Desktop Left (Empty to balance the layout) */}
        <div className="hidden md:block w-1/3"></div>

        {/* Center Logo */}
        <div className="flex flex-col items-center w-1/3 text-center">
          <h1 className="font-serif text-lg md:text-xl tracking-wide font-semibold text-brand-espresso whitespace-nowrap">
            MONTSERRAT MEDINA
          </h1>
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-brand-muted">Estética</span>
        </div>

        {/* Desktop Right Nav */}
        <div className="hidden md:flex justify-end items-center gap-8 text-[13px] font-semibold text-brand-muted w-1/3">
          <button onClick={() => setCurrentNav('explorar')} className={currentNav === 'explorar' ? 'text-brand-espresso' : 'hover:text-brand-espresso transition-colors'}>Explorar</button>
          <button onClick={() => setCurrentNav('servicios')} className={currentNav === 'servicios' ? 'text-brand-espresso' : 'hover:text-brand-espresso transition-colors'}>Servicios</button>
          <button onClick={() => setCurrentNav('reservar')} className={currentNav === 'reservar' ? 'text-brand-espresso' : 'hover:text-brand-espresso transition-colors'}>Reservar</button>
          <button onClick={() => setCurrentNav('perfil')} className={`transition-colors ml-2 ${currentNav === 'perfil' ? 'text-brand-gold' : 'text-brand-espresso hover:text-brand-gold'}`}>
            <UserCircle2 className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Right */}
        <button onClick={() => setCurrentNav('perfil')} className={`md:hidden ${currentNav === 'perfil' ? 'text-brand-gold' : 'text-brand-espresso'}`}>
          <UserCircle2 className="w-6 h-6" />
        </button>
      </header>

      {/* Views */}
      <div className="flex-1 w-full flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNav}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex-1 flex flex-col"
          >
            {currentNav === 'explorar' && <ExplorarView onNavigate={setCurrentNav} />}
            {currentNav === 'servicios' && <ServiciosView selectedServices={selectedServices} handleSelectService={handleSelectService} />}
            {currentNav === 'reservar' && <ReservarView selectedServices={selectedServices} />}
            {currentNav === 'perfil' && <PerfilView />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Booking Summary Bar */}
      {selectedServices.length > 0 && currentNav !== 'reservar' && (
        <div className="fixed bottom-[88px] md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-[420px] z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-brand-surface rounded-[28px] p-2 pr-2.5 flex items-center justify-between shadow-[0_16px_48px_-8px_rgba(30,27,24,0.12),0_0_0_1px_rgba(197,168,128,0.28)] backdrop-blur-xl">
            <div className="flex items-center gap-3 pl-2">
              <div className="w-10 h-10 rounded-full bg-brand-espresso text-white flex items-center justify-center font-semibold text-[13px]">
                {selectedServices.length}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-widest uppercase text-brand-muted">Resumen de cita</span>
                <span className="font-semibold text-brand-espresso text-[15px]">
                  {selectedServices.length} servicio{selectedServices.length > 1 ? 's' : ''} • ${totalSelectedPrice}
                </span>
              </div>
            </div>
            <button onClick={() => setCurrentNav('reservar')} className="bg-brand-espresso text-white px-5 py-3.5 rounded-full text-[14px] font-semibold flex items-center gap-2 hover:bg-brand-espresso/90 transition-all active:scale-95">
              Continuar <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* Booking bottom bar for Reservar View */}
      {currentNav === 'reservar' && (
         <div className="fixed bottom-[72px] md:bottom-0 left-0 right-0 bg-brand-surface border-t border-brand-border/60 p-4 md:p-6 z-50 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1 text-[10px] uppercase font-bold tracking-widest text-brand-muted">
                 Cita Seleccionada
              </div>
              <span className="font-semibold text-sm">Hoy, 18 Oct • 16:30</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                 <span className="font-serif text-xl font-semibold">${totalSelectedPrice || 180}</span>
              </div>
              <button className="bg-brand-espresso text-white px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform">
                Confirmar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
         </div>
      )}

      {/* Floating AI Bubble */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className={`fixed right-4 md:right-8 z-40 w-14 h-14 rounded-full shadow-[0_12px_30px_-4px_rgba(30,27,24,0.3)] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 bg-brand-espresso text-brand-gold border border-brand-gold/20
          ${currentNav === 'reservar' ? 'bottom-[150px] md:bottom-[100px]' : 
            selectedServices.length > 0 ? 'bottom-[172px] md:bottom-[116px]' : 'bottom-[96px] md:bottom-8'}
          ${isChatOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}
        `}
        aria-label="Asistente IA"
      >
        <div className="relative flex items-center justify-center"><MessageCircle className="w-6 h-6" /><Sparkles className="w-3 h-3 absolute -top-1 -right-2 text-brand-gold" /></div>
      </button>

      {/* Chatbot Interface */}
      <Chatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        onNavigate={(nav) => { setCurrentNav(nav); }}
        onAddService={handleAddService}
      />

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-surface border-t border-brand-border/60 pb-safe z-40">
        <div className="flex justify-around items-center px-2 py-2">
          {[
            { id: 'explorar', icon: LayoutGrid, label: 'Explorar' },
            { id: 'servicios', icon: Scissors, label: 'Servicios' },
            { id: 'reservar', icon: CalendarCheck2, label: 'Reservar' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setCurrentNav(item.id)}
              className={`relative flex flex-col items-center p-2 min-w-[64px] transition-all duration-300 active:scale-95 ${
                currentNav === item.id ? 'text-brand-espresso' : 'text-brand-muted hover:text-brand-espresso/60'
              }`}
            >
              <item.icon className="w-6 h-6 mb-1 transition-transform duration-300 hover:scale-110" strokeWidth={currentNav === item.id ? 2.5 : 2} />
              <span className={`text-[10px] ${currentNav === item.id ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
              {currentNav === item.id && (
                <motion.div 
                  layoutId="bottomNavIndicator"
                  transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.8 }}
                  className="absolute -top-1 w-8 h-1 bg-brand-gold rounded-b-full"
                />
              )}
            </button>
          ))}
        </div>
      </nav>

    </div>
  );
}

export default App;

