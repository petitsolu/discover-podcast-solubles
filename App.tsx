import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Episode } from './types';
import { allProcessedEpisodes } from './data/episodes';
import DiceIcon from './components/icons/DiceIcon';
import SavedEpisodesModal from './components/SavedEpisodesModal';
import CollectionIcon from './components/icons/CollectionIcon';
import Roulette from './components/Roulette';
import EpisodeFeed from './components/EpisodeFeed';
import ArrowUpIcon from './components/icons/ArrowUpIcon';
import DesktopEpisodeSlider from './components/DesktopEpisodeSlider';
import AIChatBubble from './components/AIChatBubble';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'spinning' | 'result'>('idle');
  const [modalView, setModalView] = useState<'none' | 'saved'>('none');
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [savedEpisodes, setSavedEpisodes] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (!rootElement) return;

    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width } = entries[0].contentRect;
        setIsMobile(width < 768);
      }
    });

    observer.observe(rootElement);
    
    // Set initial state based on actual container size once mounted
    setIsMobile(rootElement.offsetWidth < 768);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedPodcastEpisodes');
      if (saved) {
        setSavedEpisodes(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to parse saved episodes from localStorage", error);
      setSavedEpisodes([]);
    }
  }, []);

  const sortedEpisodes = useMemo(() =>
    [...allProcessedEpisodes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  , []);
  
  const handleRandomEpisode = () => {
    if (gameState === 'result' && isMobile) {
        const randomIndex = Math.floor(Math.random() * sortedEpisodes.length);
        const randomEpisodeId = `episode-${sortedEpisodes[randomIndex].numero}`;
        const element = document.getElementById(randomEpisodeId);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }
    
    setModalView('none');
    setGameState('spinning');

    setTimeout(() => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * allProcessedEpisodes.length);
      } while (allProcessedEpisodes.length > 1 && randomIndex === previousIndex);
      
      const newEpisode = allProcessedEpisodes[randomIndex];
      setPreviousIndex(randomIndex);
      setSelectedEpisode(newEpisode);
      
      setGameState('result');
    }, 3000);
  };
  
  const handleToggleSave = useCallback((episodeId: number) => {
    setSavedEpisodes(prev => {
        const isSaved = prev.includes(episodeId);
        const updated = isSaved ? prev.filter(id => id !== episodeId) : [...prev, episodeId];
        localStorage.setItem('savedPodcastEpisodes', JSON.stringify(updated));
        return updated;
    });
  }, []);

  const handleClose = () => {
    setModalView('none');
    setGameState('idle');
  };

  const handleOpenSaved = () => {
    setModalView('saved');
  };
  
  const handleSelectSavedEpisode = (episodeId: number) => {
      const episode = allProcessedEpisodes.find(ep => ep.numero === episodeId);
      if (episode) {
          setSelectedEpisode(episode);
          setModalView('none');
          setGameState('result');
          if (isMobile) {
            setTimeout(() => {
              const element = document.getElementById(`episode-${episodeId}`);
              element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }
      }
  }

  const handleScrollToTop = () => {
    if (isMobile) {
        const topEpisodeId = `episode-${sortedEpisodes[0].numero}`;
        const element = document.getElementById(topEpisodeId);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Effect to show/hide scroll to top button on mobile feed
  useEffect(() => {
    if (!isMobile || gameState !== 'result') return;

    const feedContainer = document.querySelector('.snap-y'); // Assuming EpisodeFeed has this class
    const handleScroll = () => {
        if (feedContainer) {
            setShowScrollToTop(feedContainer.scrollTop > window.innerHeight / 2);
        }
    };
    feedContainer?.addEventListener('scroll', handleScroll);
    return () => feedContainer?.removeEventListener('scroll', handleScroll);
  }, [isMobile, gameState]);


  // Main Mobile View
  if (isMobile) {
    return (
        <main className="h-full w-full bg-slate-900 text-white overflow-hidden">
            {gameState !== 'result' && (
                 <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 z-0"></div>
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>
                     <div className="relative z-10">
                        {gameState === 'idle' && (
                            <>
                                <h1 className="text-3xl font-black text-slate-100 mb-2">Découvrez <span className="text-indigo-400">Soluble(s)</span></h1>
                                <p className="text-lg text-slate-400 mb-8">Cliquez pour trouver un épisode au hasard.</p>
                                <button
                                    onClick={handleRandomEpisode}
                                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full shadow-lg transition-transform transform hover:scale-105"
                                >
                                    <DiceIcon />
                                    <span className="ml-3">Tenter ma chance</span>
                                </button>
                            </>
                        )}
                        {gameState === 'spinning' && <Roulette episodes={allProcessedEpisodes} isMobile={isMobile} />}
                    </div>
                </div>
            )}

            {gameState === 'result' && selectedEpisode && (
                <>
                    <EpisodeFeed 
                        episodes={sortedEpisodes} 
                        savedEpisodes={savedEpisodes} 
                        onToggleSave={handleToggleSave} 
                        initialEpisodeId={selectedEpisode.numero}
                    />
                    
                    {/* Vertical FAB stack, anchored to the dice button for alignment */}
                    <div className="fixed right-4 z-40" style={{ top: '50vw' }}>
                        <div className="relative -translate-y-1/2">
                            {/* Collection button positioned above the dice button */}
                            {savedEpisodes.length > 0 && (
                                <div className="group absolute right-0 bottom-full mb-4">
                                    <button onClick={handleOpenSaved} className="flex items-center justify-center text-slate-200 bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/90 h-12 w-12 rounded-full shadow-lg transition-all duration-300" aria-label={`Ouvrir mes ${savedEpisodes.length} découvertes`}>
                                        <span className="relative">
                                            <CollectionIcon />
                                            <span className="absolute -top-1.5 -right-1.5 block h-4 w-4 text-xs font-bold flex items-center justify-center text-slate-800 rounded-full bg-green-400 ring-2 ring-slate-800">{savedEpisodes.length}</span>
                                        </span>
                                    </button>
                                    <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 w-max bg-slate-800 text-white text-sm font-semibold px-3 py-1.5 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Mes découvertes</div>
                                </div>
                            )}

                            {/* Dice button is the anchor */}
                            <div className="group relative">
                                <button onClick={handleRandomEpisode} className="flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-700 h-12 w-12 rounded-full shadow-lg transition-all duration-300" aria-label="Tenter ma chance">
                                    <DiceIcon />
                                </button>
                                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 w-max bg-slate-800 text-white text-sm font-semibold px-3 py-1.5 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Tenter sa chance</div>
                            </div>
                            
                            {/* Scroll to top button positioned below the dice button */}
                            {showScrollToTop && (
                                <div className="group absolute right-0 top-full mt-4">
                                    <button onClick={handleScrollToTop} className="flex items-center justify-center text-slate-200 bg-slate-700/80 backdrop-blur-sm hover:bg-slate-600/90 h-12 w-12 rounded-full shadow-lg transition-all duration-300" aria-label="Retourner en haut">
                                        <ArrowUpIcon />
                                    </button>
                                    <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 w-max bg-slate-800 text-white text-sm font-semibold px-3 py-1.5 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Retour en haut</div>
                                </div>
                            )}
                        </div>
                    </div>
                    <AIChatBubble isMobile={isMobile} />
                </>
            )}

            {modalView === 'saved' && (
                <SavedEpisodesModal
                    savedEpisodeIds={savedEpisodes}
                    onClose={() => setModalView('none')}
                    onSelectEpisode={handleSelectSavedEpisode}
                    onRemoveEpisode={handleToggleSave}
                />
            )}
        </main>
    );
  }

  // Main Desktop View
  return (
    <main className="relative h-full w-full bg-slate-900 text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 z-0"></div>
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>
      
      {savedEpisodes.length > 0 && gameState === 'idle' && (
        <button
          onClick={handleOpenSaved}
          className="fixed bottom-6 right-6 z-20 flex items-center gap-2 text-slate-200 bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/90 transition-all duration-300 px-4 py-3 rounded-full shadow-lg transform hover:scale-105"
          aria-label={`Ouvrir mes ${savedEpisodes.length} découvertes`}
        >
          <span className="relative">
            <CollectionIcon />
            <span className="absolute -top-1.5 -right-1.5 block h-4 w-4 text-xs font-bold flex items-center justify-center text-slate-800 rounded-full bg-green-400 ring-2 ring-slate-800">{savedEpisodes.length}</span>
          </span>
          <span className="font-semibold">Mes découvertes</span>
        </button>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full">
        {gameState === 'idle' && (
             <>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-100 mb-2">
                Découvrez un épisode de <span className="text-indigo-400">Soluble(s)</span>
                </h1>
                <p className="text-lg text-slate-400 mb-8 max-w-xl">
                Cliquez sur le bouton ci-dessous pour trouver un épisode au hasard et laissez-vous surprendre.
                </p>
                <button
                    onClick={handleRandomEpisode}
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:scale-105"
                >
                    <DiceIcon />
                    <span className="ml-3">Tenter ma chance</span>
                </button>
            </>
        )}
        {gameState === 'spinning' && <Roulette episodes={allProcessedEpisodes} isMobile={isMobile} />}
      </div>

      {gameState === 'result' && selectedEpisode && (
        <>
            <DesktopEpisodeSlider
                episodes={sortedEpisodes}
                initialEpisode={selectedEpisode}
                savedEpisodes={savedEpisodes}
                onToggleSave={handleToggleSave}
                onClose={handleClose}
                onOpenSaved={handleOpenSaved}
            />
            <AIChatBubble isMobile={isMobile} />
        </>
      )}
      
      {modalView === 'saved' && (
        <SavedEpisodesModal
            savedEpisodeIds={savedEpisodes}
            onClose={() => setModalView('none')}
            onSelectEpisode={handleSelectSavedEpisode}
            onRemoveEpisode={handleToggleSave}
        />
      )}
    </main>
  );
};

export default App;