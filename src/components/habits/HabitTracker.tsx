import React, { useState } from "react";
import { 
  Moon, 
  Sun, 
  BookOpen, 
  CheckCircle2, 
  Plus, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trash2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { toast } from "sonner";
import NamazTracker from "../namaz/NamazTracker";

interface HabitEntry {
  id: string;
  name: string;
  completed: boolean;
  type: "prayer" | "spiritual" | "habit";
  time?: string;
}

interface DailyLog {
  date: string;
  prayers: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  quranPages: number;
  customHabits: HabitEntry[];
}

interface NamazTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface HabitTrackerProps {
  logs: Record<string, DailyLog>;
  onUpdateLogs: (logs: Record<string, DailyLog>) => void;
  namazTimes: NamazTimes;
  onUpdateNamazTimes: (newTimes: NamazTimes) => void;
  onRefreshNamaz: () => void;
}

export default function HabitTracker({ logs, onUpdateLogs, namazTimes, onUpdateNamazTimes, onRefreshNamaz }: HabitTrackerProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const currentLog = logs[selectedDate] || {
    date: selectedDate,
    prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
    quranPages: 0,
    customHabits: []
  };

  const updateLog = (updatedLog: DailyLog) => {
    onUpdateLogs({ ...logs, [selectedDate]: updatedLog });
  };

  const togglePrayer = (prayer: keyof DailyLog['prayers']) => {
    const updatedLog = { ...currentLog };
    updatedLog.prayers = { ...updatedLog.prayers, [prayer]: !updatedLog.prayers[prayer] };
    updateLog(updatedLog);
    if (updatedLog.prayers[prayer]) {
      toast.success(`${prayer.charAt(0).toUpperCase() + prayer.slice(1)} prayer logged!`, {
        icon: <CheckCircle2 className="w-4 h-4 text-[#DFFF00]" />
      });
    }
  };

  const toggleHabit = (id: string) => {
    const updatedLog = { ...currentLog };
    updatedLog.customHabits = updatedLog.customHabits.map(h => 
      h.id === id ? { ...h, completed: !h.completed } : h
    );
    updateLog(updatedLog);
  };

  const addHabit = (name: string) => {
    if (!name.trim()) return;
    const updatedLog = { ...currentLog };
    updatedLog.customHabits = [
      ...updatedLog.customHabits,
      { id: Math.random().toString(36).substr(2, 9), name, completed: false, type: "habit" }
    ];
    updateLog(updatedLog);
    toast.success("Habit added!");
  };

  const removeHabit = (id: string) => {
    const updatedLog = { ...currentLog };
    updatedLog.customHabits = updatedLog.customHabits.filter(h => h.id !== id);
    updateLog(updatedLog);
  };

  const changeDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      addHabit(newHabitName.trim());
      setNewHabitName("");
      setIsAddingHabit(false);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Header & Date Picker */}
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">Spiritual Path</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Daily Habit & Soul Tracker</p>
          </div>
          <div className="bg-zinc-900/50 p-2 rounded-2xl border border-white/5 flex items-center gap-3">
            <button onClick={() => changeDate(-1)} className="p-1 hover:text-[#DFFF00] transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="flex flex-col items-center min-w-[100px]">
              <span className="text-[10px] font-bold text-[#DFFF00] uppercase tracking-widest">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}
              </span>
              <span className="text-sm font-black tracking-tighter">
                {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <button onClick={() => changeDate(1)} className="p-1 hover:text-[#DFFF00] transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Namaz & Spiritual */}
      <section className="space-y-6">
        <NamazTracker 
          namazTimes={namazTimes} 
          onUpdateNamazTimes={onUpdateNamazTimes} 
          onRefresh={onRefreshNamaz}
        />
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-[#DFFF00] w-5 h-5" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Log Prayers</h2>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((prayer) => (
              <button
                key={prayer}
                onClick={() => togglePrayer(prayer)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300",
                  currentLog.prayers[prayer]
                    ? "bg-[#DFFF00] border-[#DFFF00] text-black shadow-[0_0_20px_rgba(223,255,0,0.2)]"
                    : "bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-white/10"
                )}
              >
                <span className="text-[10px] font-black uppercase tracking-tighter">{prayer}</span>
                <CheckCircle2 size={16} className={cn(currentLog.prayers[prayer] ? "opacity-100" : "opacity-20")} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Quran & Spiritual */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/50 p-5 rounded-3xl border border-white/5 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="text-[#DFFF00] w-4 h-4" />
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Quran Pages</h2>
          </div>
          <div className="flex items-center justify-between">
            <button 
              onClick={() => updateLog({ ...currentLog, quranPages: Math.max(0, currentLog.quranPages - 1) })}
              className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
            >
              -
            </button>
            <span className="text-3xl font-black italic">{currentLog.quranPages}</span>
            <button 
              onClick={() => updateLog({ ...currentLog, quranPages: currentLog.quranPages + 1 })}
              className="w-8 h-8 rounded-full bg-[#DFFF00] flex items-center justify-center text-black"
            >
              +
            </button>
          </div>
        </div>

        <div className="bg-zinc-900/50 p-5 rounded-3xl border border-white/5 flex flex-col justify-center items-center text-center">
          <div className="w-10 h-10 rounded-full bg-[#DFFF00]/10 flex items-center justify-center text-[#DFFF00] mb-2">
            <Sun size={20} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Daily Goal</p>
          <p className="text-lg font-black italic">Consistent</p>
        </div>
      </section>

      {/* Custom Habits */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-[#DFFF00] w-5 h-5" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Daily Habits</h2>
          </div>
          <button 
            onClick={() => setIsAddingHabit(true)}
            className="text-[10px] font-bold uppercase tracking-widest text-[#DFFF00] flex items-center gap-1 hover:text-white transition-colors"
          >
            <Plus size={12} /> Add Habit
          </button>
        </div>

        <AnimatePresence>
          {isAddingHabit && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-zinc-900 border border-[#DFFF00]/30 p-4 rounded-2xl flex gap-2"
            >
              <input 
                autoFocus
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddHabit();
                  if (e.key === "Escape") setIsAddingHabit(false);
                }}
                placeholder="Enter habit name..."
                className="flex-1 bg-transparent border-none focus:outline-none text-sm"
              />
              <div className="flex gap-1">
                <button 
                  onClick={() => setIsAddingHabit(false)}
                  className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white"
                >
                  <X size={14} />
                </button>
                <button 
                  onClick={handleAddHabit}
                  className="w-8 h-8 rounded-lg bg-[#DFFF00] flex items-center justify-center text-black"
                >
                  <Plus size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {currentLog.customHabits.length === 0 && (
            <div className="text-center py-8 bg-zinc-900/20 rounded-3xl border border-dashed border-white/5">
              <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">No habits added yet</p>
            </div>
          )}
          {currentLog.customHabits.map((habit) => (
            <div 
              key={habit.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all",
                habit.completed 
                  ? "bg-[#DFFF00]/5 border-[#DFFF00]/20" 
                  : "bg-zinc-900/50 border-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleHabit(habit.id)}
                  className={cn(
                    "w-6 h-6 rounded-lg border flex items-center justify-center transition-all",
                    habit.completed 
                      ? "bg-[#DFFF00] border-[#DFFF00] text-black" 
                      : "border-white/20 text-transparent"
                  )}
                >
                  <CheckCircle2 size={14} />
                </button>
                <span className={cn(
                  "text-sm font-medium transition-all",
                  habit.completed ? "text-zinc-500 line-through" : "text-white"
                )}>
                  {habit.name}
                </span>
              </div>
              <button 
                onClick={() => removeHabit(habit.id)}
                className="text-zinc-600 hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Manual Entry Info */}
      <div className="bg-zinc-900/30 p-4 rounded-2xl border border-white/5 flex items-start gap-3">
        <Clock className="text-zinc-500 w-4 h-4 mt-0.5" />
        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
          You can navigate through dates using the calendar controls at the top to log habits for previous days. All progress is tracked locally.
        </p>
      </div>
    </div>
  );
}
