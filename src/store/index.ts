import { format, subMonths } from "date-fns";
import { create } from "zustand";

type State = {
  statusSearch: string;
  setStatusSearch: (value: string) => void;
  orderStartDate: Date;
  setOrderStartDate: (date: Date | undefined) => void;
  orderEndDate: Date;
  setOrderEndDate: (date: Date | undefined) => void;

  shippingStatusSearch: string;
  setShippingStatusSearch: (value: string) => void;
  shippingStartDate: Date;
  setShippingStartDate: (date: Date | undefined) => void;
  shippingEndDate: Date;
  setShippingEndDate: (date: Date | undefined) => void;

  invoiceStartDate: Date;
  setInvoiceStartDate: (date: Date | undefined) => void;
  invoiceEndDate: Date;
  setInvoiceEndDate: (date: Date | undefined) => void;
};

const thisYear = new Date().getFullYear();
const thisMonth = new Date().getMonth();
const thisDate = new Date().getDate();

const startDate = subMonths(new Date(thisYear, thisMonth, 1), 3);
const endDate = new Date(thisYear, thisMonth, thisDate, 23, 59, 59);

export const useStore = create<State>((set) => ({
  statusSearch: "all",
  setStatusSearch: (value) => set((state) => ({ statusSearch: value })),
  orderStartDate: startDate,
  setOrderStartDate: (date) =>
    set((state) => ({ orderStartDate: date || startDate })),
  orderEndDate: endDate,
  setOrderEndDate: (date) =>
    set((state) => ({ orderEndDate: date || endDate })),

  shippingStatusSearch: "all",
  setShippingStatusSearch: (value) =>
    set((state) => ({ shippingStatusSearch: value })),
  shippingStartDate: startDate,
  setShippingStartDate: (date) =>
    set((state) => ({ shippingStartDate: date || startDate })),
  shippingEndDate: endDate,
  setShippingEndDate: (date) =>
    set((state) => ({ shippingEndDate: date || endDate })),

  invoiceStartDate: startDate,
  setInvoiceStartDate: (value) => set((state) => ({ invoiceStartDate: value })),
  invoiceEndDate: endDate,
  setInvoiceEndDate: (value) => set((state) => ({ invoiceEndDate: value })),
}));
