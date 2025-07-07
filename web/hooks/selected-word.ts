import { create } from "zustand";

export const useSelectedWordStore = create<{
    selectedWord: string;
    setSelectedWord: (word: string) => void;
}>((set) => ({
    selectedWord: "",
    setSelectedWord: (word) => set({ selectedWord: word }),
}));