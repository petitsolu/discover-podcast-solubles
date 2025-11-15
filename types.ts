
export interface Episode {
  numero: number;
  titre: string;
  date: string;
  duree: string;
  invite: string;
  categorie: string;
  description: string;
  motscles: string[];
  thematique: string;
  liens: {
    page: string;
    spotify?: string;
    apple?: string;
    transcription?: string;
    youtube?: string;
    deezer?: string;
    summary?: string;
  };
  image: string;
}
