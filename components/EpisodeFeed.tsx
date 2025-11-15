
import React, { useState, useEffect } from 'react';
import { Episode } from '../types';
import EpisodeCard from './EpisodeCard';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface EpisodeFeedProps {
  episodes: Episode[];
  savedEpisodes: number[];
  onToggleSave: (episodeId: number) => void;
  initialEpisodeId: number;
}

const EpisodeFeed: React.FC<EpisodeFeedProps> = ({ episodes, savedEpisodes, onToggleSave, initialEpisodeId }) => {
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    if (initialEpisodeId) {
        const element = document.getElementById(`episode-${initialEpisodeId}`);
        // Use timeout to ensure the element is rendered before scrolling
        setTimeout(() => {
            element?.scrollIntoView({ behavior: 'instant', block: 'start' });
        }, 100);
    }
  }, [initialEpisodeId]);


  useEffect(() => {
    const timer = setTimeout(() => setShowScrollHint(false), 5000);
    
    const handleScroll = () => {
      // Use a small timeout to debounce and check after scroll settles
      setTimeout(() => {
        if (window.scrollY > 50) {
          setShowScrollHint(false);
          window.removeEventListener('scroll', handleScroll);
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div className="relative h-full w-full snap-y snap-mandatory overflow-y-auto">
      {showScrollHint && (
        <div className="fixed bottom-1/4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center text-white animate-bounce pointer-events-none">
            <span className="text-lg font-semibold">Découvrir</span>
            <ChevronDownIcon />
        </div>
      )}
      {episodes.map((episode) => (
        <section 
          key={episode.numero}
          id={`episode-${episode.numero}`}
          className="h-full w-full snap-start flex-shrink-0"
        >
          <EpisodeCard
            episode={episode}
            isSaved={savedEpisodes.includes(episode.numero)}
            onToggleSave={() => onToggleSave(episode.numero)}
            isMobile={true}
          />
        </section>
      ))}
    </div>
  );
};

export default EpisodeFeed;
