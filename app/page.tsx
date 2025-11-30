'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Slider } from './components/Slider';

const easings = [
  { 
    name: 'Linear', 
    id: 'linear', 
    fn: (t: number) => t 
  },
  { 
    name: 'Ease In (Quad)', 
    id: 'easeIn', 
    fn: (t: number) => t * t 
  },
  { 
    name: 'Ease Out (Quad)', 
    id: 'easeOut', 
    fn: (t: number) => t * (2 - t) 
  },
  { 
    name: 'Ease In Out (Quad)', 
    id: 'easeInOut', 
    fn: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t 
  },
  { 
    name: 'Circ In', 
    id: 'circIn', 
    fn: (t: number) => 1 - Math.sqrt(1 - t * t) 
  },
  { 
    name: 'Circ Out', 
    id: 'circOut', 
    fn: (t: number) => Math.sqrt(1 - Math.pow(t - 1, 2)) 
  },
  { 
    name: 'Back In', 
    id: 'backIn', 
    fn: (t: number) => { const c1 = 1.70158; const c3 = c1 + 1; return c3 * t * t * t - c1 * t * t; } 
  },
  { 
    name: 'Back Out', 
    id: 'backOut', 
    fn: (t: number) => { const c1 = 1.70158; const c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); } 
  },
  { 
    name: 'Anticipate', 
    id: 'anticipate', 
    fn: (t: number) => { 
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; 
    } 
  }
] as const;

export default function Home() {
  const [selectedEasingId, setSelectedEasingId] = useState('easeInOut');
  const [duration, setDuration] = useState(1.5);
  const [trackWidth, setTrackWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const selectedEasing = easings.find(e => e.id === selectedEasingId) || easings[0];

  // Measure track width on mount and resize
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => setTrackWidth(track.offsetWidth);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  // Memoize expensive path calculation
  const curvePath = useMemo(() => {
    const points = [];
    const steps = 100;
    const width = 400;
    const height = 200;
    const padding = 20;
    const plotWidth = width - padding * 2;
    const plotHeight = height - padding * 2;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const value = selectedEasing.fn(t);
      const x = padding + t * plotWidth;
      const y = height - (padding + value * plotHeight);
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')}`;
  }, [selectedEasing]);

  const ballSize = 24; // 1.5rem = 24px
  const padding = 4;   // 0.25rem = 4px
  const travelDistance = trackWidth - ballSize - padding * 2;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8 text-white relative overflow-hidden font-sans" style={{ backgroundColor: 'var(--background)' }}>
      
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }} 
      />

      <div className="z-10 flex flex-col items-center gap-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
          Easing Functions
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
          
          <div className="flex flex-col gap-6">
            
            <div className="relative bg-zinc-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm shadow-2xl">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">Curve</div>
              <svg width="100%" height="200" viewBox="0 0 400 200" className="overflow-visible">
                <line x1="20" y1="180" x2="380" y2="180" stroke="#333" strokeWidth="1" />
                <line x1="20" y1="180" x2="20" y2="20" stroke="#333" strokeWidth="1" />
                
                <motion.path
                  d={curvePath}
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  key={selectedEasingId}
                />
              </svg>
            </div>

            <div className="relative bg-zinc-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm shadow-2xl h-32 flex flex-col justify-center">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">Motion</div>
              <div ref={trackRef} className="relative w-full h-8 bg-white/5 rounded-full overflow-hidden">
                {trackWidth > 0 && (
                  <motion.div
                    className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full"
                    animate={{ x: [0, travelDistance] }}
                    transition={{
                      duration,
                      ease: selectedEasing.id,
                      repeat: Infinity,
                      repeatDelay: 0.5,
                      repeatType: "reverse"
                    }}
                    key={`${selectedEasingId}-${duration}-${trackWidth}`}
                  />
                )}
              </div>
            </div>

          </div>

          <div className="flex flex-col gap-8">
            
            <div className="flex flex-col gap-3">
              <label className="text-xs text-gray-500 uppercase tracking-widest">Select Easing</label>
              <div className="grid grid-cols-2 gap-2">
                {easings.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setSelectedEasingId(e.id)}
                    className={`
                      px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left
                      ${selectedEasingId === e.id 
                        ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}
                    `}
                  >
                    {e.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6 p-6 bg-zinc-900/30 border border-white/5 rounded-xl">
               <Slider 
                 label="Duration (s)" 
                 value={duration} 
                 onChange={setDuration} 
                 min={0.5} 
                 max={5} 
                 step={0.1} 
               />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
