import React, { useState } from "react";
import { Plus, Trash2, ChevronRight, X, Droplets, Heart, CheckCircle2, Zap, Moon, TrendingUp, Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

interface Log {
  id: number;
  name: string;
  weight: number;
  date: string;
}

interface WorkoutHistoryItem {
  id: number;
  date: string;
  duration: string;
  exercises: string[];
}

interface Milestone {
  id: number;
  name: string;
  target: number;
  current: number;
  daysLeft: number;
}

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

interface DashboardProps {
  logs: Log[];
  milestones: Milestone[];
  history: WorkoutHistoryItem[];
  waterIntake: number;
  waterTarget: number;
  habitLogs: Record<string, DailyLog>;
  namazTimes: NamazTimes;
  onStartWorkout: () => void;
  onAddMilestone: (name: string, target: number) => void;
}

export default function Dashboard({ 
  logs, 
  milestones, 
  history, 
  waterIntake,
  waterTarget,
  habitLogs,
  namazTimes,
  onStartWorkout, 
  onAddMilestone 
}: DashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = habitLogs[todayStr] || {
    prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
    customHabits: []
  };

  const completedPrayers = Object.values(todayLog.prayers).filter(Boolean).length;
  const totalHabits = todayLog.customHabits.length;
  const completedHabits = todayLog.customHabits.filter(h => h.completed).length;

  const waterPercentage = Math.min(100, (waterIntake / waterTarget) * 100);
  const prayerPercentage = (completedPrayers / 5) * 100;
  const habitPercentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;
  
  const overallProgress = Math.round((waterPercentage + prayerPercentage + (totalHabits > 0 ? habitPercentage : prayerPercentage)) / 3);

  const getNextPrayer = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayers = Object.entries(namazTimes).map(([name, time]) => {
      const [h, m] = time.split(':').map(Number);
      return { name, minutes: h * 60 + m };
    }).sort((a, b) => a.minutes - b.minutes);

    const next = prayers.find(p => p.minutes > currentTime) || prayers[0];
    return next;
  };

  const nextPrayer = getNextPrayer();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && target) {
      onAddMilestone(name, parseInt(target));
      setName("");
      setTarget("");
      setIsModalOpen(false);
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">{today}</p>
          <h1 className="text-4xl font-black italic tracking-tighter">
            Daily <span className="text-[#DFFF00]">Overview</span>
          </h1>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Overall</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black italic">{overallProgress}%</span>
            <div className="w-8 h-8 rounded-full border-2 border-[#DFFF00]/20 flex items-center justify-center relative">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-[#DFFF00]/10"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={88}
                  strokeDashoffset={88 - (88 * overallProgress) / 100}
                  className="text-[#DFFF00]"
                />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Bento Grid Overview */}
      <div className="grid grid-cols-2 gap-4">
        {/* Next Prayer - Highlighted */}
        <div className="col-span-2 bg-zinc-900/80 border border-[#DFFF00]/20 p-6 rounded-[32px] flex items-center justify-between relative overflow-hidden group">
          <div className="relative z-10 space-y-1">
            <p className="text-[10px] font-black text-[#DFFF00] uppercase tracking-widest">Next Prayer</p>
            <h2 className="text-3xl font-black italic uppercase leading-none">{nextPrayer.name}</h2>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-2">At {nextPrayer.minutes ? `${Math.floor(nextPrayer.minutes / 60).toString().padStart(2, '0')}:${(nextPrayer.minutes % 60).toString().padStart(2, '0')}` : '--:--'}</p>
          </div>
          <div className="relative z-10 w-16 h-16 rounded-3xl bg-[#DFFF00]/10 flex items-center justify-center">
            <Moon size={32} className="text-[#DFFF00]" />
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#DFFF00]/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        </div>

        {/* Start Workout - Action Card */}
        <button 
          onClick={onStartWorkout}
          className="bg-[#DFFF00] text-black p-5 rounded-[32px] flex flex-col justify-between h-40 relative overflow-hidden group transition-transform active:scale-95 shadow-[0_0_30px_rgba(223,255,0,0.1)]"
        >
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Fitness</p>
            <h2 className="text-2xl font-black italic uppercase leading-none mt-1">Start<br/>Workout</h2>
          </div>
          <div className="relative z-10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <Zap size={16} className="text-[#DFFF00]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Action</span>
          </div>
          <TrendingUp className="absolute -right-2 -bottom-2 w-24 h-24 text-black/10 -rotate-12 group-hover:scale-110 transition-transform" />
        </button>

        {/* Water Progress */}
        <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-[32px] space-y-4 flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Droplets size={20} />
            </div>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{Math.round(waterPercentage)}%</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Hydration</p>
            <h3 className="text-xl font-black italic">{waterIntake}ml</h3>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${waterPercentage}%` }}
              className="h-full bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.3)]"
            />
          </div>
        </div>

        {/* Habit Progress */}
        <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-[32px] space-y-4 flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Heart size={20} />
            </div>
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">{completedHabits}/{totalHabits || 0}</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Habits</p>
            <h3 className="text-xl font-black italic">Daily Tasks</h3>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${habitPercentage}%` }}
              className="h-full bg-purple-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.3)]"
            />
          </div>
        </div>

        {/* Prayer Progress */}
        <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-[32px] space-y-4 flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-[#DFFF00]/10 flex items-center justify-center text-[#DFFF00]">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-[10px] font-black text-[#DFFF00] uppercase tracking-widest">{completedPrayers}/5</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Spiritual</p>
            <h3 className="text-xl font-black italic">Prayers</h3>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  i <= completedPrayers ? "bg-[#DFFF00]" : "bg-zinc-800"
                )} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-black italic tracking-tight uppercase">Recent Activity</h2>
          <button className="text-[#DFFF00] text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:underline">
            View All <ChevronRight size={12} />
          </button>
        </div>

        <div className="space-y-3">
          {logs.slice(0, 2).map((log) => (
            <div key={log.id} className="bg-zinc-900/30 border border-white/5 rounded-2xl p-4 flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm">{log.name}</h4>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-wider">{log.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-[#DFFF00]">{log.weight} kg</p>
                <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Max Weight</p>
              </div>
            </div>
          ))}
          
          {history.slice(0, 1).map((item) => (
            <div key={item.id} className="bg-zinc-900/30 border border-white/5 rounded-2xl p-4 flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm">Workout Session</h4>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-wider">{item.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-[#DFFF00]">{item.duration}</p>
                <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Duration</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-black italic tracking-tight uppercase">Milestones</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="grid gap-4">
          {milestones.map((m) => (
            <div key={m.id} className="bg-zinc-900/50 border border-white/5 rounded-[32px] p-6 space-y-4 relative overflow-hidden group">
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h3 className="text-xl font-black italic">{m.name}</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Current PB: {m.current} kg</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-[#DFFF00] tracking-tighter">{m.target} kg</p>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{m.daysLeft} days left</p>
                </div>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden relative z-10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (m.current / m.target) * 100)}%` }}
                  className="h-full bg-[#DFFF00] rounded-full"
                />
              </div>
              <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 -rotate-12 group-hover:scale-110 transition-transform" />
            </div>
          ))}
        </div>
      </section>

      {/* Add Milestone Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[40px] p-8 shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white"
              >
                <X size={24} />
              </button>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black italic tracking-tighter">New Milestone</h3>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Set a goal to crush</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-4">Exercise Name</label>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Bench Press"
                      className="w-full bg-zinc-800 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-[#DFFF00]/30 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-4">Target Weight (kg)</label>
                    <input 
                      type="number"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      placeholder="e.g. 100"
                      className="w-full bg-zinc-800 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-[#DFFF00]/30 transition-colors"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#DFFF00] text-black py-5 rounded-2xl font-black text-lg uppercase tracking-tighter hover:scale-[0.98] transition-transform active:scale-95 mt-4"
                  >
                    Add Milestone
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
