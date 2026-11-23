import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Bike } from '@/types';

const STORAGE_KEY = 'carlife_compare';
const MAX_COMPARE = 2;

interface CompareState {
  bikes: Bike[];
  canAdd: () => boolean;
  add: (bike: Bike) => void;
  remove: (bikeId: string) => void;
  clear: () => void;
  isInCompare: (bikeId: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      bikes: [],

      canAdd: () => get().bikes.length < MAX_COMPARE,

      add: (bike: Bike) => {
        const bikes = get().bikes;
        if (bikes.some((b) => b.id === bike.id)) return;
        if (bikes.length >= MAX_COMPARE) return;
        set({ bikes: [...bikes, bike] });
      },

      remove: (bikeId: string) => {
        set({ bikes: get().bikes.filter((b) => b.id !== bikeId) });
      },

      clear: () => set({ bikes: [] }),

      isInCompare: (bikeId: string) =>
        get().bikes.some((b) => b.id === bikeId),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
