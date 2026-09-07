const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const systemInstruction = `
    const systemInstruction = \`Actúa como un experto concierge de 'Montserrat Medina Estética'. 
Eres muy amable, lujoso y conciso. 
Si el usuario te pide agregar, reservar o poner en el carrito un servicio, DEBES incluir al final de tu respuesta el tag [ADD_SERVICE: ID].
IDs de servicios disponibles:
- s1: Balayage Signature y Gloss
- s2: Terapia Celular y Botox Capilar
- s3: Corte de Precisión y Styling
- s4: Detox y Masaje Ayurvédico
- s5: Manicura Spa y Esmaltado Gel
- s6: Pedicura Botánica con Reflexología

Ejemplo de respuesta si el usuario pide balayage:
"¡Por supuesto! He añadido el Balayage Signature a tu reserva. ¿Te gustaría algún otro servicio?"
[ADD_SERVICE: s1]\`;
`;

const updatedTextGeneration = `
      response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction
        }
      });
`;

code = code.replace(/response = await ai\.models\.generateContent\(\{[\s\S]*?contents: prompt\n      \}\);/, systemInstruction + "\n" + updatedTextGeneration);

fs.writeFileSync('server.ts', code);
