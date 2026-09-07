const fs = require('fs');
let code = fs.readFileSync('src/components/Chatbot.tsx', 'utf8');

// 1. Add Camera import from lucide-react
code = code.replace(/import {([^}]+)} from 'lucide-react';/, (match, group1) => {
  if (!group1.includes('Camera')) {
    return `import {${group1}, Camera, Image as ImageIcon} from 'lucide-react';`;
  }
  return match;
});

// 2. Add selectedImage state and file input ref
const stateCode = `
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
`;
code = code.replace(/const \[isTyping, setIsTyping\] = useState\(false\);/, "const [isTyping, setIsTyping] = useState(false);\n" + stateCode);

// 3. Add handleImageUpload function
const handleImageUploadCode = `
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

  const processImageRequest = async (text: string, imageBase64: string) => {
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
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        text: (
          <div className="space-y-2">
            <p className="font-semibold text-brand-gold text-xs uppercase tracking-widest flex items-center gap-1"><Sparkles className="w-3 h-3"/> Análisis Visual</p>
            <p>{data.text}</p>
          </div>
        )
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        text: "Lo siento, no pude analizar la imagen en este momento. Por favor verifica que tu API Key esté configurada."
      }]);
    } finally {
      setIsTyping(false);
    }
  };
`;
code = code.replace(/const processInput = \(text: string\) => \{/, handleImageUploadCode + "\n  const processInput = (text: string) => {");

// 4. Update handleSend to use processImageRequest
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
    
    if (currentImg) {
      processImageRequest(textToSend, currentImg);
    } else {
      processInput(textToSend);
    }
  };
`;
code = code.replace(/const handleSend = \([\s\S]*?    processInput\(textToSend\);\n  \};\n/, newHandleSend);

// 5. Add image preview and upload button to the input area
const newInputArea = `
                {/* Input Area */}
                <div className="p-4 bg-brand-surface border-t border-brand-border/50 flex flex-col gap-3">
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
                        onClick={() => handleSend()}
                        disabled={!input.trim() && !selectedImage}
                        className="absolute right-2 top-1 w-10 h-10 rounded-full bg-brand-espresso text-brand-gold flex items-center justify-center disabled:opacity-50 disabled:bg-brand-muted disabled:text-brand-surface transition-all hover:bg-brand-espresso/90 hover:scale-105 active:scale-95 shadow-md"
                      >
                        <Send className="w-4 h-4 ml-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
`;
code = code.replace(/\{\/\* Input Area \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/>/, newInputArea + "\n              </>");

// Need to update the Message type to support ReactNode text (since I am passing JSX now)
code = code.replace(/type Message = \{[\s\S]*?text: string;/g, "type Message = {\n  id: string;\n  role: 'user' | 'ai';\n  text: React.ReactNode;");


fs.writeFileSync('src/components/Chatbot.tsx', code);
