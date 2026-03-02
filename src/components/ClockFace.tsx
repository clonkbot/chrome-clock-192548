import { motion } from 'framer-motion';

interface ClockFaceProps {
  time: Date;
}

function ClockFace({ time }: ClockFaceProps) {
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDegrees = seconds * 6;
  const minuteDegrees = minutes * 6 + seconds * 0.1;
  const hourDegrees = hours * 30 + minutes * 0.5;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 md:gap-8">
      {/* Digital time display */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-display text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/40 tracking-tight tabular-nums">
          {formatTime(time)}
        </h1>
        <p className="font-body text-white/40 text-sm md:text-base mt-2 tracking-wide">
          {formatDate(time)}
        </p>
      </motion.div>

      {/* Analog clock */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-64 h-64 md:w-80 md:h-80"
      >
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-xl" />

        {/* Clock face */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-800/80 via-zinc-900/90 to-black border border-white/10 chrome-border backdrop-blur-xl shadow-2xl shadow-black/50">
          {/* Inner chrome ring */}
          <div className="absolute inset-2 md:inset-3 rounded-full border border-white/5 bg-gradient-to-br from-zinc-900 to-black" />

          {/* Hour markers */}
          {[...Array(12)].map((_, i) => {
            const rotation = i * 30;
            const isMainHour = i % 3 === 0;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 origin-center"
                style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
              >
                <div
                  className={`absolute left-1/2 -translate-x-1/2 ${
                    isMainHour
                      ? 'w-1 h-4 md:h-5 bg-gradient-to-b from-white to-white/50 rounded-full'
                      : 'w-0.5 h-2 md:h-3 bg-white/30 rounded-full'
                  }`}
                  style={{ top: '-118px', transform: 'translateX(-50%)' }}
                />
              </div>
            );
          })}

          {/* Minute markers */}
          {[...Array(60)].map((_, i) => {
            if (i % 5 === 0) return null;
            const rotation = i * 6;
            return (
              <div
                key={`min-${i}`}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 origin-center"
                style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
              >
                <div
                  className="absolute left-1/2 -translate-x-1/2 w-px h-1.5 bg-white/15 rounded-full"
                  style={{ top: '-118px', transform: 'translateX(-50%)' }}
                />
              </div>
            );
          })}

          {/* Hour hand */}
          <motion.div
            className="absolute left-1/2 top-1/2 origin-bottom"
            style={{ transform: `translate(-50%, -100%) rotate(${hourDegrees}deg)` }}
            transition={{ type: 'spring', stiffness: 50 }}
          >
            <div className="w-1.5 md:w-2 h-16 md:h-20 bg-gradient-to-t from-white via-white to-white/60 rounded-full shadow-lg shadow-white/20" />
          </motion.div>

          {/* Minute hand */}
          <motion.div
            className="absolute left-1/2 top-1/2 origin-bottom"
            style={{ transform: `translate(-50%, -100%) rotate(${minuteDegrees}deg)` }}
            transition={{ type: 'spring', stiffness: 50 }}
          >
            <div className="w-1 md:w-1.5 h-24 md:h-28 bg-gradient-to-t from-white via-white to-white/40 rounded-full shadow-lg shadow-white/20" />
          </motion.div>

          {/* Second hand */}
          <motion.div
            className="absolute left-1/2 top-1/2 origin-bottom"
            style={{ transform: `translate(-50%, -100%) rotate(${secondDegrees}deg)` }}
            animate={{ rotate: secondDegrees }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="w-0.5 h-28 md:h-32 bg-gradient-to-t from-rose-500 via-rose-400 to-rose-300 rounded-full shadow-lg shadow-rose-500/30">
              {/* Second hand tail */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-6 bg-rose-500 rounded-full" />
            </div>
          </motion.div>

          {/* Center cap */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-white via-zinc-200 to-zinc-600 shadow-lg" />
        </div>
      </motion.div>

      {/* Timezone indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-xs text-white/50 tracking-wider">
          {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </span>
      </motion.div>
    </div>
  );
}

export default ClockFace;
