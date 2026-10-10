import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, imageBase64, currentNav = 'explorar', selectedServicesCount = 0 } = req.body;

    if (typeof prompt !== 'string' && !imageBase64) {
      return res.status(400).json({ error: 'Prompt or image is required' });
    }
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const navContextGuide = currentNav === 'reservar'
      ? `El usuario se encuentra actualmente en la pantalla de 'RESERVAR'. Ya tiene ${selectedServicesCount} servicio(s) seleccionado(s). Si pide ayuda, oriéntale con la selección de estilista (Montserrat Medina para Balayage/color, Andrea Flores o Elena Torres), fecha y hora, o a completar su confirmación por WhatsApp.`
      : currentNav === 'servicios'
      ? `El usuario se encuentra actualmente en el 'MENÚ DE SERVICIOS'. Está explorando el catálogo. Recomiéndale servicios concretos usando [WIDGET: ID] según su necesidad (corte, tinte, hidratación, detox, spa) para que pueda agregarlos con un toque.`
      : currentNav === 'perfil'
      ? `El usuario está en su 'PERFIL'. Ayúdale con orientaciones sobre tratamientos según su tipo de cabello, objetivos y resultado imaginado. Puede adjuntar fotos y solicitar ideas, posibles efectos y recomendaciones de productos del catálogo. No menciones nombres de personas que atienden.`
      : `El usuario está en el 'INICIO' (Explorar). Aquí ve los tratamientos más populares y productos de temporada. Explícale con palabras sencillas y directas qué puede hacer aquí, invítale a ver los servicios con [NAVIGATE: servicios] o a agendar con [NAVIGATE: reservar].`;

    const systemInstruction = `Actúa como MontIA+, la asistente virtual inteligente de 'Montserrat Medina Estética'.
Eres cálida, refinada, muy atenta, comprensible y directa. Tus respuestas deben ser breves, claras y en español cotidiano y profesional.
Conoces a la perfección todos los servicios, tratamientos capilares, precios y el proceso de agenda del atelier.
Si recibes una foto, úsala solo para orientación cosmética preliminar. Explica que una imagen no permite confirmar diagnóstico, historial químico, alergias ni resultados; aclara posibles efectos y factores de variación, recomienda valoración presencial y prueba de mechón cuando corresponda. No prometas resultados.
Al recomendar rutina de cuidado, sugiere únicamente productos que existan en el catálogo disponible y explica por qué podrían ser pertinentes; presenta cualquier sugerencia como opcional y sujeta a revisar ingredientes, sensibilidad y criterio profesional.

VISTA ACTUAL EN PANTALLA:
${navContextGuide}
Ajusta automáticamente tus respuestas y ofrece ayuda específica sobre lo que el usuario está viendo en esta vista.

Si el usuario pregunta cómo agendar una cita o pide ayuda para reservar, explica con amabilidad y sencillez los 4 pasos (1. Elegir servicios, 2. Seleccionar estilista, 3. Escoger fecha y hora, 4. Confirmación instantánea por WhatsApp) e invítale a usar la "Explicación paso a paso" si lo prefiere.

Si recomiendas un servicio o el usuario pregunta por uno, DEBES usar el tag [WIDGET: ID] para mostrarle una mini-tarjeta interactiva para agregar el servicio.
Si el usuario te pide explícitamente agregar algo a su reserva, puedes usar [ADD: ID].
Si el usuario pide ir a reservar o ver el menú, puedes sugerir o usar [NAVIGATE: reservar] o [NAVIGATE: servicios].

IDs de servicios disponibles:
- s1: Balayage Signature y Gloss ($3,200 MXN)
- s2: Terapia Celular y Botox Capilar ($1,850 MXN)
- s3: Corte de Precisión y Styling ($650 MXN)
- s4: Detox y Masaje Ayurvédico ($1,200 MXN)
- s5: Manicura Spa y Esmaltado Gel ($450 MXN)
- s6: Pedicura Botánica con Reflexología ($550 MXN)

Productos de cuidado en casa disponibles para recomendar cuando sean pertinentes:
- Bain Elixir Ultime de Kérastase ($900 MXN)
- No. 7 Bonding Oil de Olaplex ($600 MXN)
- Masque Chromatique de Kérastase ($1,100 MXN)
No inventes productos, ingredientes, disponibilidad ni resultados. Explica que se deben revisar ingredientes y compatibilidad individual.

Ejemplo de recomendación:
"Para reparar el cabello y devolverle fuerza y brillo, te sugiero la Terapia Celular con Botox Capilar. Puedes agregarla tocando aquí:"
[WIDGET: s2]`;

    const candidateModels = ['gemini-3.6-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    let responseText = '';
    let lastErr = null;

    for (const modelName of candidateModels) {
      try {
        if (imageBase64) {
          const imageMatch = String(imageBase64).match(/^data:(image\/[\w.+-]+);base64,(.+)$/);
          const mimeType = imageMatch?.[1] || 'image/jpeg';
          const base64Data = imageMatch?.[2] || String(imageBase64).replace(/^data:image\/[^;]+;base64,/, '');
          const resp = await ai.models.generateContent({
            model: modelName,
            contents: [
              {
                role: 'user',
                parts: [
                  { text: prompt || "Analiza esta imagen y dame recomendaciones de tus servicios de estética." },
                  {
                    inlineData: {
                      mimeType,
                      data: base64Data
                    }
                  }
                ]
              }
            ],
            config: { systemInstruction }
          });
          responseText = resp.text || '';
        } else {
          const resp = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: { systemInstruction }
          });
          responseText = resp.text || '';
        }

        if (responseText.trim()) {
          break; // successfully generated
        }
      } catch (err: any) {
        lastErr = err;
        console.warn(`Model ${modelName} failed:`, err?.message || err);
      }
    }

    if (!responseText) {
      throw lastErr || new Error('No response from AI models');
    }

    res.json({ text: responseText.trim() });

  } catch (error: any) {
    console.error('Error generating content:', error);
    // Provide a smart assistant fallback instead of breaking
    const fallbackText = "Con gusto te asisto. Te recomiendo nuestro tratamiento estrella de recuperación y brillo capilar:\n[WIDGET: s2]\nTambién puedes agendar tu cita directamente seleccionando tu fecha y estilista:";
    res.json({ text: fallbackText, fallback: true });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
