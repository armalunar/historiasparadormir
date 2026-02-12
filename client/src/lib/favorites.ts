const FAVORITES_KEY = "contos_favorites";

export function loadFavorites(): string[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading favorites:", error);
    return [];
  }
}

export function saveFavorites(favorites: string[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites:", error);
  }
}

export function toggleFavorite(storyId: string): boolean {
  const favorites = loadFavorites();
  const index = favorites.indexOf(storyId);
  
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(storyId);
  }
  
  saveFavorites(favorites);
  return index === -1;
}

export function isFavorite(storyId: string): boolean {
  const favorites = loadFavorites();
  return favorites.includes(storyId);
}
