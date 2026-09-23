<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Montserrat Medina Estética

Aplicación web y plataforma de reservas de alta gama para **Montserrat Medina Estética**, con asistente virtual inteligente con IA (**MontIA+**), catálogo de servicios, selección de estilistas y agendamiento interactivo.

## ✨ Características principales

- **Catálogo de Servicios de Alta Peluquería & Spa:** Balayage signature, terapias celulares, cortes de precisión, spa y cuidado botánico.
- **Asistente Virtual MontIA+:** Asistente con IA integrado con Google Gemini para resolver dudas sobre tratamientos capilares, diagnóstico fotográfico y asistencia en agenda.
- **Flujo de Reserva Paso a Paso:** Selección de servicios, elección de estilista preferido, selección de fecha/hora y confirmación directa.
- **Tour Interactivo Guiado:** Guía paso a paso con robot 3D/animado para nuevos usuarios.
- **Diseño Editorial & Responsivo:** Estética editorial de lujo adaptada para dispositivos móviles y escritorio.

## 🚀 Ejecución local

### Requisitos previos
- [Node.js](https://nodejs.org/) (versión 18 o superior)
- Clave de API de Gemini ([Google AI Studio](https://aistudio.google.com/))

### Pasos de instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   Copia `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
   Agrega tu clave de API:
   ```env
   GEMINI_API_KEY=tu_api_key_aqui
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

4. **Compilar para producción:**
   ```bash
   npm run build
   npm run start
   ```
