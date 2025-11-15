
import React, { useState, useEffect, useRef } from 'react';
import { Episode } from '../types';
import EpisodeCard from './EpisodeCard';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import CloseIcon from './icons/CloseIcon';
import DiceIcon from './icons/DiceIcon';
import CollectionIcon from './icons/CollectionIcon';
import ToStartIcon from './icons/ToStartIcon';

interface DesktopEpisodeSliderProps {
    episodes: Episode[];
    initialEpisode: Episode;
    savedEpisodes: number[];
    onToggleSave: (episodeId: number) => void;
    onClose: () => void;
    onOpenSaved: () => void;
}

const DesktopEpisodeSlider: React.FC<DesktopEpisodeSliderProps> = ({ 
    episodes, initialEpisode, savedEpisodes, onToggleSave, onClose, onOpenSaved 
}) => {
    const [currentIndex, setCurrentIndex] = useState(() => 
        episodes.findIndex(ep => ep.numero === initialEpisode.numero)
    );
    const sliderRef = useRef<HTMLDivElement>(null);

    // Refs for swipe/drag gesture
    const gestureStartPoint = useRef<number | null>(null);
    const isGestureActive = useRef(false);


    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        const initialChild = slider.children[currentIndex] as HTMLElement;
        if(initialChild) {
            slider.scrollTo({
                left: initialChild.offsetLeft - slider.offsetLeft,
                behavior: 'instant'
            });
        }
    }, []); // Run only on initial mount

    const scrollToEpisode = (index: number) => {
        const slider = sliderRef.current;
        if (!slider) return;
        const targetChild = slider.children[index] as HTMLElement;
        if (targetChild) {
            slider.scrollTo({
                left: targetChild.offsetLeft - slider.offsetLeft,
                behavior: 'smooth'
            });
            setCurrentIndex(index);
        }
    };

    const handleNext = () => {
        if (currentIndex < episodes.length - 1) {
            scrollToEpisode(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            scrollToEpisode(currentIndex - 1);
        }
    };

    const handleRandomJump = () => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * episodes.length);
        } while (episodes.length > 1 && randomIndex === currentIndex);
        scrollToEpisode(randomIndex);
    }

    // --- Swipe and Drag Handlers ---
    const handleGestureStart = (clientX: number) => {
        gestureStartPoint.current = clientX;
        isGestureActive.current = true;
        if(sliderRef.current) sliderRef.current.style.cursor = 'grabbing';
    };

    const handleGestureEnd = (clientX: number) => {
        if (!isGestureActive.current || gestureStartPoint.current === null) return;
        
        const minSwipeDistance = 50;
        const distance = gestureStartPoint.current - clientX;
        
        if (distance > minSwipeDistance) {
            handleNext();
        } else if (distance < -minSwipeDistance) {
            handlePrev();
        }
        
        isGestureActive.current = false;
        gestureStartPoint.current = null;
        if(sliderRef.current) sliderRef.current.style.cursor = 'grab';
    };

    // Touch events
    const onTouchStart = (e: React.TouchEvent) => handleGestureStart(e.targetTouches[0].clientX);
    const onTouchEnd = (e: React.TouchEvent) => handleGestureEnd(e.changedTouches[0].clientX);

    // Mouse events
    const onMouseDown = (e: React.MouseEvent) => {
        // Prevent drag on anything other than main button
        if (e.button !== 0) return;
        handleGestureStart(e.clientX)
    };
    const onMouseUp = (e: React.MouseEvent) => handleGestureEnd(e.clientX);
    const onMouseLeave = (e: React.MouseEvent) => {
        if (isGestureActive.current) {
            handleGestureEnd(e.clientX);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-lg flex flex-col items-center justify-center z-30 animate-fade-in">
             <div className="absolute top-4 right-4 flex items-center gap-4 z-50">
                <button
                    onClick={() => scrollToEpisode(0)}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-full shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Aller à l'épisode le plus récent"
                >
                    <ToStartIcon />
                    <span>Le + récent</span>
                </button>
                <button onClick={handleRandomJump} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-full shadow-lg transition-all transform hover:scale-105">
                    <DiceIcon />
                    <span>Au hasard</span>
                </button>
                {savedEpisodes.length > 0 && (
                     <button onClick={onOpenSaved} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-full shadow-lg transition-all transform hover:scale-105">
                        <span className="relative">
                            <CollectionIcon />
                            <span className="absolute -top-1.5 -right-1.5 block h-4 w-4 text-xs font-bold flex items-center justify-center text-slate-800 rounded-full bg-green-400 ring-2 ring-slate-700">{savedEpisodes.length}</span>
                        </span>
                        <span>Mes découvertes</span>
                    </button>
                )}
                <button onClick={onClose} className="bg-slate-800/80 hover:bg-slate-700/90 text-white rounded-full p-2.5 shadow-lg transition-colors">
                    <CloseIcon />
                </button>
            </div>


            <div className="w-full flex items-center justify-center">
                <button 
                    onClick={handlePrev} 
                    className="absolute left-4 md:left-8 z-40 p-3 bg-slate-800/80 hover:bg-slate-700/90 rounded-full text-white transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Épisode précédent"
                    disabled={currentIndex === 0}
                >
                    <ChevronLeftIcon />
                </button>

                <div 
                    ref={sliderRef} 
                    className="w-full flex overflow-x-auto p-4 snap-x snap-mandatory scrollbar-hide"
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseLeave}
                    style={{ cursor: 'grab' }}
                >
                    {episodes.map(episode => (
                        <div key={episode.numero} className="w-full flex-shrink-0 flex justify-center snap-center">
                            <div className="w-full max-w-6xl h-[85vh]">
                                <EpisodeCard 
                                    episode={episode}
                                    isSaved={savedEpisodes.includes(episode.numero)}
                                    onToggleSave={() => onToggleSave(episode.numero)}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={handleNext} 
                    className="absolute right-4 md:right-8 z-40 p-3 bg-slate-800/80 hover:bg-slate-700/90 rounded-full text-white transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Épisode suivant"
                    disabled={currentIndex === episodes.length - 1}
                >
                    <ChevronRightIcon />
                </button>
            </div>
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default DesktopEpisodeSlider;