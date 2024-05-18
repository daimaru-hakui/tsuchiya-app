import { create } from 'zustand';

type State = {
  statusSearch: string;
  setStatusSearch: (value: string) => void;
};

export const useStore = create<State>((set) => ({
  statusSearch: "all",
  setStatusSearch: (value) => set((state) => ({ statusSearch: value })),
}));