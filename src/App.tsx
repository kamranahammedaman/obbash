/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { LayoutDashboard, Dumbbell, Library, Sparkles, TrendingUp, Droplets, Bell, Heart, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { Toaster, toast } from 'sonner';

// Components
import Dashboard from "./components/dashboard/Dashboard";
import WorkoutLogger from "./components/workout/WorkoutLogger";
import ExerciseLibrary from "./components/library/ExerciseLibrary";
import AuraAssistant from "./components/ai/AuraAssistant";
import WaterPage from "./components/water/WaterPage";
import HabitTracker from "./components/habits/HabitTracker";
import { NotificationSettings } from "./components/notifications/NotificationSettings";

type Tab = "dashboard" | "workout" | "library" | "aura" | "water" | "alerts" | "habits";

const ALARM_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

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

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Global Error Captured:", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  // Habit Logs State
  const [habitLogs, setHabitLogs] = useState<Record<string, DailyLog>>({
    [new Date().toISOString().split('T')[0]]: {
      date: new Date().toISOString().split('T')[0],
      prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
      quranPages: 0,
      customHabits: [
        { id: "1", name: "Read Book", completed: false, type: "habit" },
        { id: "2", name: "Morning Walk", completed: false, type: "habit" }
      ]
    }
  });
  const [notificationSettings, setNotificationSettings] = useState({
    gymTime: "08:00",
    gymEnabled: false,
    waterInterval: 60,
    waterEnabled: false,
    namazEnabled: false,
    soundEnabled: true,
    namazTimes: {
      Fajr: "04:45",
      Dhuhr: "12:15",
      Asr: "15:45",
      Maghrib: "18:15",
      Isha: "19:45"
    } as NamazTimes
  });

  // Fetch real-time Namaz times
  const fetchNamazTimes = async () => {
    try {
      const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=2');
      const data = await response.json();
      if (data.code === 200) {
        const timings = data.data.timings;
        setNotificationSettings(prev => ({
          ...prev,
          namazTimes: {
            Fajr: timings.Fajr,
            Dhuhr: timings.Dhuhr,
            Asr: timings.Asr,
            Maghrib: timings.Maghrib,
            Isha: timings.Isha
          }
        }));
        console.log("Real-time Namaz times fetched:", timings);
        toast.success("Namaz times updated!");
      }
    } catch (error) {
      console.error("Failed to fetch Namaz times:", error);
      toast.error("Failed to fetch Namaz times.");
    }
  };

  useEffect(() => {
    fetchNamazTimes();
  }, []);

  const [lastWaterReminder, setLastWaterReminder] = useState<number>(Date.now());

  // Alarm Audio Ref
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const playAlarm = () => {
    if (notificationSettings.soundEnabled && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }
  };

  // Reminder Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      // Check Gym Reminder
      if (notificationSettings.gymEnabled && currentTimeStr === notificationSettings.gymTime) {
        // Only trigger once per minute
        if (now.getSeconds() < 2) {
          playAlarm();
          toast.info("GYM TIME!", {
            description: "Time to hit your daily workout goal!",
            duration: 10000,
            icon: <Dumbbell className="w-5 h-5 text-[#DFFF00]" />,
          });
          
          if (Notification.permission === 'granted') {
            new Notification("OBBASH: GYM TIME!", {
              body: "Time to hit your daily workout goal!",
              icon: "/favicon.ico"
            });
          }
        }
      }

      // Check Namaz Reminder
      if (notificationSettings.namazEnabled) {
        const times = Object.values(notificationSettings.namazTimes);
        if (times.includes(currentTimeStr) && now.getSeconds() < 2) {
          playAlarm();
          const prayerName = Object.keys(notificationSettings.namazTimes).find(key => (notificationSettings.namazTimes as any)[key] === currentTimeStr);
          toast.info(`${prayerName?.toUpperCase()} PRAYER TIME`, {
            description: `It's time for ${prayerName}. Take a break for spiritual wellness.`,
            duration: 10000,
            icon: <Moon className="w-5 h-5 text-[#DFFF00]" />,
          });

          if (Notification.permission === 'granted') {
            new Notification(`OBBASH: ${prayerName?.toUpperCase()} TIME`, {
              body: `It's time for ${prayerName} Namaz.`,
              icon: "/favicon.ico"
            });
          }
        }
      }

      // Check Water Reminder
      if (notificationSettings.waterEnabled) {
        const minutesSinceLast = (Date.now() - lastWaterReminder) / (1000 * 60);
        if (minutesSinceLast >= notificationSettings.waterInterval) {
          playAlarm();
          setLastWaterReminder(Date.now());
          toast.info("HYDRATION ALERT", {
            description: "Time to drink some water!",
            duration: 10000,
            icon: <Droplets className="w-5 h-5 text-blue-400" />,
          });

          if (Notification.permission === 'granted') {
            new Notification("OBBASH: HYDRATION ALERT", {
              body: "Time to drink some water!",
              icon: "/favicon.ico"
            });
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [notificationSettings, lastWaterReminder]);

  // Mock data for initial state
  const [logs, setLogs] = useState([
    { id: 1, name: "Leg Curl", weight: 30, date: "Mar 23, 2026" },
    { id: 2, name: "Leg Extensions", weight: 36, date: "Mar 23, 2026" },
    { id: 3, name: "Half Squat", weight: 30, date: "Mar 23, 2026" },
  ]);

  const [milestones, setMilestones] = useState([
    { id: 1, name: "Smith Squat", target: 40, current: 0, daysLeft: 6 },
  ]);

  const handleAddMilestone = (name: string, target: number) => {
    const newMilestone = {
      id: Date.now(),
      name,
      target,
      current: 0,
      daysLeft: 30, // Default to 30 days for new milestones
    };
    setMilestones(prev => [newMilestone, ...prev]);
  };

  const [history, setHistory] = useState([
    { id: 1, date: "Mar 22, 2026", duration: "45m", exercises: ["Bench Press", "Bicep Curl", "Chin-up"] },
    { id: 2, date: "Mar 20, 2026", duration: "1h 10m", exercises: ["Squat", "Leg Press", "Calf Raise"] },
  ]);

  const [waterIntake, setWaterIntake] = useState(1500); // in ml
  const [waterTarget, setWaterTarget] = useState(3000); // in ml

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#DFFF00] selection:text-black">
      {/* Top Header for Alerts/Settings */}
      <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-50 bg-black/50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#DFFF00] rounded-lg flex items-center justify-center text-black">
            <Sparkles size={18} />
          </div>
          <span className="font-black italic tracking-tighter text-xl">OBBASH</span>
        </div>
        <button 
          onClick={() => setActiveTab("alerts")}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all",
            activeTab === "alerts" ? "bg-[#DFFF00] text-black" : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
          )}
        >
          <Bell size={20} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="pb-24 pt-20 px-4 max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Dashboard 
                logs={logs} 
                milestones={milestones} 
                history={history}
                waterIntake={waterIntake}
                waterTarget={waterTarget}
                habitLogs={habitLogs}
                namazTimes={notificationSettings.namazTimes}
                onStartWorkout={() => setActiveTab("workout")} 
                onAddMilestone={handleAddMilestone}
              />
            </motion.div>
          )}

          {activeTab === "workout" && (
            <motion.div
              key="workout"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <WorkoutLogger 
                isActive={isWorkoutActive} 
                onToggle={() => setIsWorkoutActive(!isWorkoutActive)} 
              />
            </motion.div>
          )}

          {activeTab === "library" && (
            <motion.div
              key="library"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ExerciseLibrary />
            </motion.div>
          )}

          {activeTab === "aura" && (
            <motion.div
              key="aura"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AuraAssistant />
            </motion.div>
          )}

          {activeTab === "water" && (
            <motion.div
              key="water"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <WaterPage 
                currentIntake={waterIntake}
                targetIntake={waterTarget}
                onUpdateIntake={setWaterIntake}
                onUpdateTarget={setWaterTarget}
              />
            </motion.div>
          )}

          {activeTab === "habits" && (
            <motion.div
              key="habits"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <HabitTracker 
                logs={habitLogs}
                onUpdateLogs={setHabitLogs}
                namazTimes={notificationSettings.namazTimes}
                onUpdateNamazTimes={(newTimes) => setNotificationSettings(prev => ({ ...prev, namazTimes: newTimes as NamazTimes }))}
                onRefreshNamaz={fetchNamazTimes}
              />
            </motion.div>
          )}

          {activeTab === "alerts" && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <NotificationSettings 
                settings={notificationSettings}
                onUpdateSettings={setNotificationSettings}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <audio ref={audioRef} src={ALARM_SOUND_URL} preload="auto" />
      <Toaster position="top-center" theme="dark" richColors />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 px-6 py-4 z-50">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <NavButton 
            active={activeTab === "dashboard"} 
            onClick={() => setActiveTab("dashboard")}
            icon={<LayoutDashboard size={24} />}
            label="Dashboard"
          />
          <NavButton 
            active={activeTab === "workout"} 
            onClick={() => setActiveTab("workout")}
            icon={<Dumbbell size={24} />}
            label="Workout"
          />
          <NavButton 
            active={activeTab === "water"} 
            onClick={() => setActiveTab("water")}
            icon={<Droplets size={24} />}
            label="Water"
          />
          <NavButton 
            active={activeTab === "habits"} 
            onClick={() => setActiveTab("habits")}
            icon={<Heart size={24} />}
            label="Habits"
          />
          <NavButton 
            active={activeTab === "aura"} 
            onClick={() => setActiveTab("aura")}
            icon={<Sparkles size={24} className={activeTab === "aura" ? "text-[#DFFF00]" : ""} />}
            label="Obbash AI"
            isSpecial
          />
          <NavButton 
            active={activeTab === "library"} 
            onClick={() => setActiveTab("library")}
            icon={<Library size={24} />}
            label="Library"
          />
        </div>
      </nav>
    </div>
  );
}

function NavButton({ 
  active, 
  onClick, 
  icon, 
  label,
  isSpecial = false
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string;
  isSpecial?: boolean;
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all duration-200",
        active ? "text-[#DFFF00]" : "text-zinc-500 hover:text-zinc-300",
        isSpecial && active && "scale-110"
      )}
    >
      <div className={cn(
        "p-1 rounded-lg transition-colors",
        isSpecial && !active && "bg-zinc-800/50",
        isSpecial && active && "bg-[#DFFF00]/10"
      )}>
        {icon}
      </div>
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </button>
  );
}
