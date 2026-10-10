import { useEffect, useState } from 'react';
import { Cookie, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import {
  OPEN_COOKIE_PREFERENCES_EVENT,
  readCookiePreferences,
  saveCookiePreferences,
  type CookieChoice,
} from '../lib/cookiePreferences';

export function CookieConsent({ onOpenPolicy }: { onOpenPolicy: () => void }) {
  const [open, setOpen] = useState(() => readCookiePreferences() === null);

  useEffect(() => {
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, reopen);
  }, []);

  const choose = (choice: CookieChoice) => {
    saveCookiePreferences(choice);
    setOpen(false);
  };

  return open ? (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-brand-espresso/60 p-3 backdrop-blur-sm sm:items-center sm:p-6" role="presentation">
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-consent-title"
        className="w-full max-w-xl rounded-3xl border border-brand-border bg-brand-surface p-6 shadow-2xl md:p-8"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold"><Cookie className="h-5 w-5" /></div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[.2em] text-brand-gold">Tus preferencias</p>
        <h2 id="cookie-consent-title" className="mb-3 font-serif text-2xl font-semibold text-brand-espresso">Elige cómo usar cookies y contenido externo</h2>
        <p className="mb-4 text-sm leading-6 text-brand-muted">Guardamos tu elección en este navegador, sin necesidad de cuenta, para no volver a mostrar este aviso. El sitio no incorpora cookies publicitarias ni herramientas de analítica. Si aceptas todo, se cargarán imágenes del catálogo desde Unsplash; si eliges solo las necesarias, se bloquearán esas imágenes externas y se mostrarán recursos locales.</p>
        <p className="mb-5 flex gap-2 rounded-2xl bg-brand-surface-container/60 p-3 text-xs leading-5 text-brand-muted"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />Las consultas a MontIA+ solo se envían al servicio de IA cuando tú las mandas; esto se explica en el Aviso de privacidad y no depende de esta preferencia de almacenamiento.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button onClick={() => choose('all')} className="flex-1 rounded-full bg-brand-espresso px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-gold">Aceptar todo y continuar</button>
          <button onClick={() => choose('necessary')} className="flex-1 rounded-full border border-brand-border bg-brand-surface px-5 py-3 text-sm font-semibold text-brand-espresso transition hover:bg-brand-surface-container">Solo necesarias</button>
        </div>
        <button onClick={onOpenPolicy} className="mt-4 w-full text-center text-xs font-medium text-brand-muted underline decoration-brand-gold/60 underline-offset-4 hover:text-brand-espresso">Leer la Política de Cookies</button>
      </motion.section>
    </div>
  ) : null;
}
