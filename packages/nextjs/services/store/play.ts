import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  loteryId: string | null;
  loteryNumbersSelected: number[];
}

interface Actions {
  setLoteryId: (loteryId: string | null) => void;
  setLoteryNumbersSelected: (loteryNumbersSelected: number[]) => void;
}

export const usePlayStore = create(
  persist<State & Actions>(
    (set) => ({
      loteryId: null,
      loteryNumbersSelected: [],
      setLoteryId: (loteryId: string | null) => set({ loteryId }),
      setLoteryNumbersSelected: (loteryNumbersSelected: number[]) =>
        set({ loteryNumbersSelected }),
    }),
    { name: "play" },
  ),
);
