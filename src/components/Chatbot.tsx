import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Send, Sparkles, ArrowRight, History, MessageSquare, MessageCircle,
  Camera, Mic, CheckCircle2, Calendar, Scissors, Droplets, 
  MapPin, UserCheck, RefreshCw, ChevronRight 
} from 'lucide-react';
import { services, products } from "../data";
import { Scene3D } from './Scene3D';

interface Message {
  id: string;
  role: 'ai' | 'user';
  text: React.ReactNode;
  options?: string[];
  action?: {
    type: 'ADD_SERVICE';
    payload: string;
    title: string;
  };
}

async function requestChat(body: Record<string, unknown>) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Chat API failed with ${response.status}`);
    const data = await response.json();
    if (typeof data.text !== 'string' || !data.text.trim()) throw new Error('Chat API returned an empty response');
    return data as { text: string };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

const getWelcomeTextForNav = (nav?: string, count: number = 0) => {
  if (nav === 'reservar') {
    return count > 0 
      ? `¡Hola! Veo que estás en la pantalla de Reserva con ${count} servicio(s) seleccionado(s). ¿Te ayudo a elegir estilista (Montserrat Medina, Andrea o Elena) o a encontrar el horario perfecto para tu cita?`
      : `¡Hola! Estás en la pantalla de Reserva. Te puedo guiar para elegir tus tratamientos, seleccionar a tu estilista de confianza y confirmar tu cita en un instante.`;
  }
  if (nav === 'servicios') {
    return `¡Hola! Veo que estás revisando nuestro Menú de Servicios. Conozco cada tratamiento (balayage, botox capilar, keratina, spa). ¿Te recomiendo la opción perfecta para tu tipo de cabello?`;
  }
  if (nav === 'perfil') {
    return `¡Hola! Estás en tu Perfil de cliente. Aquí puedes consultar tus citas y beneficios. ¿En qué te puedo orientar hoy?`;
  }
  return `¡Hola! Qué gusto saludarte. Soy MontIA+, tu asistente inteligente en Montserrat Medina Estética. Estás en el Inicio: aquí puedes ver lo más solicitado del salón o agendar tu cita en segundos.`;
};

const getQuestionsForNav = (nav?: string) => {
  if (nav === 'reservar') {
    return [
      {
        id: 'q-estilista',
        category: 'Especialistas',
        icon: UserCheck,
        question: '¿Puedo elegir a mi estilista preferida para mi cita?',
        tagColor: 'text-purple-800 bg-purple-500/10 border-purple-500/25',
      },
      {
        id: 'q-cita',
        category: 'Citas y Horarios',
        icon: Calendar,
        question: '¿Tienen citas y horarios disponibles para hoy?',
        tagColor: 'text-emerald-800 bg-emerald-500/10 border-emerald-500/25',
      },
      {
        id: 'q-guia',
        category: 'Paso a Paso',
        icon: Sparkles,
        question: 'Explicación paso a paso de cómo reservar',
        tagColor: 'text-brand-espresso bg-brand-gold/20 border-brand-gold/35',
      },
      {
        id: 'q-balayage',
        category: 'Servicios',
        icon: Scissors,
        question: '¿Cuánto cuesta y qué incluye el Balayage Couture?',
        tagColor: 'text-amber-800 bg-amber-500/10 border-amber-500/25',
      },
    ];
  }
  if (nav === 'servicios') {
    return [
      {
        id: 'q-diag',
        category: 'Diagnóstico Capilar',
        icon: Sparkles,
        question: '¿Qué tratamiento necesita mi cabello si está seco o maltratado?',
        tagColor: 'text-amber-800 bg-amber-500/10 border-amber-500/25',
      },
      {
        id: 'q-balayage',
        category: 'Servicios y Precios',
        icon: Scissors,
        question: '¿Cuánto cuesta y qué incluye el Balayage Couture?',
        tagColor: 'text-brand-espresso bg-brand-gold/20 border-brand-gold/35',
      },
      {
        id: 'q-cuidados',
        category: 'Cuidados y Rutina',
        icon: Droplets,
        question: '¿Cómo debo cuidar mi cabello después de un alisado o tinte?',
        tagColor: 'text-rose-800 bg-rose-500/10 border-rose-500/25',
      },
      {
        id: 'q-cita',
        category: 'Citas y Horarios',
        icon: Calendar,
        question: '¿Tienen citas y horarios disponibles para hoy?',
        tagColor: 'text-emerald-800 bg-emerald-500/10 border-emerald-500/25',
      },
    ];
  }
  return [
    {
      id: 'q-diag',
      category: 'Diagnóstico Capilar',
      icon: Sparkles,
      question: '¿Qué tratamiento necesita mi cabello si está seco o maltratado?',
      tagColor: 'text-amber-800 bg-amber-500/10 border-amber-500/25',
    },
    {
      id: 'q-cita',
      category: 'Citas y Horarios',
      icon: Calendar,
      question: '¿Tienen citas y horarios disponibles para hoy?',
      tagColor: 'text-emerald-800 bg-emerald-500/10 border-emerald-500/25',
    },
    {
      id: 'q-balayage',
      category: 'Servicios y Precios',
      icon: Scissors,
      question: '¿Cuánto cuesta y qué incluye el Balayage Couture?',
      tagColor: 'text-brand-espresso bg-brand-gold/20 border-brand-gold/35',
    },
    {
      id: 'q-ubicacion',
      category: 'Ubicación y Atelier',
      icon: MapPin,
      question: '¿Dónde están ubicados y cuáles son sus horarios de atención?',
      tagColor: 'text-amber-900 bg-amber-500/10 border-amber-500/25',
    },
  ];
};

export function Chatbot({ 
  isOpen, 
  onClose, 
  onNavigate, 
  onAddService,
  currentNav = 'explorar',
  selectedServicesCount = 0,
  onDeployGuide
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onNavigate: (view: string) => void; 
  onAddService: (id: string) => void; 
  currentNav?: string;
  selectedServicesCount?: number;
  onDeployGuide?: () => void;
}) {
  const [view, setView] = useState<'chat' | 'history'>('chat');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const [welcomeStage, setWelcomeStage] = useState<'intro' | 'questions'>('intro');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [welcomeTypedText, setWelcomeTypedText] = useState('');
  const [showQuestions, setShowQuestions] = useState(false);
  const [showQuickQuestionsTray, setShowQuickQuestionsTray] = useState(false);
  const [isInputHighlighted, setIsInputHighlighted] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Diagnostic questionnaire state
  const [step, setStep] = useState<'idle' | 'q1' | 'q2' | 'q3' | 'done'>('idle');
  const [hairData, setHairData] = useState({ texture: '', thickness: '' });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typewriterTimerRef = useRef<any>(null);

  const savedChats = [
    { id: 'c1', date: 'Ayer', preview: 'Diagnóstico: Cabello fino, rizado...' },
    { id: 'c2', date: '12 Oct', preview: 'Consulta sobre Olaplex No. 7' },
    { id: 'c3', date: '5 Sep', preview: 'Recomendación de estilista para color' },
  ];

  const currentQuestions = getQuestionsForNav(currentNav);

  // Trigger talking welcome typewriter effect whenever chat opens or view changes
  useEffect(() => {
    if (isOpen) {
      if (messages.length === 0) {
        startWelcomeSpeech();
      }
    } else {
      if (typewriterTimerRef.current) {
        clearInterval(typewriterTimerRef.current);
      }
      setIsSpeaking(false);
    }
    return () => {
      if (typewriterTimerRef.current) {
        clearInterval(typewriterTimerRef.current);
        typewriterTimerRef.current = null;
      }
    };
  }, [isOpen, currentNav]);

  const startWelcomeSpeech = () => {
    if (typewriterTimerRef.current) {
      clearInterval(typewriterTimerRef.current);
    }
    const targetText = getWelcomeTextForNav(currentNav, selectedServicesCount);
    setWelcomeTypedText('');
    setIsSpeaking(true);
    setShowQuestions(false);

    let idx = 0;
    typewriterTimerRef.current = setInterval(() => {
      idx += 3;
      if (idx >= targetText.length) {
        setWelcomeTypedText(targetText);
        setIsSpeaking(false);
        setShowQuestions(true);
        clearInterval(typewriterTimerRef.current);
      } else {
        setWelcomeTypedText(targetText.slice(0, idx));
      }
    }, 22);
  };

  const skipWelcomeSpeech = () => {
    if (typewriterTimerRef.current) {
      clearInterval(typewriterTimerRef.current);
    }
    const targetText = getWelcomeTextForNav(currentNav, selectedServicesCount);
    setWelcomeTypedText(targetText);
    setIsSpeaking(false);
    setShowQuestions(true);
  };

  const handleResetChat = () => {
    setMessages([]);
    setStep('idle');
    setInput('');
    setWelcomeStage('intro');
    setShowQuickQuestionsTray(false);
    startWelcomeSpeech();
  };

  const scrollToBottom = () => {
    if (view === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen, view, showQuestions]);

  // Voice Recognition setup
  const SpeechRecognition = typeof window !== 'undefined' ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;
  const recognition = useRef<any>(null);

  useEffect(() => {
    if (SpeechRecognition) {
      try {
        const rec = new SpeechRecognition();
        rec.lang = 'es-MX';
        rec.continuous = false;
        rec.interimResults = false;
        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => prev ? `${prev} ${transcript}` : transcript);
          setIsRecording(false);
        };
        rec.onerror = () => setIsRecording(false);
        rec.onend = () => setIsRecording(false);
        recognition.current = rec;
      } catch (e) {
        console.warn('Speech recognition not available');
      }
    }
  }, [SpeechRecognition]);

  const toggleRecording = () => {
    if (!recognition.current) {
      return;
    }
    if (isRecording) {
      recognition.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognition.current.start();
        setIsRecording(true);
      } catch (e) {
        setIsRecording(false);
      }
    }
  };

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

  // Parses server response tags like [ADD: s1], [NAVIGATE: reservar], [WIDGET: s2]
  const parseActionTags = (text: string) => {
    let cleanText = text;
    const actionElements: React.ReactNode[] = [];

    // Check for ADD
    const addMatches = [...text.matchAll(/\[ADD:\s*(.*?)\]/g)];
    for (const match of addMatches) {
      const id = match[1].trim();
      cleanText = cleanText.replace(match[0], '').trim();
      onAddService(id);
      const serviceObj = services.find(s => s.id === id);
      if (serviceObj) {
        setAddedNotice(serviceObj.title);
        setTimeout(() => setAddedNotice(null), 3000);
        actionElements.push(
          <div key={`add-${id}`} className="mt-3 p-3 bg-brand-surface border border-brand-gold/40 rounded-2xl flex items-center gap-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-brand-gold/15 text-brand-gold flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">Añadido a tu cita</p>
              <p className="text-xs font-semibold text-brand-espresso leading-tight">{serviceObj.title}</p>
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
          <div key={`widget-${id}`} className="mt-3 bg-brand-surface border border-brand-border/70 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-3.5 border-b border-brand-border/40 bg-brand-surface-container/30">
              <span className="text-[9px] uppercase tracking-widest font-bold text-brand-gold block mb-1">Recomendación Personalizada</span>
              <p className="font-serif font-semibold text-brand-espresso text-sm leading-tight">{serviceObj.title}</p>
              <p className="text-xs text-brand-muted mt-1">${serviceObj.price.toLocaleString()} MXN • {serviceObj.duration} min</p>
            </div>
            <div className="flex bg-brand-surface divide-x divide-brand-border/40">
              <button 
                onClick={() => {
                  onAddService(id);
                  setAddedNotice(serviceObj.title);
                  setTimeout(() => setAddedNotice(null), 3000);
                }}
                className="flex-1 py-2.5 text-xs font-semibold text-brand-espresso hover:bg-brand-gold/10 transition-colors flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> Agregar
              </button>
              <button 
                onClick={() => {
                  onAddService(id);
                  onNavigate('reservar');
                  setAddedNotice(`${serviceObj.title} agregado a tu reserva`);
                  setTimeout(() => setAddedNotice(null), 2500);
                }}
                className="flex-1 py-2.5 text-xs font-semibold text-brand-gold hover:bg-brand-gold hover:text-white transition-colors flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5" /> Reservar Ahora
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

  // Local intelligent diagnostic & salon logic
  const processInput = (text: string) => {
    setIsTyping(true);
    setIsSpeaking(true);
    const lower = text.toLowerCase().trim();

    setTimeout(async () => {
      let replyText: React.ReactNode = "";
      let replyOptions: string[] = [];
      let nextStep = step;

      // 0A. Full explanation in chat directly
      if (lower.includes('explicación en el chat') || lower.includes('explicacion en el chat') || lower.includes('explicar en chat') || lower.includes('explicación en chat')) {
        replyText = (
          <div className="space-y-3 text-brand-espresso">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <h4 className="font-serif font-bold text-sm text-brand-espresso">
                Guía Completa para Agendar tu Cita
              </h4>
            </div>
            <p className="text-xs text-brand-espresso/90 leading-relaxed">
              El proceso está organizado en 4 sencillos pasos:
            </p>
            <div className="space-y-2.5 text-xs bg-brand-surface border border-brand-gold/45 rounded-2xl p-3.5 shadow-sm">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-gold/20 text-brand-gold font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-brand-espresso block">Elige tus tratamientos:</strong>
                  <span className="text-brand-muted">Entra al menú de servicios (corte, diseño de color, spa capilar, etc.) y toca "Agregar".</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-gold/20 text-brand-gold font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-brand-espresso block">Selecciona a tu estilista:</strong>
                  <span className="text-brand-muted">Elige a Montserrat Medina para atención personalizada de autor o a cualquiera de nuestras máster estilistas.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-gold/20 text-brand-gold font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-brand-espresso block">Escoge día y horario:</strong>
                  <span className="text-brand-muted">Selecciona en el calendario interactivo la fecha y el turno que mejor te convenga (mañana o tarde).</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-gold/20 text-brand-gold font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                <div>
                  <strong className="text-brand-espresso block">Confirmación y recordatorios:</strong>
                  <span className="text-brand-muted">Confirma con tus datos de contacto y te enviaremos tu confirmación automática con recordatorio a tu WhatsApp.</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  onNavigate('reservar');
                  setAddedNotice('Pantalla de reserva activada');
                  setTimeout(() => setAddedNotice(null), 2500);
                }}
                className="flex-1 py-2.5 px-3 rounded-full bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-espresso font-semibold text-xs text-center border border-brand-gold/50 transition-all cursor-pointer"
              >
                📅 Ir a Reservar
              </button>
              {onDeployGuide && (
                <button
                  onClick={() => {
                    onDeployGuide();
                    onClose();
                  }}
                  className="flex-1 py-2.5 px-3 rounded-full bg-brand-espresso text-white hover:bg-brand-espresso/90 font-semibold text-xs flex items-center justify-center gap-1.5 border border-brand-gold/40 shadow-sm transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Explicación paso a paso</span>
                </button>
              )}
            </div>
          </div>
        );
        replyOptions = [
          "🚀 Explicación paso a paso",
          "📅 Ir directo a Reservar",
          "✨ Ver Menú de Servicios"
        ];
      } else if (lower.includes('agendar') || lower.includes('reservar') || lower.includes('cita') || lower.includes('cómo agendar') || lower.includes('como agendar') || lower.includes('ayuda') || lower.includes('explicar') || lower.includes('pasos')) {
        // 0B. Offer 2 choices: in-chat explanation vs free step-by-step robot deployment
        replyText = (
          <div className="space-y-3 text-brand-espresso">
            <p className="font-semibold text-brand-espresso text-sm">
              ¡Con gusto te ayudo a agendar tu cita!
            </p>
            <p className="text-xs text-brand-espresso/90 leading-relaxed">
              ¿Cómo prefieres que te explique el proceso?
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => handleSend("💬 Explicación en el chat")}
                className="p-3.5 rounded-2xl bg-brand-surface border border-brand-gold/45 hover:border-brand-gold hover:bg-brand-surface-container text-left transition-all group shadow-sm active:scale-95 cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <MessageCircle className="w-4 h-4 text-brand-gold" />
                  <strong className="text-xs text-brand-espresso group-hover:text-brand-gold transition-colors">Explicación en el chat</strong>
                </div>
                <p className="text-[11px] text-brand-muted leading-tight">
                  Te detallo aquí mismo los 4 pasos y consejos sin salir de la conversación.
                </p>
              </button>

              <button
                onClick={() => {
                  onDeployGuide?.();
                  onClose();
                }}
                className="p-3.5 rounded-2xl bg-brand-espresso text-white border border-brand-gold/45 hover:bg-brand-espresso/90 text-left transition-all group shadow-sm active:scale-95 cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-brand-gold group-hover:rotate-12 transition-transform" />
                  <strong className="text-xs text-white">Explicación paso a paso</strong>
                </div>
                <p className="text-[11px] text-white/80 leading-tight">
                  La bolita 3D sale a la pantalla y te va guiando libremente por cada sección.
                </p>
              </button>
            </div>
          </div>
        );
        replyOptions = [
          "💬 Explicación en el chat",
          "🚀 Explicación paso a paso",
          "📅 Ir directo a Reservar"
        ];
      } else if (lower.includes('servicio') || lower.includes('menú') || lower === 'ver servicios' || lower === 'ver todos los servicios') {
        onNavigate('servicios');
        replyText = (
          <div className="space-y-3">
            <p>Aquí tienes nuestros servicios y tratamientos estrella de alta peluquería en el atelier. Puedes agregar cualquiera a tu reserva con un toque:</p>
            <div className="space-y-2 mt-2">
              {services.slice(0, 3).map(s => (
                <div key={s.id} className="p-3 bg-brand-surface border border-brand-border/80 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-serif font-semibold text-brand-espresso text-sm">{s.title}</p>
                    <span className="text-xs font-semibold text-brand-gold">${s.price.toLocaleString()} MXN</span>
                  </div>
                  <p className="text-[11px] text-brand-muted line-clamp-2">{s.description}</p>
                  <div className="flex gap-2 mt-2 pt-2 border-t border-brand-border/40">
                    <button 
                      onClick={() => {
                        onAddService(s.id);
                        setAddedNotice(s.title);
                        setTimeout(() => setAddedNotice(null), 2500);
                      }}
                      className="text-[11px] font-semibold text-brand-espresso bg-brand-surface-container px-3 py-1 rounded-full hover:bg-brand-gold/20 transition-colors cursor-pointer"
                    >
                      + Agregar
                    </button>
                    <button 
                      onClick={() => {
                        onAddService(s.id);
                        onNavigate('reservar');
                        setAddedNotice(`${s.title} listo en tu reserva`);
                        setTimeout(() => setAddedNotice(null), 2500);
                      }}
                      className="text-[11px] font-semibold text-brand-gold bg-brand-surface-container px-3 py-1 rounded-full hover:bg-brand-espresso hover:text-white transition-colors cursor-pointer"
                    >
                      Apartar con este servicio
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-brand-muted">También he colocado de fondo el menú completo de servicios por categorías.</p>
          </div>
        );
        replyOptions = ["Agendar Cita", "Realizar Diagnóstico", "¿Tienen horarios hoy?"];
      }

      // 1. Dry or damaged hair question
      if (lower.includes('seco') || lower.includes('maltratado') || lower.includes('dañado') || lower.includes('tratamiento necesita mi cabello')) {
        replyText = (
          <div className="space-y-3">
            <p>Para cabello seco, quebradizo o sensibilizado por calor y procesos químicos, te recomendamos nuestro protocolo de nutrición estrella:</p>
            <div className="p-3.5 bg-brand-surface border border-brand-gold/45 rounded-2xl shadow-sm">
              <span className="text-[9px] uppercase tracking-widest font-bold text-brand-gold block mb-1">Ritual en Atelier</span>
              <p className="font-serif font-semibold text-brand-espresso text-sm">Hidratación Profunda con Ácido Hialurónico</p>
              <p className="text-xs text-brand-muted mt-0.5">$850 MXN • 60 min</p>
              <p className="text-[11px] text-brand-espresso/85 mt-2 leading-relaxed">
                Rellena la hebra capilar desde el córtex, sella las puntas abiertas y restaura un brillo sedoso inmediato sin dejar sensación pesada.
              </p>
              <div className="flex gap-2 mt-3 pt-2.5 border-t border-brand-border/50">
                <button 
                  onClick={() => {
                    onAddService('s2');
                    setAddedNotice('Hidratación Profunda');
                    setTimeout(() => setAddedNotice(null), 2500);
                  }}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-full bg-brand-surface-container hover:bg-brand-gold/20 transition-colors text-brand-espresso"
                >
                  + Agregar a mi Cita
                </button>
                <button 
                  onClick={() => {
                    onAddService('s2');
                    onNavigate('reservar');
                    setAddedNotice('Hidratación agregada a tu reserva');
                    setTimeout(() => setAddedNotice(null), 2500);
                  }}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-full bg-brand-espresso text-white hover:bg-brand-espresso/90 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  Reservar Ahora →
                </button>
              </div>
            </div>
            <p className="text-xs text-brand-muted">Si lo prefieres, también podemos realizar un test de diagnóstico completo de 3 pasos.</p>
          </div>
        );
        replyOptions = ["Realizar Diagnóstico", "Agendar Cita", "Ver Menú de Servicios"];
      }
      // 2. Appointments and available slots today
      else if (lower.includes('disponibles para hoy') || (lower.includes('citas') && lower.includes('hoy')) || lower.includes('horarios disponibles')) {
        replyText = (
          <div className="space-y-3">
            <p>¡Sí! Hoy contamos con turnos disponibles en nuestro atelier con especialistas en colorimetría, estilismo y spa capilar.</p>
            <div className="p-4 bg-brand-surface border border-brand-gold/50 rounded-2xl shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-brand-espresso font-serif font-semibold text-sm">
                <Calendar className="w-4 h-4 text-brand-gold" /> Calendario en Tiempo Real
              </div>
              <p className="text-xs text-brand-muted">
                Puedes seleccionar tus servicios deseados, elegir a tu especialista de preferencia y asegurar tu horario de hoy al instante:
              </p>
              <button 
                onClick={() => {
                  onNavigate('reservar');
                  setAddedNotice('Horarios listos en pantalla de reserva');
                  setTimeout(() => setAddedNotice(null), 2500);
                }}
                className="w-full mt-2 py-2.5 rounded-xl bg-brand-espresso text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-brand-espresso/90 transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-brand-gold" /> Ver Horarios y Reservar Cita →
              </button>
            </div>
          </div>
        );
        replyOptions = ["Agendar Cita", "Ver Servicios", "¿Dónde están ubicados?"];
      }
      // 3. Balayage Couture breakdown
      else if (lower.includes('balayage couture') || (lower.includes('balayage') && lower.includes('cuánto cuesta'))) {
        replyText = (
          <div className="space-y-3">
            <p>Nuestro <strong>Balayage Couture</strong> ($2,400 MXN • ~180 min) es una técnica artesanal a mano alzada diseñada para crear luminosidad natural y degradados multidimensionales sin efecto raíz.</p>
            <div className="p-3.5 bg-brand-surface border border-brand-gold/45 rounded-2xl shadow-sm space-y-2">
              <span className="text-[9px] uppercase tracking-widest font-bold text-brand-gold block">¿Qué incluye el servicio?</span>
              <ul className="text-xs text-brand-espresso/90 space-y-1.5 pl-1">
                <li>✦ <strong>Diagnóstico de Visagismo:</strong> Selección del tono ideal según tu tono de piel y ojos.</li>
                <li>✦ <strong>Aclarado con Plex:</strong> Decoloración controlada con protector de enlaces de queratina.</li>
                <li>✦ <strong>Matiz Gloss:</strong> Baño de brillo espejo libre de amoníaco.</li>
                <li>✦ <strong>Lavado & Peinado:</strong> Masaje relajante y acabado con ondas styling al agua.</li>
              </ul>
              <div className="flex gap-2 pt-2 border-t border-brand-border/40">
                <button 
                  onClick={() => {
                    onAddService('s1');
                    setAddedNotice('Balayage Couture');
                    setTimeout(() => setAddedNotice(null), 2500);
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-brand-surface-container border border-brand-border hover:bg-brand-gold/20 transition-colors text-brand-espresso"
                >
                  + Agregar ($2,400)
                </button>
                <button 
                  onClick={() => {
                    onAddService('s1');
                    onNavigate('reservar');
                    setAddedNotice('Balayage agregado a tu reserva');
                    setTimeout(() => setAddedNotice(null), 2500);
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-brand-espresso text-white hover:bg-brand-espresso/90 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  Reservar Balayage →
                </button>
              </div>
            </div>
          </div>
        );
        replyOptions = ["Agendar Cita", "¿Cómo debo cuidar mi cabello?", "Ver Todos los Servicios"];
      }
      // 4. Hair aftercare
      else if (lower.includes('cuidar mi cabello') || lower.includes('cuidados') || lower.includes('después de un alisado') || lower.includes('después de una decoloración')) {
        replyText = (
          <div className="space-y-3">
            <p>Para prolongar la luminosidad y salud de tu cabello tras un proceso químico o de alisado, las estilistas recomiendan este protocolo:</p>
            <div className="p-3.5 bg-brand-surface border border-brand-border rounded-2xl space-y-2 text-xs text-brand-espresso">
              <p><strong>1. Shampoo sin sulfatos:</strong> Utiliza fórmulas suaves como Olaplex No. 4 para no desgastar el color ni abrir la cutícula.</p>
              <p><strong>2. Agua templada:</strong> Evita el agua excesivamente caliente en el lavado para sellar el brillo.</p>
              <p><strong>3. Mascarilla semanal:</strong> Aplica tratamiento nutritivo durante 15 minutos una vez por semana.</p>
              <p><strong>4. Protector térmico:</strong> Indispensable antes de secadoras o planchas para evitar deshidratación.</p>
            </div>
            <p className="text-xs text-brand-muted">¿Te gustaría agendar una cita de matiz o baño de brillo para mantenimiento?</p>
          </div>
        );
        replyOptions = ["Agendar Cita de Mantenimiento", "Ver Servicios", "Hacer Diagnóstico"];
      }
      // 5. Stylist selection
      else if (lower.includes('elegir estilista') || lower.includes('estilista preferida') || lower.includes('estilistas')) {
        replyText = (
          <div className="space-y-3">
            <p>¡Por supuesto! En Montserrat Medina puedes elegir a tu especialista de cabecera al momento de agendar:</p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-semibold text-brand-espresso">Valeria Ramos</p>
                  <span className="text-[10px] text-brand-muted">Colorista Senior • Balayage & Rubio Perfecto</span>
                </div>
                <span className="text-[10px] text-brand-gold font-bold">★ 4.9</span>
              </div>
              <div className="p-2.5 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-semibold text-brand-espresso">Mariana Ortiz</p>
                  <span className="text-[10px] text-brand-muted">Master Stylist • Cortes de Precisión & Visagismo</span>
                </div>
                <span className="text-[10px] text-brand-gold font-bold">★ 4.9</span>
              </div>
              <div className="p-2.5 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-semibold text-brand-espresso">Sofía Morales</p>
                  <span className="text-[10px] text-brand-muted">Terapeuta Capilar • Cauterización & Alisados</span>
                </div>
                <span className="text-[10px] text-brand-gold font-bold">★ 4.8</span>
              </div>
            </div>
            <button 
              onClick={() => {
                onNavigate('reservar');
                setAddedNotice('Selección de estilista en pantalla de reserva');
                setTimeout(() => setAddedNotice(null), 2500);
              }}
              className="w-full py-2.5 bg-brand-espresso text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-brand-espresso/90 transition-all active:scale-95 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-brand-gold" /> Seleccionar Estilista y Reservar →
            </button>
          </div>
        );
        replyOptions = ["Agendar con Estilista", "Ver Servicios", "Hacer Diagnóstico"];
      }
      // 6. Location and hours
      else if (lower.includes('ubicados') || lower.includes('horarios') || lower.includes('dirección') || lower.includes('dónde están')) {
        replyText = (
          <div className="space-y-3">
            <div className="p-4 bg-brand-surface border border-brand-gold/40 rounded-2xl shadow-sm space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-serif font-semibold text-brand-espresso text-sm">Montserrat Medina Estética</p>
                  <p className="text-xs text-brand-muted">Av. Insurgentes Sur 1425, Col. Guadalupe Inn, Ciudad de México.</p>
                  <p className="text-[11px] text-brand-gold font-medium mt-1">🚗 Valet parking de cortesía para todos nuestros clientes.</p>
                </div>
              </div>
              <div className="pt-2 border-t border-brand-border/40 text-xs text-brand-espresso space-y-1">
                <p className="font-semibold text-[11px] uppercase tracking-wider text-brand-muted">Horarios de Atelier</p>
                <p>• <strong>Martes a Sábado:</strong> 09:00 - 20:00 hrs</p>
                <p>• <strong>Domingos:</strong> 10:00 - 17:00 hrs</p>
                <p>• <strong>Lunes:</strong> Cerrado (Capacitación y formación continua)</p>
              </div>
              <button 
                onClick={() => {
                  onNavigate('reservar');
                  setAddedNotice('Reserva lista en pantalla');
                  setTimeout(() => setAddedNotice(null), 2500);
                }}
                className="w-full py-2.5 bg-brand-espresso text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-brand-espresso/90 transition-all active:scale-95 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-brand-gold" /> Reservar Cita en Este Horario →
              </button>
            </div>
          </div>
        );
        replyOptions = ["Agendar Cita", "Ver Servicios", "Realizar Diagnóstico"];
      }
      // Specific catalog search queries
      else {
        const matchedServices = services.filter(s => 
          lower.includes(s.title.toLowerCase()) ||
          s.tags?.some(t => lower.includes(t.toLowerCase())) ||
          (lower.includes('balayage') && s.title.toLowerCase().includes('balayage')) ||
          (lower.includes('botox') && s.title.toLowerCase().includes('botox')) ||
          (lower.includes('corte') && s.title.toLowerCase().includes('corte')) ||
          (lower.includes('uña') && s.category.includes('Manicura')) ||
          (lower.includes('pedicura') && s.title.toLowerCase().includes('pedicura'))
        );

        if (matchedServices.length > 0 && !lower.includes('diagnóstico')) {
          replyText = (
            <div className="space-y-3">
              <p>He encontrado opciones ideales para lo que buscas en nuestro catálogo:</p>
              <div className="space-y-2 mt-2">
                {matchedServices.slice(0, 2).map(s => (
                  <div 
                    key={s.id}
                    className="p-3 bg-brand-surface border border-brand-border/80 rounded-2xl shadow-sm hover:border-brand-gold transition-colors"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-serif font-semibold text-brand-espresso text-sm">{s.title}</p>
                      <span className="text-xs font-semibold text-brand-gold">${s.price.toLocaleString()} MXN</span>
                    </div>
                    <p className="text-[11px] text-brand-muted line-clamp-2">{s.description}</p>
                    <div className="flex gap-2 mt-2 pt-2 border-t border-brand-border/40">
                      <button 
                        onClick={() => {
                          onAddService(s.id);
                          setAddedNotice(s.title);
                          setTimeout(() => setAddedNotice(null), 2500);
                        }}
                        className="text-[11px] font-semibold text-brand-espresso bg-brand-surface-container px-3 py-1 rounded-full hover:bg-brand-gold/20 transition-colors"
                      >
                        + Agregar
                      </button>
                      <button 
                        onClick={() => {
                          onAddService(s.id);
                          onNavigate('reservar');
                          setAddedNotice(`${s.title} listo en reserva`);
                          setTimeout(() => setAddedNotice(null), 2500);
                        }}
                        className="text-[11px] font-semibold text-white bg-brand-espresso px-3 py-1 rounded-full hover:bg-brand-espresso/90 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        Reservar Cita →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
          replyOptions = ["Agendar Cita", "Ver Menú de Servicios", "Realizar Diagnóstico"];
        }
        else if (step === 'idle') {
          if (lower.includes('diagnóstico') || lower.includes('analizar') || lower.includes('test') || lower.includes('textura')) {
            nextStep = 'q1';
            replyText = "Iniciemos tu diagnóstico capilar de alta costura. Primero, ¿cuál es la textura natural de tu cabello?";
            replyOptions = ["Lacio", "Ondulado", "Rizado", "Crespo"];
          } else {
            // Real Gemini AI Chat Query!
            try {
              const data = await requestChat({ prompt: text, currentNav, selectedServicesCount });
              if (data.text) {
                const { cleanText, actionElement } = parseActionTags(data.text || '');
                setStep('idle');
                setIsTyping(false);
                setMessages(prev => [...prev, {
                  id: Date.now().toString(),
                  role: 'ai',
                  text: (
                    <div className="space-y-2">
                      <p className="whitespace-pre-wrap">{cleanText}</p>
                      {actionElement}
                    </div>
                  ),
                  options: currentNav === 'reservar'
                    ? ["Elegir estilista", "¿Tienen horarios hoy?", "Explicación paso a paso", "Ver Servicios"]
                    : currentNav === 'servicios'
                    ? ["Recomiéndame un servicio", "Ir a Reservar", "Explicación paso a paso"]
                    : ["Agendar Cita", "Ver Menú de Servicios", "Explicación paso a paso"]
                }]);
                setTimeout(() => {
                  setIsSpeaking(false);
                }, 2200);
                return;
              }
            } catch (err) {
              console.warn('API fetch error, falling back:', err);
            }

            replyText = currentNav === 'reservar'
              ? `Veo que estás en la pantalla de Reserva (tienes ${selectedServicesCount} servicio(s)). Para completar tu cita, escoge a tu estilista de confianza, selecciona el día y horario en el calendario y llena tus datos. ¿Deseas que active la explicación paso a paso?`
              : currentNav === 'servicios'
              ? "Estás en nuestro Menú de Servicios. Puedes añadir el tratamiento que prefieras a tu cita con un toque o preguntarme cuál es el mejor para tu tipo de cabello."
              : "En Montserrat Medina Estética estamos listos para atenderte con alta peluquería, Balayage y tratamientos capilares. ¿Deseas agendar o conocer algún servicio?";
            replyOptions = currentNav === 'reservar'
              ? ["Explicación paso a paso", "Elegir estilista", "Ver Servicios"]
              : currentNav === 'servicios'
              ? ["Recomiéndame un servicio", "Ir a Reservar", "Explicación paso a paso"]
              : ["Agendar Cita", "Ver Servicios", "Realizar Diagnóstico"];
          }
        } 
        else if (step === 'q1') {
          setHairData(prev => ({ ...prev, texture: text }));
          nextStep = 'q2';
          replyText = `Comprendido, cabello ${text.toLowerCase()}. ¿Cómo calificarías el grosor o densidad de tu hebra?`;
          replyOptions = ["Fino y delicado", "Medio estándar", "Grueso y resistente"];
        } 
        else if (step === 'q2') {
          setHairData(prev => ({ ...prev, thickness: text }));
          nextStep = 'q3';
          replyText = "Último paso: ¿Cuál es el objetivo principal o necesidad actual de tu cabello?";
          replyOptions = ["Reparación profunda / Daño químico", "Mantenimiento de color y brillo", "Control de frizz y alineación", "Detox del cuero cabelludo"];
        } 
        else if (step === 'q3') {
          nextStep = 'done';
          replyText = (
            <div className="space-y-3">
              <p>¡Diagnóstico completado! Según tu perfil: <strong>Cabello {hairData.texture.toLowerCase()}, {hairData.thickness.toLowerCase()} con objetivo de {text.toLowerCase()}</strong>.</p>
              <div className="p-4 bg-brand-gold/10 border border-brand-gold/30 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-gold" />
                <p className="font-serif font-semibold text-brand-espresso text-sm flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-brand-gold" /> Ritual Recomendado en Atelier
                </p>
                <p className="text-xs text-brand-espresso/90 leading-relaxed font-medium">
                  <strong>Terapia Celular y Botox Capilar</strong> regenerativo, sellado con <strong>Olaplex No. 7</strong> para nutrición extrema sin perder ligereza.
                </p>
              </div>
              <p className="text-xs text-brand-muted">¿Deseas agregarlo a tu reserva directamente?</p>
            </div>
          );
          replyOptions = ["Reservar este Tratamiento", "Ver todos los servicios", "Reiniciar Diagnóstico"];
        }
        else if (step === 'done') {
          if (lower.includes('reiniciar')) {
            nextStep = 'q1';
            replyText = "Comencemos de nuevo. ¿Cuál es la textura natural de tu cabello?";
            replyOptions = ["Lacio", "Ondulado", "Rizado", "Crespo"];
          } else if (lower.includes('reservar')) {
            onAddService('s2');
            onNavigate('reservar');
            setAddedNotice('Tratamiento agregado a tu reserva');
            setTimeout(() => setAddedNotice(null), 2500);
            replyText = "¡Excelente! He añadido la Terapia Celular y Botox Capilar a tu cita en la pantalla de Reserva. Puedes elegir a tu estilista y horario ideal.";
            replyOptions = ["Elegir estilista", "¿Tienen horarios hoy?", "Ver Menú de Servicios"];
          } else {
            replyText = "¿En qué más puedo asistirte hoy?";
            replyOptions = ["Agendar Cita", "Ver Menú de Servicios", "Realizar Diagnóstico"];
          }
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

      // Turn off speaking state after message is delivered
      setTimeout(() => {
        setIsSpeaking(false);
      }, 1800);

    }, 600);
  };

  const processImageRequest = async (text: string, imageBase64: string | null) => {
    setIsTyping(true);
    setIsSpeaking(true);
    try {
      const data = await requestChat({ prompt: text, imageBase64, currentNav, selectedServicesCount });
      const { cleanText, actionElement } = parseActionTags(data.text || '');

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        text: (
          <div className="space-y-2">
            {imageBase64 && (
              <p className="font-semibold text-brand-gold text-xs uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold"/> Análisis Visual Capilar
              </p>
            )}
            <p className="whitespace-pre-wrap">{cleanText}</p>
            {actionElement}
          </div>
        ),
        options: ["Agendar Cita", "Ver Menú de Servicios"]
      }]);
    } catch (err) {
      console.warn('Fallback to local concierge engine:', err);
      processInput(text);
      return;
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        setIsSpeaking(false);
      }, 1500);
    }
  };

  const handleSend = (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() && !selectedImage) return;

    // Skip welcome typing if still active
    skipWelcomeSpeech();

    const lower = textToSend.toLowerCase().trim();

    // Deploy guide robot directly if requested
    if (
      lower.includes('explicacion paso a paso') ||
      lower.includes('explicación paso a paso') ||
      lower.includes('despliegue paso a paso') ||
      lower.includes('desplegar robot') ||
      lower.includes('despliegue') ||
      lower.includes('robot para explicación') ||
      lower.includes('guía con robot') ||
      lower.includes('guia con robot') ||
      lower.includes('guía paso a paso') ||
      lower.includes('guia paso a paso') ||
      lower === 'paso a paso'
    ) {
      onDeployGuide?.();
      onClose();
      setInput('');
      return;
    }

    // Instant fast-track navigation commands (updates screen in background without closing chat)
    if (lower === 'ir directo a reservar' || lower === 'ir a reservar' || lower === 'reservar este tratamiento') {
      if (lower === 'reservar este tratamiento') {
        onAddService('s2');
      }
      onNavigate('reservar');
      setAddedNotice('Pantalla de reserva activada');
      setTimeout(() => setAddedNotice(null), 2500);
    }
    if (lower === 'ver menú de servicios' || lower === 'ver todos los servicios') {
      onNavigate('servicios');
      setAddedNotice('Menú de servicios activado');
      setTimeout(() => setAddedNotice(null), 2500);
    }

    const newUserMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      text: (
        <div className="flex flex-col gap-2">
          {selectedImage && <img src={selectedImage} alt="Upload preview" className="w-48 h-48 object-cover rounded-xl shadow-sm" />}
          {textToSend && <span>{textToSend}</span>}
        </div>
      )
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    const currentImg = selectedImage;
    setSelectedImage(null);
    setShowQuickQuestionsTray(false);
    
    if (currentImg) {
      processImageRequest(textToSend, currentImg);
    } else {
      processInput(textToSend);
    }
  };

  return (
    <>
      {/* Added Service Toast */}
      {addedNotice && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[80] bg-brand-espresso text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-brand-gold shrink-0" />
          <span>"{addedNotice}" agregado a tu cita</span>
        </div>
      )}

      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-espresso/40 backdrop-blur-sm z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <motion.div
        initial={false}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          y: isOpen ? 0 : 35, 
          scale: isOpen ? 1 : 0.96,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed bottom-0 left-0 right-0 md:bottom-24 md:right-8 md:left-auto md:w-[440px] h-[92dvh] md:h-[660px] bg-brand-surface z-[70] rounded-t-[2.2rem] md:rounded-[2.2rem] shadow-[0_20px_60px_-10px_rgba(30,27,24,0.22)] border border-brand-border/80 flex flex-col overflow-hidden transition-[visibility,opacity] ${
          isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        }`}
      >
        {/* Subtle Ambient Glow Background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-25 z-0"
          style={{
            background: 'radial-gradient(circle at 50% 15%, rgba(223, 184, 121, 0.35) 0%, rgba(232, 180, 184, 0.15) 45%, transparent 75%)'
          }}
        />

        {/* Header */}
        <div className="relative z-10 bg-brand-surface/95 backdrop-blur-md px-5 py-3.5 flex items-center justify-between border-b border-brand-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-espresso text-brand-surface flex items-center justify-center shadow-inner font-serif font-bold text-xs tracking-wider border border-brand-gold/40">
              M+
            </div>
            <div>
              <h3 className="font-serif font-semibold text-brand-espresso leading-tight text-base md:text-lg">MontIA+</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-brand-muted">
                  Asistente Virtual
                </p>
                {currentNav && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-brand-gold/15 text-brand-gold font-semibold uppercase">
                    {currentNav === 'reservar' ? 'Reservar' : currentNav === 'servicios' ? 'Servicios' : currentNav === 'perfil' ? 'Perfil' : 'Inicio'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {messages.length > 0 && (
              <button 
                onClick={handleResetChat}
                title="Reiniciar bienvenida"
                className="w-8 h-8 rounded-full bg-brand-surface flex items-center justify-center text-brand-muted hover:text-brand-espresso hover:bg-brand-border/60 transition-all shadow-sm border border-brand-border/40 active:scale-95"
                aria-label="Reiniciar chat"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
            <button 
              onClick={() => setView(view === 'chat' ? 'history' : 'chat')}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm border active:scale-95 ${
                view === 'history' 
                  ? 'bg-brand-espresso text-brand-gold border-brand-espresso' 
                  : 'bg-brand-surface text-brand-muted hover:text-brand-espresso hover:bg-brand-border/60 border-brand-border/40'
              }`}
              aria-label="Historial"
            >
              {view === 'history' ? <MessageSquare className="w-3.5 h-3.5" /> : <History className="w-3.5 h-3.5" />}
            </button>
            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full bg-brand-surface flex items-center justify-center text-brand-muted hover:text-brand-espresso hover:bg-brand-border/60 transition-all shadow-sm border border-brand-border/40 active:scale-95"
              aria-label="Cerrar chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {view === 'chat' ? (
          <>
            {/* Messages & Interactive Stage */}
            <div 
              onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 30)}
              className="relative z-10 flex-1 overflow-y-auto p-4 md:p-5 space-y-4 bg-gradient-to-b from-brand-surface/30 to-brand-surface-container/20 no-scrollbar"
            >
              
              {/* DEFAULT WELCOMING TALKING STAGE WITH 3D SPHERE & GUIDED CHOICES */}
              {messages.length === 0 ? (
                welcomeStage === 'intro' ? (
                  /* STEP 1: CENTERED 3D BALL WITH UNFOLDING SPEECH WINDOW */
                  <div className="flex flex-col items-center justify-center min-h-[440px] my-auto px-1 py-4 text-center animate-in fade-in duration-500">
                    
                    {/* 3D Robot Avatar Centered - Pure Clean Transparent Canvas (10% smaller) */}
                    <div className="relative w-52 h-52 md:w-56 md:h-56 flex items-center justify-center mb-1">
                      <Scene3D isSpeaking={isSpeaking} />
                    </div>

                    {/* Unfolding 2D Text Window with Internal Lighting Depth */}
                    <motion.div
                      initial={{ opacity: 0, y: 22, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="relative w-full max-w-[390px]"
                    >
                      {/* Speech pointer tail */}
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-brand-surface border-t border-l border-brand-border rotate-45 z-10" />

                      <div className="relative z-0 overflow-hidden bg-brand-surface border border-brand-border rounded-2xl p-5 md:p-6 shadow-lg text-left select-none">

                        {/* Relative Content Container */}
                        <div className="relative z-10">
                          {/* Header with status */}
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                              <span className="text-[11px] uppercase tracking-wider font-bold text-brand-espresso font-serif">
                                MontIA+ Asistente
                              </span>
                            </div>
                            {isSpeaking && (
                              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold text-[10px] font-semibold border border-brand-gold/40 shadow-sm backdrop-blur-sm">
                                <span className="flex gap-0.5 items-end h-2.5">
                                  <span className="w-0.5 h-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                  <span className="w-0.5 h-2.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                  <span className="w-0.5 h-2 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </span>
                                <span>Hablando...</span>
                              </div>
                            )}
                          </div>

                          {/* Speech content */}
                          <p 
                            onClick={skipWelcomeSpeech}
                            className="text-[13px] md:text-sm text-brand-espresso leading-relaxed font-normal cursor-pointer"
                          >
                            {welcomeTypedText}
                            {isSpeaking && (
                              <span className="inline-block w-1.5 h-4 bg-brand-gold ml-1 animate-pulse align-middle rounded-full shadow-[0_0_8px_rgba(223,184,121,0.8)]" />
                            )}
                          </p>

                          {/* Choice buttons guiding user */}
                          <div className="mt-4 pt-3.5 border-t border-brand-border/60 space-y-2">
                            <p className="text-[11px] font-medium text-brand-muted text-center mb-1">
                              ¿Cómo deseas comenzar tu consulta?
                            </p>

                            {/* Button 1: Everyday / Common questions */}
                            <button
                              onClick={() => {
                                skipWelcomeSpeech();
                                setWelcomeStage('questions');
                              }}
                              className="w-full p-3 rounded-2xl bg-brand-espresso text-white text-xs font-semibold flex items-center justify-between hover:bg-brand-espresso/90 active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(35,28,22,0.18)] hover:shadow-[0_6px_20px_rgba(35,28,22,0.25)] border border-brand-gold/30 group"
                            >
                              <div className="flex items-center gap-2.5 text-left">
                                <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-brand-gold shrink-0 border border-white/10 group-hover:bg-brand-gold/20 transition-colors">
                                  <Sparkles className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <p className="leading-tight font-medium text-white">Preguntas cotidianas</p>
                                  <p className="text-[10px] text-white/70 font-normal">Citas, balayage, cuidados y ubicación</p>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-brand-gold group-hover:translate-x-1 transition-transform shrink-0" />
                            </button>

                            {/* Button 2: Explicación paso a paso (tour interactivo en el inicio de la IA) */}
                            {onDeployGuide && (
                              <button
                                onClick={() => {
                                  skipWelcomeSpeech();
                                  onDeployGuide();
                                  onClose();
                                }}
                                className="w-full p-3 rounded-2xl bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/60 text-brand-espresso text-xs font-semibold flex items-center justify-between active:scale-[0.98] transition-all shadow-xs group cursor-pointer"
                              >
                                <div className="flex items-center gap-2.5 text-left">
                                  <div className="w-7 h-7 rounded-xl bg-brand-gold/25 flex items-center justify-center text-brand-espresso shrink-0 border border-brand-gold/40 group-hover:scale-105 transition-transform">
                                    <Sparkles className="w-3.5 h-3.5 text-brand-espresso" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <p className="leading-tight font-semibold text-brand-espresso">Explicación paso a paso</p>
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-brand-gold/30 text-brand-espresso">Guía visual</span>
                                    </div>
                                    <p className="text-[10px] text-brand-muted font-normal">Recorrido interactivo guiado por la app</p>
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-brand-muted group-hover:text-brand-gold group-hover:translate-x-1 transition-transform shrink-0" />
                              </button>
                            )}

                            {/* Button 3: Write something specific */}
                            <button
                              onClick={() => {
                                skipWelcomeSpeech();
                                textInputRef.current?.focus();
                                setIsInputHighlighted(true);
                                setTimeout(() => setIsInputHighlighted(false), 2200);
                              }}
                              className="w-full p-3 rounded-2xl bg-brand-surface/90 backdrop-blur-md border border-brand-gold/50 text-brand-espresso text-xs font-semibold flex items-center justify-between hover:bg-white hover:border-brand-gold active:scale-[0.98] transition-all shadow-sm hover:shadow-[0_4px_16px_rgba(223,184,121,0.2)] group"
                            >
                              <div className="flex items-center gap-2.5 text-left">
                                <div className="w-7 h-7 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold shrink-0 border border-brand-gold/30 group-hover:bg-brand-gold/25 transition-colors">
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <p className="leading-tight font-medium text-brand-espresso">Escribir algo específico</p>
                                  <p className="text-[10px] text-brand-muted font-normal">Escribe tu duda o sube una foto</p>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-brand-muted group-hover:text-brand-gold group-hover:translate-x-1 transition-transform shrink-0" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  </div>
                ) : (
                  /* STEP 2: ANIMATED EVERYDAY QUESTIONS VIEW */
                  <div className="flex flex-col pt-1 pb-3 animate-in fade-in duration-300 space-y-3">
                    
                    {/* Compact Top Navigation Bar */}
                    <div className="flex items-center justify-between px-1 py-1">
                      <button
                        onClick={() => setWelcomeStage('intro')}
                        className="flex items-center gap-1 text-xs font-semibold text-brand-espresso/80 hover:text-brand-espresso px-3 py-1.5 rounded-full bg-brand-surface border border-brand-border/70 hover:border-brand-gold shadow-sm transition-all active:scale-95"
                      >
                        <span>← Volver al saludo</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full border border-brand-gold/30 relative flex items-center justify-center overflow-hidden">
                          <Scene3D isSpeaking={isSpeaking} />
                        </div>
                        <span className="font-serif text-xs font-bold text-brand-espresso">MontIA+</span>
                      </div>
                    </div>

                    {/* Section Title */}
                    <div className="px-1">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                        <h4 className="font-serif font-semibold text-brand-espresso text-sm md:text-base">
                          Preguntas cotidianas e importantes
                        </h4>
                      </div>
                      <p className="text-[11px] text-brand-muted mt-0.5">
                        Toca cualquier pregunta para obtener una respuesta inmediata de nuestro atelier:
                      </p>
                    </div>

                    {/* Fluid Staggered Animated Questions List */}
                    <div className="grid grid-cols-1 gap-2">
                      {currentQuestions.map((item, idx) => (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, y: 16, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            delay: 0.05 + idx * 0.06, 
                            duration: 0.32,
                            ease: [0.22, 1, 0.36, 1] 
                          }}
                          onClick={() => handleSend(item.question)}
                          className="text-left p-3 md:p-3.5 rounded-2xl bg-brand-surface/95 border border-brand-border/80 hover:border-brand-gold hover:bg-[#FFFDF9] transition-all shadow-sm hover:shadow-md active:scale-[0.98] group flex items-center justify-between gap-3"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-brand-surface-container/70 border border-brand-border/60 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-brand-gold/15 group-hover:border-brand-gold/40 transition-colors">
                              <item.icon className="w-4 h-4 text-brand-gold" />
                            </div>
                            <div>
                              <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-1 ${item.tagColor}`}>
                                {item.category}
                              </span>
                              <p className="text-xs md:text-[13px] font-medium text-brand-espresso leading-snug">
                                {item.question}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-gold group-hover:translate-x-1 transition-all shrink-0" />
                        </motion.button>
                      ))}
                    </div>

                    {/* Quick Fast-Action Chips */}
                    <div className="pt-2 flex flex-wrap gap-2 justify-center">
                      <button 
                        onClick={() => handleSend("Agendar Cita")}
                        className="text-xs font-semibold text-brand-espresso bg-brand-surface border border-brand-gold/50 px-3.5 py-1.5 rounded-full hover:bg-brand-espresso hover:text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <Calendar className="w-3.5 h-3.5 text-brand-gold" /> Agendar Cita
                      </button>
                      <button 
                        onClick={() => handleSend("Ver Menú de Servicios")}
                        className="text-xs font-semibold text-brand-espresso bg-brand-surface border border-brand-border px-3.5 py-1.5 rounded-full hover:bg-brand-espresso hover:text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <Scissors className="w-3.5 h-3.5 text-brand-gold" /> Ver Servicios
                      </button>
                      <button 
                        onClick={() => handleSend("Realizar Diagnóstico")}
                        className="text-xs font-semibold text-brand-espresso bg-brand-surface border border-brand-border px-3.5 py-1.5 rounded-full hover:bg-brand-espresso hover:text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> Test Capilar
                      </button>
                      {onDeployGuide && (
                        <button 
                          onClick={() => {
                            onDeployGuide();
                            onClose();
                          }}
                          className="text-xs font-semibold text-brand-espresso bg-brand-gold/15 border border-brand-gold/60 px-3.5 py-1.5 rounded-full hover:bg-brand-espresso hover:text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> Explicación paso a paso
                        </button>
                      )}
                    </div>
                  </div>
                )
              ) : (
                /* CONVERSATION MESSAGE FEED:
                   - Sin letrero volador sticky que tape la pantalla en móviles
                   - Cada mensaje AI tiene su encabezado: "MontIA+" + indicador de vista
                   - La nube de diálogo emerge clara y legible con cola hacia el avatar
                */
                <div className="flex flex-col space-y-4">
                  {/* Messages Feed */}
                  {messages.map((msg, index) => {
                    const isLatestAIMsg = msg.role === 'ai' && index === messages.length - 1;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id} 
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end self-end w-full max-w-[86%]' : 'items-start self-start w-full max-w-[92%]'}`}
                      >
                        {/* Header for AI message */}
                        {msg.role === 'ai' && (
                          <div className="flex items-center gap-2 mb-1.5 pl-1 select-none">
                            <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-brand-gold/60 shadow-xs relative bg-brand-surface">
                              <Scene3D isSpeaking={isLatestAIMsg && (isSpeaking || isTyping)} />
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-serif font-semibold text-xs text-brand-espresso">MontIA+</span>
                              {currentNav && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-brand-gold/15 text-brand-gold font-semibold uppercase tracking-wider">
                                  {currentNav === 'reservar' ? 'En Reservar' : currentNav === 'servicios' ? 'En Servicios' : currentNav === 'perfil' ? 'En Perfil' : 'En Inicio'}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Header for User message */}
                        {msg.role === 'user' && (
                          <div className="flex items-center gap-1.5 mb-1 pr-1 text-[10px] text-brand-muted font-medium select-none">
                            <span>Tú</span>
                          </div>
                        )}

                        {/* Speech Bubble */}
                        <div className={`relative w-full p-3.5 md:p-4 rounded-[22px] text-[13.5px] md:text-sm leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-brand-espresso text-white rounded-br-sm shadow-md' 
                            : isLatestAIMsg
                              ? 'bg-brand-surface border border-brand-gold/50 text-brand-espresso rounded-tl-sm shadow-md'
                              : 'bg-brand-surface-container/95 backdrop-blur-sm border border-brand-border/70 text-brand-espresso rounded-tl-sm shadow-sm'
                        }`}>
                          {/* Speech cloud tail pointing towards avatar */}
                          {msg.role === 'ai' && (
                            <div className={`absolute -top-1.5 left-4 w-3 h-3 rotate-45 z-10 ${
                              isLatestAIMsg 
                                ? 'bg-brand-surface border-t border-l border-brand-gold/50' 
                                : 'bg-brand-surface-container border-t border-l border-brand-border/70'
                            }`} />
                          )}
                          {msg.role === 'user' && (
                            <div className="absolute -top-1.5 right-4 w-3 h-3 bg-brand-espresso rotate-45 z-10" />
                          )}
                          
                          {msg.text}
                        </div>
                        
                        {msg.role === 'ai' && msg.options && index === messages.length - 1 && !isTyping && (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap gap-2 mt-2.5 pl-1"
                          >
                            {msg.options.map((opt, i) => (
                              <button
                                key={i}
                                onClick={() => handleSend(opt)}
                                className="text-[11px] font-semibold tracking-wide bg-brand-surface border border-brand-gold/70 text-brand-espresso px-3.5 py-1.5 rounded-full hover:bg-brand-espresso hover:text-white hover:border-brand-espresso transition-all shadow-sm flex items-center gap-1.5 active:scale-95 group cursor-pointer"
                              >
                                <span>{opt}</span>
                                {(opt.includes('Ir a') || opt.includes('Agendar') || opt.includes('Reservar') || opt.includes('Explicación') || opt.includes('paso a paso') || opt.includes('Despliegue')) && (
                                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-brand-gold group-hover:text-white" />
                                )}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                  
                  {/* Typing Indicator with MontIA+ Avatar Header */}
                  {isTyping && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.96, y: 4 }} 
                      animate={{ opacity: 1, scale: 1, y: 0 }} 
                      className="flex flex-col items-start self-start w-full max-w-[90%]"
                    >
                      <div className="flex items-center gap-2 mb-1.5 pl-1 select-none">
                        <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-brand-gold/60 shadow-xs relative bg-brand-surface">
                          <Scene3D isSpeaking={true} />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-serif font-semibold text-xs text-brand-espresso">MontIA+</span>
                          <span className="text-[10px] text-brand-gold font-medium animate-pulse">• Escribiendo respuesta...</span>
                        </div>
                      </div>

                      <div className="relative p-3.5 px-4 rounded-[20px] bg-brand-surface border border-brand-gold/50 rounded-tl-sm shadow-md flex gap-2.5 items-center">
                        <div className="absolute -top-1.5 left-4 w-3 h-3 bg-brand-surface border-t border-l border-brand-gold/50 rotate-45 z-10" />
                        <span className="text-xs text-brand-muted">Pensando respuesta</span>
                        <div className="flex gap-1 items-end h-3">
                          <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-2.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
              
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Quick Questions Tray Accordion (accessible anytime during chat) */}
            {messages.length > 0 && showQuickQuestionsTray && (
              <div className="relative z-10 p-3 bg-brand-surface border-t border-brand-border/60 max-h-48 overflow-y-auto space-y-1.5 animate-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between px-1 pb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">
                    Preguntas sugeridas
                  </span>
                  <button 
                    onClick={() => setShowQuickQuestionsTray(false)}
                    className="text-[10px] text-brand-muted hover:text-brand-espresso font-semibold"
                  >
                    Ocultar
                  </button>
                </div>
                {currentQuestions.map(q => (
                  <button
                    key={q.id}
                    onClick={() => handleSend(q.question)}
                    className="w-full text-left p-2 rounded-xl bg-brand-surface-container/60 hover:bg-brand-surface border border-brand-border/50 text-xs text-brand-espresso flex items-center justify-between transition-colors"
                  >
                    <span className="truncate">{q.question}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-brand-gold shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="relative z-10 p-3.5 md:p-4 bg-brand-surface/95 backdrop-blur-md border-t border-brand-border/60 flex flex-col gap-2.5">
              
              {/* Question Tray Quick Button when in message mode */}
              {messages.length > 0 && !showQuickQuestionsTray && (
                <div className="flex items-center justify-between px-1">
                  <button
                    onClick={() => setShowQuickQuestionsTray(true)}
                    className="text-[11px] font-semibold text-brand-gold hover:text-brand-espresso flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" /> Ver preguntas frecuentes
                  </button>
                  <button
                    onClick={handleResetChat}
                    className="text-[11px] text-brand-muted hover:text-brand-espresso transition-colors"
                  >
                    Volver a inicio
                  </button>
                </div>
              )}

              {selectedImage && (
                <div className="relative inline-block w-20 h-20">
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover rounded-xl border border-brand-gold/50 shadow-sm" />
                  <button 
                    onClick={() => setSelectedImage(null)} 
                    className="absolute -top-2 -right-2 w-6 h-6 bg-brand-espresso text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                  >
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
                  className="w-10 h-10 shrink-0 rounded-full bg-brand-surface-container/60 border border-brand-border text-brand-espresso flex items-center justify-center hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all shadow-inner active:scale-95"
                  aria-label="Subir foto para diagnóstico"
                >
                  <Camera className="w-4 h-4" />
                </button>
                
                <div className="relative flex-1">
                  <input 
                    ref={textInputRef}
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Escribe tu consulta o duda aquí..."
                    className={`w-full bg-brand-surface-container/60 border rounded-full py-2.5 pl-4 pr-20 text-xs md:text-sm outline-none transition-all text-brand-espresso placeholder:text-brand-muted/70 shadow-inner ${
                      isInputHighlighted 
                        ? 'ring-2 ring-brand-gold border-brand-gold bg-brand-gold/10 shadow-[0_0_16px_rgba(223,184,121,0.35)]' 
                        : 'border-brand-border focus:ring-1 focus:ring-brand-gold focus:border-brand-gold'
                    }`}
                  />
                  
                  <div className="absolute right-1.5 top-1 flex items-center gap-1">
                    <button 
                      onClick={toggleRecording}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-transparent text-brand-muted hover:text-brand-espresso'
                      }`}
                      aria-label="Hablar"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleSend()}
                      disabled={!input.trim() && !selectedImage}
                      className="w-7 h-7 rounded-full bg-brand-espresso text-brand-gold flex items-center justify-center disabled:opacity-40 disabled:bg-brand-muted disabled:text-brand-surface transition-all hover:bg-brand-espresso/90 hover:scale-105 active:scale-95 shadow-sm"
                      aria-label="Enviar mensaje"
                    >
                      <Send className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* History View */
          <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-4 bg-brand-surface/40">
            <h4 className="font-serif text-lg font-semibold text-brand-espresso mb-4">Consultas Anteriores</h4>
            <div className="space-y-3">
              {savedChats.map((c) => (
                <div 
                  key={c.id} 
                  onClick={() => setView('chat')}
                  className="p-4 bg-brand-surface-container/60 border border-brand-border/60 rounded-2xl cursor-pointer hover:border-brand-gold transition-colors flex items-center justify-between group active:scale-98"
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gold block">{c.date}</span>
                    <p className="text-xs font-semibold text-brand-espresso mt-1">{c.preview}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-espresso group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}
