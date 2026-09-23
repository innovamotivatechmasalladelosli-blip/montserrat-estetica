import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft, Check, X, MessageCircle, Move, Minimize2, Maximize2, Compass } from 'lucide-react';
import { Scene3D } from './Scene3D';

interface GuidedRobotTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  currentNav: string;
  onOpenChat?: () => void;
}

type CornerDock = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

interface TourStep {
  id: number;
  title: string;
  subtitle: string;
  explanation: string;
  targetView: string;
  defaultCorner: CornerDock;
  tip: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 1,
    title: '1. Elige tus Tratamientos',
    subtitle: 'Menú de Servicios',
    explanation: 'Explora nuestros servicios de corte, colorimetría, keratina y spa capilar. Puedes seleccionar uno o varios tocando "Agregar".',
    targetView: 'servicios',
    defaultCorner: 'bottom-right',
    tip: 'Tip: Filtra por categoría en la parte superior para encontrar tu estilo rápidamente.',
  },
  {
    id: 2,
    title: '2. Selecciona tu Fecha y Hora',
    subtitle: 'Agenda en Tiempo Real',
    explanation: 'Elige el día que prefieras y el horario que mejor se adapte a tu agenda. Nuestro sistema bloquea tu espacio en tiempo real.',
    targetView: 'reservar',
    defaultCorner: 'bottom-right',
    tip: 'Tip: Los días de quincena y fines de semana suelen llenarse rápido; te sugerimos agendar con antelación.',
  },
  {
    id: 3,
    title: '3. Elige a tu Estilista',
    subtitle: 'Atención Personalizada',
    explanation: 'Puedes elegir a tu especialista de confianza (Montserrat Medina, Andrea Flores o Elena Torres) o dejarlo en "Cualquier especialista".',
    targetView: 'reservar',
    defaultCorner: 'bottom-left',
    tip: 'Tip: Para Balayage Couture o cambios drásticos, Montserrat Medina es nuestra Master Colorist recomendada.',
  },
  {
    id: 4,
    title: '4. Confirma por WhatsApp',
    subtitle: 'Recordatorio y Cero Complicaciones',
    explanation: 'Ingresa tu nombre y teléfono para recibir tu folio y confirmación directa en WhatsApp con recordatorio automático.',
    targetView: 'reservar',
    defaultCorner: 'bottom-right',
    tip: 'Tip: No cobramos anticipo en línea. Pagas cómodamente al finalizar tu servicio en nuestro Atelier.',
  },
];

const CORNER_CLASSES: Record<CornerDock, string> = {
  'bottom-right': 'bottom-16 right-3 sm:bottom-20 sm:right-6',
  'bottom-left': 'bottom-16 left-3 sm:bottom-20 sm:left-6',
  'top-right': 'top-20 right-3 sm:top-24 sm:right-6',
  'top-left': 'top-20 left-3 sm:top-24 sm:left-6',
};

const CORNER_NAMES: Record<CornerDock, string> = {
  'bottom-right': 'Abajo Der ↘',
  'bottom-left': 'Abajo Izq ↙',
  'top-right': 'Arriba Der ↗',
  'top-left': 'Arriba Izq ↖',
};

const NEXT_CORNER: Record<CornerDock, CornerDock> = {
  'bottom-right': 'bottom-left',
  'bottom-left': 'top-left',
  'top-left': 'top-right',
  'top-right': 'bottom-right',
};

export function GuidedRobotTour({
  isOpen,
  onClose,
  onNavigate,
  currentNav,
  onOpenChat,
}: GuidedRobotTourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dockCorner, setDockCorner] = useState<CornerDock>('bottom-right');

  const currentStep = TOUR_STEPS[currentStepIndex];

  // Auto-navigate to view and synchronize corner preference
  useEffect(() => {
    if (isOpen) {
      const step = TOUR_STEPS[currentStepIndex];
      if (step && currentNav !== step.targetView) {
        onNavigate(step.targetView);
      }
      setIsSpeaking(true);
      setIsMinimized(false);
      const timer = setTimeout(() => setIsSpeaking(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentStepIndex]);

  // Reset to step 1 when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setIsMinimized(false);
      setDockCorner('bottom-right');
    }
  }, [isOpen]);

  // Auto-shrink on scroll down so it never blocks the page content
  useEffect(() => {
    if (!isOpen) return;

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // If user scrolls down significantly, minimize so as not to cover the screen
      if (currentScrollY > 100 && currentScrollY - lastScrollY > 15 && !isMinimized) {
        setIsMinimized(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen, isMinimized]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const cycleCorner = () => {
    setDockCorner(prev => NEXT_CORNER[prev]);
  };

  return (
    /* Completely free container - no dark backdrop! Users can see & interact with the site */
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden select-none">
      
      {/* Top Banner Guide Indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto z-[100]">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-espresso/95 text-white backdrop-blur-md border border-brand-gold/40 shadow-xl text-xs"
        >
          <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
          <span className="font-semibold text-brand-gold">Explicación paso a paso:</span>
          <span>Paso {currentStep.id} de {TOUR_STEPS.length}</span>
          <div className="h-3 w-px bg-white/20 mx-1" />
          <button
            onClick={onClose}
            className="hover:text-brand-gold transition-colors flex items-center gap-1 font-medium cursor-pointer"
          >
            <span>Finalizar</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>

      {/* AUTONOMOUS CORNER-DOCKED OR DRAGGABLE 3D SPHERE ROBOT */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        layout
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className={`absolute ${CORNER_CLASSES[dockCorner]} pointer-events-auto z-50 cursor-grab active:cursor-grabbing transition-[top,bottom,left,right] duration-500`}
      >
        <AnimatePresence mode="wait">
          {/* MINIMIZED MODE: Cute compact floating mini-orb in corner (al bajarle se achica automáticamente para no estorbar) */}
          {isMinimized ? (
            <motion.div
              key="minimized-robot"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              onClick={() => setIsMinimized(false)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-brand-surface/95 border border-brand-gold/60 shadow-[0_10px_30px_rgba(30,27,24,0.28)] backdrop-blur-md cursor-pointer hover:border-brand-gold transition-all active:scale-95 group"
              title="Toca para expandir la explicación"
            >
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 shrink-0">
                <Scene3D isSpeaking={isSpeaking} />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="font-serif font-bold text-xs text-brand-espresso">Paso {currentStep.id}</span>
                  <span className="text-[10px] text-brand-gold font-semibold">• Toca</span>
                </div>
                <span className="text-[10px] text-brand-muted truncate max-w-[130px]">{currentStep.subtitle}</span>
              </div>
              <Maximize2 className="w-3.5 h-3.5 text-brand-gold ml-1 group-hover:scale-110 transition-transform" />
            </motion.div>
          ) : (
            /* EXPANDED MODE: 3D Sphere with Speech Cloud emerging straight from mouth */
            <motion.div
              key="expanded-robot"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-[92vw] max-w-[370px] flex flex-col items-center"
            >
              {/* Floating Pure 3D Sphere Head */}
              <motion.div
                animate={{
                  y: [0, -6, 0],
                  rotate: isSpeaking ? [-2, 2, -2] : [0, 0, 0]
                }}
                transition={{
                  y: { repeat: Infinity, duration: 2.8, ease: 'easeInOut' },
                  rotate: { repeat: Infinity, duration: 1.1, ease: 'easeInOut' }
                }}
                className="relative flex flex-col items-center cursor-pointer select-none -mb-1 z-20"
                onClick={() => setIsSpeaking(true)}
                title="Toca para interactuar o arrastra la bolita a donde quieras"
              >
                {/* Luminous Pulsing Glow */}
                <div className="absolute w-24 h-24 rounded-full bg-radial from-[#FCE1AE]/60 via-[#DFB879]/25 to-transparent blur-lg pointer-events-none -top-1" />

                {/* 3D Ball */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[0_10px_20px_rgba(30,27,24,0.25)]">
                  <Scene3D isSpeaking={isSpeaking} />
                </div>

                {/* Floating Soft Shadow */}
                <div className="w-14 h-1.5 bg-brand-espresso/25 rounded-full blur-xs -mt-1" />
              </motion.div>

              {/* Connected Speech Cloud / Nube del Mensaje */}
              <div className="w-full relative bg-brand-surface/98 backdrop-blur-xl border border-brand-gold/50 rounded-3xl p-4 sm:p-5 shadow-[0_18px_45px_-10px_rgba(30,27,24,0.32),0_0_20px_rgba(223,184,121,0.18)] text-left">
                
                {/* Speech tail pointing directly up to the 3D ball's mouth */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-brand-surface/98 border-t border-l border-brand-gold/50 rotate-45" />

                {/* Header: Autonomous corner controls & actions */}
                <div className="flex items-center justify-between gap-1.5 mb-2 pb-2 border-b border-brand-border/40 text-[11px]">
                  
                  {/* Quick Corner Docking Button */}
                  <button
                    onClick={cycleCorner}
                    className="px-2 py-1 rounded-full bg-brand-surface-container hover:bg-brand-gold/20 text-brand-espresso font-semibold text-[10px] flex items-center gap-1 border border-brand-border/60 transition-colors active:scale-95 cursor-pointer"
                    title="Mover a otra esquina"
                  >
                    <Compass className="w-3 h-3 text-brand-gold" />
                    <span>{CORNER_NAMES[dockCorner]}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Minimize button (se achica) */}
                    <button
                      onClick={() => setIsMinimized(true)}
                      className="w-6 h-6 rounded-full bg-brand-surface-container hover:bg-brand-border text-brand-espresso flex items-center justify-center transition-colors cursor-pointer"
                      title="Achicar a la esquina para ver la pantalla"
                    >
                      <Minimize2 className="w-3 h-3" />
                    </button>

                    {/* Step pill */}
                    <span className="px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold font-bold text-[10px] tracking-wider uppercase border border-brand-gold/30">
                      {currentStep.id} / {TOUR_STEPS.length}
                    </span>

                    {/* Close button */}
                    <button
                      onClick={onClose}
                      className="w-6 h-6 rounded-full bg-brand-surface-container hover:bg-brand-border text-brand-espresso flex items-center justify-center transition-colors cursor-pointer"
                      title="Cerrar explicación"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Step Title & Explanation */}
                <h4 className="font-serif text-sm sm:text-base font-bold text-brand-espresso mb-1">
                  {currentStep.title}
                </h4>
                <p className="text-xs text-brand-espresso/90 leading-relaxed mb-2.5">
                  {currentStep.explanation}
                </p>

                {/* Tip pill */}
                <div className="p-2 rounded-xl bg-brand-surface-container/70 border border-brand-border/60 text-[11px] text-brand-muted flex items-start gap-1.5 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-0.5" />
                  <span className="leading-tight">{currentStep.tip}</span>
                </div>

                {/* Step Controls */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-brand-border/40">
                  {/* Step indicator dots */}
                  <div className="flex items-center gap-1">
                    {TOUR_STEPS.map((step, idx) => (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStepIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === currentStepIndex
                            ? 'w-5 bg-brand-gold'
                            : 'w-1.5 bg-brand-border hover:bg-brand-gold/40'
                        }`}
                        aria-label={`Paso ${step.id}`}
                      />
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-1.5">
                    {currentStepIndex > 0 && (
                      <button
                        onClick={handlePrev}
                        className="px-2.5 py-1.5 rounded-full border border-brand-border bg-brand-surface hover:bg-brand-surface-container text-brand-espresso text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        <span>Atrás</span>
                      </button>
                    )}

                    <button
                      onClick={handleNext}
                      className="px-3.5 py-1.5 rounded-full bg-brand-espresso text-white hover:bg-brand-espresso/90 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 border border-brand-gold/30 cursor-pointer"
                    >
                      {currentStepIndex === TOUR_STEPS.length - 1 ? (
                        <>
                          <span>¡Listo!</span>
                          <Check className="w-3 h-3 text-brand-gold" />
                        </>
                      ) : (
                        <>
                          <span>Siguiente</span>
                          <ArrowRight className="w-3 h-3 text-brand-gold" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick link back to chat if needed */}
                {onOpenChat && (
                  <div className="mt-2 text-center">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenChat();
                      }}
                      className="text-[10px] text-brand-muted hover:text-brand-gold transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>¿Prefieres preguntar algo en el chat?</span>
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}
