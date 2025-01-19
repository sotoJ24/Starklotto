import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  loteryId: string | null;
}

interface Actions {
  setLoteryId: (loteryId: string | null) => void;
}

export const usePlayStore = create(
  persist<State & Actions>(
    (set) => ({
      loteryId: null,
      setLoteryId: (loteryId: string | null) => set({ loteryId }),
    }),
    { name: "play" },
  ),
);
