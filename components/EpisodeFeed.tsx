import React, { useEffect, useRef } from 'react';
import { Episode } from '../types';
import EpisodeCard from './EpisodeCard';

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
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This effect ensures that when the feed is first rendered (e.g., after the roulette),
    // it automatically scrolls to the selected episode without a visible animation.
    const initialEpisodeElement = document.getElementById(`episode-${initialEpisodeId}`);
    if (initialEpisodeElement) {
      initialEpisodeElement.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, [initialEpisodeId]);

  return (
    <div
      ref={feedRef}
      className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
    >
      {episodes.map((episode) => (
        <section
          key={episode.numero}
          id={`episode-${episode.numero}`}
          className="h-full w-full snap-start flex-shrink-0 relative"
          aria-label={`Épisode: ${episode.titre}`}
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
