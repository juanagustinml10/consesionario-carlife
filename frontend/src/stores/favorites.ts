import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const STORAGE_KEY = 'sf_motos_favorites';

interface FavoritesState {
  ids: string[];
  isFavorite: (bikeId: string) => boolean;
  toggle: (bikeId: string) => void;
  add: (bikeId: string) => void;
  remove: (bikeId: string) => void;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],

      isFavorite: (bikeId: string) => get().ids.includes(bikeId),

      toggle: (bikeId: string) => {
        const ids = get().ids;
        if (ids.includes(bikeId)) {
          set({ ids: ids.filter((id) => id !== bikeId) });
        } else {
          set({ ids: [...ids, bikeId] });
        }
      },

      add: (bikeId: string) => {
        if (!get().isFavorite(bikeId)) {
          set({ ids: [...get().ids, bikeId] });
        }
      },

      remove: (bikeId: string) => {
        set({ ids: get().ids.filter((id) => id !== bikeId) });
      },

      clear: () => set({ ids: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
