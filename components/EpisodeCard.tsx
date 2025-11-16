
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Episode } from '../types';
import SpotifyIcon from './icons/SpotifyIcon';
import DeezerIcon from './icons/DeezerIcon';
import ApplePodcastsIcon from './icons/ApplePodcastsIcon';
import YouTubeIcon from './icons/YouTubeIcon';
import WebsiteIcon from './icons/WebsiteIcon';
import BookmarkIcon from './icons/BookmarkIcon';
import ShareIcon from './icons/ShareIcon';
import ClockIcon from './icons/ClockIcon';
import UserIcon from './icons/UserIcon';
import FacebookIcon from './icons/FacebookIcon';
import TwitterIcon from './icons/TwitterIcon';
import LinkedInIcon from './icons/LinkedInIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';
import RedditIcon from './icons/RedditIcon';
import PinterestIcon from './icons/PinterestIcon';
import EnvelopeIcon from './icons/EnvelopeIcon';
import BlueskyIcon from './icons/BlueskyIcon';


interface EpisodeCardProps {
  episode: Episode;
  isSaved: boolean;
  onToggleSave: () => void;
  isMobile: boolean;
}

const CardContent: React.FC<{ episode: Episode }> = ({ episode }) => {
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [copied, setCopied] = useState(false);
    const shareOptionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (shareOptionsRef.current && !shareOptionsRef.current.contains(event.target as Node)) {
                setShowShareOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const shareUrl = episode.liens.page;
    const shareTitle = `${episode.titre} - Soluble(s)`;

    const platformLinks = useMemo(() => {
        const platforms = [
            { name: 'Site Web', url: episode.liens.page, Icon: WebsiteIcon },
            { name: 'Apple', url: episode.liens.apple, Icon: ApplePodcastsIcon },
            { name: 'Deezer', url: episode.liens.deezer, Icon: DeezerIcon },
            { name: 'YouTube', url: episode.liens.youtube, Icon: YouTubeIcon },
            { name: 'Spotify', url: episode.liens.spotify, Icon: SpotifyIcon },
        ];
        
        const shareButton = { name: 'Partager', onClick: () => setShowShareOptions(s => !s), Icon: ShareIcon };

        return [...platforms.filter(p => p.url), shareButton];
    }, [episode.liens]);


    const shareOptions = useMemo(() => [
        { name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, Icon: FacebookIcon },
        { name: 'Twitter', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, Icon: TwitterIcon },
        { name: 'LinkedIn', url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`, Icon: LinkedInIcon },
        { name: 'WhatsApp', url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`, Icon: WhatsAppIcon },
        { name: 'Reddit', url: `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`, Icon: RedditIcon },
        { name: 'Pinterest', url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(episode.image)}&description=${encodeURIComponent(shareTitle)}`, Icon: PinterestIcon },
        { name: 'Bluesky', url: `https://bsky.app/intent/compose?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`, Icon: BlueskyIcon },
        { name: 'Email', url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`, Icon: EnvelopeIcon },
    ], [shareUrl, shareTitle, episode.image]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <p className="text-sm text-indigo-300 font-bold mb-1">{`Épisode ${episode.numero} • ${episode.categorie}`}</p>
            <h2 className="text-2xl lg:text-3xl font-bold leading-tight text-white">{episode.titre}</h2>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-sm my-3">
                <span>{new Date(episode.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <div className="flex items-center gap-1.5"><ClockIcon /><span>{episode.duree}</span></div>
                <div className="flex items-center gap-1.5"><UserIcon /><span>{episode.invite}</span></div>
            </div>
            
            <p className="text-slate-300 leading-relaxed my-4">{episode.description}</p>
            
            <div className="mt-6">
                <h4 className="font-semibold text-slate-200 mb-3">Écouter et Partager</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                    {platformLinks.map((item, index) => {
                        const { name, Icon } = item;
                        const commonProps = {
                            key: name + index,
                            className: "flex items-center justify-center gap-2 text-sm font-medium text-slate-200 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg transition-colors w-full",
                        };

                        if ('url' in item && item.url) {
                            return (
                                <a href={item.url} target="_blank" rel="noopener noreferrer" {...commonProps}>
                                    <Icon className="h-5 w-5" />
                                    <span>{name}</span>
                                </a>
                            );
                        } else if ('onClick' in item) {
                            return (
                                <div className="relative">
                                    <button onClick={item.onClick} {...commonProps}>
                                        <Icon />
                                        <span>{name}</span>
                                    </button>
                                    {showShareOptions && (
                                        <div ref={shareOptionsRef} className="absolute bottom-full mb-2 right-0 w-64 bg-slate-700 rounded-lg shadow-lg p-2 z-20 animate-fade-in-fast">
                                            <div className="grid grid-cols-4 gap-2 mb-2">
                                                {shareOptions.map(({ name: shareName, url, Icon: ShareIcon }) => (
                                                    <a key={shareName} href={url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2 text-xs text-slate-300 hover:bg-slate-600 rounded-md transition-colors" title={shareName}>
                                                        <ShareIcon />
                                                        <span className="mt-1.5 text-center">{shareName}</span>
                                                    </a>
                                                ))}
                                            </div>
                                            <div className="flex items-center bg-slate-800 rounded-md">
                                                <input type="text" readOnly value={shareUrl} className="bg-transparent text-slate-300 text-xs p-2 w-full outline-none" />
                                                <button onClick={handleCopyLink} className="text-xs font-semibold text-indigo-300 hover:text-indigo-200 px-3 py-2 flex-shrink-0">
                                                    {copied ? 'Copié!' : 'Copier'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </>
    );
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ 
    episode, 
    isSaved, 
    onToggleSave,
    isMobile
}) => {
    const imageRef = useRef<HTMLDivElement>(null);
    const [imageHeight, setImageHeight] = useState(0);
    const [imageTranslateY, setImageTranslateY] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            if (isMobile && imageRef.current) {
                setImageHeight(imageRef.current.offsetWidth);
            }
        };
        handleResize();
        const timer = setTimeout(handleResize, 100);
        window.addEventListener('resize', handleResize);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
        };
    }, [isMobile]);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        if (imageHeight > 0) {
            setImageTranslateY(Math.min(event.currentTarget.scrollTop, imageHeight));
        }
    };

    if (isMobile) {
        return (
            <div className="h-full w-full bg-slate-800 relative overflow-hidden">
                <div 
                    ref={imageRef}
                    className="absolute top-0 left-0 right-0 w-full aspect-square z-10"
                    style={{ transform: `translateY(-${imageTranslateY}px)` }}
                >
                     <img src={episode.image} alt="" className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-110" aria-hidden="true" />
                     <div className="absolute inset-0 bg-black/30"></div>
                     <img src={episode.image} alt={`Image for ${episode.titre}`} className="relative w-full h-full object-contain" />
                </div>
                
                <div 
                    className="absolute inset-0 z-20 overflow-y-auto"
                    onScroll={handleScroll}
                >
                    <div style={{ height: `${imageHeight}px`, flexShrink: 0 }} />
                    <div className="bg-slate-800 p-6 pb-32">
                       <CardContent episode={episode} />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent px-4 pt-12 pb-[calc(1rem+env(safe-area-inset-bottom))] pointer-events-none">
                    <button
                        onClick={onToggleSave}
                        className={`w-full flex items-center justify-center gap-2 font-semibold px-4 py-2.5 rounded-md transition-all duration-200 text-sm pointer-events-auto ${
                            isSaved 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                        }`}
                    >
                        <BookmarkIcon filled={isSaved} />
                        <span>{isSaved ? 'Sauvegardé' : 'Sauvegarder'}</span>
                    </button>
                </div>
                <style>{`
                    @keyframes fade-in-fast { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
                    .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
                `}</style>
            </div>
        );
    }
    
  return (
    <div className="h-full w-full bg-slate-800 md:rounded-2xl shadow-2xl flex flex-row md:overflow-hidden">
        <div className="w-full md:w-2/5 md:flex-shrink-0 relative">
             <img src={episode.image} alt="" className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-110" aria-hidden="true" />
             <div className="absolute inset-0 bg-black/30"></div>
             <img src={episode.image} alt={`Image for ${episode.titre}`} className="relative w-full h-full object-contain" />
        </div>
        
        <div className="w-full flex flex-col flex-1 md:w-3/5 relative overflow-hidden">
          <div className="p-6 lg:p-8 flex-grow overflow-y-auto flex flex-col">
            <div className="md:my-auto">
                <CardContent episode={episode} />
            </div>
          </div>

          <div className="flex-shrink-0 bg-slate-900/50 border-t border-slate-700 p-4 flex items-center justify-between gap-3">
              <button
                  onClick={onToggleSave}
                  className={`w-full flex items-center justify-center gap-2 font-semibold px-4 py-2.5 rounded-md transition-all duration-200 text-sm ${
                      isSaved 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  }`}
              >
                  <BookmarkIcon filled={isSaved} />
                  <span>{isSaved ? 'Sauvegardé' : 'Sauvegarder'}</span>
              </button>
          </div>
        </div>
         <style>{`
          @keyframes fade-in-fast { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
        `}</style>
      </div>
  );
};

export default EpisodeCard;
