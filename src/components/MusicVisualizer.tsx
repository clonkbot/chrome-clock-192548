import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  genre: string;
}

const mockTracks: Track[] = [
  { id: 1, title: 'Midnight Dreams', artist: 'AI Composer', duration: '3:24', genre: 'Ambient' },
  { id: 2, title: 'Digital Sunrise', artist: 'Neural Beats', duration: '2:58', genre: 'Electronic' },
  { id: 3, title: 'Quantum Waves', artist: 'Synth Mind', duration: '4:12', genre: 'Synthwave' },
  { id: 4, title: 'Chrome Horizon', artist: 'AI Orchestra', duration: '3:45', genre: 'Cinematic' },
];

function MusicVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [bars, setBars] = useState<number[]>(Array(32).fill(0));
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(32).fill(0));
      return;
    }

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map(() => Math.random() * 100)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newTrack: Track = {
      id: Date.now(),
      title: prompt.slice(0, 20) + (prompt.length > 20 ? '...' : ''),
      artist: 'Suno AI',
      duration: `${Math.floor(Math.random() * 3) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      genre: 'AI Generated',
    };

    setCurrentTrack(newTrack);
    setIsPlaying(true);
    setIsGenerating(false);
    setPrompt('');
  };

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500/20 to-orange-500/20 border border-rose-500/30">
          <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
          <span className="font-display text-xs tracking-wider text-white/70">SUNO API</span>
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-3">Music Generator</h2>
        <p className="font-body text-white/40 text-sm mt-1">AI-powered music creation</p>
      </motion.div>

      {/* Visualizer */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="h-32 md:h-40 flex items-end justify-center gap-1 px-4 py-4 rounded-2xl bg-gradient-to-br from-black/40 to-black/20 border border-white/10 chrome-border backdrop-blur-xl overflow-hidden"
      >
        {bars.map((height, i) => (
          <motion.div
            key={i}
            className="w-1.5 md:w-2 rounded-full"
            style={{
              background: `linear-gradient(to top, rgba(244, 63, 94, 0.8), rgba(251, 146, 60, 0.8))`,
            }}
            animate={{ height: `${Math.max(height, 4)}%` }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
          />
        ))}
      </motion.div>

      {/* Now Playing */}
      <AnimatePresence mode="wait">
        {currentTrack && (
          <motion.div
            key={currentTrack.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
          >
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/30 hover:scale-105 transition-transform active:scale-95"
            >
              {isPlaying ? (
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-white font-medium truncate">{currentTrack.title}</h3>
              <p className="font-body text-white/40 text-sm truncate">{currentTrack.artist}</p>
            </div>
            <span className="font-mono text-white/30 text-sm flex-shrink-0">{currentTrack.duration}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 p-2 rounded-2xl bg-white/5 border border-white/10 chrome-border backdrop-blur-xl"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your music..."
          className="flex-1 bg-transparent px-4 py-3 text-white placeholder-white/30 font-body text-sm focus:outline-none min-h-[48px]"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="px-4 md:px-6 py-3 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 text-white font-display text-sm tracking-wider disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-rose-500/30 active:scale-95 min-h-[48px] min-w-[48px]"
        >
          {isGenerating ? (
            <motion.div
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            'Create'
          )}
        </button>
      </motion.div>

      {/* Track List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <h3 className="font-display text-xs tracking-wider text-white/40 uppercase px-2">Sample Tracks</h3>
        <div className="space-y-1.5 max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {mockTracks.map((track, i) => (
            <motion.button
              key={track.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              onClick={() => handleTrackSelect(track)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all min-h-[56px] ${
                currentTrack?.id === track.id
                  ? 'bg-white/10 border border-white/20'
                  : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/10'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500/30 to-orange-500/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-body text-white text-sm truncate">{track.title}</p>
                <p className="font-body text-white/40 text-xs truncate">{track.genre}</p>
              </div>
              <span className="font-mono text-white/30 text-xs flex-shrink-0">{track.duration}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default MusicVisualizer;
