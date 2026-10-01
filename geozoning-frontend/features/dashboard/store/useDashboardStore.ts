import { create } from "zustand";
import { Bounding } from "../type/types";

export const useDashboardStore = create<Bounding>((set) => ({
  min_lng: -77.14537,
  min_lat: 38.7844,
  max_lng: -77.01988,
  max_lat: 38.84699,
  setMinLng: (min_lng: number) => set({ min_lng: min_lng }),
  setMinLat: (min_lat: number) => set({ min_lat: min_lat }),
  setMaxLng: (max_lng: number) => set({ max_lng: max_lng }),
  setMaxLat: (max_lat: number) => set({ max_lat: max_lat }),
}));
