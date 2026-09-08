import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, ArrowRight, History, MessageSquare , Camera, Image as ImageIcon, Mic, CheckCircle2 } from 'lucide-react';
import { services, products } from "../data";
import { Scene3D } from './Scene3D';

interface Message {
  id: string;
  role: 'ai' | 'user';
  text: React.ReactNode;
  options?: string[];
  action?: {
    type: 'ADD_SERVICE',
    payload: string,
    title: string
  }
}

export function Chatbot({ isOpen, onClose, onNavigate, onAddService }: { isOpen: boolean; onClose: () => void, onNavigate: (view: string) => void, onAddService: (id: string) => void }) {
  const [view, setView] = useState<'chat' | 'history'>('chat');
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      text: '¡Hola! Soy tu Concierge IA de Montserrat Medina. Puedo ayudarte a agendar una cita o realizar un diagnóstico capilar personalizado para recomendarte el ritual y los productos ideales. ¿Qué te gustaría hacer hoy?',
      options: ['Realizar Diagnóstico', 'Agendar Cita', 'Ver Servicios']
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  
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
      alert('Tu navegador no soporta entrada de voz.');
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
    let actionElements: React.ReactNode[] = [];

    // Check for ADD_SERVICE
    const addServiceMatch = text.match(/\[ADD_SERVICE:\s*(.*?)\]/);
    if (addServiceMatch) {
      const id = addServiceMatch[1].trim();
      cleanText = cleanText.replace(addServiceMatch[0], '').trim();
      const serviceObj = services.find(s => s.id === id);
      
      if (serviceObj) {
        onAddService(id);
        actionElements.push(
          <div key={`add-${id}`} className="mt-3 p-3 bg-brand-gold/10 border border-brand-gold/40 rounded-xl flex items-center gap-3 shadow-sm">
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
    const widgetMatches = [...text.matchAll(/\[WIDGET:\s*(.*?)\]/g)];
    for (const match of widgetMatches) {
       const id = match[1].trim();
       cleanText = cleanText.replace(match[0], '').trim();
       const serviceObj = services.find(s => s.id === id);

       if (serviceObj) {
         actionElements.push(
           <div key={`widget-${id}`} className="mt-3 bg-brand-surface border border-brand-border/60 rounded-xl overflow-hidden shadow-sm">
             <div className="p-3 border-b border-brand-border/40 bg-brand-surface-container/30">
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-muted mb-0.5">Sugerencia IA</p>
                <p className="font-semibold text-brand-espresso text-sm leading-tight">{serviceObj.title}</p>
                <p className="text-xs text-brand-muted mt-1">${serviceObj.price.toLocaleString()} MXN • {serviceObj.duration} min</p>
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
    const navMatch = cleanText.match(/\[NAVIGATE:\s*(.*?)\]/);
    if (navMatch) {
      const route = navMatch[1].trim();
      cleanText = cleanText.replace(navMatch[0], '').trim();
      onNavigate(route);
    }

    return { cleanText, actionElement: actionElements.length > 0 ? <>{actionElements}</> : null };
  };


  
  // Agent State
  const [step, setStep] = useState<'idle' | 'q1' | 'q2' | 'q3' | 'done'>('idle');
  const [hairData, setHairData] = useState({ texture: '', thickness: '' });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const savedChats = [
    { id: 'c1', date: 'Ayer', preview: 'Diagnóstico: Cabello fino, rizado...' },
    { id: 'c2', date: '12 Oct', preview: 'Consulta sobre Olaplex No. 7' },
    { id: 'c3', date: '5 Sep', preview: 'Recomendación de estilista para color' },
  ];

  const scrollToBottom = () => {
    if (view === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen, view]);

  
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  
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
            <p className="whitespace-pre-wrap">{cleanText}</p>
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

      if ((matchedProducts.length > 0 || matchedServices.length > 0) && step === 'idle' && !lower.includes('hola') && !lower.includes('buenos')) {
        replyText = (
          <div className="space-y-3">
            <p>He encontrado excelentes opciones para ti basadas en tu búsqueda:</p>
            {matchedServices.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-brand-gold mb-2 mt-2">Servicios Recomendados</p>
                <div className="space-y-2">
                  {matchedServices.slice(0, 2).map(s => (
                    <div 
                      key={s.id} 
                      onClick={() => onNavigate('reservar')}
                      className="p-3 bg-brand-surface border border-brand-border/60 rounded-xl cursor-pointer hover:border-brand-gold hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-brand-espresso text-sm group-hover:text-brand-gold transition-colors">{s.title}</p>
                        <span className="text-xs text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity">Reservar</span>
                      </div>
                      <p className="text-xs text-brand-muted mt-1">${s.price.toLocaleString()} MXN • {s.duration} min</p>
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
                    <div 
                      key={p.id} 
                      className="p-3 bg-brand-surface border border-brand-border/60 rounded-xl flex items-center gap-3 cursor-pointer hover:border-brand-gold hover:shadow-md transition-all group"
                    >
                      <img src={p.img} alt={p.name} className="w-10 h-10 rounded-md object-cover" />
                      <div className="flex-1">
                        <p className="font-semibold text-brand-espresso text-sm group-hover:text-brand-gold transition-colors">{p.name}</p>
                        <p className="text-xs text-brand-muted">{p.brand} • ${p.price.toLocaleString()} MXN</p>
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
        } else if (lower.includes('hola') || lower.includes('buenos dias')) {
          replyText = "¡Hola! Bienvenido a Montserrat Medina. Puedo recomendarte servicios, agendar una cita o hacerte un diagnóstico. ¿En qué te ayudo?";
          replyOptions = ["Realizar Diagnóstico", "Agendar Cita"];
        } else {
          replyText = "No encontré coincidencias exactas. Intenta buscar 'balayage', 'botox', 'olaplex', o iniciar un diagnóstico personalizado.";
          replyOptions = ["Realizar Diagnóstico", "Ver Menú de Servicios"];
        }
      } 
      else if (step === 'q1') {
        setHairData(prev => ({ ...prev, texture: text }));
        nextStep = 'q2';
        replyText = `Entendido, cabello ${text.toLowerCase()}. ¿Cómo describirías el grosor de tu fibra capilar?`;
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

  
  
  const handleSend = (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() && !selectedImage) return;
    
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


  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-surface/60 backdrop-blur-sm z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Chat Panel - Always mounted to prevent Spline WebGPU crash, but hidden when closed */}
      <motion.div
        initial={false}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          y: isOpen ? 0 : 50, 
          scale: isOpen ? 1 : 0.95,
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-0 left-0 right-0 md:bottom-28 md:right-8 md:left-auto md:w-[420px] h-[92dvh] md:h-[650px] bg-brand-surface z-[70] rounded-t-[2rem] md:rounded-[2rem] shadow-[0_20px_60px_-10px_rgba(30,27,24,0.15)] border border-brand-border/50 flex flex-col overflow-hidden"
      >
        {/* Background 3D React-Three-Fiber */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50 bg-brand-surface overflow-hidden">
          {/* Watermark text */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
            <span className="font-serif font-black text-brand-espresso text-8xl md:text-[10rem]" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
              MontIA+
            </span>
          </div>
          <div className="absolute inset-0 z-10">
            <Scene3D />
          </div>
        </div>
        {/* Header */}
            <div className="relative z-10 bg-brand-surface-container/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-brand-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-espresso text-brand-surface flex items-center justify-center shadow-inner font-serif font-bold text-xs tracking-wider">
                  M+
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-brand-espresso leading-tight text-lg">MontIA+</h3>
                  <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-brand-muted mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> En línea
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setView(view === 'chat' ? 'history' : 'chat')}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm border ${
                    view === 'history' 
                      ? 'bg-brand-espresso text-brand-gold border-brand-espresso' 
                      : 'bg-brand-surface text-brand-muted hover:text-brand-espresso hover:bg-brand-border/60 border-brand-border/40'
                  }`}
                  aria-label="Historial"
                >
                  {view === 'history' ? <MessageSquare className="w-4 h-4" /> : <History className="w-4 h-4" />}
                </button>
                <button 
                  onClick={onClose} 
                  className="w-8 h-8 rounded-full bg-brand-surface flex items-center justify-center text-brand-muted hover:text-brand-espresso hover:bg-brand-border/60 transition-colors shadow-sm border border-brand-border/40"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {view === 'chat' ? (
              <>
                {/* Messages Area */}
                <div className="relative z-10 flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-b from-brand-surface/30 to-brand-surface-container/10 no-scrollbar">
                  {messages.map((msg, index) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id} 
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[85%] p-4 rounded-[20px] text-[13px] md:text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-brand-espresso text-white rounded-br-sm shadow-md' 
                          : 'bg-brand-surface-container border border-brand-border/60 text-brand-espresso rounded-bl-sm shadow-sm'
                      }`}>
                        {msg.text}
                      </div>
                      
                      {msg.role === 'ai' && msg.options && index === messages.length - 1 && !isTyping && (
                        <motion.div 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                          className="flex flex-wrap gap-2 mt-3 pl-2"
                        >
                          {msg.options.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => handleSend(opt)}
                              className="text-[11px] font-semibold tracking-wide bg-brand-surface border border-brand-gold/60 text-brand-espresso px-4 py-2 rounded-full hover:bg-brand-gold hover:text-white transition-all shadow-sm flex items-center gap-1 group"
                            >
                              {opt}
                              {opt.includes('Ir a') && <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div className="p-4 rounded-[20px] bg-brand-surface-container border border-brand-border/60 rounded-bl-sm shadow-sm flex gap-1.5 items-center h-[46px]">
                        <span className="w-1.5 h-1.5 bg-brand-muted/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-brand-muted/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-brand-muted/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} className="h-1" />
                </div>

                
                {/* Input Area */}
                <div className="relative z-10 p-4 bg-brand-surface/80 backdrop-blur-md border-t border-brand-border/50 flex flex-col gap-3">
                  {selectedImage && (
                    <div className="relative inline-block w-20 h-20">
                      <img src={selectedImage} alt="Preview" className="w-full h-full object-cover rounded-lg border border-brand-border" />
                      <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 w-6 h-6 bg-brand-espresso text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-500 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <div className="relative flex items-center gap-2">
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleImageUpload} 
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-11 h-11 shrink-0 rounded-full bg-brand-surface-container/50 border border-brand-border/80 text-brand-espresso flex items-center justify-center hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-colors shadow-inner"
                      aria-label="Subir imagen"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Pregunta o sube una foto..."
                        className="w-full bg-brand-surface-container/50 border border-brand-border/80 rounded-full py-3.5 pl-5 pr-14 text-sm outline-none focus:ring-1 focus:ring-brand-gold transition-all text-brand-espresso placeholder:text-brand-muted/70 shadow-inner"
                      />
                      
                      <button 
                        onClick={toggleRecording}
                        className={`absolute right-12 top-1 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-transparent text-brand-muted hover:text-brand-espresso'}`}
                        aria-label="Hablar"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleSend()}
                        disabled={!input.trim() && !selectedImage}
                        className="absolute right-2 top-1 w-10 h-10 rounded-full bg-brand-espresso text-brand-gold flex items-center justify-center disabled:opacity-50 disabled:bg-brand-muted disabled:text-brand-surface transition-all hover:bg-brand-espresso/90 hover:scale-105 active:scale-95 shadow-md"
                      >
                        <Send className="w-4 h-4 ml-0.5" />
                      </button>
                    </div>
                  </div>
                </div>

              </>
            ) : (
              /* History View */
              <div className="relative z-10 flex-1 bg-brand-surface-container/80 backdrop-blur-md overflow-y-auto no-scrollbar p-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-4 px-2">Historial de Conversaciones</h4>
                <div className="space-y-3">
                  {savedChats.map(chat => (
                    <button key={chat.id} onClick={() => setView('chat')} className="w-full text-left bg-brand-surface border border-brand-border/60 p-4 rounded-2xl hover:border-brand-gold/50 hover:shadow-sm transition-all group">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-brand-espresso">{chat.date}</span>
                        <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-gold transition-colors" />
                      </div>
                      <p className="text-xs text-brand-muted truncate">{chat.preview}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
    </>
  );
}
