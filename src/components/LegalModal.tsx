import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { BUSINESS_FACEBOOK_URL, BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_E164, BUSINESS_WHATSAPP_URL } from './ContactLinks';

export type LegalPage = 'terms' | 'copyright' | 'privacy' | 'cookies';

const pageTitles: Record<LegalPage, string> = {
  terms: 'Términos y condiciones de servicio',
  copyright: 'Aviso de derechos de autor',
  privacy: 'Aviso de privacidad',
  cookies: 'Política de cookies',
};

const BUSINESS_ADDRESS = 'Avenida Concepción 5985, 45654 La Arbolada Plus, Jalisco, México';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mb-6"><h3 className="mb-2 font-serif text-lg font-semibold text-brand-espresso">{title}</h3><div className="space-y-3">{children}</div></section>;
}

function ContactParagraph() {
  return <p>Contacto de Montserrat Medina Estética: <a className="font-semibold underline" href={`tel:${BUSINESS_PHONE_E164}`}>{BUSINESS_PHONE_DISPLAY}</a> por llamada o <a className="font-semibold underline" href={BUSINESS_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>. Domicilio: <strong>{BUSINESS_ADDRESS}</strong>. También puedes visitar el <a className="font-semibold underline" href={BUSINESS_FACEBOOK_URL} target="_blank" rel="noopener noreferrer">perfil de Facebook</a>.</p>;
}

export function LegalModal({ page, onClose }: { page: LegalPage | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {page && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-brand-espresso/55 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        >
          <motion.section
            role="dialog" aria-modal="true" aria-labelledby="legal-title"
            className="relative flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-brand-surface shadow-2xl sm:rounded-3xl"
            initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 28, opacity: 0 }} onClick={event => event.stopPropagation()}
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-border bg-brand-surface/95 px-5 py-4 backdrop-blur md:px-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-brand-gold">Montserrat Medina Estética</p>
                <h2 id="legal-title" className="mt-1 font-serif text-xl font-semibold text-brand-espresso">{pageTitles[page]}</h2>
              </div>
              <button onClick={onClose} aria-label="Cerrar" className="rounded-full border border-brand-border p-2 text-brand-muted hover:bg-brand-surface-container"><X className="h-4 w-4" /></button>
            </header>
            <article className="overflow-y-auto px-5 py-6 text-sm leading-7 text-brand-espresso md:px-8">
              {page === 'terms' && <>
                <p className="mb-5"><strong>Última actualización: 10 de octubre de 2026.</strong> Estos términos describen el uso del sitio de Montserrat Medina Estética y sus herramientas de orientación capilar y selección de servicios. Se aplican sin limitar los derechos que reconoce la legislación mexicana de protección al consumidor.</p>
                <Section title="1. Proveedor y contacto"><p>El establecimiento se identifica en este sitio como Montserrat Medina Estética. Su domicilio es <strong>{BUSINESS_ADDRESS}</strong>. Para consultas sobre servicios, precios, horarios o estas condiciones, comunícate al <a className="font-semibold underline" href={`tel:${BUSINESS_PHONE_E164}`}>{BUSINESS_PHONE_DISPLAY}</a> o por <a className="font-semibold underline" href={BUSINESS_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>.</p></Section>
                <Section title="2. Catálogo, precios y servicios"><p>Las descripciones, imágenes, precios y duraciones publicados son informativos y se confirman con el establecimiento antes de realizar un servicio. Antes de un procedimiento, solicita que te expliquen el alcance, el precio total, el tiempo estimado y las precauciones pertinentes. Los resultados capilares pueden variar según el estado e historial del cabello y sus cuidados.</p><p>El flujo actual de reserva es demostrativo: una selección en pantalla no se envía al establecimiento, no bloquea disponibilidad ni confirma una cita. Las fechas y precios mostrados deben corroborarse por WhatsApp o llamada antes de acudir.</p></Section>
                <Section title="3. Pagos, cambios y cancelaciones"><p>Los controles de métodos de pago de esta versión son ilustrativos y no procesan cobros. Antes de acordar una cita, anticipo, cambio o cancelación, confirma directamente con el establecimiento las condiciones vigentes. Ningún término pretende renunciar a los derechos reconocidos por la ley.</p></Section>
                <Section title="4. MontIA+, fotos y recomendaciones"><p>MontIA+ ofrece ideas preliminares de cuidado capilar a partir de la descripción o fotografía que envíes, y puede sugerir tratamientos o productos que aparezcan en el catálogo. Una imagen no confirma diagnósticos, alergias, historial químico ni resultados, y una recomendación automatizada no sustituye la valoración presencial. Consulta a una persona profesional antes de un procedimiento químico y solicita una prueba de mechón cuando corresponda.</p><p>No uses el asistente para urgencias o problemas médicos. Evita subir imágenes de terceras personas sin su permiso o compartir datos personales que no sean necesarios.</p></Section>
                <Section title="5. Uso del sitio"><p>Utiliza el sitio de forma lícita y respetuosa. No intentes interferir con su funcionamiento, acceder sin autorización, suplantar a otra persona ni publicar contenido ilícito.</p></Section>
                <Section title="6. Propiedad intelectual"><p>El uso de textos, identidad visual, marcas y materiales está sujeto al <button className="font-semibold underline" onClick={() => window.dispatchEvent(new CustomEvent('open-legal-page', { detail: 'copyright' }))}>Aviso de derechos de autor</button>. Las marcas y productos de terceros pertenecen a sus respectivos titulares.</p></Section>
                <Section title="7. Privacidad y cookies"><p>El envío de mensajes e imágenes a MontIA+ se describe en el <button className="font-semibold underline" onClick={() => window.dispatchEvent(new CustomEvent('open-legal-page', { detail: 'privacy' }))}>Aviso de privacidad</button>. Puedes revisar o cambiar el uso de imágenes externas en la <button className="font-semibold underline" onClick={() => window.dispatchEvent(new CustomEvent('open-legal-page', { detail: 'cookies' }))}>Política de Cookies</button> y desde el acceso «Preferencias de cookies» del pie de página.</p><ContactParagraph /></Section>
              </>}

              {page === 'copyright' && <>
                <p className="mb-5"><strong>© 2026 Montserrat Medina Estética. Todos los derechos reservados.</strong></p>
                <Section title="Contenido propio y materiales de terceros"><p>La identidad de Montserrat Medina Estética y los textos y diseños originales que presenta el sitio se identifican con este aviso. Los derechos de cada obra corresponden a su titular. Las fotografías del catálogo se sirven desde Unsplash y los nombres, logotipos y marcas de productos pertenecen a sus respectivos titulares; su presencia no implica que sean propiedad del establecimiento ni que exista patrocinio.</p></Section>
                <Section title="Uso del contenido"><p>La consulta del sitio es para uso personal e informativo. No se concede permiso para reproducir o explotar comercialmente contenido protegido ni marcas de terceros. Los usos permitidos por la legislación aplicable permanecen vigentes.</p></Section>
                <Section title="Solicitudes"><p>Para solicitar autorización sobre materiales identificados con Montserrat Medina Estética o comunicar una inquietud de derechos, comunícate al <a className="font-semibold underline" href={`tel:${BUSINESS_PHONE_E164}`}>{BUSINESS_PHONE_DISPLAY}</a> o por <a className="font-semibold underline" href={BUSINESS_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>.</p><ContactParagraph /></Section>
              </>}

              {page === 'privacy' && <>
                <p className="mb-5"><strong>Responsable:</strong> Montserrat Medina Estética. <strong>Domicilio:</strong> {BUSINESS_ADDRESS}. <strong>Contacto:</strong> <a className="font-semibold underline" href={`tel:${BUSINESS_PHONE_E164}`}>{BUSINESS_PHONE_DISPLAY}</a> o <a className="font-semibold underline" href={BUSINESS_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>.</p>
                <Section title="Qué información se utiliza"><p>El texto y las imágenes que tú decides enviar a MontIA+ se reciben para responder a tu consulta. No se requiere crear una cuenta. El formulario de reserva del sitio es demostrativo: la selección de servicio, especialista y horario no se transmite al establecimiento ni se guarda como una cita. La página de perfil contiene contenido de muestra, no un expediente personal conectado a una cuenta.</p></Section>
                <Section title="Uso y proveedor de IA"><p>Cuando envías una consulta o una fotografía al asistente, el servidor de Montserrat Medina Estética la transmite a Google Gemini para generar una respuesta. Google recibe el contenido necesario para procesar esa solicitud y aplica sus propias condiciones y prácticas de privacidad; consulta la <a className="font-semibold underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Política de Privacidad de Google</a>. No envíes información sensible, imágenes de otras personas sin autorización ni datos que no sean necesarios para la consulta.</p></Section>
                <Section title="Imágenes del catálogo"><p>Si aceptas la carga de contenido externo en Preferencias de cookies, las imágenes del sitio se solicitan desde Unsplash. Esa solicitud puede transmitir a dicho proveedor datos técnicos de conexión, como la dirección IP y datos del navegador. Si eliges «Solo necesarias», el sitio bloquea esas imágenes externas y muestra recursos locales.</p></Section>
                <Section title="Conservación y controles"><p>La aplicación web no ofrece inicio de sesión ni guarda las conversaciones o imágenes en un perfil o historial del servidor de la aplicación. El contenido enviado se procesa para responder; el tratamiento que realice Google se sujeta a las condiciones enlazadas arriba. La elección sobre imágenes externas se guarda en el almacenamiento local de este navegador hasta que borres sus datos o cambies la preferencia.</p></Section>
                <Section title="Solicitudes sobre tus datos"><p>Para preguntar o presentar una solicitud relacionada con datos personales, llama al <a className="font-semibold underline" href={`tel:${BUSINESS_PHONE_E164}`}>{BUSINESS_PHONE_DISPLAY}</a> o escribe por <a className="font-semibold underline" href={BUSINESS_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>. Describe tu petición con la información necesaria para localizar la consulta; no envíes documentos de identidad ni información sensible por un canal que no hayas verificado.</p><ContactParagraph /></Section>
              </>}

              {page === 'cookies' && <>
                <p className="mb-5"><strong>Última actualización: 10 de octubre de 2026.</strong> Esta política describe las preferencias de almacenamiento y la carga de imágenes externas de Montserrat Medina Estética.</p>
                <Section title="Cookies y almacenamiento del navegador"><p>El sitio no instala cookies publicitarias ni herramientas de analítica. Guarda tu elección de preferencias en el almacenamiento local (localStorage) de este navegador; este registro permite recordar la opción aunque no tengas cuenta. No se transmite al establecimiento. Permanece hasta que borres los datos del sitio o selecciones otra preferencia desde «Preferencias de cookies» al pie de la página.</p></Section>
                <Section title="Qué hace cada opción"><p><strong>Aceptar todo y continuar:</strong> recuerda tu elección y permite cargar las imágenes externas del catálogo desde Unsplash. La solicitud de imágenes puede revelar a Unsplash datos técnicos como la dirección IP y el navegador. <strong>Solo necesarias:</strong> recuerda esa preferencia y bloquea las solicitudes a imágenes externas; se muestran recursos locales en su lugar. Ambas opciones permiten usar las funciones principales y el chat de MontIA+.</p></Section>
                <Section title="Consultas a MontIA+"><p>El texto o imagen que envías al asistente se transmite a Google Gemini para responder a tu petición. Esa transferencia ocurre únicamente cuando pulsas enviar y no se activa ni se cambia con las preferencias de cookies. Consulta los detalles en el <button className="font-semibold underline" onClick={() => window.dispatchEvent(new CustomEvent('open-legal-page', { detail: 'privacy' }))}>Aviso de privacidad</button>.</p></Section>
                <Section title="Cambiar o retirar tu elección"><p>El aviso se muestra en la primera visita y no vuelve a aparecer después de que elijas una opción. Puedes cambiarla en cualquier momento mediante «Preferencias de cookies» en el pie de página. También puedes borrar el almacenamiento local desde la configuración del navegador; si lo haces, volveremos a preguntarte en la siguiente visita.</p></Section>
                <Section title="Contacto"><ContactParagraph /></Section>
              </>}
            </article>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
