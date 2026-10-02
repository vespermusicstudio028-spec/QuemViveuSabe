import { PublicationItem } from '../types/publication';
import { INITIAL_PUBLICATIONS } from '../data/initialPublications';

const STORAGE_KEY = 'qvs_publications_v1';

export function loadPublications(): PublicationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return INITIAL_PUBLICATIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure all items have required fields
      return parsed.map((item, idx) => ({
        ...item,
        id: typeof item.id === 'number' ? item.id : idx + 1,
        title: item.title || '',
        status: item.status || 'draft',
        category: item.category || 'outro',
        tags: Array.isArray(item.tags) ? item.tags : [],
      }));
    }
    return INITIAL_PUBLICATIONS;
  } catch (err) {
    console.error('Failed to load publications from localStorage:', err);
    return INITIAL_PUBLICATIONS;
  }
}

export function savePublications(items: PublicationItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save publications to localStorage:', err);
  }
}

export function resetToInitial(): PublicationItem[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset storage:', err);
  }
  return INITIAL_PUBLICATIONS;
}
