import React, { useMemo, useState } from 'react';
import { Episode } from '../types';
import { allProcessedEpisodes } from '../data/episodes';
import CloseIcon from './icons/CloseIcon';
import TrashIcon from './icons/TrashIcon';
import EnvelopeIcon from './icons/EnvelopeIcon';
import LinkIcon from './icons/LinkIcon';

interface SavedEpisodesModalProps {
  savedEpisodeIds: number[];
  onClose: () => void;
  onSelectEpisode: (episodeId: number) => void;
  onRemoveEpisode: (episodeId: number) => void;
}

const SavedEpisodesModal: React.FC<SavedEpisodesModalProps> = ({ savedEpisodeIds, onClose, onSelectEpisode, onRemoveEpisode }) => {
  const [copied, setCopied] = useState(false);

  const savedEpisodes = useMemo(() => {
    return allProcessedEpisodes.filter(episode => savedEpisodeIds.includes(episode.numero))
      .sort((a, b) => savedEpisodeIds.indexOf(b.numero) - savedEpisodeIds.indexOf(a.numero));
  }, [savedEpisodeIds]);

  const selectionText = useMemo(() => {
    if (savedEpisodes.length === 0) return '';

    const episodesList = savedEpisodes.map(ep => `– ${ep.titre}\n  ${ep.liens.page}`).join('\n\n');
    
    return `Bonjour,

Vous souhaitez écouter cette sélection plus tard ?
Revenez vite découvrir ce contenu !

Voici ce qu'il faut conserver ou partager par mail :
${episodesList}

Bonne écoute !

[NOUVEAU Discutez avec Petit Solu, l'Assistant IA du podcast Soluble(s).]

Ne manquez pas de soutenir Soluble(s) en mettant 5 étoiles et un commentaire sur votre plateforme d’écoute préférée, ça aide beaucoup, merci infiniment :

Apple Podcasts : https://podcasts.apple.com/fr/podcast/soluble-s-actu-ecologie-soci%C3%A9t%C3%A9-solutions/id1640003869 
Spotify : https://open.spotify.com/show/11CYdR9d0vEWmaD5DHZsaH?si=2b2f511444a44ad7

– Simon Icard, créateur du podcast Soluble(s)
https://www.linkedin.com/in/simon-icard-47766821/

***
Ce dispositif n'accède à aucune adresse e-mail, ni donnée personnelle.`;
  }, [savedEpisodes]);

  const mailtoHref = useMemo(() => {
    if (savedEpisodes.length === 0) return '';
    const subject = "Épisode de Soluble(s) à écouter + tard ;-)";
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(selectionText)}`;
  }, [selectionText, savedEpisodes]);

  const handleCopy = () => {
    if (!selectionText) return;
    navigator.clipboard.writeText(selectionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700 flex-shrink-0">
          <h2 className="text-2xl font-bold text-indigo-300">Mes Découvertes</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {savedEpisodes.length > 0 && (
            <div className="mb-6 p-4 bg-slate-900/50 rounded-lg text-sm">
                <p className="text-slate-300 mb-3 text-center">
                    Partagez votre sélection d'épisodes :
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                    <a href={mailtoHref} className="w-full sm:w-auto flex items-center justify-center gap-2 font-medium text-slate-200 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-md transition-colors">
                        <EnvelopeIcon />
                        <span>S'envoyer par e-mail</span>
                    </a>
                    <button onClick={handleCopy} className="w-full sm:w-auto flex items-center justify-center gap-2 font-medium text-slate-200 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-md transition-colors">
                        <LinkIcon />
                        <span>{copied ? 'Sélection copiée !' : 'Copier la sélection'}</span>
                    </button>
                </div>
            </div>
          )}
          {savedEpisodes.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Vous n'avez pas encore sauvegardé d'épisodes.</p>
          ) : (
            <ul className="space-y-3">
              {savedEpisodes.map(episode => (
                <li key={episode.numero} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
                  <button onClick={() => onSelectEpisode(episode.numero)} className="flex items-center gap-4 text-left group w-full overflow-hidden">
                    <img src={episode.image} alt="" className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                    <div className="flex-grow overflow-hidden">
                      <p className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors truncate">{episode.titre}</p>
                      <p className="text-sm text-slate-400 truncate">{episode.invite}</p>
                    </div>
                  </button>
                  <button
                    onClick={() => onRemoveEpisode(episode.numero)}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors flex-shrink-0 ml-4"
                    aria-label="Retirer l'épisode"
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
       <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        
        @keyframes scale-up {
          from { transform: scale(0.95) translateY(10px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-scale-up { animation: scale-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
      `}</style>
    </div>
  );
};

export default SavedEpisodesModal;