import React, { useState } from "react";
import { Search, Edit3, Trash2, Dumbbell, Droplets, Heart, BookOpen, Info, Moon, Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";

const EXERCISES = [
  { id: 1, name: "Push-ups", muscle: "Chest", equipment: "Bodyweight", day: "Day 1", initial: "P" },
  { id: 2, name: "Squats", muscle: "Legs", equipment: "Bodyweight", day: "Day 1", initial: "S" },
  { id: 3, name: "Plank", muscle: "Core", equipment: "Bodyweight", day: "Day 1", initial: "P" },
  { id: 4, name: "Lunges", muscle: "Legs", equipment: "Bodyweight", day: "Day 2", initial: "L" },
  { id: 5, name: "Burpees", muscle: "Full Body", equipment: "Bodyweight", day: "Day 2", initial: "B" },
  { id: 6, name: "Mountain Climbers", muscle: "Core", equipment: "Bodyweight", day: "Day 2", initial: "M" },
  { id: 7, name: "Dumbbell Rows", muscle: "Back", equipment: "Dumbbell", day: "Day 1", initial: "D" },
  { id: 8, name: "Overhead Press", muscle: "Shoulder", equipment: "Dumbbell", day: "Day 1", initial: "O" },
  { id: 9, name: "Glute Bridges", muscle: "Glutes", equipment: "Bodyweight", day: "Day 2", initial: "G" },
  { id: 10, name: "Crunches", muscle: "Abs", equipment: "Bodyweight", day: "Day 1", initial: "C" },
  { id: 11, name: "Jumping Jacks", muscle: "Cardio", equipment: "Bodyweight", day: "Day 2", initial: "J" },
  { id: 12, name: "Diamond Push-ups", muscle: "Triceps", equipment: "Bodyweight", day: "Day 2", initial: "D" },
  { id: 13, name: "Wall Sit", muscle: "Legs", equipment: "Bodyweight", day: "Day 1", initial: "W" },
  { id: 14, name: "Dips", muscle: "Triceps", equipment: "Chair/Bench", day: "Day 2", initial: "D" },
  { id: 15, name: "Superman", muscle: "Lower Back", equipment: "Bodyweight", day: "Day 1", initial: "S" },
];

const HYDRATION_TIPS = [
  { id: 1, title: "Morning Hydration", content: "Drink 500ml of water immediately after waking up to kickstart your metabolism.", icon: <Droplets className="text-blue-400" /> },
  { id: 2, title: "Pre-Workout", content: "Drink 250-500ml water 30 mins before exercise to maintain performance.", icon: <Dumbbell className="text-[#DFFF00]" /> },
  { id: 3, title: "Electrolytes", content: "During intense workouts, add a pinch of salt or electrolytes to your water.", icon: <Info className="text-zinc-400" /> },
  { id: 4, title: "Skin Health", content: "Proper hydration keeps your skin glowing and improves elasticity.", icon: <Sparkles size={16} className="text-yellow-400" /> },
];

const HABIT_GUIDES = [
  { id: 1, title: "Spiritual Peace", content: "Regular prayer (Salah) provides mental clarity and reduces daily stress.", icon: <Heart className="text-red-400" /> },
  { id: 2, title: "Quran Reading", content: "Even 1 page a day builds a consistent spiritual habit and inner peace.", icon: <BookOpen className="text-green-400" /> },
  { id: 3, title: "Habit Stacking", content: "Attach a new habit (like reading) to an existing one (like after Fajr prayer).", icon: <Info className="text-zinc-400" /> },
];

const NAMAZ_GUIDES = [
  { id: 1, title: "Fajr Prayer", content: "The dawn prayer brings light to your day and discipline to your soul.", icon: <Moon className="text-purple-400" /> },
  { id: 2, title: "Dhuhr & Asr", content: "Afternoon prayers are perfect for a mindful reset during a busy workday.", icon: <Sparkles size={16} className="text-[#DFFF00]" /> },
  { id: 3, title: "Maghrib & Isha", content: "Evening prayers help you unwind and reflect on your day's journey.", icon: <Heart className="text-red-400" /> },
];

export default function ExerciseLibrary() {
  const [activeCategory, setActiveCategory] = useState<"exercises" | "hydration" | "habits" | "namaz">("exercises");
  const [activeFilter, setActiveFilter] = useState("Library");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExercises = EXERCISES.filter(ex => 
    ex.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-4xl font-black italic tracking-tighter text-[#DFFF00]">LIBRARY</h1>
        <button className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-[#DFFF00] hover:scale-110 transition-transform">
          <Plus size={24} />
        </button>
      </header>

      {/* Main Categories */}
      <div className="grid grid-cols-4 gap-2">
        <CategoryTab 
          active={activeCategory === "exercises"} 
          onClick={() => setActiveCategory("exercises")}
          icon={<Dumbbell size={18} />}
          label="Fitness"
        />
        <CategoryTab 
          active={activeCategory === "hydration"} 
          onClick={() => setActiveCategory("hydration")}
          icon={<Droplets size={18} />}
          label="Water"
        />
        <CategoryTab 
          active={activeCategory === "habits"} 
          onClick={() => setActiveCategory("habits")}
          icon={<Heart size={18} />}
          label="Habits"
        />
        <CategoryTab 
          active={activeCategory === "namaz"} 
          onClick={() => setActiveCategory("namaz")}
          icon={<Moon size={18} />}
          label="Namaz"
        />
      </div>

      {activeCategory === "exercises" && (
        <div className="space-y-6">
          <div className="flex bg-zinc-900/50 p-1 rounded-2xl">
            {["Day 1", "Day 2", "Library"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={cn(
                  "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                  activeFilter === tab 
                    ? "bg-[#DFFF00] text-black shadow-lg" 
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
            <input 
              type="text"
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#DFFF00]/30 transition-colors"
            />
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">All Exercises</h2>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{filteredExercises.length} Exercises</span>
            </div>

            <div className="space-y-4">
              {filteredExercises.map((ex) => (
                <div key={ex.id} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-5 flex items-center gap-4 group">
                  <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl font-black text-[#DFFF00]">
                    {ex.initial}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xl font-bold">{ex.name}</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      {ex.muscle} • {ex.equipment}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="px-3 py-1 rounded-lg border border-[#DFFF00] text-[#DFFF00] text-[10px] font-bold uppercase tracking-widest">
                      {ex.day}
                    </div>
                    <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-zinc-600 hover:text-white transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button className="text-zinc-600 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeCategory === "hydration" && (
        <div className="space-y-6">
          <div className="bg-[#DFFF00]/10 border border-[#DFFF00]/20 p-6 rounded-3xl space-y-2">
            <h2 className="text-2xl font-black italic text-[#DFFF00]">Hydration Guide</h2>
            <p className="text-zinc-400 text-sm">Everything you need to know about staying hydrated for peak performance.</p>
          </div>
          
          <div className="grid gap-4">
            {HYDRATION_TIPS.map(tip => (
              <div key={tip.id} className="bg-zinc-900/50 border border-white/5 p-5 rounded-3xl flex gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center shrink-0">
                  {tip.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">{tip.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{tip.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeCategory === "habits" && (
        <div className="space-y-6">
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl space-y-2">
            <h2 className="text-2xl font-black italic text-red-400">Habit Mastery</h2>
            <p className="text-zinc-400 text-sm">Build lasting spiritual and personal habits for a balanced life.</p>
          </div>
          
          <div className="grid gap-4">
            {HABIT_GUIDES.map(guide => (
              <div key={guide.id} className="bg-zinc-900/50 border border-white/5 p-5 rounded-3xl flex gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center shrink-0">
                  {guide.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">{guide.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{guide.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeCategory === "namaz" && (
        <div className="space-y-6">
          <div className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-3xl space-y-2">
            <h2 className="text-2xl font-black italic text-purple-400">Spiritual Wellness</h2>
            <p className="text-zinc-400 text-sm">Integrate prayer into your daily routine for holistic health and peace.</p>
          </div>
          
          <div className="grid gap-4">
            {NAMAZ_GUIDES.map(guide => (
              <div key={guide.id} className="bg-zinc-900/50 border border-white/5 p-5 rounded-3xl flex gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center shrink-0">
                  {guide.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">{guide.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{guide.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryTab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 py-4 rounded-3xl border transition-all",
        active 
          ? "bg-[#DFFF00] border-[#DFFF00] text-black shadow-[0_0_20px_rgba(223,255,0,0.2)]" 
          : "bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-white/10"
      )}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}

function Sparkles({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
