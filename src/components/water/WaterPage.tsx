import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Droplets, MessageSquare, Calendar, ChevronLeft, ChevronRight, Plus, Minus, Info, Sparkles, X, Edit2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface WaterPageProps {
  currentIntake: number;
  targetIntake: number;
  onUpdateIntake: (amount: number) => void;
  onUpdateTarget: (amount: number) => void;
}

export default function WaterPage({
  currentIntake,
  targetIntake,
  onUpdateIntake,
  onUpdateTarget
}: WaterPageProps) {
  const [showAiChat, setShowAiChat] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [tempTarget, setTempTarget] = useState(targetIntake.toString());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Convert ml to oz for display (1 oz ≈ 29.57 ml)
  const mlToOz = (ml: number) => Math.round(ml / 29.57);
  const ozToMl = (oz: number) => Math.round(oz * 29.57);

  const intakeOz = mlToOz(currentIntake);
  const targetOz = mlToOz(targetIntake);
  const percentage = Math.min(100, (currentIntake / targetIntake) * 100);

  const handleManualAdjust = (oz: number) => {
    const ml = ozToMl(oz);
    onUpdateIntake(Math.max(0, currentIntake + ml));
  };

  const handleSaveTarget = () => {
    const newTarget = parseInt(tempTarget);
    if (!isNaN(newTarget) && newTarget > 0) {
      onUpdateTarget(newTarget);
      setShowTargetModal(false);
    }
  };

  const intakeOptions = [
    { oz: 8, ml: 250 },
    { oz: 12, ml: 350 },
    { oz: 16, ml: 500 },
    { oz: 20, ml: 600 },
    { oz: 24, ml: 750 },
    { oz: 32, ml: 1000 },
  ];

  // Calendar logic
  const getDaysInWeek = (date: Date) => {
    const days = [];
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    for (let i = 0; i < 7; i++) {
      days.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }
    return days;
  };

  const weekDays = getDaysInWeek(selectedDate);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black italic tracking-tighter">Water</h1>
        <button 
          onClick={() => setShowAiChat(true)}
          className="p-3 bg-zinc-900 rounded-xl text-blue-400 hover:bg-zinc-800 transition-colors"
        >
          <MessageSquare size={24} />
        </button>
      </div>

      {/* Calendar Strip */}
      <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-400" />
            <span className="font-bold text-sm">
              {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() - 7);
              setSelectedDate(d);
            }} className="p-1 hover:bg-zinc-800 rounded">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() + 7);
              setSelectedDate(d);
            }} className="p-1 hover:bg-zinc-800 rounded">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          {weekDays.map((day, i) => {
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = day.toDateString() === selectedDate.toDateString();
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-10",
                  isSelected ? "bg-blue-500 text-white" : "hover:bg-zinc-800",
                  isToday && !isSelected && "border border-blue-500/50"
                )}
              >
                <span className="text-[10px] uppercase font-bold opacity-50">
                  {day.toLocaleString('default', { weekday: 'short' }).charAt(0)}
                </span>
                <span className="text-sm font-black">{day.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Coach Tip */}
      <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl space-y-2">
        <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest">
          <Info size={12} />
          Coach Tip
        </div>
        <p className="text-sm italic text-zinc-300">
          "Neuron signaling requires fluid for peak cognitive processing."
        </p>
        <p className="text-xs text-blue-400/70 font-medium">
          নিউরণ সিগন্যালিং এবং উন্নত চিন্তাশক্তির জন্য পর্যাপ্ত পানির প্রয়োজন।
        </p>
      </div>

      {/* Main Progress Card */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden aspect-square max-w-sm mx-auto w-full">
        <div className="relative w-48 h-48">
          {/* Circular Track */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-zinc-800"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={553}
              initial={{ strokeDashoffset: 553 }}
              animate={{ strokeDashoffset: 553 - (553 * percentage) / 100 }}
              className="text-blue-500"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-5xl font-black text-blue-400">{intakeOz}</span>
            <button 
              onClick={() => {
                setTempTarget(targetIntake.toString());
                setShowTargetModal(true);
              }}
              className="flex items-center gap-1 group"
            >
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">of {targetOz} oz</span>
              <Edit2 size={10} className="text-zinc-600 group-hover:text-blue-400 transition-colors" />
            </button>
          </div>
        </div>

        {/* Manual Adjustment Controls */}
        <div className="absolute bottom-6 flex items-center gap-6">
          <button 
            onClick={() => handleManualAdjust(-1)}
            className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all active:scale-90"
          >
            <Minus size={20} />
          </button>
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Manual</div>
          <button 
            onClick={() => handleManualAdjust(1)}
            className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all active:scale-90"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Intake Grid */}
      <div className="grid grid-cols-3 gap-3">
        {intakeOptions.map((option, i) => (
          <button
            key={i}
            onClick={() => onUpdateIntake(currentIntake + option.ml)}
            className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-zinc-800 transition-all active:scale-95 group"
          >
            <div className="relative w-8 h-12 border-2 border-zinc-700 rounded-md overflow-hidden">
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-blue-500/50"
                initial={{ height: 0 }}
                animate={{ height: `${(option.oz / 32) * 100}%` }}
              />
            </div>
            <div className="text-center">
              <div className="text-sm font-black">{option.oz} oz</div>
              <div className="text-[10px] text-zinc-500 font-bold">{option.ml} ml</div>
            </div>
          </button>
        ))}
      </div>

      {/* Today's Log */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Today's Log</h2>
        {currentIntake === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-600 gap-4">
            <Droplets size={48} className="opacity-20" />
            <p className="font-bold text-sm">No water logged yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Mock log entries */}
            <div className="bg-zinc-900/50 p-4 rounded-2xl flex justify-between items-center border border-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                  <Droplets size={20} />
                </div>
                <div>
                  <div className="font-bold">Water Intake</div>
                  <div className="text-xs text-zinc-500">Just now</div>
                </div>
              </div>
              <div className="text-blue-400 font-black">+{mlToOz(currentIntake)} oz</div>
            </div>
          </div>
        )}
      </div>

      {/* Target Setting Modal */}
      <AnimatePresence>
        {showTargetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-xs space-y-6"
            >
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black italic tracking-tighter">Set Daily Target</h3>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Adjust your hydration goal</p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <input 
                  type="number" 
                  value={tempTarget}
                  onChange={(e) => setTempTarget(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-2xl font-black text-center w-32 focus:outline-none focus:border-blue-500"
                />
                <span className="text-sm font-bold text-zinc-500">ml</span>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowTargetModal(false)}
                  className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-400 font-bold text-sm hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveTarget}
                  className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-bold text-sm hover:bg-blue-400 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Water AI Modal */}
      <AnimatePresence>
        {showAiChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="font-black italic">Aura Water AI</h2>
                  <p className="text-[10px] text-blue-400 uppercase font-bold tracking-widest">Hydration Specialist</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAiChat(false)}
                className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <div className="bg-zinc-900 p-4 rounded-2xl rounded-tl-none max-w-[80%] border border-zinc-800">
                <p className="text-sm">
                  Hello! I'm your hydration specialist. How can I help you reach your water goals today? 
                  <br /><br />
                  আপনি কি জানতে চান আপনার শরীরের জন্য কতটুকু পানি প্রয়োজন?
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-800">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ask about hydration..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
                <button className="bg-blue-500 text-white p-3 rounded-xl">
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
