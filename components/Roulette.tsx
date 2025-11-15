
import React, { useMemo } from 'react';
import { Episode } from '../types';

interface RouletteProps {
  episodes: Episode[];
}

const Roulette: React.FC<RouletteProps> = ({ episodes }) => {
  const reelItems = useMemo(() => {
    const shuffled = [...episodes].sort(() => Math.random() - 0.5);
    // To prevent crashes on mobile devices due to memory overload, we drastically reduce
    // the number of items rendered in the animation. We take the first 30 unique
    // shuffled episodes and repeat them once to create a seamless loop.
    // This creates 60 DOM elements instead of 500+, ensuring high performance.
    const shortList = shuffled.slice(0, Math.min(30, shuffled.length));
    return [...shortList, ...shortList];
  }, [episodes]);

  const itemHeight = 480; 
  const totalHeight = reelItems.length * itemHeight;
  // A shorter animation duration for a smaller list creates a similar fast-scrolling effect.
  const animationDuration = reelItems.length * 0.05; 

  return (
    <div className="h-full w-full overflow-hidden relative rounded-2xl bg-slate-900/50 flex flex-col items-center justify-center"
        style={{
            maskImage: 'linear-gradient(to bottom, transparent 5%, black 25%, black 75%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 5%, black 25%, black 75%, transparent 95%)',
        }}
    >
        <div 
            className="w-full animate-roulette-scroll"
            style={{ '--total-height': `${totalHeight}px`, '--animation-duration': `${animationDuration}s` } as React.CSSProperties}
        >
            {reelItems.map((episode, index) => (
                <div key={index} style={{ height: `${itemHeight}px` }} className="flex items-center justify-center">
                    <div className="w-full max-w-sm h-full bg-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col text-center transition-all duration-300 backdrop-blur-sm bg-opacity-80">
                        <div className="w-full aspect-square relative">
                             {/* Blurred Background */}
                            <img src={episode.image} alt="" className="absolute inset-0 w-full h-full object-cover filter blur-md" aria-hidden="true" loading="lazy" />
                            <div className="absolute inset-0 bg-black/20"></div>
                            {/* Main Image */}
                            <img src={episode.image} alt="" className="relative w-full h-full object-contain" loading="lazy" />
                        </div>
                        <div className="p-4 flex flex-col justify-center flex-grow">
                          <h3 className="text-white font-bold text-lg leading-tight truncate-3-lines">{episode.titre}</h3>
                          <p className="text-slate-400 text-sm mt-2 truncate">Avec {episode.invite}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-[480px] w-full max-w-sm border-y-4 border-indigo-400/80 rounded-lg opacity-75 shadow-inner-strong"></div>
        </div>

        <style>{`
            @keyframes roulette-scroll {
              from { transform: translateY(0); }
              to { transform: translateY(calc(-1 * var(--total-height) / 2)); }
            }
            .animate-roulette-scroll {
              animation: roulette-scroll var(--animation-duration) linear infinite;
            }
            .shadow-inner-strong {
                box-shadow: inset 0 0 25px rgba(0,0,0,0.7);
            }
            .truncate-3-lines {
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
            }
        `}</style>
    </div>
  );
};

export default Roulette;
