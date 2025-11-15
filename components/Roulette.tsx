import React, { useMemo } from 'react';
import { Episode } from '../types';

interface RouletteProps {
  episodes: Episode[];
  isMobile: boolean;
}

const Roulette: React.FC<RouletteProps> = ({ episodes, isMobile }) => {
  const reelItems = useMemo(() => {
    const shuffled = [...episodes].sort(() => Math.random() - 0.5);
    const shortList = shuffled.slice(0, Math.min(30, shuffled.length));
    return [...shortList, ...shortList, ...shortList, ...shortList];
  }, [episodes]);

  // Mobile-specific lightweight animation based on user's suggestion
  if (isMobile) {
    const itemHeight = 150; // Smaller height for just images
    const totalHeight = reelItems.length * itemHeight;
    const animationDuration = reelItems.length * 0.025;

    return (
      <div className="h-full w-full max-w-sm overflow-hidden relative rounded-2xl bg-slate-900/50 flex flex-col items-center justify-center"
          style={{
              maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          }}
      >
          {/* Static blurred background for performance */}
          <img src={episodes[0]?.image || ''} alt="" className="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-110" aria-hidden="true" />
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div 
              className="w-full animate-roulette-scroll"
              style={{ '--total-height': `${totalHeight}px`, '--animation-duration': `${animationDuration}s` } as React.CSSProperties}
          >
              {reelItems.map((episode, index) => (
                  <div key={index} style={{ height: `${itemHeight}px` }} className="flex items-center justify-center p-2">
                      <img src={episode.image} alt="" className="w-full h-full object-contain rounded-lg shadow-lg" loading="lazy" />
                  </div>
              ))}
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-[150px] w-full border-y-2 border-indigo-400/80 opacity-75"></div>
          </div>

          <style>{`
              @keyframes roulette-scroll {
                from { transform: translateY(0); }
                to { transform: translateY(calc(-1 * var(--total-height) / 2)); }
              }
              .animate-roulette-scroll {
                animation: roulette-scroll var(--animation-duration) linear infinite;
              }
          `}</style>
      </div>
    );
  }

  // Original Desktop animation
  const itemHeight = 480; 
  const totalHeight = reelItems.length * itemHeight;
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
                            <img src={episode.image} alt="" className="absolute inset-0 w-full h-full object-cover filter blur-md" aria-hidden="true" loading="lazy" />
                            <div className="absolute inset-0 bg-black/20"></div>
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