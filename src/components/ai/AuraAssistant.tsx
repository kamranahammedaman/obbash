import React, { useState, useRef, useEffect } from "react";
import { 
  Mic, 
  Send, 
  Image as ImageIcon, 
  Search, 
  MapPin, 
  Brain, 
  Volume2, 
  X,
  Loader2,
  Sparkles,
  History
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ThinkingLevel, Modality } from "@google/genai";
import { MODELS, getAI } from "@/src/lib/gemini";
import { cn } from "@/src/lib/utils";
import Markdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  type?: "text" | "image" | "search" | "map";
  imageUrl?: string;
}

export default function AuraAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "I'm Obbash, your all-in-one lifestyle companion. I'm not just an intelligent AI—I can help you track your fitness, water intake, daily habits, and Namaz times. How can I assist you now? আপনি চাইলে আমার সাথে বাংলাতেও কথা বলতে পারেন!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"chat" | "voice" | "image" | "thinking">("chat");
  const [hasApiKey, setHasApiKey] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Check for API key selection (required for image/video/pro models)
  useEffect(() => {
    const checkKey = async () => {
      const win = window as any;
      if (win.aistudio?.hasSelectedApiKey) {
        const selected = await win.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } else {
        // Fallback for local dev or if platform API is missing
        setHasApiKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    const win = window as any;
    if (win.aistudio?.openSelectKey) {
      await win.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleTTS = async (text: string) => {
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: MODELS.tts,
        contents: [{ parts: [{ text: `Say clearly and motivatingly: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioBlob = new Blob([Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))], { type: 'audio/pcm;rate=24000' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (error) {
      console.error("TTS Error:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const ai = getAI();
      if (mode === "image") {
        if (!hasApiKey) {
          setMessages(prev => [...prev, { role: "assistant", content: "Please select a paid API key to generate images." }]);
          setIsLoading(false);
          return;
        }

        const response = await ai.models.generateContent({
          model: MODELS.image,
          contents: { parts: [{ text: `Generate a high-quality, high-contrast motivational fitness poster: ${input}` }] },
          config: { imageConfig: { aspectRatio: "9:16", imageSize: "1K" } }
        });

        let imageUrl = "";
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          }
        }

        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "Here's some visual motivation for you!", 
          type: "image",
          imageUrl 
        }]);
      } else if (mode === "thinking") {
        const response = await ai.models.generateContent({
          model: MODELS.pro,
          contents: input,
          config: { 
            thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
            systemInstruction: "You are Obbash, a super-intelligent AI assistant. You have deep knowledge about everything in the world. Provide clear, detailed, and analytical explanations with examples for any topic. You are fluent in English and Bangla (বাংলা). Always respond in the language the user uses. If they use 'Banglish' or Bangla, provide clear advice in Bangla."
          }
        });
        setMessages(prev => [...prev, { role: "assistant", content: response.text || "I'm thinking..." }]);
      } else {
        // Default Chat with Search grounding (Maps cannot be combined with Search)
        const response = await ai.models.generateContent({
          model: MODELS.flash,
          contents: input,
          config: {
            tools: [{ googleSearch: {} }],
            systemInstruction: "You are Obbash, a versatile and intelligent AI assistant. You can answer any question about any topic in the world. Be clear, helpful, and provide detailed explanations with examples. Use search when needed for real-time info or facts. You are fully multilingual and specialize in English and Bangla (বাংলা). Always respond in the language the user uses. If they use 'Banglish' or Bangla, provide clear advice in Bangla."
          }
        });
        setMessages(prev => [...prev, { role: "assistant", content: response.text || "Got it." }]);
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message || "An unexpected error occurred.";
      setMessages(prev => [...prev, { role: "assistant", content: `Sorry, I encountered an error: ${errorMessage} Please try again.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] space-y-4">
      <header className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-3xl border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#DFFF00] rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(223,255,0,0.3)]">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-black italic tracking-tighter text-lg">OBBASH AI</h2>
            <p className="text-[10px] text-[#DFFF00] font-bold uppercase tracking-widest animate-pulse">Online</p>
          </div>
        </div>
        <div className="flex gap-2">
          <ModeButton active={mode === "chat"} onClick={() => setMode("chat")} icon={<Send size={16} />} />
          <ModeButton active={mode === "image"} onClick={() => setMode("image")} icon={<ImageIcon size={16} />} />
          <ModeButton active={mode === "thinking"} onClick={() => setMode("thinking")} icon={<Brain size={16} />} />
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar"
      >
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "max-w-[85%] p-4 rounded-3xl",
              msg.role === "user" 
                ? "ml-auto bg-[#DFFF00] text-black font-bold" 
                : "bg-zinc-900/80 border border-white/5 text-zinc-200"
            )}
          >
            {msg.type === "image" && msg.imageUrl ? (
              <div className="space-y-3">
                <img src={msg.imageUrl} alt="AI Generated" className="rounded-2xl w-full aspect-[9/16] object-cover" referrerPolicy="no-referrer" />
                <p className="text-sm">{msg.content}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="prose prose-invert prose-sm max-w-none">
                  <Markdown>{msg.content}</Markdown>
                </div>
                {msg.role === "assistant" && (
                  <button 
                    onClick={() => handleTTS(msg.content)}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#DFFF00] hover:text-white transition-colors"
                  >
                    <Volume2 size={12} /> Read Aloud
                  </button>
                )}
              </div>
            )}
          </motion.div>
        ))}
        {isLoading && (
          <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-3xl w-fit animate-pulse flex items-center gap-2">
            <Loader2 size={16} className="animate-spin text-[#DFFF00]" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Obbash is thinking...</span>
          </div>
        )}
      </div>

      {!hasApiKey && mode === "image" && (
        <button 
          onClick={handleSelectKey}
          className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <X size={16} /> API Key Required for Images
        </button>
      )}

      <div className="relative">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            mode === "image" ? "Describe a motivational poster..." :
            mode === "thinking" ? "Ask for deep physiological analysis..." :
            "Ask Obbash anything (বাংলায় জিজ্ঞাসা করুন)..."
          }
          className="w-full bg-zinc-900 border border-white/10 rounded-full py-5 pl-6 pr-24 focus:outline-none focus:border-[#DFFF00] transition-colors text-sm"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          <button 
            onClick={() => setMode("voice")}
            className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-[#DFFF00] transition-colors"
          >
            <Mic size={18} />
          </button>
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 bg-[#DFFF00] rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform disabled:opacity-50 disabled:scale-100"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mode === "voice" && (
          <VoiceOverlay onClose={() => setMode("chat")} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ModeButton({ active, onClick, icon }: { active: boolean; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
        active ? "bg-[#DFFF00] text-black" : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"
      )}
    >
      {icon}
    </button>
  );
}

function VoiceOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-8 space-y-12"
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 hover:text-white"
      >
        <X size={24} />
      </button>

      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black italic tracking-tighter text-[#DFFF00]">OBBASH LIVE</h2>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Listening for your command...</p>
      </div>

      <div className="relative w-48 h-48 flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-[#DFFF00]/10 rounded-full blur-3xl"
        />
        <div className="w-32 h-32 bg-[#DFFF00] rounded-full flex items-center justify-center text-black shadow-[0_0_50px_rgba(223,255,0,0.4)]">
          <Mic size={48} />
        </div>
        
        {/* Visualizer bars */}
        <div className="absolute -bottom-12 flex gap-1 items-end h-8">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [4, Math.random() * 24 + 8, 4] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
              className="w-1 bg-[#DFFF00] rounded-full"
            />
          ))}
        </div>
      </div>

      <p className="text-zinc-400 text-center max-w-xs italic">
        "Obbash, how's my form on the last set of squats?"
      </p>
    </motion.div>
  );
}
