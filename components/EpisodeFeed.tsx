import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
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
  const feedRef = useRef<HTMLDivElement>(null);
  
  // Virtualization state: tracks the window of items to render
  const [visibleRange, setVisibleRange] = useState<{ start: number; end: number }>({ start: -1, end: -1 });

  // This effect sets up the initial state: scrolls to the selected episode
  // and calculates the first "window" of items to render.
  useLayoutEffect(() => {
    const container = feedRef.current;
    if (!container) return;

    const initialIndex = episodes.findIndex(ep => ep.numero === initialEpisodeId);
    if (initialIndex === -1) return;

    // Immediately scroll to the placeholder section. This is instant and happens before the paint.
    container.scrollTop = initialIndex * container.clientHeight;

    // Define the initial window of items to render.
    const buffer = 2; // Render 2 items before and 2 after the initial one.
    const start = Math.max(0, initialIndex - buffer);
    const end = Math.min(episodes.length - 1, initialIndex + buffer);
    setVisibleRange({ start, end });

    const timer = setTimeout(() => setShowScrollHint(false), 5000);
    return () => clearTimeout(timer);
  }, [initialEpisodeId, episodes]);

  // This effect handles updating the visible window as the user scrolls.
  useEffect(() => {
    const container = feedRef.current;
    if (!container) return;
    
    let scrollTimeout: number;

    const handleScroll = () => {
        // We use a timeout to avoid updating state on every single scroll event (debouncing).
        clearTimeout(scrollTimeout);
        scrollTimeout = window.setTimeout(() => {
            const { scrollTop, clientHeight } = container;
            
            if (scrollTop > 50 && showScrollHint) {
                setShowScrollHint(false);
            }
            
            const buffer = 3; // Use a slightly larger buffer for smoother scrolling.
            const itemHeight = clientHeight;

            // Calculate which items should be in view
            const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
            const endIndex = Math.min(episodes.length - 1, Math.ceil((scrollTop + itemHeight) / itemHeight) - 1 + buffer);

            // Only update state if the visible range has actually changed
            if (startIndex !== visibleRange.start || endIndex !== visibleRange.end) {
                setVisibleRange({ start: startIndex, end: endIndex });
            }
        }, 50); // A 50ms debounce is responsive enough.
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
        clearTimeout(scrollTimeout);
        container.removeEventListener('scroll', handleScroll);
    };
  }, [visibleRange, episodes.length, showScrollHint]);

  return (
    <div ref={feedRef} className="relative h-full w-full snap-y snap-mandatory overflow-y-auto">
      {showScrollHint && (
        <div className="fixed bottom-1/4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center text-white animate-bounce pointer-events-none">
            <span className="text-lg font-semibold">Découvrir</span>
            <ChevronDownIcon />
        </div>
      )}
      {/* 
        This is the core of the virtualization. We map over all episodes to create placeholders,
        but only render the full, complex EpisodeCard component if it's within our visible range.
        The empty <section> elements maintain the total scroll height and CSS snap points.
      */}
      {episodes.map((episode, index) => (
        <section 
          key={episode.numero}
          id={`episode-${episode.numero}`}
          className="h-full w-full snap-start flex-shrink-0"
        >
          {(index >= visibleRange.start && index <= visibleRange.end) ? (
            <EpisodeCard
              episode={episode}
              isSaved={savedEpisodes.includes(episode.numero)}
              onToggleSave={() => onToggleSave(episode.numero)}
              isMobile={true}
            />
          ) : null}
        </section>
      ))}
    </div>
  );
};

export default EpisodeFeed;
