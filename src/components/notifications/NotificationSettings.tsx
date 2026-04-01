import React, { useState, useEffect } from 'react';
import { Bell, Clock, Droplets, Dumbbell, Save, Volume2, VolumeX, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface NamazTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface NotificationSettingsProps {
  settings: {
    gymTime: string;
    gymEnabled: boolean;
    waterInterval: number;
    waterEnabled: boolean;
    namazEnabled: boolean;
    soundEnabled: boolean;
    namazTimes: NamazTimes;
  };
  onUpdateSettings: (newSettings: any) => void;
}

export function NotificationSettings({ settings, onUpdateSettings }: NotificationSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    toast.success('Notification settings saved!');
    
    // Request notification permission if enabling
    if ((localSettings.gymEnabled || localSettings.waterEnabled || localSettings.namazEnabled) && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  return (
    <div className="p-6 pb-32 max-w-md mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-black italic tracking-tighter text-[#DFFF00]">ALERTS & REMINDERS</h1>
        <p className="text-zinc-500 text-sm font-mono uppercase tracking-widest">Stay on track with your fitness goals</p>
      </header>

      {/* Gym Reminder Section */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-lime-500/10 rounded-lg">
              <Dumbbell className="w-6 h-6 text-[#DFFF00]" />
            </div>
            <div>
              <h2 className="font-bold text-white">Gym Reminder</h2>
              <p className="text-xs text-zinc-500 font-mono">Daily workout alert</p>
            </div>
          </div>
          <button
            onClick={() => setLocalSettings({ ...localSettings, gymEnabled: !localSettings.gymEnabled })}
            className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.gymEnabled ? 'bg-[#DFFF00]' : 'bg-zinc-700'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-black rounded-full transition-transform ${localSettings.gymEnabled ? 'translate-x-6' : ''}`} />
          </button>
        </div>

        {localSettings.gymEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 pt-4 border-t border-zinc-800"
          >
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Set Gym Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="time"
                  value={localSettings.gymTime}
                  onChange={(e) => setLocalSettings({ ...localSettings, gymTime: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#DFFF00] transition-colors"
                />
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Water Reminder Section */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Droplets className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="font-bold text-white">Water Reminder</h2>
              <p className="text-xs text-zinc-500 font-mono">Hourly hydration alert</p>
            </div>
          </div>
          <button
            onClick={() => setLocalSettings({ ...localSettings, waterEnabled: !localSettings.waterEnabled })}
            className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.waterEnabled ? 'bg-blue-500' : 'bg-zinc-700'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-black rounded-full transition-transform ${localSettings.waterEnabled ? 'translate-x-6' : ''}`} />
          </button>
        </div>

        {localSettings.waterEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 pt-4 border-t border-zinc-800"
          >
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Interval (Minutes)</label>
              <div className="grid grid-cols-4 gap-2">
                {[30, 60, 90, 120].map((interval) => (
                  <button
                    key={interval}
                    onClick={() => setLocalSettings({ ...localSettings, waterInterval: interval })}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      localSettings.waterInterval === interval
                        ? 'bg-blue-500 text-white'
                        : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                    }`}
                  >
                    {interval}m
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Namaz Reminder Section */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Moon className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="font-bold text-white">Namaz Reminder</h2>
              <p className="text-xs text-zinc-500 font-mono">Prayer time alerts</p>
            </div>
          </div>
          <button
            onClick={() => setLocalSettings({ ...localSettings, namazEnabled: !localSettings.namazEnabled })}
            className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.namazEnabled ? 'bg-purple-500' : 'bg-zinc-700'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-black rounded-full transition-transform ${localSettings.namazEnabled ? 'translate-x-6' : ''}`} />
          </button>
        </div>

        {localSettings.namazEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 pt-4 border-t border-zinc-800"
          >
            <p className="text-[10px] text-zinc-500 font-mono uppercase leading-relaxed">
              Alerts will be sent for Fajr, Dhuhr, Asr, Maghrib, and Isha. 
              <br />
              <span className="text-[#DFFF00]">You can manually edit these times in the "Spiritual Path" tab.</span>
            </p>
          </motion.div>
        )}
      </section>

      {/* Sound Settings */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-800 rounded-lg">
            {localSettings.soundEnabled ? (
              <Volume2 className="w-6 h-6 text-white" />
            ) : (
              <VolumeX className="w-6 h-6 text-zinc-500" />
            )}
          </div>
          <div>
            <h2 className="font-bold text-white">Alarm Sound</h2>
            <p className="text-xs text-zinc-500 font-mono">Play sound for alerts</p>
          </div>
        </div>
        <button
          onClick={() => setLocalSettings({ ...localSettings, soundEnabled: !localSettings.soundEnabled })}
          className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.soundEnabled ? 'bg-white' : 'bg-zinc-700'}`}
        >
          <div className={`absolute top-1 left-1 w-4 h-4 bg-black rounded-full transition-transform ${localSettings.soundEnabled ? 'translate-x-6' : ''}`} />
        </button>
      </section>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-[#DFFF00] text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        <Save className="w-5 h-5" />
        SAVE SETTINGS
      </button>

      {/* Info Card */}
      <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl">
        <p className="text-[10px] text-zinc-500 font-mono leading-relaxed uppercase">
          Note: For notifications to work, please ensure you have granted permission in your browser. 
          The app must be open in a tab to trigger these alerts.
        </p>
      </div>
    </div>
  );
}
