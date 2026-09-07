const fs = require('fs');
let code = fs.readFileSync('src/components/Chatbot.tsx', 'utf8');

// Inside executeActionFromText, let's add support for WIDGET
const replaceStr = `  const executeActionFromText = (text: string) => {
    let cleanText = text;
    let actionElements: React.ReactNode[] = [];

    // Check for ADD_SERVICE
    const addServiceMatch = text.match(/\\[ADD_SERVICE:\\s*(.*?)\\]/);
    if (addServiceMatch) {
      const id = addServiceMatch[1].trim();
      cleanText = cleanText.replace(addServiceMatch[0], '').trim();
      const serviceObj = services.find(s => s.id === id);
      
      if (serviceObj) {
        onAddService(id);
        actionElements.push(
          <div key={\`add-\${id}\`} className="mt-3 p-3 bg-brand-gold/10 border border-brand-gold/40 rounded-xl flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-white shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">Acción Automática</p>
              <p className="text-xs font-semibold text-brand-espresso leading-tight">Se añadió {serviceObj.title}</p>
            </div>
          </div>
        );
      }
    }

    // Check for WIDGET
    const widgetMatches = [...text.matchAll(/\\[WIDGET:\\s*(.*?)\\]/g)];
    for (const match of widgetMatches) {
       const id = match[1].trim();
       cleanText = cleanText.replace(match[0], '').trim();
       const serviceObj = services.find(s => s.id === id);

       if (serviceObj) {
         actionElements.push(
           <div key={\`widget-\${id}\`} className="mt-3 bg-brand-surface border border-brand-border/60 rounded-xl overflow-hidden shadow-sm">
             <div className="p-3 border-b border-brand-border/40 bg-brand-surface-container/30">
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-muted mb-0.5">Sugerencia IA</p>
                <p className="font-semibold text-brand-espresso text-sm leading-tight">{serviceObj.title}</p>
                <p className="text-xs text-brand-muted mt-1">\${serviceObj.price.toLocaleString()} MXN • {serviceObj.duration} min</p>
             </div>
             <div className="flex bg-brand-surface">
                <button 
                  onClick={() => onAddService(id)}
                  className="flex-1 py-2.5 text-xs font-semibold text-brand-espresso hover:bg-brand-gold/10 transition-colors border-r border-brand-border/40 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Agregar
                </button>
                <button 
                  onClick={() => onNavigate('servicios')}
                  className="flex-1 py-2.5 text-xs font-semibold text-brand-muted hover:text-brand-espresso hover:bg-brand-border/30 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5" /> Detalles
                </button>
             </div>
           </div>
         );
       }
    }
    
    // Check for NAVIGATE
    const navMatch = cleanText.match(/\\[NAVIGATE:\\s*(.*?)\\]/);
    if (navMatch) {
      const route = navMatch[1].trim();
      cleanText = cleanText.replace(navMatch[0], '').trim();
      onNavigate(route);
    }

    return { cleanText, actionElement: actionElements.length > 0 ? <>{actionElements}</> : null };
  };`;

code = code.replace(/const executeActionFromText = \([\s\S]*?    return \{ cleanText, actionElement \};\n  \};/, replaceStr);

fs.writeFileSync('src/components/Chatbot.tsx', code);
