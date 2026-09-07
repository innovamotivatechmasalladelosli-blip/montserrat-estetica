const fs = require('fs');
let code = fs.readFileSync('src/components/Chatbot.tsx', 'utf8');

// 1. Add state for microphone and parsing
const stateCode = `
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState('');
  
  // Voice Recognition setup
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.lang = 'es-MX';
    recognition.continuous = false;
    recognition.interimResults = false;
  }

  const toggleRecording = () => {
    if (!recognition) {
      toast.error('Tu navegador no soporta entrada de voz.');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      setSpeechError('');
      try {
        recognition.start();
        setIsRecording(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => prev ? prev + ' ' + transcript : transcript);
          setIsRecording(false);
        };
        recognition.onerror = (event: any) => {
          console.error(event.error);
          setIsRecording(false);
        };
        recognition.onend = () => {
          setIsRecording(false);
        };
      } catch (e) {
        setIsRecording(false);
      }
    }
  };

  const executeActionFromText = (text: string) => {
    let cleanText = text;
    let actionElement = null;

    // Check for ADD_SERVICE
    const addServiceMatch = text.match(/\\[ADD_SERVICE:\s*(.*?)\\]/);
    if (addServiceMatch) {
      const id = addServiceMatch[1].trim();
      cleanText = cleanText.replace(addServiceMatch[0], '').trim();
      const serviceObj = services.find(s => s.id === id);
      
      if (serviceObj) {
        onAddService(id);
        actionElement = (
          <div className="mt-3 p-3 bg-brand-gold/10 border border-brand-gold/40 rounded-xl flex items-center gap-3 shadow-sm">
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
    
    // Check for NAVIGATE
    const navMatch = text.match(/\\[NAVIGATE:\s*(.*?)\\]/);
    if (navMatch) {
      const route = navMatch[1].trim();
      cleanText = cleanText.replace(navMatch[0], '').trim();
      onNavigate(route);
    }

    return { cleanText, actionElement };
  };
`;
code = code.replace(/const \[selectedImage, setSelectedImage\] = useState<string \| null>\(null\);\n  const fileInputRef = useRef<HTMLInputElement>\(null\);/, stateCode);

// 2. Modify processImageRequest to handle actions
const processImageCode = `
  const processImageRequest = async (text: string, imageBase64: string | null) => {
    setIsTyping(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, imageBase64 })
      });
      if (!res.ok) {
        throw new Error('Error al conectar con la IA');
      }
      const data = await res.json();
      
      const { cleanText, actionElement } = executeActionFromText(data.text);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        text: (
          <div className="space-y-2">
            {imageBase64 && <p className="font-semibold text-brand-gold text-xs uppercase tracking-widest flex items-center gap-1"><Sparkles className="w-3 h-3"/> Análisis Visual</p>}
            <p>{cleanText}</p>
            {actionElement}
          </div>
        )
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        text: "Lo siento, no pude procesar tu solicitud en este momento. Verifica tu conexión o API Key."
      }]);
    } finally {
      setIsTyping(false);
    }
  };
`;
code = code.replace(/const processImageRequest = async \([\s\S]*?    setIsTyping\(false\);\n    \}\n  \};\n/, processImageCode + "\n");

// 3. Update handleSend to ALWAYS use the backend if it's text, or let's use the backend for everything to make it autonomous.
// But we still have local processInput for diagnostic steps if needed. Let's redirect standard inputs to backend to make it smart.
const newHandleSend = `
  const handleSend = (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() && !selectedImage) return;
    
    toast.success('Mensaje enviado al Concierge IA');
    
    const newUserMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      text: (
        <div className="flex flex-col gap-2">
          {selectedImage && <img src={selectedImage} alt="Upload preview" className="w-48 h-48 object-cover rounded-lg shadow-sm" />}
          {textToSend && <span>{textToSend}</span>}
        </div>
      )
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    const currentImg = selectedImage;
    setSelectedImage(null);
    
    // Si hay imagen o no estamos en el flujo de diagnóstico, usar el servidor.
    if (currentImg || step === 'idle') {
      processImageRequest(textToSend, currentImg);
    } else {
      processInput(textToSend); // Usar lógica local para las preguntas de diagnóstico
    }
  };
`;
code = code.replace(/const handleSend = \([\s\S]*?    \} else \{\n      processInput\(textToSend\);\n    \}\n  \};\n/, newHandleSend + "\n");

// 4. Update the input field to have the Mic button
const micButton = `
                      <button 
                        onClick={toggleRecording}
                        className={\`absolute right-12 top-1 w-10 h-10 rounded-full flex items-center justify-center transition-all \${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-transparent text-brand-muted hover:text-brand-espresso'}\`}
                        aria-label="Hablar"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                      <button 
`;
code = code.replace(/<button \n\s*onClick=\{\(\) => handleSend\(\)\}/, micButton);

fs.writeFileSync('src/components/Chatbot.tsx', code);
