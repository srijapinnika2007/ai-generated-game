import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  const [highScore, setHighScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);

  const handleScoreChange = (score: number) => {
    setCurrentScore(score);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="w-full h-screen bg-slate-950 text-white flex flex-col overflow-hidden font-sans select-none border-4 border-slate-900">
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-slate-900/50 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <div className="w-2 h-2 bg-slate-950 rounded-full"></div>
          </div>
          <h1 className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            SYNTH-SNAKE v1.0
          </h1>
        </div>
        <div className="flex gap-6 items-center">
          <div className="text-xs font-mono text-emerald-400 border border-emerald-400/30 px-3 py-1 rounded bg-emerald-400/5">
            CPU LOAD: 14% | LATENCY: 12ms
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-cyan-500/50 p-1 flex items-center justify-center">
            <div className="w-full h-full bg-slate-800 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Left: Music Library */}
        <aside className="w-72 bg-slate-900/30 border-r border-white/5 p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Audio Stream</h2>
            <div className="space-y-3">
              {[
                { name: 'Midnight Circuit', type: 'AI GEN / SYNTHWAVE', active: true },
                { name: 'Neon Pulse', type: 'AI GEN / GLITCH HOP', active: false },
                { name: 'Data Stream', type: 'AI GEN / AMBIENT', active: false }
              ].map((track) => (
                <div 
                  key={track.name}
                  className={`p-3 border rounded-lg flex items-center gap-3 cursor-pointer group transition-colors ${
                    track.active ? 'bg-emerald-500/10 border-emerald-500/40' : 'hover:bg-white/5 border-white/5'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${track.active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600 group-hover:bg-cyan-400'}`}></div>
                  <div>
                    <p className={`text-sm font-bold ${track.active ? 'text-emerald-400' : 'text-slate-300'}`}>{track.name}</p>
                    <p className="text-[10px] text-slate-500">{track.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 italic">Equalizer</p>
              <div className="flex items-end gap-1 h-12">
                {[0.6, 0.85, 0.4, 0.95, 0.7, 0.5].map((h, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [`${h*100}%`, `${(h*0.5)*100}%`, `${h*100}%`] }}
                    transition={{ repeat: Infinity, duration: 1 + i*0.2 }}
                    className="flex-1 bg-emerald-500 rounded-t-sm" 
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Center Section: Game Window */}
        <section className="flex-1 flex flex-col p-8 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)] relative">
          <div className="flex-1 relative border-2 border-slate-800 rounded-2xl bg-slate-950/80 overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] flex items-center justify-center">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-20 grid-background"></div>
            
            <SnakeGame onScoreChange={handleScoreChange} />

            {/* Game Overlay Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none">
              <div className="px-4 py-2 bg-slate-900/80 border border-white/10 rounded-lg text-[10px] uppercase font-bold text-slate-400">
                Arrows to Move
              </div>
              <div className="px-4 py-2 bg-slate-900/80 border border-white/10 rounded-lg text-[10px] uppercase font-bold text-slate-400">
                SPACE to Toggle
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar Right: Scoreboard */}
        <aside className="w-72 bg-slate-900/30 border-l border-white/5 p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Telemetry</h2>
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border-l-4 border-emerald-500">
                <p className="text-[10px] text-slate-500 font-mono uppercase">Current Score</p>
                <p className="text-4xl font-black font-mono text-white">{currentScore.toString().padStart(5, '0')}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border-l-4 border-cyan-500 opacity-60">
                <p className="text-[10px] text-slate-500 font-mono uppercase">High Score</p>
                <p className="text-2xl font-black font-mono text-white">{highScore.toString().padStart(5, '0')}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border-l-4 border-rose-500 opacity-60">
                <p className="text-[10px] text-slate-500 font-mono uppercase">Level</p>
                <p className="text-2xl font-black font-mono text-white">01</p>
              </div>
            </div>
          </div>

          <div className="mt-auto">
             <div className="p-4 bg-gradient-to-br from-indigo-600/20 to-cyan-600/20 rounded-xl border border-indigo-500/20">
                <p className="text-xs font-bold text-indigo-300 mb-1">Pro Tip:</p>
                <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                  THE SNAKE MOVES FASTER WHEN THE SCORE INCREASES. MAINTAIN RHYTHM TO SURVIVE LONGER!
                </p>
             </div>
          </div>
        </aside>
      </main>

      {/* Footer Music Controls */}
      <footer className="h-24 bg-slate-900 border-t border-white/10 px-8 flex items-center justify-between relative z-20">
        <MusicPlayer />
      </footer>
    </div>
  );
}
