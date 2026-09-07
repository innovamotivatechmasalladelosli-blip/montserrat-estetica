const fs = require('fs');
let code = fs.readFileSync('src/components/Chatbot.tsx', 'utf8');

const newProcessInput = `
  const processInput = (text: string) => {
    const lower = text.toLowerCase();

    // Handle Direct Navigation
    if (lower === 'ir a reservar' || lower === 'agendar cita' || lower === 'reservar este tratamiento') {
      onNavigate('reservar');
      return;
    }
    if (lower === 'ver menú de servicios' || lower === 'ver servicios' || lower === 'ver todos los servicios') {
      onNavigate('servicios');
      return;
    }

    setIsTyping(true);

    setTimeout(() => {
      let replyText: React.ReactNode = '';
      let replyOptions: string[] | undefined = undefined;
      let nextStep = step;

      // Smart Search Logic
      const matchedProducts = products.filter(p => p.name.toLowerCase().includes(lower) || p.brand.toLowerCase().includes(lower) || lower.includes(p.name.toLowerCase()));
      const matchedServices = services.filter(s => s.title.toLowerCase().includes(lower) || s.category.toLowerCase().includes(lower) || s.description.toLowerCase().includes(lower));

      if (matchedProducts.length > 0 || matchedServices.length > 0) {
        replyText = (
          <div className="space-y-3">
            <p>He encontrado excelentes opciones para ti basadas en tu búsqueda:</p>
            {matchedServices.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-brand-gold mb-2">Servicios Recomendados</p>
                <div className="space-y-2">
                  {matchedServices.slice(0, 2).map(s => (
                    <div key={s.id} className="p-3 bg-brand-surface border border-brand-border/60 rounded-xl">
                      <p className="font-semibold text-brand-espresso text-sm">{s.title}</p>
                      <p className="text-xs text-brand-muted mt-1">\${s.price.toLocaleString()} MXN • {s.duration} min</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {matchedProducts.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-brand-gold mb-2 mt-3">Productos Recomendados</p>
                <div className="space-y-2">
                  {matchedProducts.slice(0, 2).map(p => (
                    <div key={p.id} className="p-3 bg-brand-surface border border-brand-border/60 rounded-xl flex items-center gap-3">
                      <img src={p.img} alt={p.name} className="w-10 h-10 rounded-md object-cover" />
                      <div>
                        <p className="font-semibold text-brand-espresso text-sm">{p.name}</p>
                        <p className="text-xs text-brand-muted">{p.brand} • \${p.price.toLocaleString()} MXN</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="text-[13px] pt-2">¿Te gustaría agendar una cita o ver nuestro menú completo?</p>
          </div>
        );
        replyOptions = ["Agendar Cita", "Ver Menú de Servicios"];
      }
      else if (step === 'idle') {
        if (lower.includes('diagnóstico') || lower.includes('analizar') || lower.includes('cabello') || lower.includes('test')) {
          nextStep = 'q1';
          replyText = "Perfecto. Vamos a analizar tu perfil capilar. Primero, ¿cuál es la textura natural de tu cabello?";
          replyOptions = ["Lacio", "Ondulado", "Rizado", "Crespo"];
        } else if (lower.includes('agendar') || lower.includes('reservar') || lower.includes('cita')) {
          replyText = "¡Excelente! Te dirigiré a nuestra sección de reservas para que elijas tu horario.";
          replyOptions = ["Ir a Reservar"];
        } else if (lower.includes('servicio') || lower.includes('menú')) {
          replyText = "Contamos con servicios de corte, coloración, balayage y tratamientos avanzados. ¿Qué te interesa?";
          replyOptions = ["Ver Menú de Servicios", "Realizar Diagnóstico"];
        } else {
          replyText = "Puedo ayudarte a encontrar el servicio o producto ideal. Intenta buscar 'hidratación', 'balayage', 'olaplex' o realizar un diagnóstico.";
          replyOptions = ["Realizar Diagnóstico", "Agendar Cita"];
        }
      } 
      else if (step === 'q1') {
        setHairData(prev => ({ ...prev, texture: text }));
        nextStep = 'q2';
        replyText = \`Entendido, cabello \${text.toLowerCase()}. ¿Cómo describirías el grosor de tu fibra capilar?\`;
        replyOptions = ["Fino y delicado", "Medio", "Grueso y resistente"];
      } 
      else if (step === 'q2') {
        setHairData(prev => ({ ...prev, thickness: text }));
        nextStep = 'q3';
        replyText = "Casi terminamos. ¿Cuál es tu principal objetivo o preocupación hoy?";
        replyOptions = ["Reparación profunda", "Mantenimiento de color", "Control de frizz", "Volumen y densidad"];
      } 
      else if (step === 'q3') {
        nextStep = 'done';
        replyText = (
          <div className="space-y-3">
            <p>¡Gracias! He analizado tu perfil: <strong>Cabello {hairData.texture.toLowerCase()}, {hairData.thickness.toLowerCase()} con enfoque en {text.toLowerCase()}</strong>.</p>
            <div className="p-3.5 bg-brand-gold/10 border border-brand-gold/30 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold" />
              <p className="font-semibold text-brand-espresso mb-1.5 text-sm flex items-center gap-1.5">
                Recomendación Profesional
              </p>
              <p className="text-[13px] leading-relaxed">
                Te sugiero el <strong>Tratamiento de Reconstrucción Molecular</strong> en salón, combinado con el uso en casa de <strong>Olaplex No. 7 Bonding Oil</strong>.
              </p>
            </div>
            <p>¿Qué te gustaría hacer a continuación?</p>
          </div>
        );
        replyOptions = ["Reservar este Tratamiento", "Ver todos los servicios", "Reiniciar Diagnóstico"];
      }
      else if (step === 'done') {
        if (lower.includes('reiniciar')) {
          nextStep = 'q1';
          replyText = "Comencemos de nuevo. ¿Cuál es la textura natural de tu cabello?";
          replyOptions = ["Lacio", "Ondulado", "Rizado", "Crespo"];
        } else {
          replyText = "¿Puedo ayudarte en algo más?";
          replyOptions = ["Realizar Diagnóstico", "Agendar Cita"];
        }
      }

      setStep(nextStep);
      setIsTyping(false);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        text: replyText,
        options: replyOptions
      }]);

    }, 1200);
  };
`;

code = code.replace(/const processInput = \(text: string\) => \{[\s\S]*?    \}, 1200\);\n  \};\n/, newProcessInput + "\n");
fs.writeFileSync('src/components/Chatbot.tsx', code);
