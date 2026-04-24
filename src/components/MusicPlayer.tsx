import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, ListMusic, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  duration: string;
}

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Midnight Circuit',
    artist: 'AI Synth Ensemble',
    cover: 'https://picsum.photos/seed/cyber1/400/400',
    duration: '3:45',
  },
  {
    id: '2',
    title: 'Neon Pulse',
    artist: 'Digital Dreamer',
    cover: 'https://picsum.photos/seed/neon2/400/400',
    duration: '4:12',
  },
  {
    id: '3',
    title: 'Data Stream',
    artist: 'Vaporwave Ghost',
    cover: 'https://picsum.photos/seed/city3/400/400',
    duration: '2:58',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const currentTrack = TRACKS[currentTrackIndex];
  const progressInterval = useRef<number>(0);

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = window.setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
      }, 100);
    } else {
      clearInterval(progressInterval.current);
    }
    return () => clearInterval(progressInterval.current);
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentTrackIndex(prev => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handleBack = () => {
    setCurrentTrackIndex(prev => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="w-full flex items-center justify-between">
      {/* Left: Track Info */}
      <div className="w-1/3 flex items-center gap-4">
        <div className="w-14 h-14 bg-emerald-950 rounded-lg overflow-hidden border border-emerald-500/30 flex items-center justify-center shrink-0">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-white truncate">{currentTrack.title}</p>
          <p className="text-xs text-slate-400 truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Center: Controls & Progress */}
      <div className="flex flex-col items-center gap-2 w-1/3">
        <div className="flex items-center gap-6">
          <button 
            onClick={handleBack}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <SkipBack fill="currentColor" size={20} />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} className="translate-x-0.5" />}
          </button>
          <button 
            onClick={handleNext}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <SkipForward fill="currentColor" size={20} />
          </button>
        </div>
        <div className="w-full flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-500">1:24</span>
          <div className="flex-1 h-1 bg-slate-800 rounded-full relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-emerald-500 shadow-[0_0_10px_#10b981] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
            <motion.div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
              animate={{ left: `${progress}%` }}
              style={{ x: '-50%' }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-500">{currentTrack.duration}</span>
        </div>
      </div>

      {/* Right: Volume & More */}
      <div className="w-1/3 flex justify-end items-center gap-4">
        <div className="flex items-center gap-3 w-32">
          <Volume2 size={16} className="text-slate-400" />
          <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="w-[70%] h-full bg-slate-400"></div>
          </div>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors cursor-pointer">
          <ListMusic size={20} />
        </button>
      </div>
    </div>
  );
}
