import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClockFace from './components/ClockFace';
import AIAssistant from './components/AIAssistant';
import MusicVisualizer from './components/MusicVisualizer';
import './styles.css';

type Tab = 'clock' | 'ai' | 'music';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('clock');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeOfDayGradient = useCallback(() => {
    const hour = time.getHours();
    if (hour >= 5 && hour < 8) return 'from-indigo-950 via-purple-900 to-orange-900';
    if (hour >= 8 && hour < 17) return 'from-slate-900 via-zinc-900 to-slate-800';
    if (hour >= 17 && hour < 20) return 'from-slate-950 via-orange-950 to-purple-950';
    return 'from-slate-950 via-zinc-950 to-black';
  }, [time]);

  return (
    <div className={`min-h-[100dvh] bg-gradient-to-br ${getTimeOfDayGradient()} transition-colors duration-[3000ms] flex flex-col`}>
      {/* Noise overlay */}
      <div className="fixed inset-0 noise-overlay pointer-events-none opacity-30" />

      {/* Chrome reflection effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[60vh] bg-gradient-radial from-white/5 via-transparent to-transparent blur-3xl" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 md:py-12 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'clock' && (
            <motion.div
              key="clock"
              initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateX: 10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg"
            >
              <ClockFace time={time} />
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg"
            >
              <AIAssistant />
            </motion.div>
          )}

          {activeTab === 'music' && (
            <motion.div
              key="music"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg"
            >
              <MusicVisualizer />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Tab Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 pb-safe">
        <div className="mx-4 mb-4 md:mx-auto md:max-w-md">
          <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-2 flex gap-2 chrome-border">
            {(['clock', 'ai', 'music'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 min-h-[48px] ${
                  activeTab === tab
                    ? 'bg-gradient-to-br from-white/20 to-white/5 text-white shadow-lg shadow-white/10'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <span className="block font-display tracking-wide uppercase text-xs">
                  {tab === 'clock' && 'Clock'}
                  {tab === 'ai' && 'Claude'}
                  {tab === 'music' && 'Suno'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <footer className="fixed bottom-20 md:bottom-24 left-0 right-0 text-center pb-2">
        <p className="text-[10px] md:text-xs text-white/25 font-mono tracking-wider">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}

export default App;
