import React, { useState } from 'react';
import { Check, Star, ChevronDown, Clock, Sparkles, CreditCard, Banknote, Landmark } from 'lucide-react';
import { stylists, services } from '../data';

export function ReservarView({ selectedServices }: { selectedServices: string[] }) {
  const [selectedStylist, setSelectedStylist] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<number>(18);
  const [selectedTime, setSelectedTime] = useState<string>('16:30');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');

  const service = services.find(s => selectedServices.includes(s.id)) || services[0];
  const dates = [
    { day: 'Vie', num: 18 },
    { day: 'Sáb', num: 19 },
    { day: 'Dom', num: 20, disabled: true },
    { day: 'Lun', num: 21 },
    { day: 'Mar', num: 22 },
  ];
  
  const morningSlots = ['10:00', '11:30'];
  const afternoonSlots = ['14:00', '15:30', '16:30', '18:30'];

  return (
    <main className="px-5 md:px-10 pt-4 pb-32 max-w-3xl mx-auto space-y-8 w-full">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 px-2 mt-4 relative">
         <div className="absolute top-3 left-6 right-6 h-[2px] bg-brand-border -z-10" />
         <div className="absolute top-3 left-6 w-1/2 h-[2px] bg-brand-gold -z-10 transition-all duration-700" />
         
         <div className="flex flex-col items-center gap-2 bg-brand-surface px-2">
            <div className="w-6 h-6 rounded-full bg-brand-gold text-white shadow-sm flex items-center justify-center"><Check className="w-4 h-4" /></div>
            <span className="text-[9px] font-bold tracking-widest uppercase text-brand-gold">1. Servicio</span>
         </div>
         
         <div className="flex flex-col items-center gap-2 bg-brand-surface px-2">
            <div className="w-6 h-6 rounded-full bg-brand-espresso text-white shadow-md flex items-center justify-center text-xs ring-4 ring-brand-surface">2</div>
            <span className="text-[9px] font-bold tracking-widest uppercase text-brand-espresso">2. Fecha</span>
         </div>
         
         <div className="flex flex-col items-center gap-2 bg-brand-surface px-2 opacity-50">
            <div className="w-6 h-6 rounded-full bg-brand-surface-container text-brand-espresso flex items-center justify-center text-xs border border-brand-border">3</div>
            <span className="text-[9px] font-bold tracking-widest uppercase">3. Confirmar</span>
         </div>
      </div>

      {/* Selected Service */}
      <section className="bg-brand-surface-container/50 border border-brand-border/50 p-4 rounded-3xl flex items-center gap-4">
        <img referrerPolicy="no-referrer" src={service.imageUrl} className="w-16 h-16 rounded-xl object-cover" />
        <div className="flex-1">
           <div className="flex justify-between items-start">
              <span className="text-[9px] font-bold tracking-widest uppercase text-brand-muted mb-1 block">Servicio Seleccionado</span>
              <button className="text-xs font-semibold text-brand-muted underline">Cambiar</button>
           </div>
           <h4 className="font-serif text-lg font-semibold leading-tight mb-1">{service.title}</h4>
           <div className="flex justify-between items-end">
              <p className="text-[11px] text-brand-muted">{service.duration} min • {service.category}</p>
              <p className="font-serif font-semibold text-lg">${service.price.toLocaleString()} MXN</p>
           </div>
        </div>
      </section>

      {/* Stylists */}
      <section>
        <div className="flex justify-between items-end mb-4">
           <div>
             <span className="text-[10px] font-bold tracking-widest uppercase text-brand-muted block mb-1">Atelier Masters</span>
             <h3 className="font-serif text-2xl font-semibold text-brand-espresso">Selecciona tu Estilista</h3>
           </div>
           <span className="text-xs text-brand-muted font-medium">3 disponibles</span>
        </div>
        
        <div className="space-y-3">
           {/* Any */}
           <div onClick={() => setSelectedStylist('any')} className={`p-4 rounded-3xl border cursor-pointer active:scale-[0.98] flex items-center gap-4 transition-all duration-300 hover:shadow-md ${selectedStylist === 'any' ? 'border-brand-gold ring-1 ring-brand-gold bg-brand-surface-container/50' : 'border-brand-border bg-brand-surface hover:border-brand-gold/50'}`}>
              <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
                <Star className="w-5 h-5 fill-brand-gold" />
              </div>
              <div className="flex-1">
                 <div className="flex items-center gap-2">
                   <h4 className="font-serif text-lg font-semibold">Cualquier estilista</h4>
                   <span className="bg-brand-gold text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest shadow-sm">Recomendado</span>
                 </div>
                 <p className="text-xs text-brand-muted mt-0.5">Asignación óptima según tu horario</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedStylist === 'any' ? 'border-brand-gold bg-brand-gold' : 'border-brand-border'}`}>
                 {selectedStylist === 'any' && <div className="w-2.5 h-2.5 bg-brand-surface rounded-full" />}
              </div>
           </div>
           
           {/* List */}
           {stylists.map(stylist => (
             <div key={stylist.id} onClick={() => setSelectedStylist(stylist.id)} className={`p-4 rounded-3xl border cursor-pointer active:scale-[0.98] flex items-center gap-4 transition-all duration-300 hover:shadow-md ${selectedStylist === stylist.id ? 'border-brand-gold ring-1 ring-brand-gold bg-brand-surface-container/50' : 'border-brand-border bg-brand-surface hover:border-brand-gold/50'}`}>
                <img referrerPolicy="no-referrer" src={stylist.imageUrl} className="w-12 h-12 rounded-full object-cover shadow-sm shrink-0" />
                <div className="flex-1">
                   <h4 className="font-serif text-lg font-semibold">{stylist.name}</h4>
                   <p className="text-[11px] text-brand-muted mb-1">{stylist.title}</p>
                   <div className="flex items-center gap-2 text-[10px] font-semibold text-brand-muted mt-2">
                     <span className="bg-brand-surface-container px-2 py-0.5 rounded-full flex items-center gap-1">4.9 ★</span>
                     {stylist.isAvailableToday && <span className="flex items-center gap-1 text-green-700/80"><span className="w-1.5 h-1.5 rounded-full bg-green-600"/> Hoy</span>}
                   </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedStylist === stylist.id ? 'border-brand-gold bg-brand-gold' : 'border-brand-border'}`}>
                   {selectedStylist === stylist.id && <div className="w-2.5 h-2.5 bg-brand-surface rounded-full" />}
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Date */}
      <section>
        <div className="flex justify-between items-center mb-4">
           <span className="text-[10px] font-bold tracking-widest uppercase text-brand-muted block">Disponibilidad</span>
        </div>
        <h3 className="font-serif text-2xl font-semibold text-brand-espresso mb-4">Octubre 2026</h3>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {dates.map(date => (
             <button 
               key={date.num} 
               onClick={() => !date.disabled && setSelectedDate(date.num)}
               disabled={date.disabled}
               className={`min-w-[75px] p-3 rounded-2xl flex flex-col items-center gap-1 transition-all duration-300 ${
                 date.disabled ? 'opacity-30 cursor-not-allowed' :
                 selectedDate === date.num ? 'bg-brand-espresso text-white shadow-lg scale-105' : 'bg-brand-surface-container/50 border border-brand-border hover:bg-brand-surface-container active:scale-95 hover:shadow-sm active:scale-95'
               }`}
             >
                {date.num === 18 && <span className="text-[8px] font-bold uppercase tracking-widest mb-1">Hoy</span>}
                <span className="font-serif text-xl font-semibold">{date.num}</span>
                <span className="text-xs">{date.day}</span>
             </button>
          ))}
        </div>
      </section>

      {/* Times */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-serif text-2xl font-semibold text-brand-espresso">Horarios Disponibles</h3>
          <span className="text-xs text-brand-muted flex items-center gap-1"><Clock className="w-3 h-3"/> Zona horaria: CDMX</span>
        </div>
        
        <div>
           <div className="flex items-center gap-2 mb-3 text-brand-muted">
             <span className="text-[10px] font-bold uppercase tracking-widest">Turno de Mañana</span>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             {morningSlots.map(time => (
                <button 
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-3 rounded-xl text-sm font-semibold transition-colors ${
                    selectedTime === time ? 'bg-brand-espresso text-white' : 'bg-brand-surface-container/30 border border-brand-border hover:bg-brand-surface-container active:scale-95'
                  }`}
                >
                  {time}
                </button>
             ))}
           </div>
        </div>

        <div>
           <div className="flex items-center gap-2 mb-3 text-brand-muted">
             <span className="text-[10px] font-bold uppercase tracking-widest">Turno de Tarde</span>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             {afternoonSlots.map(time => (
                <button 
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-3 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors ${
                    selectedTime === time ? 'bg-brand-espresso text-white' : 'bg-brand-surface-container/30 border border-brand-border hover:bg-brand-surface-container active:scale-95'
                  }`}
                >
                  {selectedTime === time && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"/>}
                  {time}
                </button>
             ))}
           </div>
        </div>
      </section>

      {/* Payment Method */}
      <section className="space-y-4 pt-4">
        <div>
           <span className="text-[10px] font-bold tracking-widest uppercase text-brand-muted block mb-1">Paso Final</span>
           <h3 className="font-serif text-2xl font-semibold text-brand-espresso">Método de Pago</h3>
        </div>
        
        <div className="space-y-3">
           <div onClick={() => setSelectedPaymentMethod('card')} className={`p-4 rounded-3xl border cursor-pointer active:scale-[0.98] flex items-center gap-4 transition-all duration-300 hover:shadow-md ${selectedPaymentMethod === 'card' ? 'border-brand-gold ring-1 ring-brand-gold bg-brand-surface-container/50' : 'border-brand-border bg-brand-surface hover:border-brand-gold/50'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${selectedPaymentMethod === 'card' ? 'bg-brand-gold text-white shadow-sm' : 'bg-brand-surface-container text-brand-muted border border-brand-border/60'}`}>
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="flex-1">
                 <h4 className="font-semibold text-brand-espresso text-sm md:text-base">Tarjeta de Crédito / Débito</h4>
                 <p className="text-[11px] text-brand-muted mt-0.5">Pago seguro en línea o terminal</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPaymentMethod === 'card' ? 'border-brand-gold bg-brand-gold' : 'border-brand-border'}`}>
                 {selectedPaymentMethod === 'card' && <Check className="w-3 h-3 text-white" />}
              </div>
           </div>

           <div onClick={() => setSelectedPaymentMethod('transfer')} className={`p-4 rounded-3xl border cursor-pointer active:scale-[0.98] flex items-center gap-4 transition-all duration-300 hover:shadow-md ${selectedPaymentMethod === 'transfer' ? 'border-brand-gold ring-1 ring-brand-gold bg-brand-surface-container/50' : 'border-brand-border bg-brand-surface hover:border-brand-gold/50'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${selectedPaymentMethod === 'transfer' ? 'bg-brand-gold text-white shadow-sm' : 'bg-brand-surface-container text-brand-muted border border-brand-border/60'}`}>
                <Landmark className="w-5 h-5" />
              </div>
              <div className="flex-1">
                 <h4 className="font-semibold text-brand-espresso text-sm md:text-base">Transferencia Bancaria</h4>
                 <p className="text-[11px] text-brand-muted mt-0.5">Vía banca móvil o SPEI</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPaymentMethod === 'transfer' ? 'border-brand-gold bg-brand-gold' : 'border-brand-border'}`}>
                 {selectedPaymentMethod === 'transfer' && <Check className="w-3 h-3 text-white" />}
              </div>
           </div>

           <div onClick={() => setSelectedPaymentMethod('cash')} className={`p-4 rounded-3xl border cursor-pointer active:scale-[0.98] flex items-center gap-4 transition-all duration-300 hover:shadow-md ${selectedPaymentMethod === 'cash' ? 'border-brand-gold ring-1 ring-brand-gold bg-brand-surface-container/50' : 'border-brand-border bg-brand-surface hover:border-brand-gold/50'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${selectedPaymentMethod === 'cash' ? 'bg-brand-gold text-white shadow-sm' : 'bg-brand-surface-container text-brand-muted border border-brand-border/60'}`}>
                <Banknote className="w-5 h-5" />
              </div>
              <div className="flex-1">
                 <h4 className="font-semibold text-brand-espresso text-sm md:text-base">Efectivo en Salón</h4>
                 <p className="text-[11px] text-brand-muted mt-0.5">Pago físico al finalizar el servicio</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPaymentMethod === 'cash' ? 'border-brand-gold bg-brand-gold' : 'border-brand-border'}`}>
                 {selectedPaymentMethod === 'cash' && <Check className="w-3 h-3 text-white" />}
              </div>
           </div>
        </div>
      </section>

      {/* Action Summary */}
      <div className="pt-8 border-t border-brand-border/60 mt-4">
         <div className="flex justify-between items-center mb-4">
            <span className="font-serif text-lg font-semibold text-brand-espresso">Total Estimado</span>
            <span className="font-serif text-xl font-bold text-brand-espresso">${service.price} USD</span>
         </div>
         <button className="w-full py-4 bg-brand-espresso text-white rounded-full text-sm font-semibold shadow-md hover:bg-brand-espresso/90 hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
           Confirmar Reserva <Check className="w-4 h-4" />
         </button>
      </div>

    </main>
  )
}
