import React from 'react';
import ChevronDownIcon from './icons/ChevronDownIcon';

const ScrollNudge: React.FC = () => {
  return (
    <div 
      className="fixed bottom-32 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-nudge"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-1 text-white bg-slate-900/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
        <span className="text-sm font-semibold">Faites défiler</span>
        <ChevronDownIcon />
      </div>
      <style>{`
        @keyframes nudge-fade-in-out {
          0% { opacity: 0; transform: translate(-50%, 10px); }
          20% { opacity: 1; transform: translate(-50%, 0); }
          80% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, 10px); }
        }
        .animate-nudge {
          animation: nudge-fade-in-out 5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .animate-nudge svg {
            width: 28px;
            height: 28px;
            animation: gentle-bounce 1.5s ease-in-out infinite;
        }
        @keyframes gentle-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default ScrollNudge;
