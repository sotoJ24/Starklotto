import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Page } from "~~/interfaces/global";

type FunctionAvailable = {
  read: string[];
  write: string[];
};

const functionAvailableByPage: Record<Page, FunctionAvailable> = {
  [Page.Play]: {
    read: [],
    write: ["buyticket"],
  },
  [Page.HowItWorks]: {
    read: [],
    write: [],
  },
  [Page.Home]: {
    read: [],
    write: [],
  },
  [Page.Profile]: {
    read: ["getusertickets", "getticketinfo"],
    write: [],
  },
};

interface State {
  currentPage: Page;
  filteredFunctionsNames: FunctionAvailable;
}

interface Actions {
  setCurrentPage: (newCurrentPage: Page) => void;
  setFilteredFunctionsNames: (
    newFilteredFunctionsNames: FunctionAvailable,
  ) => void;
}

export const useContractFnStore = create(
  persist<State & Actions>(
    (set) => ({
      currentPage: Page.Home,
      filteredFunctionsNames: functionAvailableByPage[Page.Home],
      setCurrentPage: (newCurrentPage: Page) =>
        set({
          currentPage: newCurrentPage,
          filteredFunctionsNames: functionAvailableByPage[newCurrentPage],
        }),
      setFilteredFunctionsNames: (
        newFilteredFunctionsNames: FunctionAvailable,
      ) => set({ filteredFunctionsNames: newFilteredFunctionsNames }),
    }),
    { name: "contractFn" },
  ),
);
