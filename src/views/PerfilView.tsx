import React from 'react';
import { motion } from 'motion/react';
import { UserCircle2, Calendar, Clock, ChevronRight, MapPin, Sparkles, CreditCard, Settings, LogOut, Award } from 'lucide-react';

export function PerfilView() {
  const pastServices = [
    { id: 1, name: 'Corte Botánico y Peinado', date: '15 Ago, 2026', stylist: 'Elena R.', price: '$1,700 MXN' },
    { id: 2, name: 'Tratamiento de Reconstrucción Molecular', date: '2 Jul, 2026', stylist: 'Sofía M.', price: '$2,400 MXN' },
    { id: 3, name: 'Retoque de Color y Brillo', date: '10 May, 2026', stylist: 'Elena R.', price: '$3,000 MXN' },
  ];

  return (
    <main className="px-5 md:px-10 pt-6 pb-28 max-w-4xl mx-auto w-full space-y-10">
      {/* User Header */}
      <section className="flex flex-col items-center text-center mt-4 mb-8">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-brand-surface-container border-2 border-brand-gold p-1">
            <img referrerPolicy="no-referrer" 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-brand-espresso text-brand-gold p-1.5 rounded-full shadow-lg border border-brand-gold/30">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-brand-espresso">Isabella Carter</h2>
        <span className="text-[10px] font-bold tracking-widest uppercase text-brand-gold mt-1">Miembro Signature</span>
      </section>

      {/* Upcoming Appointment */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-lg font-semibold text-brand-espresso">Próxima Cita</h3>
        </div>
        <div className="bg-brand-surface-container/50 border border-brand-border rounded-3xl p-5 hover:bg-brand-surface-container/80 transition-colors cursor-pointer active:bg-brand-surface-container active:scale-[0.98]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-semibold text-brand-espresso mb-1">Balayage Couture y Olaplex</h4>
              <p className="text-xs text-brand-muted">con Elena R.</p>
            </div>
            <div className="bg-brand-espresso text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
              Confirmada
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-4 border-t border-brand-border/60">
            <div className="text-sm text-brand-espresso font-medium">
              18 Octubre, 2026
            </div>
            <div className="text-sm text-brand-espresso font-medium">
              16:30 hrs
            </div>
          </div>
        </div>
      </section>

      {/* Historial de Servicios Anteriores */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-lg font-semibold text-brand-espresso">Servicios Anteriores</h3>
        </div>
        <div className="bg-brand-surface-container/30 border border-brand-border rounded-3xl overflow-hidden">
          {pastServices.map((service, index) => (
            <div key={service.id} className={`p-5 flex items-center justify-between hover:bg-brand-surface-container/60 cursor-pointer active:bg-brand-surface-container active:scale-[0.98] transition-colors ${index !== pastServices.length - 1 ? 'border-b border-brand-border/60' : ''}`}>
              <div>
                <h4 className="font-semibold text-brand-espresso text-sm mb-1">{service.name}</h4>
                <div className="flex items-center gap-3 text-[11px] text-brand-muted">
                  <span>{service.date}</span>
                  <span>{service.stylist}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-brand-espresso block">{service.price}</span>
                <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest mt-0.5 block">Reagendar</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Account Menu */}
      <section className="bg-brand-surface-container/30 border border-brand-border rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-brand-border/60 flex items-center justify-between hover:bg-brand-surface-container/60 cursor-pointer active:bg-brand-surface-container active:scale-[0.98] transition-colors">
          <div className="flex items-center gap-4">
            <div>
              <h4 className="text-sm font-semibold text-brand-espresso">Preferencias de Visita</h4>
              <p className="text-[11px] text-brand-muted">Bebidas, música y nivel de conversación</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-brand-border/60 flex items-center justify-between hover:bg-brand-surface-container/60 cursor-pointer active:bg-brand-surface-container active:scale-[0.98] transition-colors">
          <div className="flex items-center gap-4">
            <div>
              <h4 className="text-sm font-semibold text-brand-espresso">Métodos de Pago</h4>
              <p className="text-[11px] text-brand-muted">Tarjetas y facturación</p>
            </div>
          </div>
        </div>

        <div className="p-4 flex items-center justify-between hover:bg-brand-surface-container/60 cursor-pointer active:bg-brand-surface-container active:scale-[0.98] transition-colors">
          <div className="flex items-center gap-4">
            <div>
              <h4 className="text-sm font-semibold text-brand-espresso">Configuración</h4>
              <p className="text-[11px] text-brand-muted">Notificaciones y seguridad</p>
            </div>
          </div>
        </div>
      </section>

      {/* Logout */}
      <button className="w-full py-4 flex items-center justify-center gap-2 text-sm font-semibold text-red-800/70 hover:text-red-800 transition-colors active:scale-95">
        Cerrar Sesión
      </button>

    </main>
  );
}
