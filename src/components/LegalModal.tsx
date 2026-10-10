import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

export type LegalPage = 'terms' | 'copyright' | 'privacy' | 'cookies';

const pageTitles: Record<LegalPage, string> = {
  terms: 'Términos y condiciones de servicio',
  copyright: 'Aviso de derechos de autor',
  privacy: 'Aviso de privacidad',
  cookies: 'Política de cookies',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mb-6"><h3 className="mb-2 font-serif text-lg font-semibold text-brand-espresso">{title}</h3><div className="space-y-3">{children}</div></section>;
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
              <p className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs leading-5 text-amber-950">
                <strong>Información del negocio pendiente:</strong> antes de publicar, sustituye los campos señalados con los datos reales del titular y confirma el inventario de tecnologías del sitio. El texto es un borrador general para México, no asesoría legal ni garantía de cumplimiento.
              </p>

              {page === 'terms' && <>
                <p className="mb-5"><strong>Última actualización:</strong> 10 de octubre de 2026. Estos términos describen el uso del sitio de Montserrat Medina Estética. Al navegar o usar sus herramientas, aceptas estas condiciones en lo que resulte aplicable y sin perder los derechos irrenunciables que te concede la legislación de protección al consumidor.</p>
                <Section title="1. Titular y alcance"><p>El titular u operador del sitio es <strong>[NOMBRE O RAZÓN SOCIAL DEL PROVEEDOR]</strong>, con domicilio en <strong>[DOMICILIO COMPLETO]</strong> y contacto en <strong>[CORREO Y TELÉFONO]</strong>. El sitio presenta información del atelier, catálogo de servicios y productos, orientación de MontIA+, y herramientas para revisar tratamientos, seleccionar opciones y preparar una solicitud de cita.</p></Section>
                <Section title="2. Catálogo, cotizaciones y servicios"><p>Las descripciones, imágenes, precios y duraciones son informativos y pueden requerir confirmación. Antes de realizar un procedimiento, el negocio debe comunicar el diagnóstico profesional cuando corresponda, el alcance, el precio total, el tiempo estimado, las precauciones y cualquier cargo adicional. Los resultados de tratamientos capilares varían según el estado, historial químico, mantenimiento y características individuales del cabello.</p><p>La selección de servicios en pantalla no crea por sí misma un contrato ni garantiza disponibilidad. Las fechas, horarios y totales que muestra la versión actual son un prototipo; no se sincronizan con una agenda real, no envían una solicitud al negocio y no reservan un horario. Confirma por un canal oficial antes de desplazarte.</p></Section>
                <Section title="3. Métodos de pago, cambios y cancelaciones"><p>Los selectores de pago visibles en esta versión son ilustrativos y no procesan tarjetas ni cobros. Antes de aceptar un anticipo, pago, cambio o cancelación, el proveedor debe informar de forma clara la política aplicable y sus efectos. Ninguna condición de estos términos pretende limitar derechos legales de la clientela ni sustituir la solución de controversias ante las autoridades competentes.</p></Section>
                <Section title="4. MontIA+, fotos y recomendaciones"><p>MontIA+ permite preguntar por tipo de cabello, objetivos, ideas de estilo, tratamientos y productos; también puedes adjuntar una imagen voluntariamente. El análisis automatizado es una referencia visual y no confirma diagnóstico, alergias, historial químico, compatibilidad ni resultado. No garantiza que un tratamiento sea seguro o adecuado. Antes de un procedimiento químico, solicita una valoración presencial y una prueba de mechón cuando la especialista lo considere pertinente.</p><p>No utilices el asistente para urgencias o problemas médicos. Ante irritación, lesión, caída repentina u otra preocupación de salud, consulta a un profesional de la salud. Revisa ingredientes y advertencias de productos. No subas imágenes de terceras personas sin permiso ni compartas información que no sea necesaria.</p></Section>
                <Section title="5. Uso aceptable"><p>Usa el sitio de forma lícita y respetuosa. No intentes interferir con su disponibilidad, obtener acceso no autorizado, enviar contenido ilícito o suplantar a otra persona. Podemos limitar temporalmente el acceso cuando sea necesario para proteger el sitio o a sus usuarios, respetando la legislación aplicable.</p></Section>
                <Section title="6. Propiedad intelectual"><p>Los derechos sobre las marcas, materiales, contenido y diseño se describen en el <button className="font-semibold underline" onClick={() => window.dispatchEvent(new CustomEvent('open-legal-page', { detail: 'copyright' }))}>Aviso de derechos de autor</button>. Los nombres y marcas de terceros pertenecen a sus titulares.</p></Section>
                <Section title="7. Privacidad, cookies y contacto"><p>El uso del asistente y el envío de imágenes se rigen también por el <button className="font-semibold underline" onClick={() => window.dispatchEvent(new CustomEvent('open-legal-page', { detail: 'privacy' }))}>Aviso de privacidad</button> y la <button className="font-semibold underline" onClick={() => window.dispatchEvent(new CustomEvent('open-legal-page', { detail: 'cookies' }))}>Política de cookies</button>. Para dudas, quejas, cambios o cancelaciones: <strong>[CORREO Y TELÉFONO DEL NEGOCIO]</strong>.</p><p>Legislación y jurisdicción aplicable: México y <strong>[ENTIDAD FEDERATIVA DEL ESTABLECIMIENTO]</strong>, sujeto a las normas obligatorias de protección al consumidor y privacidad.</p></Section>
              </>}

              {page === 'copyright' && <>
                <p className="mb-5"><strong>© 2026 Montserrat Medina Estética. Todos los derechos reservados.</strong></p>
                <Section title="Material protegido"><p>Salvo que se indique otra cosa, los textos, identidad gráfica, logotipos propios, composición visual, ilustraciones y materiales originales de este sitio son propiedad de <strong>[NOMBRE O RAZÓN SOCIAL DEL TITULAR DE LOS DERECHOS]</strong> o se utilizan con autorización. La titularidad de cada obra debe verificarse antes de publicar.</p><p>Las fotografías, tipografías, recursos gráficos, nombres comerciales y marcas de terceros pertenecen a sus respectivos titulares y se rigen por sus propias licencias o autorizaciones. La mención o exhibición de una marca de producto no implica que sea propiedad del salón ni que exista patrocinio, salvo indicación expresa.</p></Section>
                <Section title="Usos permitidos y no permitidos"><p>Puedes consultar el contenido para uso personal y no comercial. No copies, redistribuyas, alteres, publiques o explotes comercialmente materiales protegidos sin permiso previo del titular correspondiente, salvo las excepciones que reconozca la ley. Este aviso no transfiere derechos ni concede licencia sobre marcas de terceros.</p></Section>
                <Section title="Solicitudes y avisos"><p>Para solicitar autorización, reportar un posible uso no autorizado o acreditar titularidad, contacta a <strong>[CORREO DE DERECHOS DE AUTOR]</strong>. Incluye la obra o URL identificada, explicación del uso y datos para responder. El responsable revisará la solicitud y actuará conforme a la ley aplicable.</p></Section>
                <p className="text-xs text-brand-muted">La frase de reserva de derechos de autor no sustituye la verificación de quién posee los derechos de cada recurso del sitio.</p>
              </>}

              {page === 'privacy' && <>
                <p className="mb-5"><strong>Responsable del tratamiento:</strong> Montserrat Medina Estética, operado legalmente por <strong>[NOMBRE O RAZÓN SOCIAL]</strong>, con domicilio en <strong>[DOMICILIO COMPLETO]</strong>. Contacto de privacidad: <strong>[CORREO]</strong>. Este aviso aplica al uso del sitio, su asistente y las solicitudes que voluntariamente envíes.</p>
                <Section title="Datos que pueden tratarse"><p>El contenido de los mensajes que envíes a MontIA+, la fotografía que decidas adjuntar, la información que incluyas voluntariamente en una consulta o reserva, y datos técnicos necesarios para entregar y proteger el sitio. La pantalla de perfil y el flujo de reserva de esta versión contienen datos de ejemplo; no están conectados a una cuenta ni a una agenda real. No envíes identificaciones, datos financieros, información médica detallada o imágenes de otras personas.</p></Section>
                <Section title="Finalidades"><p>Responder consultas; ofrecer ideas iniciales sobre tratamientos y productos del catálogo; procesar el texto o foto que adjuntes para generar una respuesta automatizada; mostrar las funciones del catálogo y preparar una selección de reserva; y mantener la seguridad y operación técnica del sitio. Cualquier uso adicional para mercadotecnia o finalidades secundarias debe describirse y, cuando proceda, contar con el consentimiento correspondiente.</p></Section>
                <Section title="Proveedores y tratamiento de imágenes"><p>Cuando envías una consulta o foto a MontIA+, el servidor de esta aplicación la remite al servicio de inteligencia artificial de Google Gemini para producir una respuesta. Las imágenes de catálogo se cargan desde servicios externos, incluido Unsplash. Estos proveedores pueden recibir datos técnicos de conexión y aplicar sus propias políticas. El responsable debe verificar los términos, ubicación del tratamiento y periodos de conservación vigentes de cada proveedor antes de publicar este aviso. La aplicación no presenta una función de cuenta ni una base de datos de reservas en esta versión; no se promete aquí un periodo de borrado de los proveedores externos.</p></Section>
                <Section title="Derechos sobre tus datos"><p>Puedes solicitar acceso, rectificación, cancelación u oposición al tratamiento, así como revocar el consentimiento cuando proceda, conforme a la legislación aplicable. Envía tu solicitud a <strong>[CORREO DE PRIVACIDAD]</strong> e incluye la información necesaria para identificar los datos y atenderla. El responsable deberá completar el procedimiento, requisitos, plazos y canal de seguimiento con base en la ley vigente.</p></Section>
                <Section title="Cambios a este aviso"><p>Publicaremos aquí las modificaciones y su fecha. Fecha de última actualización: 10 de octubre de 2026. Responsable legal y contacto aún por completar: <strong>[NOMBRE/RAZÓN SOCIAL, DOMICILIO Y CORREO]</strong>.</p></Section>
              </>}

              {page === 'cookies' && <>
                <p className="mb-5">Esta política explica el uso posible de cookies y tecnologías similares en el sitio de Montserrat Medina Estética. Una cookie es un archivo o identificador que el navegador puede guardar al visitar una página. La presencia y duración de cookies depende también del proveedor de alojamiento, analítica o contenido externo que se active.</p>
                <Section title="Categorías"><p><strong>Técnicas:</strong> podrían ser necesarias para entregar y proteger el sitio o recordar una preferencia esencial. <strong>Preferencias:</strong> pueden recordar idioma u opciones elegidas. <strong>Analítica y publicidad:</strong> solo aplican si el responsable incorpora servicios de medición o publicidad; deben identificarse aquí antes de activarlos y gestionarse conforme a la normativa aplicable.</p></Section>
                <Section title="Servicios de terceros"><p>El sitio carga imágenes alojadas por proveedores externos y, si envías una consulta o fotografía al asistente, transmite ese contenido a Google Gemini para generar una respuesta. Los proveedores externos pueden usar sus propias tecnologías y políticas. Este proyecto no incluye actualmente un panel para aceptar o rechazar categorías de cookies; por ello, antes de activar analítica, publicidad o cookies no esenciales en producción, el titular debe verificar qué se instala y ofrecer los avisos y opciones de consentimiento que correspondan.</p></Section>
                <Section title="Cómo administrar preferencias"><p>Puedes revisar, bloquear o eliminar cookies desde la configuración del navegador. Bloquear tecnologías necesarias puede impedir que ciertas partes del sitio funcionen. Cambiar la configuración del navegador no necesariamente modifica los datos tratados directamente por un proveedor externo; revisa también la política de cada servicio.</p></Section>
                <Section title="Contacto e inventario"><p>Responsable: <strong>[NOMBRE O RAZÓN SOCIAL]</strong>. Contacto: <strong>[CORREO]</strong>. Inventario definitivo de cookies, proveedores, propósito y duración: <strong>[COMPLETAR TRAS REVISAR EL DOMINIO PUBLICADO Y SUS SERVICIOS]</strong>. Última actualización: 10 de octubre de 2026.</p></Section>
              </>}
            </article>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
