import React, { useState, useEffect, useRef } from 'react';
import { Episode } from '../types';
import EpisodeCard from './EpisodeCard';

// This component is a lightweight placeholder that will be observed.
// When it becomes visible, it calls the onVisible callback.
interface EpisodePlaceholderProps {
  onVisible: () => void;
  height: string;
}

const EpisodePlaceholder: React.FC<EpisodePlaceholderProps> = ({ onVisible, height }) => {
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // We create an IntersectionObserver to watch this placeholder.
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the placeholder is intersecting the viewport, trigger the onVisible callback.
        if (entry.isIntersecting) {
          onVisible();
          // We only need to trigger this once, so we disconnect the observer for performance.
          if (placeholderRef.current) {
            observer.unobserve(placeholderRef.current);
          }
        }
      },
      {
        // `rootMargin` allows us to start loading the card a little before
        // it's fully on screen, making the transition seamless.
        rootMargin: '200px 0px',
      }
    );

    if (placeholderRef.current) {
      observer.observe(placeholderRef.current);
    }

    // Cleanup function to unobserve the element when the component unmounts.
    return () => {
      if (placeholderRef.current) {
        observer.unobserve(placeholderRef.current);
      }
    };
  }, [onVisible]);

  return <div ref={placeholderRef} style={{ height }} aria-hidden="true" />;
};


interface EpisodeFeedProps {
  episodes: Episode[];
  savedEpisodes: number[];
  onToggleSave: (episodeId: number) => void;
  initialEpisodeId: number;
}

const EpisodeFeed: React.FC<EpisodeFeedProps> = ({
  episodes,
  savedEpisodes,
  onToggleSave,
  initialEpisodeId,
}) => {
  // A Set to keep track of which episode IDs have been fully rendered.
  const [renderedEpisodes, setRenderedEpisodes] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Ensure the initial episode selected by the roulette is always visible from the start.
    setRenderedEpisodes(prev => new Set(prev).add(initialEpisodeId));

    // Scroll to the selected episode without animation on initial load.
    const initialEpisodeElement = document.getElementById(`episode-${initialEpisodeId}`);
    if (initialEpisodeElement) {
      initialEpisodeElement.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, [initialEpisodeId]);

  // Callback to add an episode ID to the set of rendered episodes.
  const handleMakeVisible = (episodeId: number) => {
    setRenderedEpisodes(prev => new Set(prev).add(episodeId));
  };

  return (
    <div
      className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
    >
      {episodes.map((episode) => (
        <section
          key={episode.numero}
          id={`episode-${episode.numero}`}
          className="h-full w-full snap-start flex-shrink-0"
          aria-label={`Épisode: ${episode.titre}`}
        >
          {/* Conditional rendering: show the full card or a lightweight placeholder */}
          {renderedEpisodes.has(episode.numero) ? (
            <EpisodeCard
              episode={episode}
              isSaved={savedEpisodes.includes(episode.numero)}
              onToggleSave={() => onToggleSave(episode.numero)}
              isMobile={true}
            />
          ) : (
            <EpisodePlaceholder
              height="100%"
              onVisible={() => handleMakeVisible(episode.numero)}
            />
          )}
        </section>
      ))}
    </div>
  );
};

export default EpisodeFeed;
