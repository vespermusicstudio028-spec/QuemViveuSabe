export type PublicationStatus = 'draft' | 'ready' | 'scheduled' | 'published';

export type PublicationCategory = 'desenho' | 'filme' | 'serie' | 'maratona' | 'anime' | 'outro';

export interface PublicationItem {
  id: number;
  title: string;
  status: PublicationStatus;
  category: PublicationCategory;
  scheduledDate?: string; // YYYY-MM-DD
  scheduledTime?: string; // HH:mm
  publishedDate?: string; // YYYY-MM-DD
  videoUrl?: string; // Link to video storage or source
  facebookUrl?: string; // Link to published post on Facebook
  caption?: string; // Custom Facebook text/caption
  notes?: string; // Internal production notes
  tags?: string[];
  updatedAt?: string;
}

export type FilterStatus = 'all' | 'filled' | 'empty' | 'published' | 'scheduled' | 'ready' | 'draft';
export type ViewMode = 'table' | 'cards';
