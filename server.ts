import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// API routes
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, imageBase64 } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    let response;
    
    const systemInstruction = `Actúa como un Asistente IA Concierge de 'Montserrat Medina Estética'.
Eres muy amable, proactivo y sumamente conciso. Tus respuestas deben ser breves y directas.
Si recomiendas un servicio o el usuario pregunta por uno, DEBES usar el tag [WIDGET: ID] para mostrarle una mini-tarjeta interactiva.
Si el usuario te pide explícitamente agregar algo a su reserva SIN preguntar, puedes usar [ADD_SERVICE: ID].
Si el usuario te pide ver su perfil o el menú de servicios general, usa [NAVIGATE: perfil] o [NAVIGATE: servicios].

IDs de servicios disponibles:
- s1: Balayage Signature y Gloss
- s2: Terapia Celular y Botox Capilar
- s3: Corte de Precisión y Styling
- s4: Detox y Masaje Ayurvédico
- s5: Manicura Spa y Esmaltado Gel
- s6: Pedicura Botánica con Reflexología

Ejemplo de recomendación:
"Para reparar el daño, te sugiero la Terapia Celular. Aquí tienes la opción rápida para agregarla:"
[WIDGET: s2]`;

    if (imageBase64) {
      // Multimodal request
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt || "Analiza esta imagen y dame recomendaciones de tus servicios." },
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
    } else {
      // Text request
      response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: { systemInstruction }
      });
    }

    res.json({ text: response.text });

  } catch (error: any) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
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
