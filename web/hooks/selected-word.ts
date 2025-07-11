import { create } from "zustand";

export const useSelectedWordStore = create<{
    selectedWord: string;
    setSelectedWord: (word: string) => void;
}>((set: any) => ({
    selectedWord: "",
    setSelectedWord: (word: string) => set({ selectedWord: word }),
}));