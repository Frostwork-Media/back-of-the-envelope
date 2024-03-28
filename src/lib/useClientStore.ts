import { create } from "zustand";

type ClientStore = {
  isTextStreaming: boolean;
};

export const useClientStore = create<ClientStore>(() => ({
  isTextStreaming: false,
}));
