
import React, { useState, useEffect } from 'react';
import CloseIcon from './icons/CloseIcon';
import MinimizeIcon from './icons/MinimizeIcon';
import MaximizeIcon from './icons/MaximizeIcon';

interface AIChatBubbleProps {
    isMobile: boolean;
}

const AIChatBubble: React.FC<AIChatBubbleProps> = ({ isMobile }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isReduced, setIsReduced] = useState(false);

    const logoUrl = "https://csoluble.media/wp-content/uploads/2025/11/Petit-Solu-assistant-IA-podcast-Solubles-Icon-e1763207117628.png";
    const iframeUrl = "https://petitsolu.netlify.app/";

    const handleOpen = () => {
        if (isMobile) {
            setIsReduced(false);
        }
        setIsOpen(true);
    };

    if (!isOpen) {
        const bubblePosition = isMobile ? "-translate-y-1/2 left-4" : "bottom-6 left-6";
        const bubbleSize = isMobile ? "w-12 h-12" : "w-16 h-16";
        const logoSize = isMobile ? "w-6 h-6" : "w-10 h-10";
        return (
            <button
                onClick={handleOpen}
                className={`group fixed ${bubblePosition} z-50 flex items-center justify-center ${bubbleSize} border-2 border-teal-400 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50`}
                style={{
                    backgroundColor: '#2A3449',
                    top: isMobile ? 'calc(50vw + 4rem)' : undefined
                }}
                aria-label="Ouvrir l'assistant IA Petit Solu"
            >
                <img src={logoUrl} alt="Petit Solu Logo" className={`${logoSize} transition-transform duration-300 group-hover:rotate-12`} />
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 w-max bg-slate-800 text-white text-sm font-semibold px-3 py-1.5 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none md:left-full md:right-auto md:ml-4 md:mr-0">
                    Discuter avec Petit Solu
                </div>
            </button>
        );
    }

    const containerClasses = [
        "fixed z-[9999] flex animate-fade-in transition-all duration-300 ease-out",
        isMobile && isReduced ? "inset-auto bottom-28 right-4 pointer-events-none" : "inset-0",
        !isMobile ? "items-center justify-center p-4 bg-black/60 backdrop-blur-sm" : ""
    ].join(' ');

    const windowClasses = [
        "bg-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out animate-scale-up pointer-events-auto",
        isMobile && isReduced ? "w-80 h-[60vh] max-h-96 rounded-2xl" : "w-full h-full",
        !isMobile ? "max-w-6xl w-full h-[85vh] rounded-2xl" : "md:rounded-2xl"
    ].join(' ');

    return (
        <div 
            className={containerClasses}
            style={isMobile && !isReduced ? { backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' } : {}}
        >
            <div className={windowClasses}>
                <header className="flex items-center justify-between p-4 bg-slate-900/70 backdrop-blur-sm border-b border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <img src={logoUrl} alt="" className="w-6 h-6" aria-hidden="true" />
                        <h3 className="font-bold text-white">Discuter avec Petit Solu</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {isMobile && (
                            <button
                                onClick={() => setIsReduced(!isReduced)}
                                className="p-1 text-slate-400 hover:text-white transition-colors"
                                aria-label={isReduced ? "Agrandir" : "Réduire"}
                            >
                                {isReduced ? <MaximizeIcon /> : <MinimizeIcon />}
                            </button>
                        )}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 text-slate-400 hover:text-white transition-colors"
                            aria-label="Fermer l'assistant IA"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                </header>
                <div className="flex-grow bg-slate-700 overflow-hidden">
                    <iframe
                        src={iframeUrl}
                        className="w-full h-full border-0"
                        title="Petit Solu - Assistant IA"
                        // The sandbox attribute is important for security
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    ></iframe>
                </div>
            </div>
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                
                @keyframes scale-up {
                  from { transform: scale(0.95); opacity: 0; }
                  to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-up { animation: scale-up 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
            `}</style>
        </div>
    );
};

export default AIChatBubble;