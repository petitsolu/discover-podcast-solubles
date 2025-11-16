
import React from 'react';
import ChevronUpDownIcon from './icons/ChevronUpDownIcon';

const ScrollNudge: React.FC = () => {
  return (
    <div 
      className="fixed left-4 -translate-y-1/2 z-40 pointer-events-none animate-nudge"
      style={{ top: 'calc(50vw - 4rem)' }}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-1 text-white bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
        <ChevronUpDownIcon />
        <span className="text-sm font-semibold tracking-wide">Explorer</span>
      </div>
      <style>{`
        @keyframes nudge-fade-in-out {
          0% { opacity: 0; transform: translateY(-50%) scale(0.95); }
          20% { opacity: 1; transform: translateY(-50%) scale(1); }
          80% { opacity: 1; transform: translateY(-50%) scale(1); }
          100% { opacity: 0; transform: translateY(-50%) scale(0.95); }
        }
        .animate-nudge {
          animation: nudge-fade-in-out 5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-nudge svg .animate-pulse-up {
            animation: pulse-up 1.5s ease-in-out infinite;
        }
        .animate-nudge svg .animate-pulse-down {
            animation: pulse-down 1.5s ease-in-out infinite;
        }

        @keyframes pulse-up {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
        }
        @keyframes pulse-down {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(3px); }
        }
      `}</style>
    </div>
  );
};

export default ScrollNudge;