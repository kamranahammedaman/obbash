import React, { useState, useEffect } from "react";
import { Info, Plus, Play, Pause, RotateCcw, ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface WorkoutLoggerProps {
  isActive: boolean;
  onToggle: () => void;
}

export default function WorkoutLogger({ isActive, onToggle }: WorkoutLoggerProps) {
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedRest, setSelectedRest] = useState(60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRest = () => {
    setTimer(selectedRest);
    setIsTimerRunning(true);
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full animate-pulse",
            isActive ? "bg-[#DFFF00]" : "bg-zinc-700"
          )} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            {isActive ? "Session Active" : "Session Inactive"}
          </span>
        </div>
        <button 
          onClick={onToggle}
          className={cn(
            "text-sm font-bold uppercase tracking-tighter",
            isActive ? "text-[#DFFF00]" : "text-zinc-500"
          )}
        >
          {isActive ? "Finish" : "Start"}
        </button>
      </header>

      <div className="flex justify-between items-center">
        <button className="flex items-center gap-2 group">
          <h1 className="text-4xl font-black italic tracking-tighter">Leg Curl</h1>
          <ChevronDown className="text-[#DFFF00] group-hover:translate-y-1 transition-transform" />
        </button>
        <button className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
          <Info size={20} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Set</p>
          <p className="text-2xl font-black">1</p>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Weight (kg)</p>
          <div className="bg-zinc-900 rounded-2xl py-4 border border-white/5">
            <span className="text-zinc-600 font-black">--</span>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Reps</p>
          <div className="bg-zinc-900 rounded-2xl py-4 border border-white/5 relative">
            <span className="text-zinc-600 font-black">--</span>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-zinc-800" />
          </div>
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 text-zinc-400 font-bold hover:text-white transition-colors py-4">
        <Plus size={20} /> Add Set
      </button>

      <div className="bg-zinc-900/80 border border-white/5 rounded-[40px] p-8 space-y-6">
        <div className="flex justify-center gap-2">
          {[60, 120, 180, 240, 300].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedRest(s)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold transition-all",
                selectedRest === s 
                  ? "bg-[#DFFF00] text-black" 
                  : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"
              )}
            >
              {s / 60}m
            </button>
          ))}
        </div>

        <div className="text-center space-y-2">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Rest Timer</p>
          <p className="text-7xl font-black tracking-tighter tabular-nums">
            {formatTime(timer || selectedRest)}
          </p>
        </div>

        <button 
          onClick={isTimerRunning ? () => setIsTimerRunning(false) : startRest}
          className={cn(
            "w-full py-6 rounded-3xl font-black text-xl uppercase tracking-tighter transition-all active:scale-95",
            isTimerRunning 
              ? "bg-zinc-800 text-white" 
              : "bg-[#DFFF00] text-black shadow-[0_0_30px_rgba(223,255,0,0.1)]"
          )}
        >
          {isTimerRunning ? "Stop Rest" : "Start Rest"}
        </button>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Session Comments</p>
        <textarea 
          placeholder="How did this exercise feel?"
          className="w-full bg-zinc-900/50 border border-white/5 rounded-3xl p-6 min-h-[120px] focus:outline-none focus:border-[#DFFF00]/30 transition-colors resize-none placeholder:text-zinc-700"
        />
      </div>
    </div>
  );
}
