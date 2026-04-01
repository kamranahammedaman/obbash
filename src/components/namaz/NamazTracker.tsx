import React, { useState, useEffect } from "react";
import { Moon, Sun, Sunrise, Sunset, Clock, MapPin, Edit2, Check, X, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

interface PrayerTime {
  name: string;
  time: string;
  icon: React.ReactNode;
}

interface NamazTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface NamazTrackerProps {
  namazTimes: NamazTimes;
  onUpdateNamazTimes: (newTimes: NamazTimes) => void;
  onRefresh: () => void;
}

export default function NamazTracker({ namazTimes, onUpdateNamazTimes, onRefresh }: NamazTrackerProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editingPrayer, setEditingPrayer] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const prayerIcons: Record<string, React.ReactNode> = {
    Fajr: <Sunrise size={20} />,
    Dhuhr: <Sun size={20} />,
    Asr: <Sun size={20} className="opacity-70" />,
    Maghrib: <Sunset size={20} />,
    Isha: <Moon size={20} />,
  };

  const checkPassed = (timeStr: string) => {
    const [hoursStr, minutesStr] = timeStr.split(':');
    const hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);
    
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);
    return currentTime > prayerDate;
  };

  const formatDisplayTime = (timeStr: string) => {
    const [hoursStr, minutesStr] = timeStr.split(':');
    let hours = parseInt(hoursStr);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours.toString().padStart(2, '0')}:${minutesStr} ${ampm}`;
  };

  const handleSaveEdit = (name: string) => {
    if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(editValue)) {
      onUpdateNamazTimes({ ...namazTimes, [name]: editValue });
      setEditingPrayer(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black italic tracking-tighter text-[#DFFF00]">NAMAZ TIMES</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRefresh}
              className={cn(
                "p-1.5 rounded-md bg-zinc-900 border border-white/5 text-zinc-500 hover:text-[#DFFF00] transition-all",
                isRefreshing && "animate-spin text-[#DFFF00]"
              )}
            >
              <RefreshCw size={12} />
            </button>
            <div className="bg-[#DFFF00]/10 px-2 py-1 rounded-md flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-[#DFFF00] rounded-full animate-pulse" />
              <span className="text-[8px] font-black text-[#DFFF00] uppercase tracking-widest">Real-time Sync</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
          <MapPin size={12} />
          <span>Dhaka, Bangladesh</span>
        </div>
      </header>

      <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center space-y-2">
        <Clock className="text-[#DFFF00] mb-2" size={32} />
        <span className="text-4xl font-black tracking-tighter tabular-nums">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Current Time</span>
      </div>

      <div className="space-y-3">
        {Object.entries(namazTimes).map(([name, time], i) => {
          const isPassed = checkPassed(time);
          const isEditing = editingPrayer === name;

          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border p-4 transition-all",
                isPassed 
                  ? "bg-zinc-900/30 border-white/5 opacity-50" 
                  : "bg-zinc-900/80 border-white/10 hover:border-[#DFFF00]/50"
              )}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    isPassed ? "bg-zinc-800 text-zinc-500" : "bg-[#DFFF00]/10 text-[#DFFF00]"
                  )}>
                    {prayerIcons[name]}
                  </div>
                  <div>
                    <h3 className="font-black italic tracking-tight text-lg">{name}</h3>
                    {isEditing ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input 
                          type="time"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="bg-zinc-800 border border-white/10 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-[#DFFF00]"
                        />
                        <button onClick={() => handleSaveEdit(name)} className="text-[#DFFF00] hover:scale-110 transition-transform">
                          <Check size={14} />
                        </button>
                        <button onClick={() => setEditingPrayer(null)} className="text-zinc-500 hover:scale-110 transition-transform">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                          {formatDisplayTime(time)}
                        </p>
                        <button 
                          onClick={() => {
                            setEditingPrayer(name);
                            setEditValue(time);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-[#DFFF00]"
                        >
                          <Edit2 size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {isPassed ? (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Passed</span>
                ) : (
                  <div className="w-2 h-2 bg-[#DFFF00] rounded-full animate-pulse shadow-[0_0_10px_rgba(223,255,0,0.5)]" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="p-4 bg-zinc-900/30 border border-dashed border-white/10 rounded-2xl text-center">
        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest leading-relaxed">
          "Prayer is better than sleep"<br/>
          <span className="text-[#DFFF00]/50">- Fajr Adhan</span>
        </p>
      </div>
    </div>
  );
}
