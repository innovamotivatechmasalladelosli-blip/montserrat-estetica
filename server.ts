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
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const navContextGuide = currentNav === 'reservar'
      ? `El usuario se encuentra actualmente en la pantalla de 'RESERVAR'. Ya tiene ${selectedServicesCount} servicio(s) seleccionado(s). Si pide ayuda, oriéntale con la selección de estilista (Montserrat Medina para Balayage/color, Andrea Flores o Elena Torres), fecha y hora, o a completar su confirmación por WhatsApp.`
      : currentNav === 'servicios'
      ? `El usuario se encuentra actualmente en el 'MENÚ DE SERVICIOS'. Está explorando el catálogo. Recomiéndale servicios concretos usando [WIDGET: ID] según su necesidad (corte, tinte, hidratación, detox, spa) para que pueda agregarlos con un toque.`
      : currentNav === 'perfil'
      ? `El usuario está en su 'PERFIL'. Ayúdale con información sobre citas, historial o consultas de lealtad.`
      : `El usuario está en el 'INICIO' (Explorar). Aquí ve los tratamientos más populares y productos de temporada. Explícale con palabras sencillas y directas qué puede hacer aquí, invítale a ver los servicios con [NAVIGATE: servicios] o a agendar con [NAVIGATE: reservar].`;

    const systemInstruction = `Actúa como MontIA+, la asistente virtual inteligente de 'Montserrat Medina Estética'.
Eres cálida, refinada, muy atenta, comprensible y directa. Tus respuestas deben ser breves, claras y en español cotidiano y profesional.
Conoces a la perfección todos los servicios, tratamientos capilares, precios y el proceso de agenda del atelier.

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

Ejemplo de recomendación:
"Para reparar el cabello y devolverle fuerza y brillo, te sugiero la Terapia Celular con Botox Capilar. Puedes agregarla tocando aquí:"
[WIDGET: s2]`;

    const candidateModels = ['gemini-3.6-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    let responseText = '';
    let lastErr = null;

    for (const modelName of candidateModels) {
      try {
        if (imageBase64) {
          const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
          const resp = await ai.models.generateContent({
            model: modelName,
            contents: [
              {
                role: 'user',
                parts: [
                  { text: prompt || "Analiza esta imagen y dame recomendaciones de tus servicios de estética." },
                  {
                    inlineData: {
                      mimeType: 'image/jpeg',
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

        if (responseText) {
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

    res.json({ text: responseText });

  } catch (error: any) {
    console.error('Error generating content:', error);
    // Provide a smart assistant fallback instead of breaking
    const fallbackText = "Con gusto te asisto. Te recomiendo nuestro tratamiento estrella de recuperación y brillo capilar:\n[WIDGET: s2]\nTambién puedes agendar tu cita directamente seleccionando tu fecha y estilista:";
    res.json({ text: fallbackText });
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
