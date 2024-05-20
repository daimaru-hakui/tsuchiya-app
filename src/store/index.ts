import { format, subMonths } from "date-fns";
import { create } from "zustand";

type State = {
  statusSearch: string;
  setStatusSearch: (value: string) => void;
  orderStartDate: Date;
  setOrderStartDate: (date: Date | undefined) => void;
  orderEndDate: Date | undefined;
  setOrderEndDate: (date: Date | undefined) => void;
};

const thisYear = new Date().getFullYear();
const thisMonth = new Date().getMonth() + 1;
const thisDate = new Date().getDate();

export const useStore = create<State>((set) => ({
  statusSearch: "all",
  setStatusSearch: (value) => set((state) => ({ statusSearch: value })),
  orderStartDate: subMonths(new Date(thisYear, thisMonth, 1), 3),
  setOrderStartDate: (date) => set((state) => ({ orderStartDate: date })),
  orderEndDate: new Date(thisYear, thisMonth, 20, thisDate),
  setOrderEndDate: (date) => set((state) => ({ orderEndDate: date })),
}));
