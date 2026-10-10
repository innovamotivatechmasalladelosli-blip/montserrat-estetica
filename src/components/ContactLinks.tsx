import { Facebook, MessageCircle } from 'lucide-react';

export const BUSINESS_PHONE_DISPLAY = '+52 33 1862 0707';
export const BUSINESS_PHONE_E164 = '+523318620707';
export const BUSINESS_WHATSAPP_URL = 'https://wa.me/523318620707?text=Hola%2C%20quiero%20hacer%20una%20consulta%20sobre%20sus%20servicios.';
export const BUSINESS_FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=100042202250248';

export function ContactLinks({ variant = 'subtle' }: { variant?: 'subtle' | 'booking' }) {
  if (variant === 'booking') {
    return (
      <section className="rounded-2xl border border-brand-border/60 bg-brand-surface-container/35 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="mb-3 sm:mb-0">
          <h3 className="font-serif text-base font-semibold text-brand-espresso">¿Tienes dudas antes de reservar?</h3>
          <a href={`tel:${BUSINESS_PHONE_E164}`} className="mt-1 inline-block text-xs text-brand-muted underline decoration-brand-gold/50 underline-offset-2">Llama al {BUSINESS_PHONE_DISPLAY}</a>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={BUSINESS_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-brand-espresso px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-gold">
            <MessageCircle className="h-4 w-4 text-brand-gold" /> WhatsApp
          </a>
          <a href={BUSINESS_FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Visitar Facebook de Montserrat Medina Estética" className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-surface px-4 py-2.5 text-xs font-semibold text-brand-espresso transition hover:border-brand-gold hover:bg-brand-surface-container">
            <Facebook className="h-4 w-4 text-brand-gold" /> Facebook
          </a>
        </div>
      </section>
    );
  }

  return (
    <nav aria-label="Contacto y redes sociales" className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-brand-muted">
      <a href={BUSINESS_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition hover:text-brand-espresso">
        <MessageCircle className="h-3.5 w-3.5 text-brand-gold" /> WhatsApp
      </a>
      <a href={BUSINESS_FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition hover:text-brand-espresso">
        <Facebook className="h-3.5 w-3.5 text-brand-gold" /> Facebook
      </a>
    </nav>
  );
}
